import { useState, useEffect, useCallback } from 'react';
import { Text, YStack, XStack, ScrollView, Input, Sheet } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, ArrowUp, MessageCircle, Edit2, Trash2, Check, X as XIcon, MoreVertical } from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Comment } from '@/types';

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

export default function CommentRepliesScreen() {
  const router = useRouter();
  const { commentId, threadId } = useLocalSearchParams<{ commentId: string; threadId: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const { user } = useAuth();

  const [parentComment, setParentComment] = useState<Comment | null>(null);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  useEffect(() => {
    if (commentId && threadId) {
      fetchCommentData();
    }
  }, [commentId, threadId]);

  // Refresh comments when screen comes into focus (e.g., navigating back)
  useFocusEffect(
    useCallback(() => {
      if (commentId && threadId) {
        fetchCommentData();
      }
    }, [commentId, threadId])
  );

  const fetchCommentData = async () => {
    setLoading(true);
    try {
      // Fetch parent comment (includes nested replies)
      const commentResponse = await apiClient.get<Comment>(`/comments/${commentId}`);
      if (commentResponse.success) {
        setParentComment(commentResponse.data);
        // Extract replies from parent comment response
        setReplies(commentResponse.data.replies || []);
      }
    } catch (error) {
      console.error('Failed to fetch comment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || !user || posting) return;

    setPosting(true);
    try {
      const response = await apiClient.post<Comment>('/comments', {
        threadId: Number(threadId),
        parentCommentId: Number(commentId),
        text: replyText.trim(),
      });

      if (response.success) {
        setReplyText('');
        await fetchCommentData(); // Refresh replies
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = async (targetCommentId: number) => {
    if (!editingText.trim()) return;

    try {
      const response = await apiClient.put<Comment>(`/comments/${targetCommentId}`, {
        text: editingText.trim(),
      });

      if (response.success) {
        const updatedComment = response.data;

        // Update comment in local state
        if (targetCommentId === Number(commentId)) {
          // Updated parent comment
          setParentComment(prev => prev ? { ...prev, text: updatedComment.text, updatedAt: updatedComment.updatedAt } : null);
        } else {
          // Updated a reply
          setReplies(replies.map(r =>
            r.id === targetCommentId ? { ...r, text: updatedComment.text, updatedAt: updatedComment.updatedAt } : r
          ));
        }

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

  const handleDeleteComment = (targetCommentId: number) => {
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
              const response = await apiClient.delete(`/comments/${targetCommentId}`);

              if (response.success) {
                // Refresh data to get updated state
                await fetchCommentData();
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
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
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
                Replies
              </Text>
            </XStack>

            {/* Content */}
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
              <YStack>
                {loading ? (
                  <YStack padding={24} alignItems="center">
                    <Text fontSize={14} color={colors.textSecondary}>
                      Loading...
                    </Text>
                  </YStack>
                ) : (
                  <>
                    {/* Parent Comment */}
                    {parentComment && (
                      <YStack
                        backgroundColor={colors.card}
                        paddingVertical={18}
                        paddingHorizontal={24}
                        gap={10}
                        borderBottomWidth={7}
                        borderBottomColor={colors.borderLight}
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
                            <Text fontSize={20}>{parentComment.isAnonymous ? '👤' : '👨‍🎓'}</Text>
                          </YStack>
                          <XStack flex={1} alignItems="center" gap={6}>
                            <Text fontSize={15} fontWeight="600" color={colors.text} fontFamily="$body">
                              {parentComment.isAnonymous ? 'Anonymous' : `User ${parentComment.userId}`}
                            </Text>
                            <Text fontSize={12} color={colors.textSecondary} fontFamily="$body">
                              •
                            </Text>
                            <Text fontSize={12} color={colors.textSecondary} fontFamily="$body">
                              {getTimeAgo(parentComment.createdAt)}
                            </Text>
                          </XStack>
                          {/* Three-dot menu for own comments */}
                          {user && parentComment.userId === user.userId && editingCommentId !== parentComment.id && (
                            <XStack
                              width={36}
                              height={36}
                              borderRadius={18}
                              backgroundColor={colors.backgroundSecondary}
                              justifyContent="center"
                              alignItems="center"
                              pressStyle={{ opacity: 0.7, backgroundColor: colors.backgroundTertiary }}
                              cursor="pointer"
                              onPress={(e) => {
                                e.stopPropagation();
                                showCommentActions(parentComment);
                              }}
                            >
                              <MoreVertical size={18} color={colors.textSecondary} strokeWidth={2} />
                            </XStack>
                          )}
                        </XStack>

                        {/* Comment Text - Editable or Display */}
                        {editingCommentId === parentComment.id ? (
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
                                onPress={() => handleSaveEdit(parentComment.id)}
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
                            {parentComment.text}
                          </Text>
                        )}

                        {/* Like Count and Reply Count */}
                        {editingCommentId !== parentComment.id && (
                          <XStack gap={24} paddingTop={4}>
                            <XStack alignItems="center" gap={6}>
                              <Heart size={18} color={colors.textSecondary} strokeWidth={2} />
                              <Text fontSize={13} color={colors.textSecondary} fontWeight="500" fontFamily="$body">
                                {parentComment.likes}
                              </Text>
                            </XStack>
                            <XStack alignItems="center" gap={6}>
                              <MessageCircle size={18} color={colors.textSecondary} strokeWidth={2} />
                              <Text fontSize={13} color={colors.textSecondary} fontWeight="500" fontFamily="$body">
                                {parentComment.replyCount === 0 ? 'Reply' : parentComment.replyCount}
                              </Text>
                            </XStack>
                          </XStack>
                        )}
                      </YStack>
                    )}

                    {/* Comments Header */}
                    <YStack
                      paddingVertical={14}
                      paddingHorizontal={24}
                      borderBottomWidth={1}
                      borderBottomColor={colors.border}
                    >
                      <Text fontSize={15} fontWeight="600" fontFamily="$body" borderBottomColor={colors.border}>
                        Comments
                      </Text>
                    </YStack>

                    {/* Replies List */}
                    {replies.length === 0 ? (
                      <YStack padding={24} alignItems="center">
                        <Text fontSize={14} color={colors.textSecondary}>
                          No replies yet. Be the first to reply!
                        </Text>
                      </YStack>
                    ) : (
                      replies.map((reply) => (
                        <YStack
                          key={reply.id}
                          backgroundColor={colors.card}
                          paddingVertical={18}
                          paddingHorizontal={24}
                          gap={2}
                          borderBottomWidth={1}
                          borderBottomColor={colors.border}
                          pressStyle={{ opacity: 0.7, backgroundColor: colors.backgroundSecondary }}
                          cursor="pointer"
                          onPress={() => editingCommentId !== reply.id && router.push(`/comment-replies?commentId=${reply.id}&threadId=${threadId}`)}
                        >
                          {/* User Info */}
                          <XStack alignItems="center" gap={12}>
                            <YStack
                              width={36}
                              height={36}
                              borderRadius={18}
                              backgroundColor={colors.backgroundSecondary}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Text fontSize={18}>{reply.isAnonymous ? '👤' : '👨‍🎓'}</Text>
                            </YStack>
                            <XStack flex={1} alignItems="center" gap={6}>
                              <Text fontSize={14} fontWeight="600" color={colors.text} fontFamily="$body">
                                {reply.isAnonymous ? 'Anonymous' : `User ${reply.userId}`}
                              </Text>
                              <Text fontSize={11} color={colors.textSecondary} fontFamily="$body">
                                •
                              </Text>
                              <Text fontSize={11} color={colors.textSecondary} fontFamily="$body">
                                {getTimeAgo(reply.createdAt)}
                              </Text>
                            </XStack>
                            {/* Three-dot menu for own comments */}
                            {user && reply.userId === user.userId && editingCommentId !== reply.id && (
                              <XStack
                                width={32}
                                height={32}
                                borderRadius={16}
                                backgroundColor={colors.backgroundSecondary}
                                justifyContent="center"
                                alignItems="center"
                                pressStyle={{ opacity: 0.7, backgroundColor: colors.backgroundTertiary }}
                                cursor="pointer"
                                onPress={(e) => {
                                  e.stopPropagation();
                                  showCommentActions(reply);
                                }}
                              >
                                <MoreVertical size={16} color={colors.textSecondary} strokeWidth={2} />
                              </XStack>
                            )}
                          </XStack>

                          {/* Reply Content - aligned with name */}
                          <YStack paddingLeft={48} gap={12}>
                            {/* Reply Text - Editable or Display */}
                            {editingCommentId === reply.id ? (
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
                                  fontSize={13}
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
                                    onPress={() => handleSaveEdit(reply.id)}
                                  >
                                    <XStack gap={4} alignItems="center">
                                      <Check size={14} color="white" strokeWidth={2.5} />
                                      <Text fontSize={12} fontWeight="600" color="white" fontFamily="$body">
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
                                      <XIcon size={14} color={colors.text} strokeWidth={2.5} />
                                      <Text fontSize={12} fontWeight="600" color={colors.text} fontFamily="$body">
                                        Cancel
                                      </Text>
                                    </XStack>
                                  </XStack>
                                </XStack>
                              </YStack>
                            ) : (
                              <Text fontSize={13} color={colors.text} fontFamily="$body" lineHeight={18}>
                                {reply.text}
                              </Text>
                            )}

                            {/* Like Count and Reply Count */}
                            {editingCommentId !== reply.id && (
                              <XStack gap={20}>
                                <XStack alignItems="center" gap={4}>
                                  <Heart size={16} color={colors.textSecondary} strokeWidth={2} />
                                  <Text fontSize={12} color={colors.textSecondary} fontWeight="500" fontFamily="$body">
                                    {reply.likes}
                                  </Text>
                                </XStack>
                                <XStack
                                  alignItems="center"
                                  gap={4}
                                  pressStyle={{ opacity: 0.7 }}
                                  cursor="pointer"
                                  onPress={(e) => {
                                    router.push(`/comment-replies?commentId=${reply.id}&threadId=${threadId}`);
                                  }}
                                >
                                  <MessageCircle size={16} color={colors.textSecondary} strokeWidth={2} />
                                  <Text fontSize={12} color={colors.textSecondary} fontWeight="500" fontFamily="$body">
                                    {reply.replyCount === 0 ? 'Reply' : reply.replyCount}
                                  </Text>
                                </XStack>
                              </XStack>
                            )}
                          </YStack>
                        </YStack>
                      ))
                    )}

                    {/* Bottom padding */}
                    <YStack height={20} />
                  </>
                )}
              </YStack>
            </ScrollView>

            {/* Input Field */}
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
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Write a reply..."
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
                backgroundColor={replyText.trim() && !posting ? colors.primary : colors.primaryLight}
                justifyContent="center"
                alignItems="center"
                pressStyle={{ opacity: 0.8 }}
                cursor="pointer"
                onPress={handlePostReply}
              >
                <ArrowUp
                  size={20}
                  color={'white'}
                  strokeWidth={2}
                />
              </XStack>
            </XStack>
          </YStack>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Comment Actions Sheet */}
      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        snapPoints={[17]}
        dismissOnSnapToBottom
        zIndex={100000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0, 0, 0, 0.1)"
        />
        <Sheet.Frame
          backgroundColor={colors.card}
          borderTopLeftRadius={16}
          borderTopRightRadius={16}
          borderWidth={1}
          borderColor={colors.border}
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
    </>
  );
}
