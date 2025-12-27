import { useState, useRef, useEffect, useCallback } from 'react';
import { Text, YStack, XStack, Input } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface ChatMessage {
  id: number;
  senderId: number;
  text: string;
  createdAt: string;
}

export default function ChatConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const initialMessageCountRef = useRef<number | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [otherUser, setOtherUser] = useState<{ id: number; name: string; profilePicture?: string; isOnline: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch chat data on mount
  useEffect(() => {
    if (id) {
      fetchChatData();
    }
  }, [id]);

  const fetchChatData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<any>(`/chats/${id}`);
      if (response.success && response.data) {
        const fetchedMessages = response.data.messages || [];
        setMessages(fetchedMessages);
        messagesRef.current = fetchedMessages;

        // Track initial message count for empty chat cleanup
        if (initialMessageCountRef.current === null) {
          initialMessageCountRef.current = fetchedMessages.length;
        }

        // Determine the other user in the chat
        const isUser1 = response.data.user1Id === user?.userId;
        const otherUserId = isUser1 ? response.data.user2Id : response.data.user1Id;
        const otherUserName = isUser1
          ? (response.data.user2Name || `User ${otherUserId}`)
          : (response.data.user1Name || `User ${otherUserId}`);
        const otherUserProfilePicture = isUser1 ? response.data.user2ProfilePicture : response.data.user1ProfilePicture;

        setOtherUser({
          id: otherUserId,
          name: otherUserName,
          profilePicture: otherUserProfilePicture,
          isOnline: false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp - WhatsApp style
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const messageText = inputText.trim();
    setInputText(''); // Clear input immediately for better UX

    try {
      const response = await apiClient.post<ChatMessage>(
        `/messages/chats/${id}/messages`,
        { text: messageText }
      );

      if (response.success && response.data) {
        const newMessage = response.data;
        setMessages(prev => {
          const updated = [...prev, newMessage];
          messagesRef.current = updated;
          return updated;
        });

        // Auto-scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore input text on error
      setInputText(messageText);
    }
  };

  // Auto-delete empty chat when user navigates away
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup when user navigates away
        // Only delete if chat was initially empty AND still has no messages
        if (initialMessageCountRef.current === 0 && messagesRef.current.length === 0) {
          apiClient.delete(`/chats/${id}`)
            .then(() => console.log(`Empty chat ${id} deleted`))
            .catch(error => console.error('Failed to delete empty chat:', error));
        }
        // Reset for next time
        initialMessageCountRef.current = null;
      };
    }, [id])
  );

  // Render message bubble
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isSent = item.senderId === user?.userId;

    return (
      <YStack
        paddingHorizontal={20}
        paddingVertical={6}
        alignItems={isSent ? 'flex-end' : 'flex-start'}
      >
        <YStack
          backgroundColor={isSent ? colors.primary : colors.backgroundSecondary}
          borderRadius={20}
          borderTopLeftRadius={isSent ? 20 : 4}
          borderTopRightRadius={20}
          borderBottomLeftRadius={20}
          borderBottomRightRadius={isSent ? 4 : 20}
          paddingHorizontal={12}
          paddingTop={10}
          paddingBottom={6}
          maxWidth="75%"
        >
          <XStack alignItems="flex-end" gap={8}>
            <Text
              fontSize={15}
              lineHeight={20}
              color={isSent ? 'white' : colors.text}
              fontFamily="$body"
              flexShrink={1}
              paddingBottom={2}
            >
              {item.text}
            </Text>
            <Text
              fontSize={11}
              color={isSent ? 'rgba(255, 255, 255, 0.7)' : colors.textTertiary}
              fontFamily="$body"
              alignSelf="flex-end"
            >
              {formatTime(item.createdAt)}
            </Text>
          </XStack>
        </YStack>
      </YStack>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <YStack flex={1} backgroundColor={colors.background}>
          {/* Header */}
          <XStack
            paddingHorizontal={20}
            paddingVertical={16}
            alignItems="center"
            gap={12}
            borderBottomWidth={1}
            borderBottomColor={colors.border}
            backgroundColor={colors.background}
          >
            {/* Back Button */}
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
              <ArrowLeft size={20} color={colors.text} strokeWidth={2.5} />
            </XStack>

            {/* Avatar */}
            <YStack
              width={48}
              height={48}
              backgroundColor={colorScheme === 'light' ? '#F5F4FE' : '#38347F'}
              borderRadius={24}
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
            >
              {otherUser?.profilePicture ? (
                <Image
                  source={{ uri: otherUser.profilePicture }}
                  style={{ width: 48, height: 48 }}
                />
              ) : (
                <Text fontSize={24}>👤</Text>
              )}
            </YStack>

            {/* Name and Status */}
            <YStack flex={1}>
              <Text fontSize={17} fontWeight="700" color={colors.text} fontFamily="$body">
                {otherUser?.name || 'Unknown'}
              </Text>
              <XStack alignItems="center" gap={6}>
                {otherUser?.isOnline && (
                  <YStack
                    width={8}
                    height={8}
                    borderRadius={4}
                    backgroundColor={colors.success}
                  />
                )}
                <Text fontSize={13} color={colors.textSecondary} fontFamily="$body">
                  {otherUser?.isOnline ? 'Active now' : 'Last seen 2h ago'}
                </Text>
              </XStack>
            </YStack>

            {/* More Options */}
            <XStack
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={colors.backgroundSecondary}
              justifyContent="center"
              alignItems="center"
              pressStyle={{ backgroundColor: colors.backgroundTertiary, scale: 0.95 }}
              cursor="pointer"
            >
              <MoreVertical size={20} color={colors.text} strokeWidth={2.5} />
            </XStack>
          </XStack>

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingVertical: 16,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical={40}>
                <Text fontSize={16} color={colors.textSecondary} fontFamily="$body">
                  Start the conversation
                </Text>
              </YStack>
            }
          />

          {/* Input Area */}
          <XStack
            marginHorizontal={16}
            marginBottom={38}
            backgroundColor={colors.backgroundSecondary}
            borderColor={colors.border}
            borderWidth={1}
            borderRadius={99}
            paddingLeft={18}
            paddingRight={8}
            alignItems="center"
            gap={8}
          >
            <Input
              flex={1}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.textTertiary}
              backgroundColor="transparent"
              borderWidth={0}
              fontSize={14}
              fontFamily="$body"
              color={colors.text}
              paddingHorizontal={0}
              paddingVertical={4}
            />
            <XStack
              width={35}
              height={35}
              borderRadius={99}
              backgroundColor={inputText.trim() ? colors.primary : colors.primaryLight}
              justifyContent="center"
              alignItems="center"
              pressStyle={{ opacity: 0.8 }}
              cursor="pointer"
              onPress={handleSendMessage}
            >
              <Send
                size={18}
                color="white"
                strokeWidth={2.5}
              />
            </XStack>
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
