import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Image, FlatList } from 'react-native';
import { SlidersHorizontal, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Navbar } from '@/components/navbar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { Offer, Category } from '@/types';

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
  location: string;
  status: string;
  imageUrls: string[];
  createdAt: string;
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
    seller: offer.user?.name || 'Unknown Seller',
    location: offer.pickupLocation,
    status: offer.status === 'available' ? 'Available' : 'Sold',
    imageUrls: offer.imageUrls || [],
    createdAt: offer.createdAt,
  };
}

export default function HomeScreen() {
  const [sortBy, setSortBy] = useState('Most Recent');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [listings, setListings] = useState<ListingDisplay[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  // Fetch categories and offers whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        // Fetch categories
        setLoadingCategories(true);
        const categoriesResponse = await apiClient.get<Category[]>('/categories');
        let categoryMap: Record<number, { name: string; emoji: string }> = {};

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
          // Create category lookup map
          categoryMap = categoriesResponse.data.reduce((acc, cat) => {
            acc[cat.id] = { name: cat.name, emoji: cat.emoji };
            return acc;
          }, {} as Record<number, { name: string; emoji: string }>);
        } else {
          console.error('Failed to fetch categories:', categoriesResponse.message);
          setCategoriesError(categoriesResponse.message || 'Failed to load categories');
        }
        setLoadingCategories(false);

        // Fetch offers
        const offersResponse = await apiClient.get<Offer[]>('/offers');
        if (offersResponse.success && offersResponse.data) {
          const transformedListings = offersResponse.data.map(offer =>
            transformOfferToListing(offer, categoryMap)
          );
          setListings(transformedListings);
        } else {
          console.error('Failed to fetch offers:', offersResponse.message);
        }
      }
      fetchData();
    }, [])
  );

  const openListingDetail = (listing: ListingDisplay) => {
    router.push({
      pathname: '/listing-detail',
      params: {
        id: listing.id,
        userId: listing.userId,
        name: listing.name,
        category: listing.category,
        price: listing.price,
        emoji: listing.emoji,
        description: listing.description,
        seller: listing.seller,
        location: listing.location,
        status: listing.status,
        imageUrls: JSON.stringify(listing.imageUrls),
        createdAt: listing.createdAt
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        <Navbar />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingTop={16} paddingBottom={24} gap={20} backgroundColor={colors.background}>
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
                onPress={() => {
                  console.log('Open sorting options');
                  // TODO: Implement sorting dropdown
                }}
                cursor="pointer"
              >
                <Text fontSize={14} fontWeight="500" color={colors.text} fontFamily="$body">
                  {sortBy}
                </Text>
                <ChevronDown size={18} color={colors.icon} strokeWidth={2.5} />
              </XStack>

              {/* Filter Button */}
              <XStack
                alignItems="center"
                justifyContent="center"
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
                onPress={() => {
                  console.log('Open filter modal');
                  setShowFilterModal(true);
                  // TODO: Implement filter modal
                }}
                cursor="pointer"
              >
                <SlidersHorizontal size={20} color={colors.icon} strokeWidth={2.5} />
              </XStack>
            </XStack>
            
            {/* Offers Grid */}
            <FlatList
              data={listings}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 16 }}
              contentContainerStyle={{ gap: 16 }}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <YStack padding={40} alignItems="center">
                  <Text fontSize={16} color={colors.textSecondary} fontFamily="$body">
                    No listings available
                  </Text>
                </YStack>
              }
              renderItem={({ item: listing }) => (
                <YStack
                  flex={1}
                  maxWidth="48%"
                  backgroundColor={colors.card}
                  borderRadius={20}
                  borderWidth={1}
                  borderColor={colors.border}
                  overflow="hidden"
                  pressStyle={{
                    opacity: 0.9,
                    scale: 0.97,
                  }}
                  cursor="pointer"
                  onPress={() => openListingDetail(listing)}
                >
                  <YStack
                    height={160}
                    backgroundColor={colors.backgroundSecondary}
                    borderBottomColor={colors.border}
                    borderBottomWidth={1}
                    justifyContent="center"
                    alignItems="center"
                    overflow="hidden"
                  >
                    {listing.imageUrls && listing.imageUrls.length > 0 ? (
                      <Image
                        source={{ uri: listing.imageUrls[0] }}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text fontSize={48}>{listing.emoji}</Text>
                    )}
                  </YStack>
                  <YStack padding={12} gap={6}>
                    <Text
                      fontSize={15}
                      fontWeight="600"
                      color={colors.text}
                      fontFamily="$body"
                      numberOfLines={1}
                    >
                      {listing.name}
                    </Text>
                    <Text
                      fontSize={17}
                      fontWeight="700"
                      color={colors.primary}
                      fontFamily="$body"
                      marginTop={2}
                    >
                      {listing.price}
                    </Text>
                  </YStack>
                </YStack>
              )}
            />
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}

