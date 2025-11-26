package com.zenbund.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Junction table representing the many-to-many relationship between Users and Threads.
 *
 * This entity stores:
 * - Which user joined which thread
 * - Whether they post anonymously in that thread
 * - When they joined
 *
 * This allows each user to have different anonymous settings per thread.
 */
@Entity
@Table(
    name = "thread_members",
    // Unique constraint: a user can only join a thread once
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "thread_id"})
)
public class ThreadMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign key to User table
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Foreign key to Thread table
    @Column(name = "thread_id", nullable = false)
    private Long threadId;

    // Whether user posts anonymously in this specific thread
    @Column(nullable = false)
    private Boolean postAnonymously = false;

    // When the user joined this thread
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    // JPA relationships for easier querying
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", insertable = false, updatable = false)
    private Thread thread;

    // No-argument constructor required by JPA
    public ThreadMember() {
    }

    // Constructor for creating a new membership
    public ThreadMember(Long userId, Long threadId) {
        this.userId = userId;
        this.threadId = threadId;
        this.postAnonymously = false;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Thread getThread() {
        return thread;
    }

    public void setThread(Thread thread) {
        this.thread = thread;
    }

    @Override
    public String toString() {
        return "ThreadMember{" +
                "id=" + id +
                ", userId=" + userId +
                ", threadId=" + threadId +
                ", postAnonymously=" + postAnonymously +
                ", joinedAt=" + joinedAt +
                '}';
    }
}
