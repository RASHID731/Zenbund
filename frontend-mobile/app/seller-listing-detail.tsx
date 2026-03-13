import { useState, useCallback } from 'react';
import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useAlert } from '@/contexts/AlertContext';
import { ChevronLeft, Edit3, CheckCircle, Tag, MapPin, Calendar } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { Offer } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SellerListingDetailModal() {
  // This is rendered as a modal due to its location in app/
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { showAlert } = useAlert();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Parse initial listing data from params
  const initialListing = {
    id: params.id ? parseInt(params.id as string) : undefined,
    userId: params.userId ? parseInt(params.userId as string) : undefined,
    name: params.name as string || 'Item',
    category: params.category as string || 'Category',
    categoryId: params.categoryId ? parseInt(params.categoryId as string) : undefined,
    price: params.price as string || '$0',
    description: params.description as string || '',
    emoji: params.emoji as string || '📦',
    seller: params.seller as string || 'You',
    sellerAvatar: params.sellerAvatar as string || '',
    location: params.location as string || 'Location not specified',
    status: params.status as string || 'Available',
    imageUrls: params.imageUrls
      ? (typeof params.imageUrls === 'string'
          ? JSON.parse(params.imageUrls)
          : params.imageUrls)
      : [],
    createdAt: params.createdAt as string || new Date().toISOString()
  };

  // State for listing data (can be updated from API)
  const [listing, setListing] = useState(initialListing);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch fresh listing data from API
  const fetchListing = useCallback(async () => {
    if (!listing.id) return;

    try {
      setIsLoading(true);
      const response = await apiClient.get<Offer>(`/offers/${listing.id}`);

      if (response.success && response.data) {
        // Update listing with fresh data from API
        setListing({
          id: response.data.id,
          userId: response.data.userId,
          name: response.data.title,
          category: listing.category, // Keep from params if not in response
          categoryId: response.data.categoryId,
          price: `€${response.data.price}`,
          description: response.data.description,
          emoji: listing.emoji,
          seller: 'You',
          sellerAvatar: listing.sellerAvatar,
          location: response.data.pickupLocation,
          status: response.data.status,
          imageUrls: response.data.imageUrls || [],
          createdAt: response.data.createdAt,
        });
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setIsLoading(false);
    }
  }, [listing.id]);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchListing();
    }, [fetchListing])
  );

  // Calculate time since posted
  const getTimeSincePosted = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInMs = now.getTime() - posted.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Posted today';
    if (diffInDays === 1) return 'Posted 1 day ago';
    if (diffInDays < 7) return `Posted ${diffInDays} days ago`;
    if (diffInDays < 30) return `Posted ${Math.floor(diffInDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffInDays / 30)} months ago`;
  };

  // Handle carousel scroll
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  // Toggle listing status between Available and Sold
  const handleToggleStatus = async () => {
    if (!listing.id) {
      showAlert({ title: 'Error', message: 'Invalid listing ID' });
      return;
    }

    const newStatus = listing.status.toLowerCase() === 'available' ? 'sold' : 'available';

    try {
      const response = await apiClient.put(`/offers/${listing.id}/status`, {
        status: newStatus
      });

      if (response.success) {
        showAlert({
          title: 'Success',
          message: `Listing marked as ${newStatus === 'available' ? 'Available' : 'Sold'}`,
          buttons: [{ text: 'OK', onPress: () => router.back() }],
        });
      } else {
        showAlert({ title: 'Error', message: response.message || 'Failed to update status' });
      }
    } catch (error: any) {
      console.error('Error toggling status:', error);
      showAlert({ title: 'Error', message: error.message || 'Failed to update status' });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={[]}>
      <YStack flex={1} backgroundColor={colors.background}>
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack gap={24} paddingBottom={24}>
            {/* Image Carousel */}
            <YStack position="relative">
              {listing.imageUrls && listing.imageUrls.length > 0 ? (
                <YStack>
                  <FlatList
                    data={listing.imageUrls}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    keyExtractor={(item, index) => `image-${index}`}
                    renderItem={({ item }) => (
                      <YStack
                        width={SCREEN_WIDTH}
                        height={360}
                        backgroundColor={colors.backgroundSecondary}
                      >
                        <Image
                          source={{ uri: item }}
                          style={{ width: SCREEN_WIDTH, height: 360 }}
                          resizeMode="cover"
                        />
                      </YStack>
                    )}
                  />

                  {/* Pagination Dots */}
                  {listing.imageUrls.length > 1 && (
                    <XStack
                      position="absolute"
                      bottom={12}
                      alignSelf="center"
                      gap={4}
                      backgroundColor="rgba(0,0,0,0.4)"
                      paddingHorizontal={8}
                      paddingVertical={2}
                      borderRadius={16}
                    >
                      {listing.imageUrls.map((_: string, index: number) => (
                        <YStack
                          key={index}
                          width={currentImageIndex === index ? 20 : 6}
                          height={6}
                          borderRadius={3}
                          backgroundColor={currentImageIndex === index ? 'white' : 'rgba(255,255,255,0.5)'}
                        />
                      ))}
                    </XStack>
                  )}
                </YStack>
              ) : (
                <YStack
                  height={360}
                  backgroundColor={colors.backgroundSecondary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize={120}>{listing.emoji}</Text>
                </YStack>
              )}

              {/* Back Button - Overlay on Image */}
              <YStack
                position="absolute"
                top={56}
                left={16}
                backgroundColor="rgba(0, 0, 0, 0.5)"
                borderRadius={20}
                padding={8}
                pressStyle={{ opacity: 0.8, scale: 0.95 }}
                cursor="pointer"
                onPress={() => router.back()}
              >
                <ChevronLeft size={24} color="white" strokeWidth={2.5} />
              </YStack>
            </YStack>

            {/* Content */}
            <YStack paddingHorizontal={20} gap={20}>
              {/* Name, Price, and Timestamp */}
              <YStack gap={8}>
                <Text fontSize={24} fontWeight="600" color={colors.text} fontFamily="$body">
                  {listing.name}
                </Text>
                <YStack gap={8}>
                  <Text fontSize={24} fontWeight="700" color={colors.primary} fontFamily="$body">
                    {listing.price}
                  </Text>
                  <XStack gap={6} alignItems="center">
                    <Calendar size={14} color={colors.textSecondary} strokeWidth={2.5} />
                    <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                      {getTimeSincePosted(listing.createdAt)}
                    </Text>
                  </XStack>
                </YStack>
              </YStack>

              {/* Description */}
              {listing.description && listing.description.trim() !== '' && (
                <Text fontSize={15} color={colors.textSecondary} fontFamily="$body" lineHeight={22}>
                  {listing.description}
                </Text>
              )}

              {/* Category & Location - Compact Row */}
              <XStack gap={16} flexWrap="wrap">
                {/* Category */}
                <XStack
                  flex={1}
                  minWidth="45%"
                  gap={8}
                  alignItems="center"
                  backgroundColor={colors.backgroundSecondary}
                  paddingHorizontal={12}
                  paddingVertical={10}
                  borderRadius={12}
                >
                  <Tag size={16} color={colors.text} strokeWidth={2.5} />
                  <YStack flex={1} gap={2}>
                    <Text fontSize={12} fontWeight="500" color={colors.textSecondary} fontFamily="$body">
                      Category
                    </Text>
                    <Text fontSize={14} fontWeight="600" color={colors.text} fontFamily="$body">
                      {listing.category}
                    </Text>
                  </YStack>
                </XStack>

                {/* Location */}
                <XStack
                  flex={1}
                  minWidth="45%"
                  gap={8}
                  alignItems="center"
                  backgroundColor={colors.backgroundSecondary}
                  paddingHorizontal={12}
                  paddingVertical={10}
                  borderRadius={12}
                >
                  <MapPin size={16} color={colors.text} strokeWidth={2.5} />
                  <YStack flex={1} gap={2}>
                    <Text fontSize={12} fontWeight="500" color={colors.textSecondary} fontFamily="$body">
                      Location
                    </Text>
                    <Text fontSize={14} fontWeight="600" color={colors.text} fontFamily="$body">
                      {listing.location}
                    </Text>
                  </YStack>
                </XStack>
              </XStack>

              {/* Seller Info */}
              <YStack gap={4}>
                <Text fontSize={12} fontWeight="500" color={colors.textSecondary} fontFamily="$body">
                  Seller
                </Text>
                <XStack alignItems="center" gap={10}>
                  <YStack
                    width={36}
                    height={36}
                    backgroundColor={colors.backgroundSecondary}
                    borderRadius={18}
                    justifyContent="center"
                    alignItems="center"
                    overflow="hidden"
                  >
                    {listing.sellerAvatar ? (
                      <Image
                        source={{ uri: listing.sellerAvatar }}
                        style={{ width: 36, height: 36 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text fontSize={18}>👤</Text>
                    )}
                  </YStack>
                  <Text fontSize={14} color={colors.text} fontWeight="500" fontFamily="$body">
                    {listing.seller}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>

        {/* Seller Action Buttons - Fixed at Bottom */}
        <YStack
          backgroundColor={colors.background}
          borderTopWidth={1}
          borderTopColor={colors.border}
          paddingHorizontal={20}
          paddingTop={12}
          paddingBottom={28}
          gap={12}
        >
          <XStack gap={12}>
            {/* Edit Listing Button */}
            <XStack
              flex={1}
              backgroundColor={colors.background}
              borderWidth={1.5}
              borderColor={colors.primary}
              borderRadius={16}
              paddingVertical={10}
              justifyContent="center"
              alignItems="center"
              gap={8}
              pressStyle={{ opacity: 0.7, scale: 0.98, backgroundColor: colors.backgroundSecondary }}
              cursor="pointer"
              onPress={() => {
                router.push({
                  pathname: '/edit-listing',
                  params: {
                    id: listing.id,
                    title: listing.name,
                    price: listing.price.replace('€', ''),
                    categoryId: listing.categoryId,
                    location: listing.location,
                    description: listing.description,
                    imageUrls: JSON.stringify(listing.imageUrls),
                  }
                });
              }}
            >
              <Edit3 size={20} color={colors.primary} strokeWidth={2.5} />
              <Text fontSize={15} fontWeight="600" color={colors.primary} fontFamily="$body">
                Edit Listing
              </Text>
            </XStack>

            {/* Mark as Sold/Available Button */}
            <XStack
              flex={1}
              backgroundColor={listing.status.toLowerCase() === 'available' ? '#10B981' : colors.textSecondary}
              borderRadius={16}
              paddingVertical={10}
              justifyContent="center"
              alignItems="center"
              gap={8}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              cursor="pointer"
              onPress={handleToggleStatus}
            >
              <CheckCircle size={20} color="white" strokeWidth={2.5} />
              <Text fontSize={15} fontWeight="600" color="white" fontFamily="$body">
                {listing.status.toLowerCase() === 'available' ? 'Mark Sold' : 'Mark Available'}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
