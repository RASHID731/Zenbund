import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Image, FlatList } from 'react-native';
import { Home, Shirt, BookOpen, Gamepad2, SlidersHorizontal, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Navbar } from '@/components/navbar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { Offer, CATEGORY_MAP } from '@/types';

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
function transformOfferToListing(offer: Offer): ListingDisplay {
  const categoryInfo = CATEGORY_MAP[offer.categoryId] || CATEGORY_MAP[6];
  return {
    id: offer.id,
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
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  // Fetch offers from API on mount
  useEffect(() => {
    async function fetchOffers() {
      const response = await apiClient.get<Offer[]>('/offers');
      if (response.success && response.data) {
        const transformedListings = response.data.map(transformOfferToListing);
        setListings(transformedListings);
      } else {
        console.error('Failed to fetch offers:', response.message);
      }
    }
    fetchOffers();
  }, []);

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
        <Navbar />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingTop={16} paddingBottom={24} gap={20} backgroundColor={colors.background}>
            {/* Category Buttons - Wolt Style */}
            <XStack gap={16} width="100%" justifyContent="space-around">
              {/* Dorm */}
              <YStack
                alignItems="center"
                gap={8}
                pressStyle={{
                  opacity: 0.7,
                }}
                onPress={() => {
                  router.push('/dorm');
                }}
                cursor="pointer"
              >
                <YStack
                  width={56}
                  height={56}
                  backgroundColor={colorScheme === 'light' ? '#E3F2FD' : '#1565C0'}
                  borderRadius={28}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Home
                    size={24}
                    color={colorScheme === 'light' ? '#1976D2' : '#E3F2FD'}
                    strokeWidth={2}
                  />
                </YStack>
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={colors.text}
                  fontFamily="$body"
                >
                  Dorm
                </Text>
              </YStack>

              {/* Fashion */}
              <YStack
                alignItems="center"
                gap={8}
                pressStyle={{
                  opacity: 0.7,
                }}
                onPress={() => {
                  router.push('/fashion');
                }}
                cursor="pointer"
              >
                <YStack
                  width={56}
                  height={56}
                  backgroundColor={colorScheme === 'light' ? '#FCE4EC' : '#AD1457'}
                  borderRadius={28}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Shirt
                    size={24}
                    color={colorScheme === 'light' ? '#C2185B' : '#FCE4EC'}
                    strokeWidth={2}
                  />
                </YStack>
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={colors.text}
                  fontFamily="$body"
                >
                  Fashion
                </Text>
              </YStack>

              {/* School */}
              <YStack
                alignItems="center"
                gap={8}
                pressStyle={{
                  opacity: 0.7,
                }}
                onPress={() => {
                  router.push('/school');
                }}
                cursor="pointer"
              >
                <YStack
                  width={56}
                  height={56}
                  backgroundColor={colorScheme === 'light' ? '#E8F5E9' : '#2E7D32'}
                  borderRadius={28}
                  alignItems="center"
                  justifyContent="center"
                >
                  <BookOpen
                    size={24}
                    color={colorScheme === 'light' ? '#388E3C' : '#E8F5E9'}
                    strokeWidth={2}
                  />
                </YStack>
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={colors.text}
                  fontFamily="$body"
                >
                  School
                </Text>
              </YStack>

              {/* Hobbies */}
              <YStack
                alignItems="center"
                gap={8}
                pressStyle={{
                  opacity: 0.7,
                }}
                onPress={() => {
                  router.push('/hobbies');
                }}
                cursor="pointer"
              >
                <YStack
                  width={56}
                  height={56}
                  backgroundColor={colorScheme === 'light' ? '#FFF3E0' : '#E65100'}
                  borderRadius={28}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Gamepad2
                    size={24}
                    color={colorScheme === 'light' ? '#F57C00' : '#FFF3E0'}
                    strokeWidth={2}
                  />
                </YStack>
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={colors.text}
                  fontFamily="$body"
                >
                  Hobbies
                </Text>
              </YStack>
            </XStack>

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

