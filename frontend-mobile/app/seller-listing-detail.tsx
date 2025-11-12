import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Edit3, CheckCircle, Info, Tag, MapPin } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Sizes, FontSizes, BorderRadius } from '@/constants/sizes';
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
          paddingHorizontal={Sizes.lg}
          paddingVertical={Sizes.mdlg}
          alignItems="center"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
          <Text fontSize={FontSizes.lg} fontWeight="700" color={colors.text} fontFamily="$body">
            Manage Listing
          </Text>
          <XStack
            width={Sizes.xxxxl}
            height={Sizes.xxxxl}
            justifyContent="center"
            alignItems="center"
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
            onPress={() => router.back()}
          >
            <X size={Sizes.xl} color={colors.text} strokeWidth={2.5} />
          </XStack>
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack gap={Sizes.xl} paddingBottom={Sizes.xl}>
            {/* Image */}
            <YStack
              height={Sizes.image}
              backgroundColor={colors.backgroundSecondary}
              justifyContent="center"
              alignItems="center"
              position="relative"
            >
              <Text fontSize={FontSizes.emoji}>{listing.emoji}</Text>

              {/* Status Badge */}
              <XStack
                position="absolute"
                top={Sizes.mdlg}
                right={Sizes.mdlg}
                backgroundColor={listing.status === 'Available' ? '#10B981' : '#6B7280'}
                paddingHorizontal={Sizes.md}
                paddingVertical={Sizes.xs / 1.5}
                borderRadius={BorderRadius.lg}
              >
                <Text fontSize={FontSizes.xs} fontWeight="600" color="white" fontFamily="$body">
                  {listing.status}
                </Text>
              </XStack>
            </YStack>

            {/* Content */}
            <YStack paddingHorizontal={Sizes.lg} gap={Sizes.lg}>
              {/* Name, Price, and Timestamp */}
              <YStack gap={Sizes.sm}>
                <Text fontSize={FontSizes.xxxl} fontWeight="700" color={colors.text} fontFamily="$body">
                  {listing.name}
                </Text>
                <YStack gap={Sizes.xs}>
                  <Text fontSize={FontSizes.xxxxl} fontWeight="700" color={colors.primary} fontFamily="$body">
                    {listing.price}
                  </Text>
                  <Text fontSize={FontSizes.xsm} color={colors.textSecondary} fontFamily="$body">
                    {getTimeSincePosted(listing.createdAt)}
                  </Text>
                </YStack>
              </YStack>

              {/* Description */}
              <YStack gap={Sizes.sm}>
                <XStack gap={Sizes.sm} alignItems="center">
                  <Info size={FontSizes.md} color={colors.text} strokeWidth={2.5} />
                  <Text fontSize={FontSizes.smd} fontWeight="600" color={colors.text} fontFamily="$body">
                    Description
                  </Text>
                </XStack>
                <Text fontSize={FontSizes.sm} color={colors.textSecondary} fontFamily="$body" lineHeight={FontSizes.xxl}>
                  {listing.description}
                </Text>
              </YStack>

              {/* Category & Location - Compact Row */}
              <XStack gap={Sizes.mdlg} flexWrap="wrap">
                {/* Category */}
                <XStack
                  flex={1}
                  minWidth="45%"
                  gap={Sizes.sm}
                  alignItems="center"
                  backgroundColor={colors.backgroundSecondary}
                  paddingHorizontal={Sizes.md}
                  paddingVertical={Sizes.smd}
                  borderRadius={BorderRadius.lg}
                >
                  <Tag size={FontSizes.md} color={colors.text} strokeWidth={2.5} />
                  <YStack flex={1}>
                    <Text fontSize={FontSizes.xs} color={colors.textSecondary} fontFamily="$body">
                      Category
                    </Text>
                    <Text fontSize={FontSizes.sm} fontWeight="600" color={colors.text} fontFamily="$body">
                      {listing.category}
                    </Text>
                  </YStack>
                </XStack>

                {/* Location */}
                <XStack
                  flex={1}
                  minWidth="45%"
                  gap={Sizes.sm}
                  alignItems="center"
                  backgroundColor={colors.backgroundSecondary}
                  paddingHorizontal={Sizes.md}
                  paddingVertical={Sizes.smd}
                  borderRadius={BorderRadius.lg}
                >
                  <MapPin size={FontSizes.md} color={colors.text} strokeWidth={2.5} />
                  <YStack flex={1}>
                    <Text fontSize={FontSizes.xs} color={colors.textSecondary} fontFamily="$body">
                      Pickup Location
                    </Text>
                    <Text fontSize={FontSizes.sm} fontWeight="600" color={colors.text} fontFamily="$body">
                      {listing.location}
                    </Text>
                  </YStack>
                </XStack>
              </XStack>

              {/* Seller Info */}
              <YStack gap={Sizes.sm}>
                <Text fontSize={FontSizes.smd} fontWeight="600" color={colors.text} fontFamily="$body">
                  Seller
                </Text>
                <XStack alignItems="center" gap={Sizes.md}>
                  <YStack
                    width={Sizes.xxxxl}
                    height={Sizes.xxxxl}
                    backgroundColor={colorScheme === 'light' ? '#F5F4FE' : '#38347F'}
                    borderRadius={BorderRadius.xxl}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={FontSizes.xl}>👤</Text>
                  </YStack>
                  <Text fontSize={FontSizes.smd} color={colors.text} fontWeight="500" fontFamily="$body">
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
          paddingHorizontal={Sizes.lg}
          paddingTop={Sizes.md}
          paddingBottom={Sizes.xxl}
          gap={Sizes.md}
        >
          <XStack gap={Sizes.md}>
            {/* Edit Listing Button */}
            <XStack
              flex={1}
              backgroundColor={colors.background}
              borderWidth={1.5}
              borderColor={colors.primary}
              borderRadius={BorderRadius.xl}
              paddingVertical={Sizes.smd}
              justifyContent="center"
              alignItems="center"
              gap={Sizes.sm}
              pressStyle={{ opacity: 0.7, scale: 0.98, backgroundColor: colors.backgroundSecondary }}
              cursor="pointer"
              onPress={() => {
                // TODO: Navigate to edit listing form
                // router.push(`/edit-listing?id=${params.id}`);
              }}
            >
              <Edit3 size={FontSizes.xl} color={colors.primary} strokeWidth={2.5} />
              <Text fontSize={FontSizes.smd} fontWeight="600" color={colors.primary} fontFamily="$body">
                Edit Listing
              </Text>
            </XStack>

            {/* Mark as Sold/Available Button */}
            <XStack
              flex={1}
              backgroundColor={listing.status === 'Available' ? '#10B981' : colors.textSecondary}
              borderRadius={BorderRadius.xl}
              paddingVertical={Sizes.smd}
              justifyContent="center"
              alignItems="center"
              gap={Sizes.sm}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              cursor="pointer"
              onPress={() => {
                // TODO: Toggle listing status
                // handleToggleStatus();
              }}
            >
              <CheckCircle size={FontSizes.xl} color="white" strokeWidth={2.5} />
              <Text fontSize={FontSizes.smd} fontWeight="600" color="white" fontFamily="$body">
                {listing.status === 'Available' ? 'Mark Sold' : 'Mark Available'}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
