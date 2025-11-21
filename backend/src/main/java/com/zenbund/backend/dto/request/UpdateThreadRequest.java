package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.Size;

public class UpdateThreadRequest {

    @Size(max = 10, message = "Thread emoji must not exceed 10 characters")
    private String emoji;

    @Size(max = 100, message = "Thread name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Thread description must not exceed 500 characters")
    private String description;

    // No-argument constructor
    public UpdateThreadRequest() {
    }

    // Constructor with all fields
    public UpdateThreadRequest(String emoji, String name, String description) {
        this.emoji = emoji;
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "UpdateThreadRequest{" +
                "emoji='" + emoji + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
