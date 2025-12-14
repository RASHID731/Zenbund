import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Edit3, CheckCircle, Info, Tag, MapPin } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SellerListingDetailModal() {
  // This is rendered as a modal due to its location in app/
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  // Parse listing data from params
  const listing = {
    name: params.name as string || 'Item',
    category: params.category as string || 'Category',
    price: params.price as string || '$0',
    description: params.description as string || 'No description available',
    emoji: params.emoji as string || '📦',
    seller: params.seller as string || 'You',
    location: params.location as string || 'Location not specified',
    status: params.status as string || 'Available',
    createdAt: params.createdAt as string || new Date().toISOString()
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
            Manage Listing
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
            {/* Image */}
            <YStack
              height={300}
              backgroundColor={colors.backgroundSecondary}
              justifyContent="center"
              alignItems="center"
              position="relative"
            >
              <Text fontSize={120}>{listing.emoji}</Text>

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
                  <Info size={16} color={colors.text} strokeWidth={2.5} />
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
                // TODO: Navigate to edit listing form
                // router.push(`/edit-listing?id=${params.id}`);
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
              backgroundColor={listing.status === 'Available' ? '#10B981' : colors.textSecondary}
              borderRadius={16}
              paddingVertical={10}
              justifyContent="center"
              alignItems="center"
              gap={8}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              cursor="pointer"
              onPress={() => {
                // TODO: Toggle listing status
                // handleToggleStatus();
              }}
            >
              <CheckCircle size={20} color="white" strokeWidth={2.5} />
              <Text fontSize={15} fontWeight="600" color="white" fontFamily="$body">
                {listing.status === 'Available' ? 'Mark Sold' : 'Mark Available'}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
