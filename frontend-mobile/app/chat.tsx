import { Text, YStack, XStack, ScrollView, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  const messages = [
    {
      id: 1,
      name: 'Sarah Chen',
      lastMessage: 'Is the textbook still available?',
      time: '2m ago',
      unread: 2,
      avatar: '👩‍💼'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      lastMessage: 'Thanks for the quick response!',
      time: '1h ago',
      unread: 0,
      avatar: '👨‍🎓'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      lastMessage: 'Can you meet at the library?',
      time: '3h ago',
      unread: 1,
      avatar: '👩‍🎨'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      lastMessage: 'Perfect, see you tomorrow!',
      time: '1d ago',
      unread: 0,
      avatar: '👨‍💻'
    },
    {
      id: 5,
      name: 'Lisa Park',
      lastMessage: 'The price is negotiable',
      time: '2d ago',
      unread: 0,
      avatar: '👩‍🔬'
    },
    {
      id: 6,
      name: 'David Kim',
      lastMessage: 'Interested in the laptop',
      time: '3d ago',
      unread: 3,
      avatar: '👨‍🏫'
    }
  ];

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
          <XStack alignItems="center" gap={12}>
            <XStack
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={colors.backgroundSecondary}
              justifyContent="center"
              alignItems="center"
              pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.95 }}
              onPress={() => {
                router.back();
              }}
              cursor="pointer"
            >
              <ArrowLeft size={20} color={colors.text} strokeWidth={2.5} />
            </XStack>

            <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
              Messages
            </Text>
          </XStack>
        </XStack>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingTop={16} paddingBottom={24} gap={16} backgroundColor={colors.background}>
            {/* Search Bar */}
            <XStack
              alignItems="center"
              marginHorizontal={20}
              backgroundColor={colors.backgroundSecondary}
              borderRadius={24}
              paddingHorizontal={16}
              paddingVertical={1}
              borderWidth={1}
              borderColor={colors.border}
            >
              <Search size={18} color={colors.icon} strokeWidth={2.5} style={{ marginRight: 10 }} />
              <Input
                flex={1}
                placeholder="Search conversations"
                placeholderTextColor={colors.textTertiary}
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

            {/* Messages List */}
            <YStack>
              {messages.map((message) => (
                <XStack
                  key={message.id}
                  backgroundColor="transparent"
                  paddingHorizontal={20}
                  paddingVertical={12}
                  alignItems="center"
                  gap={12}
                  pressStyle={{ backgroundColor: colors.backgroundSecondary }}
                  cursor="pointer"
                >
                  {/* Avatar */}
                  <YStack
                    width={56}
                    height={56}
                    backgroundColor={colorScheme === 'light' ? '#F5F4FE' : '#38347F'}
                    borderRadius={28}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={28}>{message.avatar}</Text>
                  </YStack>

                  {/* Message Info */}
                  <YStack flex={1} gap={6}>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text fontSize={16} fontWeight="600" color={colors.text} fontFamily="$body">
                        {message.name}
                      </Text>
                      <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                        {message.time}
                      </Text>
                    </XStack>

                    <XStack justifyContent="space-between" alignItems="center">
                      <Text
                        fontSize={14}
                        color={colors.textSecondary}
                        fontFamily="$body"
                        numberOfLines={1}
                        flex={1}
                        marginRight={8}
                      >
                        {message.lastMessage}
                      </Text>

                      {message.unread > 0 && (
                        <YStack
                          backgroundColor={colors.primary}
                          borderRadius={24}
                          paddingHorizontal={8}
                          paddingVertical={4}
                          minWidth={24}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize={12} fontWeight="700" color="white" fontFamily="$body">
                            {message.unread}
                          </Text>
                        </YStack>
                      )}
                    </XStack>
                  </YStack>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
