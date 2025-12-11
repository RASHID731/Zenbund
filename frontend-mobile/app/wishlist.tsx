import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Wishlist() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

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

          <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
            Wishlist
          </Text>

          <XStack width={40} />
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
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
              <Text fontSize={15} color={colors.textSecondary} textAlign="center" fontFamily="$body">
                Save items you love to view them later
              </Text>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
