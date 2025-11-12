package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.Size;

public class UpdateCategoryRequest {

    @Size(max = 50, message = "Category name must not exceed 50 characters")
    private String name;

    @Size(max = 10, message = "Category emoji must not exceed 10 characters")
    private String emoji;

    // No-argument constructor
    public UpdateCategoryRequest() {
    }

    // Constructor with all fields
    public UpdateCategoryRequest(String name, String emoji) {
        this.name = name;
        this.emoji = emoji;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmoji() {
        return emoji;
    }

    public void setEmoji(String emoji) {
        this.emoji = emoji;
    }

    @Override
    public String toString() {
        return "UpdateCategoryRequest{" +
                "name='" + name + '\'' +
                ", emoji='" + emoji + '\'' +
                '}';
    }
}
