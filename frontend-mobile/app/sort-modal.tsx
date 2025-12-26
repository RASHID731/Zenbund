import { Text, YStack, XStack } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SortOption } from '@/types';

const SORT_OPTIONS: { value: SortOption; label: string; description: string }[] = [
  { value: 'mostRecent', label: 'Most Recent', description: 'Newest offers first' },
  { value: 'priceLowToHigh', label: 'Price: Low to High', description: 'Cheapest first' },
  { value: 'priceHighToLow', label: 'Price: High to Low', description: 'Most expensive first' },
  { value: 'mostWishlisted', label: 'Most Wishlisted', description: 'Popular items' },
];

export default function SortModal() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { currentSort, minPrice, maxPrice } = useLocalSearchParams<{
    currentSort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();

  const handleSortSelect = (sortValue: SortOption) => {
    // Navigate back to home with params, preserving filters
    router.replace({
      pathname: '/(tabs)',
      params: {
        sortBy: sortValue,
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
      }
    });
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
          {/* Close Button */}
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
            <X size={20} color={colors.text} strokeWidth={2.5} />
          </XStack>

          {/* Title */}
          <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
            Sort By
          </Text>

          {/* Spacer */}
          <XStack width={40} />
        </XStack>

        {/* Content - Sort Options */}
        <YStack paddingHorizontal={20} paddingTop={20} paddingBottom={40} gap={12}>
          {SORT_OPTIONS.map((option) => {
            const isSelected = currentSort === option.value;
            return (
              <XStack
                key={option.value}
                backgroundColor={isSelected ? colors.backgroundTertiary : colors.backgroundSecondary}
                borderRadius={16}
                paddingHorizontal={16}
                paddingVertical={16}
                borderWidth={1}
                borderColor={isSelected ? colors.primary : colors.border}
                pressStyle={{ opacity: 0.7, scale: 0.98 }}
                cursor="pointer"
                onPress={() => handleSortSelect(option.value)}
                alignItems="center"
              >
                <YStack flex={1} gap={4}>
                  <Text fontSize={16} fontWeight="600" color={colors.text} fontFamily="$body">
                    {option.label}
                  </Text>
                  <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                    {option.description}
                  </Text>
                </YStack>
                {isSelected && (
                  <Check size={20} color={colors.primary} strokeWidth={2.5} />
                )}
              </XStack>
            );
          })}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
