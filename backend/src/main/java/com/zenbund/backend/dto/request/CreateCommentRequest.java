package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateCommentRequest {

    @NotNull(message = "Thread ID is required")
    private Long threadId;

    private Long parentCommentId; // Optional - null for parent comments, has value for replies

    @NotBlank(message = "Comment text is required")
    private String text;

    // No-argument constructor
    public CreateCommentRequest() {
    }

    // Constructor
    public CreateCommentRequest(Long threadId, Long parentCommentId, String text) {
        this.threadId = threadId;
        this.parentCommentId = parentCommentId;
        this.text = text;
    }

    // Getters and Setters
    public Long getThreadId() {
        return threadId;
    }

    public void setThreadId(Long threadId) {
        this.threadId = threadId;
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
}
