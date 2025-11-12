package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class UpdateOfferRequest {

    // All fields are optional for partial updates
    private String[] imageUrls;

    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private Long categoryId;

    @Size(max = 200, message = "Pickup location must not exceed 200 characters")
    private String pickupLocation;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Pattern(regexp = "available|sold", message = "Status must be either 'available' or 'sold'")
    private String status;

    // Constructors
    public UpdateOfferRequest() {
    }

    // Getters and Setters
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
