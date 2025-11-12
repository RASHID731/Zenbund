import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Sizes, FontSizes, BorderRadius } from '@/constants/sizes';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Category configuration
const categoryConfig = {
  dorm: {
    title: 'Dorm',
    emoji: '🛏️',
    description: 'Furniture, bedding, storage, and everything for your dorm room',
  },
  fashion: {
    title: 'Fashion',
    emoji: '👕',
    description: 'Clothing, shoes, accessories, and style essentials',
  },
  school: {
    title: 'School',
    emoji: '📚',
    description: 'Textbooks, stationery, calculators, and academic materials',
  },
  hobbies: {
    title: 'Hobbies',
    emoji: '🎮',
    description: 'Gaming, sports equipment, instruments, and hobby gear',
  },
};

export default function CategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  // Get category from params
  const categoryId = params.category as string;
  const category = categoryConfig[categoryId as keyof typeof categoryConfig] || {
    title: 'Category',
    emoji: '📦',
    description: 'Browse items in this category',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        {/* Header with Back Button */}
        <XStack
          paddingHorizontal={Sizes.lg}
          paddingVertical={Sizes.mdlg}
          alignItems="center"
          gap={Sizes.md}
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
          <XStack
            width={Sizes.xxxxl}
            height={Sizes.xxxxl}
            justifyContent="center"
            alignItems="center"
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
            onPress={() => router.back()}
          >
            <ChevronLeft size={Sizes.xl} color={colors.text} strokeWidth={2.5} />
          </XStack>
          <Text fontSize={FontSizes.lg} fontWeight="700" color={colors.text} fontFamily="$body">
            {category.title}
          </Text>
        </XStack>

        {/* Content */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={Sizes.lg} paddingTop={Sizes.xl} gap={Sizes.lg}>
            {/* Category Icon/Emoji */}
            <YStack
              alignItems="center"
              justifyContent="center"
              paddingVertical={Sizes.xxl}
            >
              <Text fontSize={80}>{category.emoji}</Text>
              <Text
                fontSize={FontSizes.xxxl}
                fontWeight="700"
                color={colors.text}
                fontFamily="$body"
                marginTop={Sizes.md}
              >
                {category.title}
              </Text>
              <Text
                fontSize={FontSizes.sm}
                color={colors.textSecondary}
                fontFamily="$body"
                marginTop={Sizes.xs}
                textAlign="center"
              >
                {category.description}
              </Text>
            </YStack>

            {/* Debug Info - Shows current category ID */}
            <YStack
              backgroundColor={colors.backgroundSecondary}
              borderRadius={BorderRadius.xl}
              padding={Sizes.md}
              alignItems="center"
            >
              <Text fontSize={FontSizes.xs} color={colors.textSecondary} fontFamily="$body">
                Category ID: {categoryId}
              </Text>
            </YStack>

            {/* Placeholder Content */}
            <YStack
              backgroundColor={colors.backgroundSecondary}
              borderRadius={BorderRadius.xl}
              padding={Sizes.xl}
              alignItems="center"
              gap={Sizes.sm}
            >
              <Text fontSize={FontSizes.md} color={colors.textSecondary} fontFamily="$body" textAlign="center">
                Listings will appear here
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
