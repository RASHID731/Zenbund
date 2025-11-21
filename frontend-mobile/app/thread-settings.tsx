import { useState } from 'react';
import { Text, YStack, XStack, Switch } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Mock data - same threads as in threads.tsx
// In the future, this would come from a shared state/context
const JOINED_THREADS = [
  { id: '1', name: 'Study Group', emoji: '📚' },
  { id: '2', name: 'Gaming Club', emoji: '🎮' },
  { id: '3', name: 'Art Society', emoji: '🎨' }
];

export default function ThreadSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  // State to track anonymous setting for each thread
  // Key: thread id, Value: boolean (true = post anonymously)
  const [anonymousSettings, setAnonymousSettings] = useState<Record<string, boolean>>({
    '1': false,
    '2': false,
    '3': false,
  });

  // Toggle anonymous setting for a specific thread
  const toggleAnonymous = (threadId: string) => {
    setAnonymousSettings(prev => ({
      ...prev,
      [threadId]: !prev[threadId]
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <YStack flex={1} backgroundColor={colors.background}>
        {/* Header - follows sell-modal.tsx pattern */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={20}
          paddingVertical={16}
          borderBottomWidth={1}
          borderBottomColor={colors.border}
        >
          {/* Close button (X) - positioned on left like sell-modal */}
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
            Anonymous Settings
          </Text>

          {/* Spacer to balance the header */}
          <XStack width={40} />
        </XStack>

        {/* Settings List */}
        <YStack paddingHorizontal={20} paddingTop={20} gap={12}>
          {/* Description text */}
          <Text fontSize={14} color={colors.textSecondary} fontFamily="$body" marginBottom={8}>
            Choose which threads you want to post anonymously in.
          </Text>

          {/* Thread list with toggles */}
          {JOINED_THREADS.map((thread) => (
            <XStack
              key={thread.id}
              backgroundColor={colors.card}
              borderRadius={16}
              paddingHorizontal={16}
              paddingVertical={14}
              alignItems="center"
              justifyContent="space-between"
              borderWidth={1}
              borderColor={colors.border}
            >
              {/* Left side: emoji + thread name */}
              <XStack alignItems="center" gap={12}>
                <Text fontSize={24}>{thread.emoji}</Text>
                <Text fontSize={16} fontWeight="600" color={colors.text} fontFamily="$body">
                  {thread.name}
                </Text>
              </XStack>

              {/* Right side: toggle switch */}
              <Switch
                size="$4"
                checked={anonymousSettings[thread.id] || false}
                onCheckedChange={() => toggleAnonymous(thread.id)}
                backgroundColor={anonymousSettings[thread.id] ? colors.primary : colors.backgroundTertiary}
              >
                <Switch.Thumb
                  animation="quick"
                  backgroundColor="white"
                />
              </Switch>
            </XStack>
          ))}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
