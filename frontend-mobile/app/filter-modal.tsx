import { useState } from 'react';
import { Text, YStack, XStack, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FilterModal() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const params = useLocalSearchParams<{
    minPrice?: string;
    maxPrice?: string;
    currentSort?: string;
  }>();

  const [minPrice, setMinPrice] = useState(params.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(params.maxPrice || '');
  const [error, setError] = useState('');

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setError('');
  };

  const handleApply = () => {
    // Validation
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;

    if (min !== undefined && isNaN(min)) {
      setError('Please enter a valid minimum price');
      return;
    }

    if (max !== undefined && isNaN(max)) {
      setError('Please enter a valid maximum price');
      return;
    }

    if (min !== undefined && max !== undefined && min > max) {
      setError('Minimum price cannot be greater than maximum price');
      return;
    }

    // Navigate back to home with filter params, preserving sort
    router.replace({
      pathname: '/(tabs)',
      params: {
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        sortBy: params.currentSort || 'mostRecent',
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
              Filter
            </Text>

            {/* Clear Button */}
            <XStack
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
              onPress={handleClearFilters}
            >
              <Text fontSize={15} fontWeight="600" color={colors.primary} fontFamily="$body">
                Clear
              </Text>
            </XStack>
          </XStack>

        {/* Content */}
        <YStack flex={1} paddingHorizontal={20} paddingVertical={20} gap={24}>
          {/* Price Range Section */}
          <YStack gap={16}>
            <Text fontSize={16} fontWeight="600" color={colors.text} fontFamily="$body">
              Price Range (€)
            </Text>

            <XStack gap={12}>
              {/* Min Price Input */}
              <YStack flex={1} gap={8}>
                <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                  Min Price
                </Text>
                <Input
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={(text) => {
                    setMinPrice(text);
                    setError('');
                  }}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  backgroundColor={colors.backgroundSecondary}
                  borderColor={error ? '#ef4444' : colors.border}
                  borderWidth={1}
                  borderRadius={12}
                  paddingHorizontal={16}
                  paddingVertical={14}
                  fontSize={16}
                  fontFamily="$body"
                  color={colors.text}
                />
              </YStack>

              {/* Max Price Input */}
              <YStack flex={1} gap={8}>
                <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                  Max Price
                </Text>
                <Input
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={(text) => {
                    setMaxPrice(text);
                    setError('');
                  }}
                  placeholder="Any"
                  placeholderTextColor={colors.textTertiary}
                  backgroundColor={colors.backgroundSecondary}
                  borderColor={error ? '#ef4444' : colors.border}
                  borderWidth={1}
                  borderRadius={12}
                  paddingHorizontal={16}
                  paddingVertical={14}
                  fontSize={16}
                  fontFamily="$body"
                  color={colors.text}
                />
              </YStack>
            </XStack>

            {/* Error Message */}
            {error && (
              <Text fontSize={13} color="#ef4444" fontFamily="$body">
                {error}
              </Text>
            )}
          </YStack>

          {/* Spacer */}
          <YStack flex={1} />

          {/* Apply Button */}
          <XStack
            backgroundColor={colors.primary}
            borderRadius={12}
            paddingVertical={16}
            justifyContent="center"
            alignItems="center"
            marginBottom={20}
            pressStyle={{ opacity: 0.8, scale: 0.98 }}
            cursor="pointer"
            onPress={handleApply}
          >
            <Text fontSize={17} fontWeight="700" color="white" fontFamily="$body">
              Apply Filters
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
