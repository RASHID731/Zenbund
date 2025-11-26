import { useState, useEffect } from 'react';
import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { ThreadMember } from '@/types';

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

        {/* Empty State - Comments Coming Soon */}
        <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal={40}>
          <Text fontSize={48} marginBottom={16}>💬</Text>
          <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body" textAlign="center" marginBottom={8}>
            Comments Coming Soon
          </Text>
          <Text fontSize={14} color={colors.textSecondary} fontFamily="$body" textAlign="center" lineHeight={20}>
            Thread discussions will be available here once the comment system is implemented.
          </Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
