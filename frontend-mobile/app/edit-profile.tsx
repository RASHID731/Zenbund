import { Text, YStack, XStack, ScrollView, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { X, User, GraduationCap, BookOpen, MessageSquare, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  // State for form fields
  const [emoji, setEmoji] = useState('👤');
  const [name, setName] = useState('Alex Johnson');
  const [bio, setBio] = useState('');
  const [university, setUniversity] = useState('University of Rostock');
  const [major, setMajor] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');

  // Track if user has made changes
  const [hasChanges, setHasChanges] = useState(false);

  // Handle save
  function handleSave() {
    // TODO: Implement API call to save profile
    Alert.alert('Success', 'Profile updated successfully!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  }

  // Handle back with unsaved changes check
  function handleBack() {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  }

  // Track changes
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
              >
                <Text fontSize={48}>{emoji}</Text>
              </YStack>
              <Text fontSize={14} color={colors.textSecondary} fontFamily="$body">
                Tap to change profile picture
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
              backgroundColor={colors.primary}
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              marginTop={8}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              cursor="pointer"
              onPress={handleSave}
            >
              <Text fontSize={17} fontWeight="700" color="white" fontFamily="$body">
                Save Changes
              </Text>
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
