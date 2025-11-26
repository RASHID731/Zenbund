import { useState, useEffect } from 'react';
import { Text, YStack, XStack, Switch } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { ThreadMember } from '@/types';
import { Alert } from 'react-native';

export default function ThreadSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user } = useAuth();

  const [memberships, setMemberships] = useState<ThreadMember[]>([]);
  const [loading, setLoading] = useState(true);

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
        setMemberships(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load thread settings');
    } finally {
      setLoading(false);
    }
  };

  // Toggle anonymous setting for a specific thread
  const toggleAnonymous = async (membership: ThreadMember) => {
    try {
      const newValue = !membership.postAnonymously;

      const response = await apiClient.put(`/thread-members/${membership.id}`, {
        postAnonymously: newValue,
      });

      if (response.success) {
        // Update local state
        setMemberships(memberships.map(m =>
          m.id === membership.id
            ? { ...m, postAnonymously: newValue }
            : m
        ));
      } else {
        Alert.alert('Error', response.message || 'Failed to update setting');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update setting');
    }
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

          {/* Loading State */}
          {loading && (
            <Text fontSize={14} color={colors.textSecondary} textAlign="center" paddingVertical={20}>
              Loading settings...
            </Text>
          )}

          {/* Empty State */}
          {!loading && memberships.length === 0 && (
            <Text fontSize={14} color={colors.textSecondary} textAlign="center" paddingVertical={20}>
              No threads joined yet
            </Text>
          )}

          {/* Thread list with toggles */}
          {!loading && memberships.map((membership) => (
            <XStack
              key={membership.id}
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
                <Text fontSize={24}>{membership.threadEmoji || '💬'}</Text>
                <Text fontSize={16} fontWeight="600" color={colors.text} fontFamily="$body">
                  {membership.threadName || 'Unknown'}
                </Text>
              </XStack>

              {/* Right side: toggle switch */}
              <Switch
                size="$4"
                checked={membership.postAnonymously || false}
                onCheckedChange={() => toggleAnonymous(membership)}
                backgroundColor={membership.postAnonymously ? colors.primary : colors.backgroundTertiary}
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
