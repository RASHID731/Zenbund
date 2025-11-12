package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name must not exceed 50 characters")
    private String name;

    @NotBlank(message = "Category emoji is required")
    @Size(max = 10, message = "Category emoji must not exceed 10 characters")
    private String emoji;

    // No-argument constructor
    public CreateCategoryRequest() {
    }

    // Constructor with all fields
    public CreateCategoryRequest(String name, String emoji) {
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
        return "CreateCategoryRequest{" +
                "name='" + name + '\'' +
                ", emoji='" + emoji + '\'' +
                '}';
    }
}
