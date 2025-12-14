import { useState, useEffect } from 'react';
import { Text, YStack, XStack, TextArea, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Settings } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { ThreadMember } from '@/types';

export default function AddCommentModal() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user } = useAuth();
  const { threadId } = useLocalSearchParams<{ threadId: string }>();

  const [commentText, setCommentText] = useState('');
  const [errors, setErrors] = useState<{ text?: string }>({});
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingSettings, setFetchingSettings] = useState(true);

  // Fetch user's ThreadMember settings for this thread
  useEffect(() => {
    fetchThreadMemberSettings();
  }, [threadId, user?.userId]);

  // Refresh settings when screen comes back into focus (e.g., after returning from settings)
  useFocusEffect(
    useCallback(() => {
      fetchThreadMemberSettings();
    }, [threadId, user?.userId])
  );

  const fetchThreadMemberSettings = async () => {
    if (!user?.userId || !threadId) {
      setFetchingSettings(false);
      return;
    }

    try {
      const response = await apiClient.get<ThreadMember>(
        `/thread-members?userId=${user.userId}&threadId=${threadId}`
      );

      if (response.success && response.data) {
        setIsAnonymous(response.data.postAnonymously);
      }
    } catch (error) {
      console.error('Failed to fetch thread member settings:', error);
    } finally {
      setFetchingSettings(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!commentText.trim()) {
      setErrors({ text: 'Comment cannot be empty' });
      return;
    }

    if (!threadId) {
      setErrors({ text: 'Thread ID is missing' });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/comments', {
        threadId: parseInt(threadId),
        text: commentText.trim(),
        parentCommentId: null, // null for parent comments
      });

      if (response.success) {
        // Close modal and refresh comments list
        router.back();
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
      setErrors({ text: 'Failed to post comment. Please try again.' });
    } finally {
      setLoading(false);
    }
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
          {/* Close Button */}
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
            <X size={20} color={colors.text} strokeWidth={2.5} />
          </XStack>

          {/* Title */}
          <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
            Add Comment
          </Text>

          {/* Spacer */}
          <XStack width={40} />
        </XStack>

        {/* Content */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={20} paddingVertical={20} gap={20}>
            {/* Comment Text Input */}
            <YStack gap={8}>
              <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                Your Comment *
              </Text>
              <YStack
                backgroundColor={colors.backgroundSecondary}
                borderRadius={20}
                paddingHorizontal={16}
                paddingVertical={12}
                borderColor={errors.text ? '#ef4444' : colors.border}
                borderWidth={1}
                minHeight={120}
              >
                <TextArea
                  placeholder="Write your comment here..."
                  placeholderTextColor={colors.textTertiary}
                  value={commentText}
                  onChangeText={(text) => {
                    setCommentText(text);
                    if (errors.text) setErrors({});
                  }}
                  borderWidth={0}
                  backgroundColor="transparent"
                  paddingHorizontal={0}
                  paddingVertical={0}
                  fontSize={16}
                  fontFamily="$body"
                  color={colors.text}
                  verticalAlign="top"
                />
              </YStack>
              {errors.text && (
                <Text fontSize={13} color="#ef4444" fontFamily="$body">
                  {errors.text}
                </Text>
              )}
            </YStack>

            {/* Anonymous Status Indicator */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              backgroundColor={isAnonymous ? colors.backgroundSecondary : colors.backgroundSecondary}
              borderRadius={16}
              paddingHorizontal={16}
              paddingVertical={14}
              borderWidth={1}
              borderColor={colors.border}
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
              onPress={() => router.push('/thread-settings')}
            >
              <YStack flex={1} gap={4}>
                <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                  {isAnonymous ? 'Posting Anonymously' : 'Posting as Your Name'}
                </Text>
                <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                  {isAnonymous
                    ? 'Your name will be hidden from other users'
                    : 'Other users will see your name'
                  }
                </Text>
                <XStack alignItems="center" gap={6} paddingTop={2}>
                  <Settings size={14} color={colors.primary} strokeWidth={2} />
                  <Text fontSize={12} color={colors.primary} fontFamily="$body" fontWeight="500">
                    Change in Thread Settings
                  </Text>
                </XStack>
              </YStack>
            </XStack>

            {/* Submit Button */}
            <XStack
              backgroundColor={loading ? colors.textTertiary : colors.primary}
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              marginTop={8}
              pressStyle={loading ? {} : { opacity: 0.8, scale: 0.98 }}
              cursor={loading ? "not-allowed" : "pointer"}
              onPress={loading ? undefined : handleSubmit}
              opacity={loading ? 0.6 : 1}
            >
              <Text fontSize={17} fontWeight="700" color="white" fontFamily="$body">
                {loading ? 'Posting...' : 'Post Comment'}
              </Text>
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
