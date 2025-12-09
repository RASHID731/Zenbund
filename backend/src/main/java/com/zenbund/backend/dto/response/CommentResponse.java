package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.Comment;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CommentResponse {

    private Long id;
    private Long threadId;
    private Long userId;
    private Long parentCommentId;
    private String text;
    private Boolean isAnonymous;
    private Integer likes;
    private Integer replyCount;
    private Instant createdAt;
    private Instant updatedAt;
    private List<CommentResponse> replies;

    // No-argument constructor
    public CommentResponse() {
        this.replies = new ArrayList<>();
    }

    // Constructor
    public CommentResponse(Long id, Long threadId, Long userId, Long parentCommentId,
                          String text, Boolean isAnonymous, Integer likes, Integer replyCount,
                          Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.threadId = threadId;
        this.userId = userId;
        this.parentCommentId = parentCommentId;
        this.text = text;
        this.isAnonymous = isAnonymous;
        this.likes = likes;
        this.replyCount = replyCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.replies = new ArrayList<>();
    }

    // Static factory method to convert entity to response
    public static CommentResponse fromEntity(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getThreadId(),
                comment.getUserId(),
                comment.getParentCommentId(),
                comment.getText(),
                comment.getIsAnonymous(),
                comment.getLikes(),
                comment.getReplyCount(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }

    // Static factory method with replies
    public static CommentResponse fromEntityWithReplies(Comment comment, List<Comment> replyEntities) {
        CommentResponse response = fromEntity(comment);
        if (replyEntities != null && !replyEntities.isEmpty()) {
            response.setReplies(
                    replyEntities.stream()
                            .map(CommentResponse::fromEntity)
                            .collect(Collectors.toList())
            );
        }
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getThreadId() {
        return threadId;
    }

    public void setThreadId(Long threadId) {
        this.threadId = threadId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getReplyCount() {
        return replyCount;
    }

    public void setReplyCount(Integer replyCount) {
        this.replyCount = replyCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<CommentResponse> getReplies() {
        return replies;
    }

    public void setReplies(List<CommentResponse> replies) {
        this.replies = replies;
    }
}
