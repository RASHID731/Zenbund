package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.Category;

public class CategoryResponse {

    private Long id;
    private String name;
    private String emoji;

    // No-argument constructor
    public CategoryResponse() {
    }

    // Constructor with all fields
    public CategoryResponse(Long id, String name, String emoji) {
        this.id = id;
        this.name = name;
        this.emoji = emoji;
    }

    // Static factory method to convert entity to response DTO
    public static CategoryResponse fromEntity(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getEmoji()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        return "CategoryResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", emoji='" + emoji + '\'' +
                '}';
    }
}
