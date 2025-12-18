import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Image, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Alert } from 'react-native';
import { X, Heart, MessageCircle, MessageSquare, Tag, MapPin } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Chat } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ListingDetailModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Parse listing data from params
  const listing = {
    id: params.id ? parseInt(params.id as string) : 0,
    userId: params.userId ? parseInt(params.userId as string) : 0,
    name: params.name as string || 'Item',
    category: params.category as string || 'Category',
    price: params.price as string || '$0',
    description: params.description as string || 'No description available',
    emoji: params.emoji as string || '📦',
    seller: params.seller as string || 'Unknown Seller',
    location: params.location as string || 'Location not specified',
    status: params.status as string || 'Available',
    createdAt: params.createdAt as string || new Date().toISOString(),
    imageUrls: params.imageUrls
      ? (typeof params.imageUrls === 'string'
          ? JSON.parse(params.imageUrls)
          : params.imageUrls)
      : []
  };

  // Check if item is wishlisted on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !listing.id) return;

      try {
        const response = await apiClient.get<{ isWishlisted: boolean }>(`/wishlists/check/${listing.id}`);
        if (response.success && response.data) {
          setIsWishlisted(response.data.isWishlisted);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, listing.id]);

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to add items to your wishlist.');
      return;
    }

    if (!listing.id) {
      Alert.alert('Error', `Invalid listing ID: ${listing.id}`);
      return;
    }

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await apiClient.delete(`/wishlists/offer/${listing.id}`);
        if (response.success) {
          setIsWishlisted(false);
        } else {
          Alert.alert('Error', response.message || 'Failed to remove from wishlist.');
        }
      } else {
        // Add to wishlist
        const response = await apiClient.post('/wishlists', { offerId: listing.id });
        if (response.success) {
          setIsWishlisted(true);
        } else {
          Alert.alert('Error', response.message || 'Failed to add to wishlist.');
        }
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Message seller - create or get chat
  const handleMessageSeller = async () => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to message the seller.');
      return;
    }

    if (!listing.userId) {
      Alert.alert('Error', 'Seller information not available.');
      return;
    }

    try {
      const response = await apiClient.post<Chat>('/chats', {
        otherUserId: listing.userId
      });

      if (response.success && response.data) {
        router.push(`/chat/${response.data.id}`);
      } else {
        Alert.alert('Error', response.message || 'Failed to start chat. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to create chat:', error);
      Alert.alert('Error', error.message || 'Failed to start chat. Please try again.');
    }
  };

  // Handle carousel scroll
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        {/* Header with Close Button */}
        <XStack
          paddingHorizontal={20}
          paddingVertical={16}
          alignItems="center"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
          <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
            Item Details
          </Text>
          <XStack
            width={40}
            height={40}
            justifyContent="center"
            alignItems="center"
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
            onPress={() => router.back()}
          >
            <X size={24} color={colors.text} strokeWidth={2.5} />
          </XStack>
        </XStack>

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
                        height={300}
                        backgroundColor={colors.backgroundSecondary}
                      >
                        <Image
                          source={{ uri: item }}
                          style={{
                            width: SCREEN_WIDTH,
                            height: 300,
                          }}
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
                  height={300}
                  backgroundColor={colors.backgroundSecondary}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize={120}>{listing.emoji}</Text>
                </YStack>
              )}

              {/* Status Badge */}
              <XStack
                position="absolute"
                top={16}
                right={16}
                backgroundColor={listing.status === 'Available' ? '#10B981' : '#6B7280'}
                paddingHorizontal={12}
                paddingVertical={2.67}
                borderRadius={12}
              >
                <Text fontSize={12} fontWeight="600" color="white" fontFamily="$body">
                  {listing.status}
                </Text>
              </XStack>
            </YStack>

            {/* Content */}
            <YStack paddingHorizontal={20} gap={20}>
              {/* Name, Price, and Timestamp */}
              <YStack gap={8}>
                <Text fontSize={26} fontWeight="700" color={colors.text} fontFamily="$body">
                  {listing.name}
                </Text>
                <YStack gap={4}>
                  <Text fontSize={36} fontWeight="700" color={colors.primary} fontFamily="$body">
                    {listing.price}
                  </Text>
                  <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                    {getTimeSincePosted(listing.createdAt)}
                  </Text>
                </YStack>
              </YStack>

              {/* Description */}
              <YStack gap={8}>
                <XStack gap={8} alignItems="center">
                  <MessageSquare size={16} color={colors.text} strokeWidth={2.5} />
                  <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                    Description
                  </Text>
                </XStack>
                <Text fontSize={14} color={colors.textSecondary} fontFamily="$body" lineHeight={22}>
                  {listing.description}
                </Text>
              </YStack>

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
                  <YStack flex={1}>
                    <Text fontSize={12} color={colors.textSecondary} fontFamily="$body">
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
                  <YStack flex={1}>
                    <Text fontSize={12} color={colors.textSecondary} fontFamily="$body">
                      Pickup Location
                    </Text>
                    <Text fontSize={14} fontWeight="600" color={colors.text} fontFamily="$body">
                      {listing.location}
                    </Text>
                  </YStack>
                </XStack>
              </XStack>

              {/* Seller Info */}
              <YStack gap={8}>
                <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                  Seller
                </Text>
                <XStack alignItems="center" gap={12}>
                  <YStack
                    width={40}
                    height={40}
                    backgroundColor={colorScheme === 'light' ? '#F5F4FE' : '#38347F'}
                    borderRadius={20}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={20}>👤</Text>
                  </YStack>
                  <Text fontSize={15} color={colors.text} fontWeight="500" fontFamily="$body">
                    {listing.seller}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>

        {/* Action Buttons - Fixed at Bottom */}
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
            {/* Wishlist Button */}
            <XStack
              flex={1}
              backgroundColor={isWishlisted ? '#FEE2E2' : colors.background}
              borderWidth={1.5}
              borderColor={isWishlisted ? '#EF4444' : colors.border}
              borderRadius={16}
              paddingVertical={10}
              justifyContent="center"
              alignItems="center"
              gap={8}
              pressStyle={{ opacity: 0.7, scale: 0.98 }}
              cursor="pointer"
              onPress={handleWishlistToggle}
              opacity={wishlistLoading ? 0.5 : 1}
            >
              <Heart
                size={20}
                color={isWishlisted ? '#EF4444' : colors.textSecondary}
                strokeWidth={2.5}
                fill={isWishlisted ? '#EF4444' : 'transparent'}
              />
              <Text
                fontSize={15}
                fontWeight="600"
                color={isWishlisted ? '#EF4444' : colors.textSecondary}
                fontFamily="$body"
              >
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </Text>
            </XStack>

            {/* Chat Button */}
            <XStack
              flex={1}
              backgroundColor={listing.status === 'Available' ? colors.primary : colors.textSecondary}
              borderRadius={16}
              paddingVertical={10}
              justifyContent="center"
              alignItems="center"
              gap={8}
              pressStyle={listing.status === 'Available' ? { opacity: 0.8, scale: 0.98 } : undefined}
              cursor={listing.status === 'Available' ? "pointer" : "not-allowed"}
              opacity={listing.status === 'Available' ? 1 : 0.6}
              onPress={() => {
                if (listing.status === 'Available') {
                  handleMessageSeller();
                }
              }}
            >
              <MessageCircle size={20} color="white" strokeWidth={2.5} />
              <Text fontSize={15} fontWeight="600" color="white" fontFamily="$body">
                {listing.status === 'Available' ? 'Message Seller' : 'Sold Out'}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
