import { Text, YStack, XStack, ScrollView, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { X, Camera, Euro, Tag, MapPin, MessageSquare, Image as ImageIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Alert, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { CATEGORY_NAME_TO_ID } from '@/types';

interface SelectedImage {
  uri: string;
  width: number;
  height: number;
}

export default function SellModal() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Error states for validation
  const [errors, setErrors] = useState({
    title: '',
    price: '',
    images: '',
  });

  // Compress image to reduce size
  async function compressImage(uri: string): Promise<string> {
    try {
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }], // Resize to max 1200px width
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri; // Return original if compression fails
    }
  }

  // Pick images from gallery
  async function pickImages() {
    if (images.length >= 10) {
      Alert.alert('Maximum Photos', 'You can only add up to 10 photos');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.slice(0, 10 - images.length);
      
      // Validate image sizes
      for (const asset of newImages) {
        // Approximate size check (5MB = 5 * 1024 * 1024 bytes)
        // Note: expo-image-picker doesn't provide file size, so we skip this for now
      }

      setImages([...images, ...newImages]);
    }
  }

  // Take photo with camera
  async function takePhoto() {
    if (images.length >= 10) {
      Alert.alert('Maximum Photos', 'You can only add up to 10 photos');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImages([...images, result.assets[0]]);
    }
  }

  // Remove image
  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  // Validate form and return true if valid
  function validateForm(): boolean {
    const newErrors = {
      title: '',
      price: '',
      images: '',
    };

    let isValid = true;

    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Please enter a title for your listing';
      isValid = false;
    }

    // Validate price
    if (!price.trim()) {
      newErrors.price = 'Please enter a price';
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  // Clear error when user starts typing
  function clearError(field: 'title' | 'price' | 'images') {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  }

  // Handle form submission
  async function handlePublish() {
    // Validate required fields
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      // Compress all images
      const compressedUris = await Promise.all(
        images.map(img => compressImage(img.uri))
      );

      // Create FormData
      const formData = new FormData();

      // Add images to FormData
      for (let i = 0; i < compressedUris.length; i++) {
        const uri = compressedUris[i];
        const filename = uri.split('/').pop() || `image_${i}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('images', {
          uri,
          name: filename,
          type,
        } as any);
      }

      // Add offer data
      const categoryId = CATEGORY_NAME_TO_ID[category] || 6; // Default to "Other"
      
      formData.append('userId', '1'); // Temporary hardcoded userId
      formData.append('title', title);
      formData.append('price', price);
      formData.append('categoryId', categoryId.toString());
      formData.append('pickupLocation', location || 'To be determined');
      formData.append('description', description || '');

      // Send to backend
      const response = await apiClient.postFormData('/offers', formData);

      if (response.success) {
        Alert.alert('Success', 'Your listing has been published!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to create listing. Please try again.');
      }
    } catch (error) {
      console.error('Error publishing listing:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
            onPress={() => {
              // Check if user has entered any data
              const hasData = title || price || category || location || description || images.length > 0;

              if (hasData) {
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
            }}
            cursor="pointer"
          >
            <X size={20} color={colors.text} strokeWidth={2.5} />
          </XStack>

          <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
            Sell Item
          </Text>

          <XStack width={40} />
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingTop={20} paddingBottom={24} gap={24} backgroundColor={colors.background}>
            {/* Image Upload Section */}
            <YStack gap={12}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={16} fontWeight="700" color={colors.text} fontFamily="$body">
                  Photos
                </Text>
                <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                  {images.length} of 10
                </Text>
              </XStack>

              <XStack gap={12} flexWrap="wrap">
                {/* Display selected images */}
                {images.map((image, index) => (
                  <YStack key={index} position="relative">
                    <Image
                      source={{ uri: image.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 20,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <X size={16} color="white" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </YStack>
                ))}

                {/* Add Photo Button - show if less than 10 images */}
                {images.length < 10 && (
                  <>
                    <YStack
                      width={100}
                      height={100}
                      backgroundColor={colors.backgroundSecondary}
                      borderRadius={20}
                      borderWidth={2}
                      borderColor={colors.border}
                      borderStyle="dashed"
                      justifyContent="center"
                      alignItems="center"
                      pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.97 }}
                      cursor="pointer"
                      onPress={pickImages}
                    >
                      <ImageIcon size={28} color={colors.icon} strokeWidth={2.5} />
                      <Text fontSize={12} color={colors.textSecondary} marginTop={6} fontFamily="$body">
                        Gallery
                      </Text>
                    </YStack>

                    <YStack
                      width={100}
                      height={100}
                      backgroundColor={colors.backgroundSecondary}
                      borderRadius={20}
                      borderWidth={2}
                      borderColor={colors.border}
                      borderStyle="dashed"
                      justifyContent="center"
                      alignItems="center"
                      pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.97 }}
                      cursor="pointer"
                      onPress={takePhoto}
                    >
                      <Camera size={28} color={colors.icon} strokeWidth={2.5} />
                      <Text fontSize={12} color={colors.textSecondary} marginTop={6} fontFamily="$body">
                        Camera
                      </Text>
                    </YStack>
                  </>
                )}
              </XStack>
            </YStack>

            {/* Item Information */}
            <YStack gap={20}>
              <Text fontSize={16} fontWeight="700" color={colors.text} fontFamily="$body">
                Item Information
              </Text>

              {/* Title */}
              <YStack gap={8}>
                <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                  Title *
                </Text>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={20}
                  paddingHorizontal={16}
                  alignItems="center"
                  borderColor={errors.title ? '#ef4444' : colors.border}
                  borderWidth={1}
                  gap={8}
                >
                  <Input
                    flex={1}
                    placeholder="What are you selling?"
                    placeholderTextColor={colors.textTertiary}
                    value={title}
                    onChangeText={(text) => {
                      setTitle(text);
                      clearError('title');
                    }}
                    borderWidth={0}
                    backgroundColor="transparent"
                    paddingHorizontal={0}
                    paddingVertical={0}
                    fontSize={16}
                    fontFamily="$body"
                    color={colors.text}
                  />
                </XStack>
                {errors.title && (
                  <Text fontSize={13} color="#ef4444" fontFamily="$body">
                    {errors.title}
                  </Text>
                )}
              </YStack>

              {/* Price and Category */}
              <XStack gap={12}>
                {/* Price */}
                <YStack flex={1} gap={8}>
                  <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                    Price *
                  </Text>
                  <XStack
                    backgroundColor={colors.backgroundSecondary}
                    borderRadius={20}
                    paddingHorizontal={16}
                    alignItems="center"
                    borderColor={errors.price ? '#ef4444' : colors.border}
                    borderWidth={1}
                    gap={8}
                  >
                    <Euro size={20} color={colors.icon} strokeWidth={2.5} />
                    <Input
                      flex={1}
                      placeholder="0"
                      placeholderTextColor={colors.textTertiary}
                      value={price}
                      onChangeText={(text) => {
                        setPrice(text);
                        clearError('price');
                      }}
                      borderWidth={0}
                      backgroundColor="transparent"
                      paddingHorizontal={0}
                      paddingVertical={0}
                      fontSize={16}
                      fontFamily="$body"
                      color={colors.text}
                      keyboardType="numeric"
                    />
                  </XStack>
                  {errors.price && (
                    <Text fontSize={13} color="#ef4444" fontFamily="$body">
                      {errors.price}
                    </Text>
                  )}
                </YStack>

                {/* Category */}
                <YStack flex={1} gap={8}>
                  <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                    Category
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
                    <Tag size={20} color={colors.icon} strokeWidth={2.5} />
                    <Input
                      flex={1}
                      placeholder="Select"
                      placeholderTextColor={colors.textTertiary}
                      value={category}
                      onChangeText={setCategory}
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

              {/* Location */}
              <YStack gap={8}>
                <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                  Location
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
                  <MapPin size={20} color={colors.icon} strokeWidth={2.5} />
                  <Input
                    flex={1}
                    placeholder="Where is this item located?"
                    placeholderTextColor={colors.textTertiary}
                    value={location}
                    onChangeText={setLocation}
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

              {/* Description */}
              <YStack gap={8}>
                <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                  Description
                </Text>
                <XStack
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={20}
                  paddingHorizontal={16}
                  paddingVertical={12}
                  alignItems="flex-start"
                  borderColor={colors.border}
                  borderWidth={1}
                  minHeight={120}
                  gap={8}
                >
                  <MessageSquare size={20} color={colors.icon} strokeWidth={2.5} style={{ marginTop: 2 }} />
                  <Input
                    flex={1}
                    placeholder="Describe your item in detail..."
                    placeholderTextColor={colors.textTertiary}
                    value={description}
                    onChangeText={setDescription}
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
            </YStack>

            {/* Publish Button */}
            <XStack
              backgroundColor={isUploading ? colors.backgroundTertiary : colors.primary}
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              marginTop={8}
              pressStyle={!isUploading ? { opacity: 0.8, scale: 0.98 } : undefined}
              cursor={isUploading ? "not-allowed" : "pointer"}
              opacity={isUploading ? 0.6 : 1}
              onPress={isUploading ? undefined : handlePublish}
            >
              <Text fontSize={17} fontWeight="700" color="white" fontFamily="$body">
                {isUploading ? 'Uploading...' : 'Publish Listing'}
              </Text>
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
