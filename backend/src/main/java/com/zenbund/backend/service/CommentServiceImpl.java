package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateCommentRequest;
import com.zenbund.backend.dto.request.UpdateCommentRequest;
import com.zenbund.backend.dto.response.CommentResponse;
import com.zenbund.backend.entity.Comment;
import com.zenbund.backend.entity.ThreadMember;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.exception.UnauthorizedException;
import com.zenbund.backend.repository.CommentRepository;
import com.zenbund.backend.repository.ThreadMemberRepository;
import com.zenbund.backend.repository.ThreadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ThreadMemberRepository threadMemberRepository;
    private final ThreadRepository threadRepository;

    public CommentServiceImpl(CommentRepository commentRepository,
                             ThreadMemberRepository threadMemberRepository,
                             ThreadRepository threadRepository) {
        this.commentRepository = commentRepository;
        this.threadMemberRepository = threadMemberRepository;
        this.threadRepository = threadRepository;
    }

    @Override
    public CommentResponse createComment(CreateCommentRequest request, Long userId) {
        // Verify thread exists
        threadRepository.findById(request.getThreadId())
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + request.getThreadId()));

        // Verify user is a member of the thread
        boolean isMember = threadMemberRepository.existsByUserIdAndThreadId(userId, request.getThreadId());
        if (!isMember) {
            throw new UnauthorizedException("You must be a member of this thread to comment");
        }

        // Get user's ThreadMember to determine isAnonymous setting
        ThreadMember threadMember = threadMemberRepository
                .findByUserIdAndThreadId(userId, request.getThreadId())
                .orElseThrow(() -> new ResourceNotFoundException("Thread membership not found"));

        Boolean isAnonymous = threadMember.getPostAnonymously();

        // If this is a reply, verify parent comment exists and belongs to the same thread
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found with id: " + request.getParentCommentId()));

            if (!parentComment.getThreadId().equals(request.getThreadId())) {
                throw new IllegalArgumentException("Parent comment does not belong to the specified thread");
            }
        }

        // Create the comment
        Comment comment = new Comment(
                request.getThreadId(),
                userId,
                request.getParentCommentId(),
                request.getText(),
                isAnonymous
        );

        Comment savedComment = commentRepository.save(comment);

        // If this is a reply, update parent comment's reply count
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId()).get();
            long replyCount = commentRepository.countByParentCommentId(request.getParentCommentId());
            parentComment.setReplyCount((int) replyCount);
            commentRepository.save(parentComment);
        }

        return CommentResponse.fromEntity(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByThreadId(Long threadId) {
        // Verify thread exists
        threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + threadId));

        // Get all parent comments (newest first)
        List<Comment> parentComments = commentRepository.findByThreadIdAndParentCommentIdIsNullOrderByCreatedAtDesc(threadId);

        // For each parent comment, get its replies (oldest first)
        return parentComments.stream()
                .map(parent -> {
                    List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(parent.getId());
                    return CommentResponse.fromEntityWithReplies(parent, replies);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        // If this is a parent comment, include its replies
        if (comment.getParentCommentId() == null) {
            List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtAsc(comment.getId());
            return CommentResponse.fromEntityWithReplies(comment, replies);
        }

        return CommentResponse.fromEntity(comment);
    }

    @Override
    public CommentResponse updateComment(Long id, UpdateCommentRequest request, Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        // Verify ownership
        if (!comment.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own comments");
        }

        // Only update text (isAnonymous, likes, etc. cannot be updated)
        comment.setText(request.getText());

        Comment updatedComment = commentRepository.save(comment);
        return CommentResponse.fromEntity(updatedComment);
    }

    @Override
    public void deleteComment(Long id, Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        // Verify ownership
        if (!comment.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        // If this is a parent comment, delete all replies first
        if (comment.getParentCommentId() == null) {
            commentRepository.deleteByParentCommentId(comment.getId());
            commentRepository.deleteById(id);
        } else {
            // If this is a reply, update parent's reply count after deletion
            Comment parentComment = commentRepository.findById(comment.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));

            commentRepository.deleteById(id);
            long replyCount = commentRepository.countByParentCommentId(comment.getParentCommentId());
            parentComment.setReplyCount((int) replyCount);
            commentRepository.save(parentComment);
        }
    }
}
