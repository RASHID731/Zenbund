import { useState, useEffect, useCallback } from 'react';
import { Text, YStack, XStack, ScrollView, Input, Sheet } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Settings, Heart, MessageCircle, Plus, Edit2, Trash2, Check, X as XIcon, MoreVertical } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { ThreadMember, Comment } from '@/types';

// Helper function to format relative time
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export default function ThreadsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user } = useAuth();

  const [joinedThreads, setJoinedThreads] = useState<Array<{ id: number; name: string; emoji: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  // Fetch user's memberships on mount
  useEffect(() => {
    fetchMemberships();
  }, [user?.userId]);

  // Fetch comments when active thread changes
  useEffect(() => {
    if (activeThreadId) {
      fetchComments();
    }
  }, [activeThreadId]);

  // Refresh comments when screen comes back into focus (e.g., after posting a comment)
  useFocusEffect(
    useCallback(() => {
      if (activeThreadId) {
        fetchComments();
      }
    }, [activeThreadId])
  );

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

  const fetchComments = async () => {
    if (!activeThreadId) return;

    setLoadingComments(true);
    try {
      const response = await apiClient.get<Comment[]>(
        `/comments?threadId=${activeThreadId}`
      );

      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editingText.trim()) return;

    try {
      const response = await apiClient.put<Comment>(`/comments/${commentId}`, {
        text: editingText.trim(),
      });

      if (response.success) {
        const updatedComment = response.data;

        // Update comment in local state using server response
        setComments(comments.map(c => {
          if (c.id === commentId) {
            // Preserve existing replies array (server returns empty array)
            return { ...updatedComment, replies: c.replies };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map(r =>
                r.id === commentId ? updatedComment : r
              ),
            };
          }
          return c;
        }));
        setEditingCommentId(null);
        setEditingText('');
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
      Alert.alert('Error', 'Failed to update comment. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleDeleteComment = (commentId: number) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiClient.delete(`/comments/${commentId}`);

              if (response.success) {
                // Re-fetch comments to get updated state from server
                // This handles cascade deletion and replyCount updates automatically
                await fetchComments();
              }
            } catch (error) {
              console.error('Failed to delete comment:', error);
              Alert.alert('Error', 'Failed to delete comment. Please try again.');
            }
          },
        },
      ]
    );
  };

  const showCommentActions = (comment: Comment) => {
    setSelectedComment(comment);
    setSheetOpen(true);
  };

  const handleSheetEditAction = () => {
    if (selectedComment) {
      setSheetOpen(false);
      handleEditComment(selectedComment);
      setSelectedComment(null);
    }
  };

  const handleSheetDeleteAction = () => {
    if (selectedComment) {
      setSheetOpen(false);
      handleDeleteComment(selectedComment.id);
      setSelectedComment(null);
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
            {loadingComments ? (
              <YStack padding={24} alignItems="center">
                <Text fontSize={14} color={colors.textSecondary}>
                  Loading comments...
                </Text>
              </YStack>
            ) : comments.length === 0 ? (
              <YStack padding={24} alignItems="center">
                <Text fontSize={14} color={colors.textSecondary}>
                  No comments yet. Be the first to comment!
                </Text>
              </YStack>
            ) : (
              comments.map((comment) => (
                <YStack key={comment.id}>
                  {/* Parent Comment */}
                  <YStack
                    backgroundColor={colors.card}
                    paddingVertical={18}
                    paddingHorizontal={24}
                    gap={10}
                    borderBottomWidth={comment.replies && comment.replies.length > 0 ? 0 : 1}
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
                        <Text fontSize={20}>{comment.isAnonymous ? '👤' : '👨‍🎓'}</Text>
                      </YStack>
                      <YStack flex={1}>
                        <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                          {comment.isAnonymous ? 'Anonymous' : `User ${comment.userId}`}
                        </Text>
                        <Text fontSize={12} color={colors.textSecondary} fontFamily="$body">
                          {getTimeAgo(comment.createdAt)}
                        </Text>
                      </YStack>
                      {/* Three-dot menu for own comments */}
                      {user && comment.userId === user.userId && editingCommentId !== comment.id && (
                        <XStack
                          width={36}
                          height={36}
                          borderRadius={18}
                          backgroundColor={colors.backgroundSecondary}
                          justifyContent="center"
                          alignItems="center"
                          pressStyle={{ opacity: 0.7, backgroundColor: colors.backgroundTertiary }}
                          cursor="pointer"
                          onPress={() => showCommentActions(comment)}
                        >
                          <MoreVertical size={18} color={colors.textSecondary} strokeWidth={2} />
                        </XStack>
                      )}
                    </XStack>

                    {/* Comment Text - Editable or Display */}
                    {editingCommentId === comment.id ? (
                      <YStack gap={8}>
                        <Input
                          value={editingText}
                          onChangeText={setEditingText}
                          backgroundColor={colors.backgroundSecondary}
                          borderColor={colors.border}
                          borderWidth={1}
                          borderRadius={12}
                          paddingHorizontal={12}
                          paddingVertical={8}
                          fontSize={14}
                          fontFamily="$body"
                          color={colors.text}
                          multiline
                        />
                        <XStack gap={8}>
                          <XStack
                            flex={1}
                            backgroundColor={colors.primary}
                            borderRadius={8}
                            paddingVertical={8}
                            justifyContent="center"
                            alignItems="center"
                            pressStyle={{ opacity: 0.8 }}
                            cursor="pointer"
                            onPress={() => handleSaveEdit(comment.id)}
                          >
                            <XStack gap={4} alignItems="center">
                              <Check size={16} color="white" strokeWidth={2.5} />
                              <Text fontSize={13} fontWeight="600" color="white" fontFamily="$body">
                                Save
                              </Text>
                            </XStack>
                          </XStack>
                          <XStack
                            flex={1}
                            backgroundColor={colors.backgroundSecondary}
                            borderRadius={8}
                            paddingVertical={8}
                            justifyContent="center"
                            alignItems="center"
                            pressStyle={{ opacity: 0.8 }}
                            cursor="pointer"
                            onPress={handleCancelEdit}
                          >
                            <XStack gap={4} alignItems="center">
                              <XIcon size={16} color={colors.text} strokeWidth={2.5} />
                              <Text fontSize={13} fontWeight="600" color={colors.text} fontFamily="$body">
                                Cancel
                              </Text>
                            </XStack>
                          </XStack>
                        </XStack>
                      </YStack>
                    ) : (
                      <Text fontSize={14} color={colors.text} fontFamily="$body" lineHeight={20}>
                        {comment.text}
                      </Text>
                    )}

                    {/* Action Buttons */}
                    {editingCommentId !== comment.id && (
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
                    )}
                  </YStack>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <YStack
                      backgroundColor={colors.backgroundSecondary}
                      paddingLeft={44}
                      borderBottomWidth={1}
                      borderColor={colors.border}
                    >
                      {comment.replies.map((reply) => (
                        <YStack
                          key={reply.id}
                          paddingVertical={16}
                          paddingRight={24}
                          gap={8}
                          borderTopWidth={1}
                          borderColor={colors.border}
                        >
                          {/* Reply User Info */}
                          <XStack alignItems="center" gap={10}>
                            <YStack
                              width={32}
                              height={32}
                              borderRadius={16}
                              backgroundColor={colors.card}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text fontSize={16}>{reply.isAnonymous ? '👤' : '👨‍🎓'}</Text>
                            </YStack>
                            <YStack flex={1}>
                              <Text fontSize={14} fontWeight="600" color={colors.text} fontFamily="$body">
                                {reply.isAnonymous ? 'Anonymous' : `User ${reply.userId}`}
                              </Text>
                              <Text fontSize={11} color={colors.textSecondary} fontFamily="$body">
                                {getTimeAgo(reply.createdAt)}
                              </Text>
                            </YStack>
                          </XStack>

                          {/* Reply Text */}
                          <Text fontSize={13} color={colors.text} fontFamily="$body" lineHeight={18}>
                            {reply.text}
                          </Text>

                          {/* Reply Action Buttons */}
                          <XStack gap={20} paddingTop={2}>
                            <XStack alignItems="center" gap={4}>
                              <Heart size={16} color={colors.textSecondary} strokeWidth={2} />
                              <Text fontSize={12} color={colors.textSecondary} fontWeight="500" fontFamily="$body">
                                {reply.likes}
                              </Text>
                            </XStack>
                          </XStack>
                        </YStack>
                      ))}
                    </YStack>
                  )}
                </YStack>
              ))
            )}

            {/* Bottom padding for FAB */}
            <YStack height={80} />
          </YStack>
        </ScrollView>

        {/* Floating Action Button */}
        {activeThreadId && (
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
            onPress={() => router.push(`/add-comment-modal?threadId=${activeThreadId}`)}
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={4}
            elevation={8}
          >
            <Plus size={28} color="white" strokeWidth={2.5} />
          </XStack>
        )}

        {/* Comment Actions Sheet */}
        <Sheet
          modal
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          snapPoints={[25]}
          dismissOnSnapToBottom
          zIndex={100000}
          animation="medium"
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            backgroundColor="rgba(0, 0, 0, 0.5)"
          />
          <Sheet.Frame
            backgroundColor={colors.card}
            borderTopLeftRadius={16}
            borderTopRightRadius={16}
            paddingBottom={32}
          >
            <YStack gap={0}>
              {/* Edit Action */}
              <XStack
                paddingVertical={18}
                paddingHorizontal={24}
                alignItems="center"
                gap={12}
                pressStyle={{ opacity: 0.7, backgroundColor: colors.backgroundSecondary }}
                cursor="pointer"
                onPress={handleSheetEditAction}
                borderBottomWidth={1}
                borderBottomColor={colors.border}
              >
                <Edit2 size={20} color={colors.primary} strokeWidth={2} />
                <Text fontSize={16} fontWeight="600" color={colors.text} fontFamily="$body">
                  Edit
                </Text>
              </XStack>

              {/* Delete Action */}
              <XStack
                paddingVertical={18}
                paddingHorizontal={24}
                alignItems="center"
                gap={12}
                pressStyle={{ opacity: 0.7, backgroundColor: colors.backgroundSecondary }}
                cursor="pointer"
                onPress={handleSheetDeleteAction}
              >
                <Trash2 size={20} color="#ef4444" strokeWidth={2} />
                <Text fontSize={16} fontWeight="600" color="#ef4444" fontFamily="$body">
                  Delete
                </Text>
              </XStack>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </YStack>
    </SafeAreaView>
  );
}
