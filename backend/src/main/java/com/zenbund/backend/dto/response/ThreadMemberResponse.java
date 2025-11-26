package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.ThreadMember;

import java.time.LocalDateTime;

/**
 * Response DTO for thread membership data.
 * Includes thread details for convenience.
 */
public class ThreadMemberResponse {

    private Long id;
    private Long userId;
    private Long threadId;
    private Boolean postAnonymously;
    private LocalDateTime joinedAt;

    // Thread details (included for convenience when fetching user's memberships)
    private String threadName;
    private String threadEmoji;

    // No-argument constructor
    public ThreadMemberResponse() {
    }

    // Constructor with all fields
    public ThreadMemberResponse(Long id, Long userId, Long threadId, Boolean postAnonymously,
                                LocalDateTime joinedAt, String threadName, String threadEmoji) {
        this.id = id;
        this.userId = userId;
        this.threadId = threadId;
        this.postAnonymously = postAnonymously;
        this.joinedAt = joinedAt;
        this.threadName = threadName;
        this.threadEmoji = threadEmoji;
    }

    // Static factory method to convert entity to response DTO
    public static ThreadMemberResponse fromEntity(ThreadMember member) {
        ThreadMemberResponse response = new ThreadMemberResponse();
        response.setId(member.getId());
        response.setUserId(member.getUserId());
        response.setThreadId(member.getThreadId());
        response.setPostAnonymously(member.getPostAnonymously());
        response.setJoinedAt(member.getJoinedAt());

        // Include thread details if relationship is loaded
        if (member.getThread() != null) {
            response.setThreadName(member.getThread().getName());
            response.setThreadEmoji(member.getThread().getEmoji());
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

    public Boolean getPostAnonymously() {
        return postAnonymously;
    }

    public void setPostAnonymously(Boolean postAnonymously) {
        this.postAnonymously = postAnonymously;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getThreadName() {
        return threadName;
    }

    public void setThreadName(String threadName) {
        this.threadName = threadName;
    }

    public String getThreadEmoji() {
        return threadEmoji;
    }

    public void setThreadEmoji(String threadEmoji) {
        this.threadEmoji = threadEmoji;
    }

    @Override
    public String toString() {
        return "ThreadMemberResponse{" +
                "id=" + id +
                ", userId=" + userId +
                ", threadId=" + threadId +
                ", postAnonymously=" + postAnonymously +
                ", joinedAt=" + joinedAt +
                ", threadName='" + threadName + '\'' +
                ", threadEmoji='" + threadEmoji + '\'' +
                '}';
    }
}
