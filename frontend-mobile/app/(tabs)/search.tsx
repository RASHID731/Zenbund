import { Text, YStack, XStack, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search } from 'lucide-react-native';
import { Navbar } from '@/components/navbar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const MOCK_OFFERS = [
  { id: 1, title: 'Calculus Textbook', price: 25, imageUrls: [], emoji: '📚', status: 'available' },
  { id: 2, title: 'Laptop Stand', price: 18, imageUrls: [], emoji: '💻', status: 'available' },
  { id: 3, title: 'Study Desk Lamp', price: 12, imageUrls: [], emoji: '💡', status: 'available' },
  { id: 4, title: 'Wireless Headphones', price: 45, imageUrls: [], emoji: '🎧', status: 'available' },
  { id: 5, title: 'Mini Fridge', price: 60, imageUrls: [], emoji: '🧊', status: 'available' },
];

const MOCK_USERS = [
  { id: 1, name: 'Alex Martin', university: 'TU Berlin', profilePicture: undefined, listingCount: 5 },
  { id: 2, name: 'Sara Müller', university: 'HU Berlin', profilePicture: undefined, listingCount: 12 },
  { id: 3, name: 'Jonas Weber', university: 'FU Berlin', profilePicture: undefined, listingCount: 3 },
  { id: 4, name: 'Lena Bauer', university: 'TU Berlin', profilePicture: undefined, listingCount: 8 },
];

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

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Offers Section */}
            <YStack marginBottom={28}>
              <Text
                fontSize={17}
                fontWeight="700"
                color={colors.text}
                fontFamily="$body"
                marginBottom={12}
              >
                Offers
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap={0}>
                  {MOCK_OFFERS.map((offer) => (
                    <TouchableOpacity
                      key={offer.id}
                      activeOpacity={0.8}
                      style={{ marginRight: 12 }}
                    >
                      <YStack
                        width={150}
                        backgroundColor={colors.card}
                        borderRadius={8}
                        overflow="hidden"
                      >
                        <YStack
                          width={150}
                          aspectRatio={1}
                          backgroundColor={colors.backgroundSecondary}
                          justifyContent="center"
                          alignItems="center"
                          borderRadius={8}
                          overflow="hidden"
                        >
                          {offer.imageUrls.length > 0 ? (
                            <Image
                              source={{ uri: offer.imageUrls[0] }}
                              style={{ width: '100%', height: '100%', borderRadius: 8 }}
                              resizeMode="cover"
                            />
                          ) : (
                            <Text fontSize={56}>{offer.emoji}</Text>
                          )}
                        </YStack>
                        <YStack paddingVertical={8} paddingHorizontal={6} gap={4}>
                          <Text
                            fontSize={14}
                            fontWeight="600"
                            color={colors.text}
                            fontFamily="$body"
                            numberOfLines={1}
                          >
                            {offer.title}
                          </Text>
                          <Text
                            fontSize={15}
                            fontWeight="700"
                            color={colors.primary}
                            fontFamily="$body"
                          >
                            {offer.price} €
                          </Text>
                        </YStack>
                      </YStack>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </ScrollView>
            </YStack>

            {/* Users Section */}
            <YStack marginBottom={28}>
              <Text
                fontSize={17}
                fontWeight="700"
                color={colors.text}
                fontFamily="$body"
                marginBottom={12}
              >
                Users
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap={0}>
                  {MOCK_USERS.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      activeOpacity={0.8}
                      style={{ marginRight: 12 }}
                    >
                      <XStack
                        width={240}
                        height={100}
                        alignItems="stretch"
                        backgroundColor={colors.card}
                        borderRadius={12}
                        borderWidth={1}
                        borderColor={colors.border}
                        overflow="hidden"
                      >
                        {/* Avatar — full left panel */}
                        <YStack
                          width={90}
                          backgroundColor={colors.backgroundSecondary}
                          justifyContent="center"
                          alignItems="center"
                          flexShrink={0}
                        >
                          {user.profilePicture ? (
                            <Image
                              source={{ uri: user.profilePicture }}
                              style={{ width: 90, height: 100 }}
                              resizeMode="cover"
                            />
                          ) : (
                            <Text fontSize={40}>👤</Text>
                          )}
                        </YStack>

                        {/* Info */}
                        <YStack flex={1} justifyContent="center" gap={4} paddingHorizontal={14}>
                          <Text
                            fontSize={15}
                            fontWeight="700"
                            color={colors.text}
                            fontFamily="$body"
                            numberOfLines={1}
                          >
                            {user.name}
                          </Text>
                          <Text
                            fontSize={13}
                            color={colors.textSecondary}
                            fontFamily="$body"
                            numberOfLines={1}
                          >
                            {user.university}
                          </Text>
                          <Text
                            fontSize={12}
                            color={colors.primary}
                            fontFamily="$body"
                            fontWeight="600"
                          >
                            {user.listingCount} {user.listingCount === 1 ? 'listing' : 'listings'}
                          </Text>
                        </YStack>
                      </XStack>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </ScrollView>
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
