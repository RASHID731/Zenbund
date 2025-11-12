import { useState } from 'react';
import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navbar } from '@/components/navbar';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const THREADS = [
  {
    id: '1',
    name: 'Study Group',
    emoji: '📚',
    members: '1.2k',
    description: 'Share study materials and help each other with assignments'
  },
  {
    id: '2',
    name: 'Gaming Club',
    emoji: '🎮',
    members: '856',
    description: 'Connect with fellow gamers and organize tournaments'
  },
  {
    id: '3',
    name: 'Art Society',
    emoji: '🎨',
    members: '423',
    description: 'Share your artwork and collaborate on creative projects'
  },
  {
    id: '4',
    name: 'Fitness Group',
    emoji: '🏃',
    members: '678',
    description: 'Stay active together with workout sessions and challenges'
  }
];

export default function CommunityScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const router = useRouter();

  const [joinedThreads, setJoinedThreads] = useState<string[]>([]);

  const toggleJoinThread = (threadId: string) => {
    if (joinedThreads.includes(threadId)) {
      setJoinedThreads(joinedThreads.filter(id => id !== threadId));
    } else {
      setJoinedThreads([...joinedThreads, threadId]);
    }
  };

  const navigateToThreads = () => {
    if (joinedThreads.length > 0) {
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
                opacity={joinedThreads.length === 0 ? 0.4 : 1}
              >
                <Text fontSize={14} color={colors.primary} fontWeight="600" fontFamily="$body">
                  Go to threads
                </Text>
                <ChevronRight size={16} color={colors.primary} strokeWidth={2.5} />
              </XStack>
            </XStack>

            {/* Threads List */}
            <YStack gap={16}>
              {THREADS.map((thread) => {
                const isJoined = joinedThreads.includes(thread.id);

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
                        {thread.members} members
                      </Text>
                      <Text fontSize={14} color={colors.textSecondary} fontFamily="$body" numberOfLines={2} lineHeight={20}>
                        {thread.description}
                      </Text>
                    </YStack>

                    <XStack
                      backgroundColor={isJoined ? colors.background : colors.primary}
                      borderWidth={isJoined ? 1.5 : 0}
                      borderColor={isJoined ? colors.border : 'transparent'}
                      borderRadius={20}
                      paddingHorizontal={16}
                      paddingVertical={10}
                      pressStyle={{ opacity: 0.8, scale: 0.98 }}
                      cursor="pointer"
                      onPress={() => toggleJoinThread(thread.id)}
                    >
                      <Text
                        fontSize={14}
                        fontWeight="600"
                        color={isJoined ? colors.textSecondary : 'white'}
                        fontFamily="$body"
                      >
                        {isJoined ? 'Joined' : 'Join'}
                      </Text>
                    </XStack>
                  </XStack>
                );
              })}
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
