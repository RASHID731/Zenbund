package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for joining a thread.
 * Creates a new ThreadMember relationship.
 */
public class JoinThreadRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Thread ID is required")
    private Long threadId;

    // No-argument constructor
    public JoinThreadRequest() {
    }

    // Constructor with all fields
    public JoinThreadRequest(Long userId, Long threadId) {
        this.userId = userId;
        this.threadId = threadId;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getThreadId() {
        return threadId;
    }

    public void setThreadId(Long threadId) {
        this.threadId = threadId;
    }

    @Override
    public String toString() {
        return "JoinThreadRequest{" +
                "userId=" + userId +
                ", threadId=" + threadId +
                '}';
    }
}
