import { Text, YStack, XStack, ScrollView, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { X, Camera, Euro, Tag, MapPin, MessageSquare, Image as ImageIcon, ChevronDown, ChevronLeft, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAlert } from '@/contexts/AlertContext';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { Category } from '@/types';

interface SelectedImage {
  uri: string;
  isExisting?: boolean;
}

export default function EditListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { showAlert } = useAlert();

  // Parse params
  const listingId = params.id ? parseInt(params.id as string) : undefined;
  const initialTitle = params.title as string || '';
  const initialPrice = params.price as string || '';
  const initialCategoryId = params.categoryId ? parseInt(params.categoryId as string) : null;
  const initialLocation = params.location as string || '';
  const initialDescription = params.description as string || '';
  const initialImageUrls = params.imageUrls
    ? (typeof params.imageUrls === 'string' ? JSON.parse(params.imageUrls) : params.imageUrls)
    : [];

  // Form state
  const [title, setTitle] = useState(initialTitle);
  const [price, setPrice] = useState(initialPrice);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);
  const [location, setLocation] = useState(initialLocation);
  const [description, setDescription] = useState(initialDescription);
  const [images, setImages] = useState<SelectedImage[]>(
    initialImageUrls.map((url: string) => ({ uri: url, isExisting: true }))
  );

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Category dropdown state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    title: '',
    price: '',
  });

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      setLoadingCategories(true);
      const response = await apiClient.get<Category[]>('/categories');
      if (response.success && response.data) {
        setCategories(response.data);
      }
      setLoadingCategories(false);
    }
    fetchCategories();
  }, []);

  // Get selected category for display
  const selectedCategory = categories.find(c => c.id === categoryId);

  // Compress image to reduce size
  async function compressImage(uri: string): Promise<string> {
    try {
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri;
    }
  }

  // Pick images from gallery
  async function pickImages() {
    if (images.length >= 10) {
      showAlert({ title: 'Maximum Photos', message: 'You can only add up to 10 photos' });
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert({ title: 'Permission Denied', message: 'We need camera roll permissions to select photos' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.slice(0, 10 - images.length).map(asset => ({
        uri: asset.uri,
        isExisting: false,
      }));
      setImages([...images, ...newImages]);
      setHasChanges(true);
    }
  }

  // Take photo with camera
  async function takePhoto() {
    if (images.length >= 10) {
      showAlert({ title: 'Maximum Photos', message: 'You can only add up to 10 photos' });
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showAlert({ title: 'Permission Denied', message: 'We need camera permissions to take photos' });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImages([...images, { uri: result.assets[0].uri, isExisting: false }]);
      setHasChanges(true);
    }
  }

  // Remove image
  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
    setHasChanges(true);
  }

  // Validate form
  function validateForm(): boolean {
    const newErrors = { title: '', price: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Please enter a title for your listing';
      isValid = false;
    }

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
  function clearError(field: 'title' | 'price') {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  }

  // Track changes
  function handleChange<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setHasChanges(true);
  }

  // Handle save
  async function handleSave() {
    if (!listingId) {
      showAlert({ title: 'Error', message: 'Invalid listing ID' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Separate existing and new images
      const existingImageUrls = images.filter(img => img.isExisting).map(img => img.uri);
      const newImages = images.filter(img => !img.isExisting);

      // Compress new images
      const compressedUris = await Promise.all(
        newImages.map(img => compressImage(img.uri))
      );

      // Create FormData
      const formData = new FormData();

      // Add new image files
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

      // Add existing image URLs as JSON string
      formData.append('existingImageUrls', JSON.stringify(existingImageUrls));

      // Add offer data
      formData.append('title', title);
      formData.append('price', price);
      if (categoryId) formData.append('categoryId', categoryId.toString());
      formData.append('pickupLocation', location || 'To be determined');
      formData.append('description', description || '');

      // Send to backend
      const response = await apiClient.putFormData(`/offers/${listingId}`, formData);

      if (response.success) {
        showAlert({ title: 'Success', message: 'Your listing has been updated!', buttons: [
          { text: 'OK', onPress: () => router.back() },
        ] });
      } else {
        showAlert({ title: 'Error', message: response.message || 'Failed to update listing. Please try again.' });
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      showAlert({ title: 'Error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  // Handle delete
  function handleDelete() {
    showAlert({
      title: 'Delete Listing',
      message: 'Are you sure you want to delete this listing? This action cannot be undone.',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ],
    });
  }

  async function confirmDelete() {
    if (!listingId) {
      showAlert({ title: 'Error', message: 'Invalid listing ID' });
      return;
    }

    setIsDeleting(true);

    try {
      const response = await apiClient.delete(`/offers/${listingId}`);

      if (response.success) {
        showAlert({ title: 'Deleted', message: 'Your listing has been deleted.', buttons: [
          { text: 'OK', onPress: () => router.push('/(tabs)/profile') },
        ] });
      } else {
        showAlert({ title: 'Error', message: response.message || 'Failed to delete listing. Please try again.' });
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      showAlert({ title: 'Error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsDeleting(false);
    }
  }

  // Handle back with unsaved changes check
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
            <ChevronLeft size={24} color={colors.text} strokeWidth={2.5} />
          </XStack>

          <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
            Edit Listing
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

                {/* Add Photo Buttons */}
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
                      handleChange(setTitle, text);
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
                        handleChange(setPrice, text);
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
                <YStack flex={2} gap={8} position="relative" zIndex={showCategoryDropdown ? 1000 : 1}>
                  <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                    Category
                  </Text>
                  <XStack
                    backgroundColor={colors.backgroundSecondary}
                    borderRadius={20}
                    paddingHorizontal={16}
                    borderColor={colors.border}
                    borderWidth={1}
                    gap={8}
                    alignItems="center"
                    height={47}
                    pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.98 }}
                    cursor="pointer"
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <Tag size={20} color={colors.icon} strokeWidth={2.5} />
                    <Text
                      flex={1}
                      fontSize={16}
                      fontFamily="$body"
                      color={selectedCategory ? colors.text : colors.textTertiary}
                      numberOfLines={1}
                    >
                      {loadingCategories ? 'Loading...' : selectedCategory ? `${selectedCategory.emoji} ${selectedCategory.name}` : 'Select'}
                    </Text>
                    <ChevronDown size={20} color={colors.icon} strokeWidth={2.5} />
                  </XStack>

                  {/* Dropdown List */}
                  {showCategoryDropdown && (
                    <YStack
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      backgroundColor={colors.card}
                      borderRadius={16}
                      borderWidth={1}
                      borderColor={colors.border}
                      marginTop={4}
                      maxHeight={250}
                      zIndex={1000}
                      shadowColor="#000"
                      shadowOffset={{ width: 0, height: 2 }}
                      shadowOpacity={0.1}
                      shadowRadius={8}
                      elevation={5}
                    >
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <YStack padding={8} gap={4}>
                          {categories.map((cat) => (
                            <XStack
                              key={cat.id}
                              backgroundColor={categoryId === cat.id ? colors.backgroundTertiary : 'transparent'}
                              borderRadius={12}
                              paddingHorizontal={12}
                              paddingVertical={10}
                              alignItems="center"
                              gap={10}
                              pressStyle={{ opacity: 0.7, backgroundColor: colors.backgroundSecondary }}
                              cursor="pointer"
                              onPress={() => {
                                handleChange(setCategoryId, cat.id);
                                setShowCategoryDropdown(false);
                              }}
                            >
                              <Text fontSize={24}>{cat.emoji}</Text>
                              <Text
                                flex={1}
                                fontSize={15}
                                fontWeight={categoryId === cat.id ? "600" : "500"}
                                color={colors.text}
                                fontFamily="$body"
                              >
                                {cat.name}
                              </Text>
                            </XStack>
                          ))}
                        </YStack>
                      </ScrollView>
                    </YStack>
                  )}
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
                    onChangeText={(text) => handleChange(setLocation, text)}
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
                    onChangeText={(text) => handleChange(setDescription, text)}
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

            {/* Save Changes Button */}
            <XStack
              backgroundColor={isSaving ? colors.backgroundTertiary : colors.primary}
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              marginTop={8}
              pressStyle={!isSaving ? { opacity: 0.8, scale: 0.98 } : undefined}
              cursor={isSaving ? "not-allowed" : "pointer"}
              opacity={isSaving ? 0.6 : 1}
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

            {/* Delete Listing Button */}
            <XStack
              backgroundColor="transparent"
              borderWidth={1.5}
              borderColor="#ef4444"
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              gap={8}
              pressStyle={!isDeleting ? { opacity: 0.8, scale: 0.98, backgroundColor: '#fef2f2' } : undefined}
              cursor={isDeleting ? "not-allowed" : "pointer"}
              opacity={isDeleting ? 0.6 : 1}
              onPress={isDeleting ? undefined : handleDelete}
            >
              {isDeleting ? (
                <ActivityIndicator color="#ef4444" />
              ) : (
                <>
                  <Trash2 size={20} color="#ef4444" strokeWidth={2.5} />
                  <Text fontSize={17} fontWeight="700" color="#ef4444" fontFamily="$body">
                    Delete Listing
                  </Text>
                </>
              )}
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
