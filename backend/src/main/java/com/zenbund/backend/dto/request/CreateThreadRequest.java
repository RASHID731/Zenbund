package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateThreadRequest {

    @NotBlank(message = "Thread emoji is required")
    @Size(max = 10, message = "Thread emoji must not exceed 10 characters")
    private String emoji;

    @NotBlank(message = "Thread name is required")
    @Size(max = 100, message = "Thread name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Thread description is required")
    @Size(max = 500, message = "Thread description must not exceed 500 characters")
    private String description;

    // No-argument constructor
    public CreateThreadRequest() {
    }

    // Constructor with all fields
    public CreateThreadRequest(String emoji, String name, String description) {
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
        return "CreateThreadRequest{" +
                "emoji='" + emoji + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
