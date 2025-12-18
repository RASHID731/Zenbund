import { useState, useEffect } from 'react';
import { Text, YStack, XStack, ScrollView, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Chat } from '@/types';

export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Chat[]>('/chats');
      if (response.success && response.data) {
        setChats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
              {loading ? (
                <YStack padding={40} alignItems="center">
                  <Text fontSize={14} color={colors.textSecondary} fontFamily="$body">
                    Loading chats...
                  </Text>
                </YStack>
              ) : chats.length === 0 ? (
                <YStack padding={40} alignItems="center">
                  <Text fontSize={16} color={colors.textSecondary} fontFamily="$body">
                    No conversations yet
                  </Text>
                  <Text fontSize={14} color={colors.textTertiary} fontFamily="$body" marginTop={8}>
                    Start a chat by messaging a someone
                  </Text>
                </YStack>
              ) : (
                chats.map((chat) => {
                  // Determine the other user in the chat
                  const isUser1 = chat.user1Id === user?.userId;
                  const otherUserId = isUser1 ? chat.user2Id : chat.user1Id;
                  const otherUserName = isUser1
                    ? (chat.user2Name || `User ${otherUserId}`)
                    : (chat.user1Name || `User ${otherUserId}`);
                  const otherUserAvatar = isUser1 ? chat.user2ProfilePicture : chat.user1ProfilePicture;

                  return (
                    <XStack
                      key={chat.id}
                      backgroundColor="transparent"
                      paddingHorizontal={20}
                      paddingVertical={12}
                      alignItems="center"
                      gap={12}
                      pressStyle={{ backgroundColor: colors.backgroundSecondary }}
                      cursor="pointer"
                      onPress={() => router.push(`/chat/${chat.id}`)}
                    >
                      {/* Avatar */}
                      <YStack
                        width={56}
                        height={56}
                        backgroundColor={colorScheme === 'light' ? '#F5F4FE' : '#38347F'}
                        borderRadius={28}
                        justifyContent="center"
                        alignItems="center"
                        overflow="hidden"
                      >
                        {otherUserAvatar ? (
                          <Image
                            source={{ uri: otherUserAvatar }}
                            style={{ width: 56, height: 56 }}
                          />
                        ) : (
                          <Text fontSize={28}>👤</Text>
                        )}
                      </YStack>

                      {/* Message Info */}
                      <YStack flex={1} gap={6}>
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize={16} fontWeight="600" color={colors.text} fontFamily="$body">
                            {otherUserName}
                          </Text>
                          {chat.lastMessage && (
                            <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                              {formatTime(chat.lastMessage.createdAt)}
                            </Text>
                          )}
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
                            {chat.lastMessage ? chat.lastMessage.text : 'Start a conversation'}
                          </Text>
                        </XStack>
                      </YStack>
                    </XStack>
                  );
                })
              )}
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
