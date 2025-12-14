import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface WishlistItem {
  id: number;
  userId: number;
  addedAt: string;
  offerId: number;
  imageUrls: string[];
  title: string;
  price: number;
  categoryId: number;
  pickupLocation: string;
  description: string;
  status: string;
  wishlistCount: number;
}

export default function Wishlist() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get<WishlistItem[]>('/wishlists');
      if (response.success && response.data) {
        setWishlistItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchWishlist();
  };

  // Remove item from wishlist
  const handleRemoveItem = async (wishlistId: number, title: string) => {
    Alert.alert(
      'Remove from Wishlist',
      `Are you sure you want to remove "${title}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiClient.delete(`/wishlists/${wishlistId}`);
              if (response.success) {
                setWishlistItems(prev => prev.filter(item => item.id !== wishlistId));
              } else {
                Alert.alert('Error', response.message || 'Failed to remove item from wishlist.');
              }
            } catch (error: any) {
              console.error('Error removing from wishlist:', error);
              Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Navigate to listing detail
  const handleItemPress = (item: WishlistItem) => {
    router.push({
      pathname: '/listing-detail',
      params: {
        id: item.offerId.toString(),
        name: item.title,
        price: `$${item.price}`,
        description: item.description,
        location: item.pickupLocation,
        status: item.status === 'available' ? 'Available' : 'Sold Out',
        imageUrls: JSON.stringify(item.imageUrls),
        category: 'Category',
        emoji: '📦',
        seller: 'Seller',
        createdAt: item.addedAt
      }
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Added today';
    if (diffInDays === 1) return 'Added 1 day ago';
    if (diffInDays < 7) return `Added ${diffInDays} days ago`;
    if (diffInDays < 30) return `Added ${Math.floor(diffInDays / 7)} weeks ago`;
    return `Added ${Math.floor(diffInDays / 30)} months ago`;
  };

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
            onPress={() => router.back()}
            cursor="pointer"
          >
            <ArrowLeft size={20} color={colors.text} strokeWidth={2.5} />
          </XStack>

          <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
            Wishlist
          </Text>

          <XStack width={40} />
        </XStack>

        {/* Content */}
        {loading ? (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={colors.primary} />
          </YStack>
        ) : !isAuthenticated ? (
          <YStack flex={1} paddingHorizontal={20} paddingTop={40} alignItems="center" gap={16}>
            <YStack
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor={colors.backgroundSecondary}
              justifyContent="center"
              alignItems="center"
            >
              <Heart size={36} color={colors.icon} strokeWidth={2} />
            </YStack>

            <YStack gap={8} alignItems="center">
              <Text fontSize={20} fontWeight="700" color={colors.text} fontFamily="$body">
                Login Required
              </Text>
              <Text fontSize={14} color={colors.textSecondary} textAlign="center" fontFamily="$body">
                Please log in to view your wishlist
              </Text>
            </YStack>
          </YStack>
        ) : wishlistItems.length === 0 ? (
          <ScrollView
            flex={1}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          >
            <YStack paddingHorizontal={20} paddingTop={40} alignItems="center" gap={16}>
              <YStack
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor={colors.backgroundSecondary}
                justifyContent="center"
                alignItems="center"
              >
                <Heart size={36} color={colors.icon} strokeWidth={2} />
              </YStack>

              <YStack gap={8} alignItems="center">
                <Text fontSize={20} fontWeight="700" color={colors.text} fontFamily="$body">
                  Your Wishlist is Empty
                </Text>
                <Text fontSize={14} color={colors.textSecondary} textAlign="center" fontFamily="$body">
                  Save items you love to view them later
                </Text>
              </YStack>
            </YStack>
          </ScrollView>
        ) : (
          <ScrollView
            flex={1}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          >
            <YStack paddingHorizontal={20} paddingVertical={20} gap={12}>
              {wishlistItems.map((item) => (
                <XStack
                  key={item.id}
                  backgroundColor={colors.backgroundSecondary}
                  borderRadius={12}
                  overflow="hidden"
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                  cursor="pointer"
                  onPress={() => handleItemPress(item)}
                >
                  {/* Image */}
                  <YStack width={100} height={100} backgroundColor={colors.backgroundTertiary}>
                    {item.imageUrls && item.imageUrls.length > 0 ? (
                      <Image
                        source={{ uri: item.imageUrls[0] }}
                        style={{ width: 100, height: 110 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <YStack flex={1} justifyContent="center" alignItems="center">
                        <Text fontSize={36}>📦</Text>
                      </YStack>
                    )}
                  </YStack>

                  {/* Content */}
                  <YStack flex={1} padding={12} gap={4} justifyContent="space-between">
                    <YStack gap={4}>
                      <Text
                        fontSize={15}
                        fontWeight="600"
                        color={colors.text}
                        fontFamily="$body"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text fontSize={18} fontWeight="700" color={colors.primary} fontFamily="$body">
                        ${item.price}
                      </Text>
                    </YStack>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize={12} color={colors.textSecondary} fontFamily="$body">
                        {formatDate(item.addedAt)}
                      </Text>
                      <XStack
                        width={32}
                        height={32}
                        borderRadius={8}
                        backgroundColor={colors.background}
                        justifyContent="center"
                        alignItems="center"
                        pressStyle={{ backgroundColor: '#FEE2E2', scale: 0.95 }}
                        cursor="pointer"
                        onPress={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(item.id, item.title);
                        }}
                      >
                        <Trash2 size={16} color="#EF4444" strokeWidth={2.5} />
                      </XStack>
                    </XStack>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </SafeAreaView>
  );
}
