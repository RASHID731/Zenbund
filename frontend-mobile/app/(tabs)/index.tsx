import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from 'react';
import { Image, FlatList, ActivityIndicator } from 'react-native';
import { SlidersHorizontal, ChevronDown, Heart } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Navbar } from '@/components/navbar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { Offer, Category, PagedOffersResponse, SortOption, OfferFilters } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';

// Frontend display type (transformed from backend Offer)
interface ListingDisplay {
  id: number;
  userId: number;
  name: string;
  category: string;
  price: string;
  emoji: string;
  description: string;
  seller: string;
  sellerAvatar: string;
  location: string;
  status: string;
  imageUrls: string[];
  createdAt: string;
  wishlistCount: number;
}

// Transform backend Offer to frontend ListingDisplay
function transformOfferToListing(
  offer: Offer,
  categoryMap: Record<number, { name: string; emoji: string }>
): ListingDisplay {
  const categoryInfo = categoryMap[offer.categoryId] || { name: 'Other', emoji: '📦' };
  return {
    id: offer.id,
    userId: offer.userId,
    name: offer.title,
    category: categoryInfo.name,
    price: `${offer.price} €`,
    emoji: categoryInfo.emoji,
    description: offer.description,
    seller: offer.userName || 'Unknown Seller',
    sellerAvatar: offer.userProfilePicture || '',
    location: offer.pickupLocation,
    status: offer.status === 'available' ? 'Available' : 'Sold',
    imageUrls: offer.imageUrls || [],
    createdAt: offer.createdAt,
    wishlistCount: offer.wishlistCount || 0,
  };
}

// Format timestamp to relative time (e.g., "2h ago", "3d ago")
function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
}

