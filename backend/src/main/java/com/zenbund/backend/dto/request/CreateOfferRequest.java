package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class CreateOfferRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private String[] imageUrls;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Pickup location is required")
    @Size(max = 200, message = "Pickup location must not exceed 200 characters")
    private String pickupLocation;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    // Constructors
    public CreateOfferRequest() {
    }

    public CreateOfferRequest(Long userId, String[] imageUrls, String title, BigDecimal price,
                              Long categoryId, String pickupLocation, String description) {
        this.userId = userId;
        this.imageUrls = imageUrls;
        this.title = title;
        this.price = price;
        this.categoryId = categoryId;
        this.pickupLocation = pickupLocation;
        this.description = description;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String[] getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(String[] imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
