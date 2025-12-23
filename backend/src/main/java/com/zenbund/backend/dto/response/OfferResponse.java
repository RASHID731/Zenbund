package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.Offer;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OfferResponse {

    private Long id;
    private Long userId;
    private String[] imageUrls;
    private String title;
    private BigDecimal price;
    private Long categoryId;
    private String pickupLocation;
    private String description;
    private String status;
    private Integer wishlistCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String userName;
    private String userProfilePicture;

    // Constructors
    public OfferResponse() {
    }

    public OfferResponse(Long id, Long userId, String[] imageUrls, String title, BigDecimal price,
                         Long categoryId, String pickupLocation, String description, String status,
                         Integer wishlistCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.imageUrls = imageUrls;
        this.title = title;
        this.price = price;
        this.categoryId = categoryId;
        this.pickupLocation = pickupLocation;
        this.description = description;
        this.status = status;
        this.wishlistCount = wishlistCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Static factory method to convert from Entity to DTO
    public static OfferResponse fromEntity(Offer offer) {
        return new OfferResponse(
                offer.getId(),
                offer.getUserId(),
                offer.getImageUrls(),
                offer.getTitle(),
                offer.getPrice(),
                offer.getCategoryId(),
                offer.getPickupLocation(),
                offer.getDescription(),
                offer.getStatus(),
                offer.getWishlistCount(),
                offer.getCreatedAt(),
                offer.getUpdatedAt()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getWishlistCount() {
        return wishlistCount;
    }

    public void setWishlistCount(Integer wishlistCount) {
        this.wishlistCount = wishlistCount;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserProfilePicture() {
        return userProfilePicture;
    }

    public void setUserProfilePicture(String userProfilePicture) {
        this.userProfilePicture = userProfilePicture;
    }
}
