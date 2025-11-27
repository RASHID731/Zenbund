import { useState, useEffect } from 'react';
import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Settings, Heart, MessageCircle, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { ThreadMember } from '@/types';

// Mock comment data
const MOCK_COMMENTS = [
  {
    id: 1,
    userId: 1,
    username: 'Sarah Chen',
    avatar: '👩‍💼',
    text: 'Anyone has notes from yesterday\'s lecture? I had to leave early for an appointment.',
    isAnonymous: false,
    likes: 12,
    replyCount: 3,
    createdAt: '2h ago',
  },
  {
    id: 2,
    userId: null,
    username: 'Anonymous',
    avatar: '👤',
    text: 'The midterm is going to be tough. Has anyone started studying yet?',
    isAnonymous: true,
    likes: 8,
    replyCount: 5,
    createdAt: '3h ago',
  },
  {
    id: 3,
    userId: 3,
    username: 'Mike Johnson',
    avatar: '👨‍🎓',
    text: 'I can share my notes! Give me a sec to upload them.',
    isAnonymous: false,
    likes: 24,
    replyCount: 8,
    createdAt: '4h ago',
  },
  {
    id: 4,
    userId: null,
    username: 'Anonymous',
    avatar: '👤',
    text: 'Does anyone know if the professor posts slides after class?',
    isAnonymous: true,
    likes: 6,
    replyCount: 2,
    createdAt: '5h ago',
  },
  {
    id: 5,
    userId: 5,
    username: 'Emma Davis',
    avatar: '👩‍🎓',
    text: 'Thanks everyone for the help! This community is amazing 💙',
    isAnonymous: false,
    likes: 18,
    replyCount: 1,
    createdAt: '6h ago',
  },
];

export default function ThreadsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user } = useAuth();

  const [joinedThreads, setJoinedThreads] = useState<Array<{ id: number; name: string; emoji: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);

  // Fetch user's memberships on mount
  useEffect(() => {
    fetchMemberships();
  }, [user?.userId]);

  const fetchMemberships = async () => {
    if (!user?.userId) return;

    setLoading(true);
    try {
      const response = await apiClient.get<ThreadMember[]>(
        `/thread-members?userId=${user.userId}`
      );

      if (response.success) {
        // Map memberships to thread data
        const threads = response.data.map(m => ({
          id: m.threadId,
          name: m.threadName || 'Unknown',
          emoji: m.threadEmoji || '💬',
        }));
        setJoinedThreads(threads);
        // Set first thread as active
        if (threads.length > 0 && !activeThreadId) {
          setActiveThreadId(threads[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        {/* Header */}
        <XStack
          paddingHorizontal={20}
          paddingVertical={16}
          alignItems="center"
          gap={12}
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
          <XStack
            width={40}
            height={40}
            justifyContent="center"
            alignItems="center"
            pressStyle={{ opacity: 0.7 }}
            cursor="pointer"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} strokeWidth={2.5} />
          </XStack>
          <Text fontSize={20} fontWeight="700" color={colors.text} fontFamily="$body">
            Community
          </Text>
        </XStack>

        {/* Pill-Shaped Thread Tabs */}
        <YStack
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 12,
                alignItems: 'center'
              }}
            >
              <XStack gap={8}>
                {loading ? (
                  <Text fontSize={14} color={colors.textSecondary}>
                    Loading threads...
                  </Text>
                ) : joinedThreads.length === 0 ? (
                  <Text fontSize={14} color={colors.textSecondary}>
                    No threads joined yet
                  </Text>
                ) : (
                  <>
                    {joinedThreads.map((thread) => {
                      const isActive = activeThreadId === thread.id;

                      return (
                        <XStack
                          key={thread.id}
                          backgroundColor={isActive ? colors.primary : colors.card}
                          borderWidth={1}
                          borderColor={isActive ? colors.primary : colors.border}
                          borderRadius={20}
                          paddingHorizontal={14}
                          paddingVertical={6}
                          alignItems="center"
                          gap={6}
                          pressStyle={{ opacity: 0.8, scale: 0.97 }}
                          cursor="pointer"
                          onPress={() => setActiveThreadId(thread.id)}
                        >
                          <Text fontSize={16}>{thread.emoji}</Text>
                          <Text
                            fontSize={13}
                            fontWeight="600"
                            color={isActive ? 'white' : colors.text}
                            fontFamily="$body"
                          >
                            {thread.name}
                          </Text>
                        </XStack>
                      );
                    })}

                    {/* Settings Pill */}
                    <XStack
                      backgroundColor={colors.card}
                      borderWidth={1}
                      borderColor={colors.border}
                      borderRadius={20}
                      paddingHorizontal={12}
                      paddingVertical={6}
                      alignItems="center"
                      pressStyle={{ opacity: 0.8, scale: 0.97 }}
                      cursor="pointer"
                      onPress={() => router.push('/thread-settings')}
                    >
                      <Settings size={18} color={colors.text} strokeWidth={2} />
                    </XStack>
                  </>
                )}
              </XStack>
            </ScrollView>
        </YStack>

        {/* Comments List */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack>
            {MOCK_COMMENTS.map((comment) => (
              <YStack
                key={comment.id}
                backgroundColor={colors.card}
                paddingVertical={18}
                paddingHorizontal={24}
                gap={10}
                borderBottomWidth={1}
                borderColor={colors.border}
              >
                {/* User Info */}
                <XStack alignItems="center" gap={12}>
                  <YStack
                    width={40}
                    height={40}
                    borderRadius={20}
                    backgroundColor={colors.backgroundSecondary}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text fontSize={20}>{comment.avatar}</Text>
                  </YStack>
                  <YStack flex={1}>
                    <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                      {comment.username}
                    </Text>
                    <Text fontSize={12} color={colors.textSecondary} fontFamily="$body">
                      {comment.createdAt}
                    </Text>
                  </YStack>
                </XStack>

                {/* Comment Text */}
                <Text fontSize={14} color={colors.text} fontFamily="$body" lineHeight={20}>
                  {comment.text}
                </Text>

                {/* Action Buttons */}
                <XStack gap={24} paddingTop={4}>
                  {/* Like Button */}
                  <XStack
                    alignItems="center"
                    gap={6}
                    pressStyle={{ opacity: 0.7 }}
                    cursor="pointer"
                  >
                    <Heart size={18} color={colors.textSecondary} strokeWidth={2} />
                    <Text fontSize={13} color={colors.textSecondary} fontWeight="500" fontFamily="$body">
                      {comment.likes}
                    </Text>
                  </XStack>

                  {/* Comment/Reply Button */}
                  <XStack
                    alignItems="center"
                    gap={6}
                    pressStyle={{ opacity: 0.7 }}
                    cursor="pointer"
                  >
                    <MessageCircle size={18} color={colors.textSecondary} strokeWidth={2} />
                    <Text fontSize={13} color={colors.textSecondary} fontWeight="500" fontFamily="$body">
                      {comment.replyCount}
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            ))}

            {/* Bottom padding for FAB */}
            <YStack height={80} />
          </YStack>
        </ScrollView>

        {/* Floating Action Button */}
        <XStack
          position="absolute"
          bottom={36}
          right={24}
          width={56}
          height={56}
          borderRadius={99}
          backgroundColor={colors.primary}
          justifyContent="center"
          alignItems="center"
          pressStyle={{ opacity: 0.8, scale: 0.95 }}
          cursor="pointer"
          onPress={() => router.push('/add-comment-modal')}
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={4}
          elevation={8}
        >
          <Plus size={28} color="white" strokeWidth={2.5} />
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
