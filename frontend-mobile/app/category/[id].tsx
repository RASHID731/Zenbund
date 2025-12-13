import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Image, FlatList } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { Offer, Category } from '@/types';

// Frontend display type (transformed from backend Offer)
interface ListingDisplay {
  id: number;
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
function transformOfferToListing(offer: Offer, category: Category): ListingDisplay {
  return {
    id: offer.id,
    name: offer.title,
    category: category.name,
    price: `${offer.price} €`,
    emoji: category.emoji,
    description: offer.description,
    seller: offer.user?.name || 'Unknown Seller',
    location: offer.pickupLocation,
    status: offer.status === 'available' ? 'Available' : 'Sold',
    imageUrls: offer.imageUrls || [],
    createdAt: offer.createdAt,
  };
}

export default function CategoryDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [offers, setOffers] = useState<ListingDisplay[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch category and offers on mount
  useEffect(() => {
    async function fetchData() {
      // Fetch category details
      setLoadingCategory(true);
      const catResponse = await apiClient.get<Category>(`/categories/${categoryId}`);
      let fetchedCategory: Category | null = null;

      if (catResponse.success && catResponse.data) {
        fetchedCategory = catResponse.data;
        setCategory(fetchedCategory);
      } else {
        console.error('Failed to fetch category:', catResponse.message);
        setError(catResponse.message || 'Category not found');
      }
      setLoadingCategory(false);

      // Fetch offers filtered by category (only if category was successfully fetched)
      if (fetchedCategory) {
        setLoadingOffers(true);
        const offersResponse = await apiClient.get<Offer[]>(`/offers/category/${categoryId}`);
        if (offersResponse.success && offersResponse.data) {
          const transformed = offersResponse.data.map(offer => transformOfferToListing(offer, fetchedCategory));
          setOffers(transformed);
        } else {
          console.error('Failed to fetch offers:', offersResponse.message);
        }
        setLoadingOffers(false);
      }
    }

    fetchData();
  }, [categoryId]);

  const openListingDetail = (listing: ListingDisplay) => {
    router.push({
      pathname: '/listing-detail',
      params: {
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
        {/* Header with Back Button */}
        <XStack
          paddingHorizontal={20}
          paddingVertical={16}
          alignItems="center"
          gap={12}
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
          <XStack
            width={40}
            height={40}
            justifyContent="center"
            alignItems="center"
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.text} strokeWidth={2.5} />
          </XStack>
          <Text fontSize={20} fontWeight="700" color={colors.text} fontFamily="$body">
            {loadingCategory ? 'Loading...' : category?.name || 'Category'}
          </Text>
        </XStack>

        {/* Content */}
        {error ? (
          // Error State
          <YStack flex={1} justifyContent="center" alignItems="center" padding={40} gap={16}>
            <Text fontSize={48}>❌</Text>
            <Text fontSize={18} fontWeight="600" color={colors.text} textAlign="center" fontFamily="$body">
              {error}
            </Text>
            <XStack
              backgroundColor={colors.primary}
              borderRadius={20}
              paddingHorizontal={24}
              paddingVertical={12}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              cursor="pointer"
              onPress={() => router.back()}
            >
              <Text fontSize={14} fontWeight="600" color="white" fontFamily="$body">
                Go Back
              </Text>
            </XStack>
          </YStack>
        ) : (
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack paddingHorizontal={20} paddingTop={16} paddingBottom={24} gap={20}>
              {/* Offers Grid */}
              <FlatList
                data={offers}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={{ gap: 16 }}
                contentContainerStyle={{ gap: 16 }}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <YStack padding={40} alignItems="center" gap={12}>
                    <Text fontSize={64}>{category?.emoji || '📦'}</Text>
                    <Text fontSize={16} color={colors.textSecondary} fontFamily="$body" textAlign="center">
                      {loadingOffers ? 'Loading items...' : 'No items available in this category'}
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
        )}
      </YStack>
    </SafeAreaView>
  );
}
