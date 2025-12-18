package com.zenbund.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User 1 ID is required")
    @Column(name = "user1_id", nullable = false)
    private Long user1Id;

    @NotNull(message = "User 2 ID is required")
    @Column(name = "user2_id", nullable = false)
    private Long user2Id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", insertable = false, updatable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", insertable = false, updatable = false)
    private User user2;

    // Constructors
    public Chat() {
    }

    public Chat(Long user1Id, Long user2Id) {
        this.user1Id = user1Id;
        this.user2Id = user2Id;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(Long user1Id) {
        this.user1Id = user1Id;
    }

    public Long getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(Long user2Id) {
        this.user2Id = user2Id;
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

    public User getUser1() {
        return user1;
    }

    public void setUser1(User user1) {
        this.user1 = user1;
    }

    public User getUser2() {
        return user2;
    }

    public void setUser2(User user2) {
        this.user2 = user2;
    }
}