export default function HomeScreen() {
  const [listings, setListings] = useState<ListingDisplay[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [wishlistedItems, setWishlistedItems] = useState<Set<number>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<OfferFilters>({
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'mostRecent',
  });

  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { isAuthenticated, user } = useAuth();
  const { showAlert } = useAlert();

  // Helper functions for sort mapping
  const mapSortToBackend = (sort: SortOption): string => {
    const map: Record<SortOption, string> = {
      mostRecent: 'createdAt',
      priceLowToHigh: 'price',
      priceHighToLow: 'price',
      mostWishlisted: 'wishlistCount',
    };
    return map[sort];
  };

  const getSortDirection = (sort: SortOption): string => {
    return sort === 'priceLowToHigh' ? 'ASC' : 'DESC';
  };

  const getSortLabel = (sort: SortOption): string => {
    const labels: Record<SortOption, string> = {
      mostRecent: 'Most Recent',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      mostWishlisted: 'Most Wishlisted',
    };
    return labels[sort];
  };

  // Check wishlist status for all items
  const checkWishlistStatus = async (listingIds: number[]) => {
    if (!isAuthenticated || listingIds.length === 0) return;

    try {
      const wishlistStatuses = await Promise.all(
        listingIds.map(async (id) => {
          const response = await apiClient.get<{ isWishlisted: boolean }>(`/wishlists/check/${id}`);
          return { id, isWishlisted: response.success && response.data?.isWishlisted };
        })
      );

      const wishlisted = new Set<number>();
      wishlistStatuses.forEach(({ id, isWishlisted }) => {
        if (isWishlisted) wishlisted.add(id);
      });
      setWishlistedItems(wishlisted);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Toggle wishlist for a specific item
  const handleWishlistToggle = async (listingId: number, e?: any) => {
    if (e) {
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      showAlert({ title: 'Authentication Required', message: 'Please log in to add items to your wishlist.' });
      return;
    }

    const isWishlisted = wishlistedItems.has(listingId);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await apiClient.delete(`/wishlists/offer/${listingId}`);
        if (response.success) {
          setWishlistedItems(prev => {
            const updated = new Set(prev);
            updated.delete(listingId);
            return updated;
          });
          // Update wishlist count in listings
          setListings(prev => prev.map(listing =>
            listing.id === listingId
              ? { ...listing, wishlistCount: Math.max(0, listing.wishlistCount - 1) }
              : listing
          ));
        } else {
          showAlert({ title: 'Error', message: response.message || 'Failed to remove from wishlist.' });
        }
      } else {
        // Add to wishlist
        const response = await apiClient.post('/wishlists', { offerId: listingId });
        if (response.success) {
          setWishlistedItems(prev => new Set(prev).add(listingId));
          // Update wishlist count in listings
          setListings(prev => prev.map(listing =>
            listing.id === listingId
              ? { ...listing, wishlistCount: listing.wishlistCount + 1 }
              : listing
          ));
        } else {
          showAlert({ title: 'Error', message: response.message || 'Failed to add to wishlist.' });
        }
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      showAlert({ title: 'Error', message: error.message || 'Something went wrong. Please try again.' });
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    const categoriesResponse = await apiClient.get<Category[]>('/categories');

    if (categoriesResponse.success && categoriesResponse.data) {
      setCategories(categoriesResponse.data);
    } else {
      console.error('Failed to fetch categories:', categoriesResponse.message);
      setCategoriesError(categoriesResponse.message || 'Failed to load categories');
    }
    setLoadingCategories(false);
  };

  // Fetch offers with pagination - wrapped in useCallback to prevent infinite loops
  const fetchOffers = useCallback(async (page: number, append: boolean = false) => {
    try {
      // Build category map for transformation
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.id] = { name: cat.name, emoji: cat.emoji };
        return acc;
      }, {} as Record<number, { name: string; emoji: string }>);

      const params = {
        page,
        limit: 20,
        sortBy: mapSortToBackend(filters.sortBy),
        sortDirection: getSortDirection(filters.sortBy),
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      };

      const response = await apiClient.getWithParams<PagedOffersResponse>('/offers', params);

      if (response.success && response.data) {
        const transformed = response.data.offers.map(offer =>
          transformOfferToListing(offer, categoryMap)
        );

        if (append) {
          setListings(prev => [...prev, ...transformed]);
        } else {
          setListings(transformed);
        }

        setHasMore(response.data.hasNext);
        setCurrentPage(response.data.currentPage);

        // Check wishlist status for new items
        const listingIds = transformed.map(l => l.id);
        await checkWishlistStatus(listingIds);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    }
  }, [categories, filters.sortBy, filters.minPrice, filters.maxPrice, isAuthenticated]);

  // Load more for infinite scroll
  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      fetchOffers(currentPage + 1, true).finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [hasMore, isLoadingMore, currentPage, fetchOffers]);

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setCurrentPage(0);
    await fetchOffers(0, false);
    setIsRefreshing(false);
  }, [fetchOffers]);

  // Fetch categories on mount
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  // Fetch offers when categories are loaded or filters change
  useEffect(() => {
    if (categories.length > 0) {
      setCurrentPage(0);
      fetchOffers(0, false);
    }
  }, [filters.sortBy, filters.minPrice, filters.maxPrice, categories.length, fetchOffers]);

  // Listen for route param changes from modals
  useEffect(() => {
    let shouldUpdate = false;
    const newFilters: Partial<OfferFilters> = {};

    // Handle sort parameter
    if (params.sortBy && params.sortBy !== filters.sortBy) {
      newFilters.sortBy = params.sortBy as SortOption;
      shouldUpdate = true;
    }

    // Handle price parameters
    const minPriceParam = params.minPrice as string | undefined;
    const maxPriceParam = params.maxPrice as string | undefined;

    const minPrice = minPriceParam && minPriceParam !== '' ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam && maxPriceParam !== '' ? parseFloat(maxPriceParam) : undefined;

    const validMinPrice = minPrice !== undefined && !isNaN(minPrice) ? minPrice : undefined;
    const validMaxPrice = maxPrice !== undefined && !isNaN(maxPrice) ? maxPrice : undefined;

    if (validMinPrice !== filters.minPrice) {
      newFilters.minPrice = validMinPrice;
      shouldUpdate = true;
    }

    if (validMaxPrice !== filters.maxPrice) {
      newFilters.maxPrice = validMaxPrice;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  }, [params.sortBy, params.minPrice, params.maxPrice]);

  const openListingDetail = (listing: ListingDisplay) => {
    // Check if user owns this listing
    const isOwnListing = user && listing.userId === user.userId;

    // Route to seller view if owner, buyer view otherwise
    const pathname = isOwnListing ? '/seller-listing-detail' : '/listing-detail';

    router.push({
      pathname,
      params: {
        id: listing.id,
        userId: listing.userId,
        name: listing.name,
        category: listing.category,
        price: listing.price,
        emoji: listing.emoji,
        description: listing.description,
        seller: listing.seller,
        sellerAvatar: listing.sellerAvatar,
        location: listing.location,
        status: listing.status,
        imageUrls: JSON.stringify(listing.imageUrls),
        createdAt: listing.createdAt
      }
    });
  };

  // Modal navigation handlers
  const openSortModal = () => {
    router.push({
      pathname: '/sort-modal',
      params: {
        currentSort: filters.sortBy,
        minPrice: filters.minPrice?.toString() || '',
        maxPrice: filters.maxPrice?.toString() || '',
      }
    });
  };

  const openFilterModal = () => {
    router.push({
      pathname: '/filter-modal',
      params: {
        minPrice: filters.minPrice?.toString() || '',
        maxPrice: filters.maxPrice?.toString() || '',
        currentSort: filters.sortBy,
      }
    });
  };

  const hasActiveFilters = () => {
    return filters.minPrice !== undefined || filters.maxPrice !== undefined;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        <Navbar />

        <FlatList
          data={listings}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 24 }}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            <YStack paddingTop={16} paddingBottom={20} gap={20}>
            {/* Category Slider - Horizontal ScrollView */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 12,
              }}
            >
              {loadingCategories ? (
                // Loading skeleton: 4 placeholder circles
                [1, 2, 3, 4].map((i) => (
                  <YStack key={i} alignItems="center" gap={8} opacity={0.5}>
                    <YStack
                      width={56}
                      height={56}
                      backgroundColor={colors.backgroundSecondary}
                      borderRadius={28}
                    />
                    <YStack
                      width={50}
                      height={12}
                      backgroundColor={colors.backgroundSecondary}
                      borderRadius={6}
                    />
                  </YStack>
                ))
              ) : categoriesError ? (
                // Error state
                <YStack padding={20} alignItems="center">
                  <Text fontSize={14} color={colors.textSecondary} fontFamily="$body">
                    {categoriesError}
                  </Text>
                </YStack>
              ) : (
                // Success state: Map over categories
                categories.map((category) => (
                  <YStack
                    key={category.id}
                    alignItems="center"
                    gap={8}
                    minWidth={70}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => router.push(`/category/${category.id}`)}
                    cursor="pointer"
                  >
                    <YStack
                      width={56}
                      height={56}
                      backgroundColor={colors.backgroundTertiary}
                      borderRadius={28}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize={32}>{category.emoji}</Text>
                    </YStack>
                    <Text
                      fontSize={12}
                      fontWeight="600"
                      color={colors.text}
                      fontFamily="$body"
                      numberOfLines={1}
                    >
                      {category.name}
                    </Text>
                  </YStack>
                ))
              )}
            </ScrollView>

            {/* Sorting and Filter */}
            <XStack gap={12} width="100%" alignItems="center">
              {/* Sorting Dropdown */}
              <XStack
                flex={1}
                alignItems="center"
                justifyContent="space-between"
                backgroundColor={colors.backgroundSecondary}
                borderWidth={1}
                borderColor={colors.border}
                borderRadius={20}
                paddingHorizontal={16}
                paddingVertical={10}
                pressStyle={{
                  backgroundColor: colors.backgroundTertiary,
                  scale: 0.98,
                }}
                onPress={openSortModal}
                cursor="pointer"
              >
                <Text fontSize={14} fontWeight="500" color={colors.text} fontFamily="$body">
                  {getSortLabel(filters.sortBy)}
                </Text>
                <ChevronDown size={18} color={colors.icon} strokeWidth={2.5} />
              </XStack>

              {/* Filter Button */}
              <XStack
                alignItems="center"
                justifyContent="center"
                backgroundColor={hasActiveFilters() ? colors.primary : colors.backgroundSecondary}
                borderWidth={1}
                borderColor={hasActiveFilters() ? colors.primary : colors.border}
                borderRadius={20}
                paddingHorizontal={16}
                paddingVertical={10}
                pressStyle={{
                  backgroundColor: colors.backgroundTertiary,
                  scale: 0.98,
                }}
                onPress={openFilterModal}
                cursor="pointer"
              >
                <SlidersHorizontal
                  size={20}
                  color={hasActiveFilters() ? 'white' : colors.icon}
                  strokeWidth={2.5}
                />
              </XStack>
            </XStack>
            </YStack>
          }
          ListFooterComponent={
            isLoadingMore ? (
              <YStack padding={20} alignItems="center">
                <ActivityIndicator size="small" color={colors.primary} />
              </YStack>
            ) : null
          }
          ListEmptyComponent={
            !isLoadingMore ? (
              <YStack padding={40} alignItems="center" gap={12}>
                <Text fontSize={16} color={colors.textSecondary} fontFamily="$body">
                  {hasActiveFilters() ? 'No offers found' : 'No listings available'}
                </Text>
                {hasActiveFilters() && (
                  <XStack
                    backgroundColor={colors.primary}
                    borderRadius={12}
                    paddingHorizontal={20}
                    paddingVertical={10}
                    pressStyle={{ opacity: 0.8, scale: 0.98 }}
                    cursor="pointer"
                    onPress={() => {
                      setFilters(prev => ({
                        ...prev,
                        minPrice: undefined,
                        maxPrice: undefined,
                      }));
                    }}
                  >
                    <Text fontSize={14} fontWeight="600" color="white" fontFamily="$body">
                      Clear Filters
                    </Text>
                  </XStack>
                )}
              </YStack>
            ) : null
          }
          renderItem={({ item: listing }) => (
                <YStack
                  flex={1}
                  maxWidth="48%"
                  backgroundColor={colors.card}
                  borderRadius={8}
                  overflow="hidden"
                  pressStyle={{
                    opacity: 0.95,
                    scale: 0.98,
                  }}
                  cursor="pointer"
                  onPress={() => openListingDetail(listing)}
                >
                  {/* Image Container with Overlays */}
                  <YStack
                    width="100%"
                    aspectRatio={1}
                    backgroundColor={colors.backgroundSecondary}
                    justifyContent="center"
                    alignItems="center"
                    position="relative"
                    borderRadius={8}
                    overflow="hidden"
                  >
                    {listing.imageUrls && listing.imageUrls.length > 0 ? (
                      <Image
                        source={{ uri: listing.imageUrls[0] }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 8,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text fontSize={56}>{listing.emoji}</Text>
                    )}

                    {/* Wishlist Heart Overlay */}
                    <XStack
                      position="absolute"
                      top={12}
                      right={12}
                      backgroundColor="rgba(0, 0, 0, 0.5)"
                      borderRadius={20}
                      padding={8}
                      gap={4}
                      alignItems="center"
                      pressStyle={{
                        opacity: 0.8,
                        scale: 0.95,
                      }}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(listing.id, e);
                      }}
                      cursor="pointer"
                    >
                      <Heart
                        size={16}
                        color="white"
                        strokeWidth={2}
                        fill={wishlistedItems.has(listing.id) ? 'white' : 'transparent'}
                      />
                      {listing.wishlistCount > 0 && (
                        <Text
                          fontSize={12}
                          fontWeight="600"
                          color="white"
                          fontFamily="$body"
                        >
                          {listing.wishlistCount}
                        </Text>
                      )}
                    </XStack>

                    {/* Sold Badge Overlay */}
                    {listing.status === 'Sold' && (
                      <YStack
                        position="absolute"
                        top={12}
                        left={12}
                        backgroundColor="rgba(0, 0, 0, 0.75)"
                        borderRadius={8}
                        paddingHorizontal={12}
                        paddingVertical={6}
                      >
                        <Text
                          fontSize={12}
                          fontWeight="700"
                          color="white"
                          fontFamily="$body"
                        >
                          SOLD
                        </Text>
                      </YStack>
                    )}
                  </YStack>

                  {/* Content */}
                  <YStack paddingVertical={10} paddingHorizontal={6} gap={6}>
                    <Text
                      fontSize={15}
                      fontWeight="600"
                      color={colors.text}
                      fontFamily="$body"
                      numberOfLines={2}
                    >
                      {listing.name}
                    </Text>
                    <Text
                      fontSize={17}
                      fontWeight="700"
                      color={colors.primary}
                      fontFamily="$body"
                    >
                      {listing.price}
                    </Text>
                  </YStack>
                </YStack>
          )}
        />
      </YStack>
    </SafeAreaView>
  );
}

