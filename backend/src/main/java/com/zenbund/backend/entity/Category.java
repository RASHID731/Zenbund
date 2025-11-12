package com.zenbund.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name must not exceed 50 characters")
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @NotBlank(message = "Category emoji is required")
    @Size(max = 10, message = "Category emoji must not exceed 10 characters")
    @Column(nullable = false, length = 10)
    private String emoji;

    // No-argument constructor required by JPA
    public Category() {
    }

    // Constructor with all fields
    public Category(String name, String emoji) {
        this.name = name;
        this.emoji = emoji;
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
        return "Category{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", emoji='" + emoji + '\'' +
                '}';
    }
}
