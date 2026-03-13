import { Text, YStack, XStack, ScrollView, Input, Image } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { X, User, GraduationCap, BookOpen, MessageSquare, Calendar, Camera } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useAlert } from '@/contexts/AlertContext';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user, updateProfile } = useAuth();
  const { showAlert } = useAlert();

  // State for form fields - initialize with user data
  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(user?.profilePicture || null);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [major, setMajor] = useState(user?.major || '');
  const [year, setYear] = useState(user?.year || '');

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Track if user has made changes
  const [hasChanges, setHasChanges] = useState(false);

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setProfilePictureUri(user.profilePicture || null);
      setName(user.name || '');
      setBio(user.bio || '');
      setUniversity(user.university || '');
      setMajor(user.major || '');
      setYear(user.year || '');
    }
  }, [user]);

  /**
   * Compress image to reduce file size before upload
   */
  async function compressImage(uri: string): Promise<string> {
    try {
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize to max 800px width
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri; // Return original if compression fails
    }
  }

  /**
   * Handle profile picture selection
   */
  async function handleSelectProfilePicture() {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert({ title: 'Permission Denied', message: 'We need camera roll permissions to select a photo' });
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const imageUri = result.assets[0].uri;

      // Show loading and upload immediately
      setIsUploading(true);

      try {
        // Compress image
        const compressedUri = await compressImage(imageUri);

        // Upload to backend
        const filename = compressedUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        const formData = new FormData();
        formData.append('image', {
          uri: compressedUri,
          name: filename,
          type,
        } as any);

        const response = await apiClient.postFormData('/users/profile-picture', formData);

        if (response.success && response.data) {
          // Update local state with the Cloudinary URL
          setProfilePictureUri((response.data as any).url);
          setHasChanges(true);
          showAlert({ title: 'Success', message: 'Profile picture uploaded! Remember to save changes.' });
        } else {
          showAlert({ title: 'Error', message: 'Failed to upload profile picture' });
        }
      } catch (error) {
        console.error('Upload error:', error);
        showAlert({ title: 'Error', message: 'Failed to upload profile picture. Please try again.' });
      } finally {
        setIsUploading(false);
      }
    }
  }

  /**
   * Handle save profile
   */
  async function handleSave() {
    setIsSaving(true);

    try {
      // Prepare request body (only send non-empty values)
      const requestBody: any = {};

      if (name.trim()) requestBody.name = name.trim();
      if (bio.trim()) requestBody.bio = bio.trim();
      if (profilePictureUri) requestBody.profilePicture = profilePictureUri;
      if (university.trim()) requestBody.university = university.trim();
      if (major.trim()) requestBody.major = major.trim();
      if (year.trim()) requestBody.year = year.trim();

      // Call API to update profile
      const response = await apiClient.put('/users/profile', requestBody);

      if (response.success && response.data) {
        // Update user context with new data
        await updateProfile(response.data as any);

        showAlert({ title: 'Success', message: 'Profile updated successfully!', buttons: [
          { text: 'OK', onPress: () => router.back() },
        ] });
      } else {
        showAlert({ title: 'Error', message: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Save error:', error);
      showAlert({ title: 'Error', message: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Handle back with unsaved changes check
   */
  function handleBack() {
    if (hasChanges) {
      showAlert({
        title: 'Discard Changes?',
        message: 'You have unsaved changes. Are you sure you want to go back?',
        buttons: [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ],
      });
    } else {
      router.back();
    }
  }

  /**
   * Track changes
   */
  function handleChange(setter: (value: string) => void, value: string) {
    setter(value);
    setHasChanges(true);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={20}
          paddingVertical={16}
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
          <XStack
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor={colors.backgroundSecondary}
            justifyContent="center"
            alignItems="center"
            pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.95 }}
            onPress={handleBack}
            cursor="pointer"
          >
            <X size={20} color={colors.text} strokeWidth={2.5} />
          </XStack>

          <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
            Edit Profile
          </Text>

          <XStack width={40} />
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingTop={24} paddingBottom={32} gap={24} backgroundColor={colors.background}>

            {/* Profile Picture Section */}
            <YStack gap={12} alignItems="center">
              <YStack
                width={100}
                height={100}
                backgroundColor={colorScheme === 'light' ? '#F5F4FE' : '#38347F'}
                borderRadius={99}
                justifyContent="center"
                alignItems="center"
                borderWidth={3}
                borderColor={colors.primary}
                pressStyle={{ scale: 0.95 }}
                cursor="pointer"
                onPress={isUploading ? undefined : handleSelectProfilePicture}
                opacity={isUploading ? 0.6 : 1}
              >
                {isUploading ? (
                  <ActivityIndicator color={colors.primary} size="large" />
                ) : profilePictureUri ? (
                  <Image
                    source={{ uri: profilePictureUri }}
                    width={94}
                    height={94}
                    borderRadius={94}
                  />
                ) : (
                  <Camera size={40} color={colors.primary} strokeWidth={2} />
                )}
              </YStack>
              <Text fontSize={14} color={colors.textSecondary} fontFamily="$body">
                {isUploading ? 'Uploading...' : 'Tap to change profile picture'}
              </Text>
            </YStack>

            {/* Form Fields */}
            <YStack gap={20}>

              {/* Name */}
              <YStack gap={8}>
                <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                  Name
                </Text>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={20}
                  paddingHorizontal={16}
                  alignItems="center"
                  borderColor={colors.border}
                  borderWidth={1}
                  gap={8}
                >
                  <User size={20} color={colors.icon} strokeWidth={2.5} />
                  <Input
                    flex={1}
                    placeholder="Your name"
                    placeholderTextColor={colors.textTertiary}
                    value={name}
                    onChangeText={(text) => handleChange(setName, text)}
                    borderWidth={0}
                    backgroundColor="transparent"
                    paddingHorizontal={0}
                    paddingVertical={0}
                    fontSize={16}
                    fontFamily="$body"
                    color={colors.text}
                  />
                </XStack>
              </YStack>

              {/* Bio */}
              <YStack gap={8}>
                <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                  Bio
                </Text>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={20}
                  paddingHorizontal={16}
                  paddingVertical={12}
                  alignItems="flex-start"
                  borderColor={colors.border}
                  borderWidth={1}
                  minHeight={100}
                  gap={8}
                >
                  <MessageSquare size={20} color={colors.icon} strokeWidth={2.5} style={{ marginTop: 2 }} />
                  <Input
                    flex={1}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor={colors.textTertiary}
                    value={bio}
                    onChangeText={(text) => handleChange(setBio, text)}
                    borderWidth={0}
                    backgroundColor="transparent"
                    paddingHorizontal={0}
                    paddingVertical={0}
                    fontSize={16}
                    fontFamily="$body"
                    color={colors.text}
                    multiline
                    textAlignVertical="top"
                  />
                </XStack>
              </YStack>

              {/* University */}
              <YStack gap={8}>
                <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                  University
                </Text>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={20}
                  paddingHorizontal={16}
                  alignItems="center"
                  borderColor={colors.border}
                  borderWidth={1}
                  gap={8}
                >
                  <GraduationCap size={20} color={colors.icon} strokeWidth={2.5} />
                  <Input
                    flex={1}
                    placeholder="Your university"
                    placeholderTextColor={colors.textTertiary}
                    value={university}
                    onChangeText={(text) => handleChange(setUniversity, text)}
                    borderWidth={0}
                    backgroundColor="transparent"
                    paddingHorizontal={0}
                    paddingVertical={0}
                    fontSize={16}
                    fontFamily="$body"
                    color={colors.text}
                  />
                </XStack>
              </YStack>

              {/* Major and Year */}
              <XStack gap={12}>
                {/* Major */}
                <YStack flex={1} gap={8}>
                  <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                    Major
                  </Text>
                  <XStack
                    backgroundColor={colors.backgroundSecondary}
                    borderRadius={20}
                    paddingHorizontal={16}
                    alignItems="center"
                    borderColor={colors.border}
                    borderWidth={1}
                    gap={8}
                  >
                    <BookOpen size={20} color={colors.icon} strokeWidth={2.5} />
                    <Input
                      flex={1}
                      placeholder="Your major"
                      placeholderTextColor={colors.textTertiary}
                      value={major}
                      onChangeText={(text) => handleChange(setMajor, text)}
                      borderWidth={0}
                      backgroundColor="transparent"
                      paddingHorizontal={0}
                      paddingVertical={0}
                      fontSize={16}
                      fontFamily="$body"
                      color={colors.text}
                    />
                  </XStack>
                </YStack>

                {/* Year */}
                <YStack flex={1} gap={8}>
                  <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                    Year
                  </Text>
                  <XStack
                    backgroundColor={colors.backgroundSecondary}
                    borderRadius={20}
                    paddingHorizontal={16}
                    alignItems="center"
                    borderColor={colors.border}
                    borderWidth={1}
                    gap={8}
                  >
                    <Calendar size={20} color={colors.icon} strokeWidth={2.5} />
                    <Input
                      flex={1}
                      placeholder="e.g. 3rd Year"
                      placeholderTextColor={colors.textTertiary}
                      value={year}
                      onChangeText={(text) => handleChange(setYear, text)}
                      borderWidth={0}
                      backgroundColor="transparent"
                      paddingHorizontal={0}
                      paddingVertical={0}
                      fontSize={16}
                      fontFamily="$body"
                      color={colors.text}
                    />
                  </XStack>
                </YStack>
              </XStack>

            </YStack>

            {/* Save Button */}
            <XStack
              backgroundColor={isSaving ? colors.textTertiary : colors.primary}
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              marginTop={8}
              pressStyle={isSaving ? {} : { opacity: 0.8, scale: 0.98 }}
              cursor={isSaving ? 'not-allowed' : 'pointer'}
              onPress={isSaving ? undefined : handleSave}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text fontSize={17} fontWeight="700" color="white" fontFamily="$body">
                  Save Changes
                </Text>
              )}
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
