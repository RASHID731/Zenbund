import { useState, useEffect } from 'react';
import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navbar } from '@/components/navbar';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';
import { apiClient } from '@/lib/api';
import { Thread, ThreadMember } from '@/types';

export default function CommunityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [memberships, setMemberships] = useState<ThreadMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch threads and memberships on mount
  useEffect(() => {
    fetchData();
  }, [user?.userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all threads (public endpoint)
      const threadsResponse = await apiClient.get<Thread[]>('/threads');
      if (threadsResponse.success) {
        setThreads(threadsResponse.data);
      }

      // Fetch user's memberships (only if logged in)
      if (user?.userId) {
        const membershipsResponse = await apiClient.get<ThreadMember[]>(
          `/thread-members?userId=${user.userId}`
        );
        if (membershipsResponse.success) {
          setMemberships(membershipsResponse.data);
        }
      }
    } catch (error) {
      showAlert({ title: 'Error', message: 'Failed to load threads' });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPress = async (threadId: number) => {
    if (!user?.userId) return;

    try {
      const response = await apiClient.post<ThreadMember>('/thread-members', {
        userId: user.userId,
        threadId: threadId,
      });

      if (response.success) {
        // Add to memberships
        setMemberships([...memberships, response.data]);

        // Update thread's member count
        setThreads(threads.map(t =>
          t.id === threadId
            ? { ...t, memberCount: t.memberCount + 1 }
            : t
        ));
      } else {
        showAlert({ title: 'Error', message: response.message || 'Failed to join thread' });
      }
    } catch (error) {
      showAlert({ title: 'Error', message: 'Failed to join thread' });
    }
  };

  const handleLeavePress = async (threadId: number) => {
    if (!user?.userId) return;

    // Find the membership
    const membership = memberships.find(m => m.threadId === threadId);
    if (!membership) return;

    showAlert({
      title: 'Leave Thread',
      message: 'Are you sure you want to leave this thread?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiClient.delete(`/thread-members/${membership.id}`);

              if (response.success) {
                setMemberships(memberships.filter(m => m.id !== membership.id));
                setThreads(threads.map(t =>
                  t.id === threadId
                    ? { ...t, memberCount: Math.max(0, t.memberCount - 1) }
                    : t
                ));
              } else {
                showAlert({ title: 'Error', message: response.message || 'Failed to leave thread' });
              }
            } catch (error) {
              showAlert({ title: 'Error', message: 'Failed to leave thread' });
            }
          },
        },
      ],
    });
  };

  const navigateToThreads = () => {
    if (memberships.length > 0) {
      router.push('/threads');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        <Navbar />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingTop={16} paddingBottom={24} gap={20} backgroundColor={colors.background}>
            {/* Header */}
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={18} fontWeight="700" color={colors.text} fontFamily="$body">
                Join Threads
              </Text>
              <XStack
                alignItems="center"
                gap={6}
                pressStyle={{ opacity: 0.7 }}
                cursor="pointer"
                onPress={navigateToThreads}
                opacity={memberships.length === 0 ? 0.4 : 1}
              >
                <Text fontSize={14} color={colors.primary} fontWeight="600" fontFamily="$body">
                  Go to threads
                </Text>
                <ChevronRight size={16} color={colors.primary} strokeWidth={2.5} />
              </XStack>
            </XStack>

            {/* Loading State */}
            {loading && (
              <Text fontSize={14} color={colors.textSecondary} textAlign="center" paddingVertical={20}>
                Loading threads...
              </Text>
            )}

            {/* Threads List */}
            {!loading && (
              <YStack gap={16}>
                {threads.map((thread) => {
                  const isJoined = memberships.some(m => m.threadId === thread.id);

                  return (
                    <XStack
                      key={thread.id}
                      backgroundColor={colors.card}
                      borderWidth={1}
                      borderColor={colors.border}
                      borderRadius={20}
                      padding={14}
                      alignItems="center"
                      gap={12}
                    >
                      <YStack
                        width={56}
                        height={56}
                        backgroundColor={colorScheme === 'light' ? '#F5F4FE' : '#38347F'}
                        borderRadius={20}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text fontSize={28}>{thread.emoji}</Text>
                      </YStack>

                      <YStack flex={1} gap={4}>
                        <Text fontSize={16} fontWeight="600" color={colors.text} fontFamily="$body">
                          {thread.name}
                        </Text>
                        <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                          {thread.memberCount} members
                        </Text>
                        <Text fontSize={14} color={colors.textSecondary} fontFamily="$body" numberOfLines={2} lineHeight={20}>
                          {thread.description}
                        </Text>
                      </YStack>

                      <XStack
                        backgroundColor={isJoined ? 'transparent' : colors.primary}
                        borderWidth={isJoined ? 1.5 : 0}
                        borderColor={isJoined ? '#EF4444' : 'transparent'}
                        borderRadius={20}
                        paddingHorizontal={16}
                        paddingVertical={10}
                        pressStyle={{ opacity: 0.8, scale: 0.98 }}
                        cursor="pointer"
                        onPress={() => isJoined ? handleLeavePress(thread.id) : handleJoinPress(thread.id)}
                      >
                        <Text
                          fontSize={14}
                          fontWeight="600"
                          color={isJoined ? '#EF4444' : 'white'}
                          fontFamily="$body"
                        >
                          {isJoined ? 'Leave' : 'Join'}
                        </Text>
                      </XStack>
                    </XStack>
                  );
                })}
              </YStack>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
