import { useState } from 'react';
import { Text, YStack, XStack, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const JOINED_THREADS = [
  { id: '1', name: 'Study Group', emoji: '📚' },
  { id: '2', name: 'Gaming Club', emoji: '🎮' },
  { id: '3', name: 'Art Society', emoji: '🎨' }
];

const THREAD_COMMENTS = {
  '1': [
    { id: 1, user: 'Sarah Chen', avatar: '👩‍💼', comment: 'Anyone has notes from yesterday\'s lecture?', time: '2h ago', likes: 12, replies: 3 },
    { id: 2, user: 'Mike Johnson', avatar: '👨‍🎓', comment: 'I can share mine! Give me a sec', time: '1h ago', likes: 5, replies: 1 },
    { id: 3, user: 'Emma Davis', avatar: '👩‍🎓', comment: 'Thanks! That would be really helpful', time: '45m ago', likes: 8, replies: 0 }
  ],
  '2': [
    { id: 1, user: 'Alex Turner', avatar: '🎮', comment: 'Who\'s up for some gaming tonight?', time: '3h ago', likes: 15, replies: 5 },
    { id: 2, user: 'Chris Lee', avatar: '👾', comment: 'I\'m in! What game?', time: '2h ago', likes: 7, replies: 2 },
    { id: 3, user: 'Jordan Smith', avatar: '🕹️', comment: 'Count me in too!', time: '2h ago', likes: 6, replies: 1 }
  ],
  '3': [
    { id: 1, user: 'Nina Garcia', avatar: '🎨', comment: 'Check out my new painting!', time: '4h ago', likes: 24, replies: 8 },
    { id: 2, user: 'Tom Wilson', avatar: '🖌️', comment: 'Beautiful colors! What inspired you?', time: '3h ago', likes: 10, replies: 3 },
    { id: 3, user: 'Lisa Park', avatar: '🎭', comment: 'Love the style! Very expressive', time: '2h ago', likes: 14, replies: 2 }
  ]
};

export default function ThreadsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  const [activeThreadId, setActiveThreadId] = useState(JOINED_THREADS[0]?.id || '1');

  const comments = THREAD_COMMENTS[activeThreadId as keyof typeof THREAD_COMMENTS] || [];

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
              {JOINED_THREADS.map((thread) => {
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
            </XStack>
          </ScrollView>
        </YStack>

        {/* Comments (Reddit-style) */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingVertical={16} gap={16}>
            {comments.map((comment) => (
              <YStack
                key={comment.id}
                gap={5}
              >
                {/* User Info */}
                <XStack alignItems="center" gap={10}>
                  <Text fontSize={28}>{comment.avatar}</Text>
                  <YStack flex={1}>
                    <XStack alignItems="center" gap={8}>
                      <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                        {comment.user}
                      </Text>
                      <Text fontSize={12} color={colors.textSecondary} fontFamily="$body">
                        · {comment.time}
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>

                {/* Comment Text */}
                <Text fontSize={14} color={colors.text} fontFamily="$body" lineHeight={20} paddingLeft={38}>
                  {comment.comment}
                </Text>

                {/* Action Buttons */}
                <XStack gap={20} paddingLeft={38} paddingTop={4}>
                  {/* Like Button */}
                  <XStack
                    alignItems="center"
                    gap={6}
                    pressStyle={{ opacity: 0.7 }}
                    cursor="pointer"
                  >
                    <Heart size={16} color={colors.textSecondary} strokeWidth={2} />
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
                    <MessageCircle size={16} color={colors.textSecondary} strokeWidth={2} />
                    <Text fontSize={13} color={colors.textSecondary} fontWeight="500" fontFamily="$body">
                      {comment.replies}
                    </Text>
                  </XStack>
                </XStack>
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
