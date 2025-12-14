package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.Wishlist;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO that includes both wishlist data and full offer details.
 * Used for displaying wishlist items with all offer information.
 */
public class WishlistWithOfferResponse {

    private Long id;
    private Long userId;
    private LocalDateTime addedAt;

    // Offer details
    private Long offerId;
    private String[] imageUrls;
    private String title;
    private BigDecimal price;
    private Long categoryId;
    private String pickupLocation;
    private String description;
    private String status;
    private Integer wishlistCount;

    // Constructors
    public WishlistWithOfferResponse() {
    }

    public WishlistWithOfferResponse(Long id, Long userId, LocalDateTime addedAt, Long offerId,
                                     String[] imageUrls, String title, BigDecimal price, Long categoryId,
                                     String pickupLocation, String description, String status, Integer wishlistCount) {
        this.id = id;
        this.userId = userId;
        this.addedAt = addedAt;
        this.offerId = offerId;
        this.imageUrls = imageUrls;
        this.title = title;
        this.price = price;
        this.categoryId = categoryId;
        this.pickupLocation = pickupLocation;
        this.description = description;
        this.status = status;
        this.wishlistCount = wishlistCount;
    }

    // Static factory method to convert from Wishlist entity with Offer
    public static WishlistWithOfferResponse fromEntity(Wishlist wishlist) {
        return new WishlistWithOfferResponse(
                wishlist.getId(),
                wishlist.getUserId(),
                wishlist.getAddedAt(),
                wishlist.getOffer().getId(),
                wishlist.getOffer().getImageUrls(),
                wishlist.getOffer().getTitle(),
                wishlist.getOffer().getPrice(),
                wishlist.getOffer().getCategoryId(),
                wishlist.getOffer().getPickupLocation(),
                wishlist.getOffer().getDescription(),
                wishlist.getOffer().getStatus(),
                wishlist.getOffer().getWishlistCount()
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

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public Long getOfferId() {
        return offerId;
    }

    public void setOfferId(Long offerId) {
        this.offerId = offerId;
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
}
