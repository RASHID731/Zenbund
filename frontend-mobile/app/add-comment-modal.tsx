import { useState } from 'react';
import { Text, YStack, XStack, TextArea, ScrollView } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AddCommentModal() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  const [commentText, setCommentText] = useState('');
  const [errors, setErrors] = useState<{ text?: string }>({});

  // Mock: In the future, this will come from the user's thread membership settings
  const isAnonymous = false; // This would be fetched from ThreadMember.postAnonymously

  const handleSubmit = () => {
    // Validation
    if (!commentText.trim()) {
      setErrors({ text: 'Comment cannot be empty' });
      return;
    }

    // TODO: In the future, this will make an API call to create the comment
    console.log('Comment submitted:', { commentText, isAnonymous });

    // Close modal
    router.back();
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
              backgroundColor={colors.primary}
              borderRadius={12}
              paddingVertical={16}
              justifyContent="center"
              alignItems="center"
              marginTop={8}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              cursor="pointer"
              onPress={handleSubmit}
            >
              <Text fontSize={17} fontWeight="700" color="white" fontFamily="$body">
                Post Comment
              </Text>
            </XStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
