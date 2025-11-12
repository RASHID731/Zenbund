import { Text, YStack, XStack, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Search } from 'lucide-react-native';
import { Navbar } from '@/components/navbar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        <YStack flex={1} paddingHorizontal={20} paddingTop={16} gap={20} backgroundColor={colors.background}>
          {/* Search Bar */}
          <XStack
            alignItems="center"
            width="100%"
            backgroundColor={colors.backgroundSecondary}
            borderWidth={1}
            borderColor={colors.border}
            borderRadius={24}
            paddingHorizontal={16}
            paddingVertical={1}
          >
            <Search size={18} color={colors.icon} strokeWidth={2.5} style={{ marginRight: 10 }} />
            <Input
              flex={1}
              placeholder="Search for items..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              borderWidth={0}
              backgroundColor="transparent"
              paddingHorizontal={0}
              paddingVertical={0}
              fontSize={15}
              fontFamily="$body"
              color={colors.text}
              borderRadius={0}
            />
          </XStack>

          {/* Search Results Placeholder */}
          <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal={32}>
            <Text fontSize={56} marginBottom={16}>🔍</Text>
            <Text
              fontSize={18}
              fontWeight="600"
              color={colors.text}
              fontFamily="$body"
              marginBottom={8}
            >
              Search for items
            </Text>
            <Text
              fontSize={15}
              color={colors.textSecondary}
              fontFamily="$body"
              textAlign="center"
              lineHeight={22}
            >
              Find textbooks, electronics, furniture, and more from your campus community
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
