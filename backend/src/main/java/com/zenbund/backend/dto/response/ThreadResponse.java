package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.Thread;

import java.time.LocalDateTime;

public class ThreadResponse {

    private Long id;
    private String emoji;
    private String name;
    private String description;
    private Integer memberCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // No-argument constructor
    public ThreadResponse() {
    }

    // Constructor with all fields
    public ThreadResponse(Long id, String emoji, String name, String description,
                         Integer memberCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.emoji = emoji;
        this.name = name;
        this.description = description;
        this.memberCount = memberCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Static factory method to convert entity to response DTO
    public static ThreadResponse fromEntity(Thread thread) {
        return new ThreadResponse(
                thread.getId(),
                thread.getEmoji(),
                thread.getName(),
                thread.getDescription(),
                thread.getMemberCount(),
                thread.getCreatedAt(),
                thread.getUpdatedAt()
        );
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
        return "ThreadResponse{" +
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
