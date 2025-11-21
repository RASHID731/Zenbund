package com.zenbund.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "threads")
public class Thread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Thread emoji is required")
    @Size(max = 10, message = "Thread emoji must not exceed 10 characters")
    @Column(nullable = false, length = 10)
    private String emoji;

    @NotBlank(message = "Thread name is required")
    @Size(max = 100, message = "Thread name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Thread description is required")
    @Size(max = 500, message = "Thread description must not exceed 500 characters")
    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private Integer memberCount = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // No-argument constructor required by JPA
    public Thread() {
    }

    // Constructor with fields (excluding id and timestamps which are auto-generated)
    public Thread(String emoji, String name, String description) {
        this.emoji = emoji;
        this.name = name;
        this.description = description;
        this.memberCount = 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmoji() {
        return emoji;
    }

    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Thread{" +
                "id=" + id +
                ", emoji='" + emoji + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", memberCount=" + memberCount +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
