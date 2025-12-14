package com.zenbund.backend.dto.response;

import com.zenbund.backend.entity.Wishlist;

import java.time.LocalDateTime;

public class WishlistResponse {

    private Long id;
    private Long userId;
    private Long offerId;
    private LocalDateTime addedAt;

    // Constructors
    public WishlistResponse() {
    }

    public WishlistResponse(Long id, Long userId, Long offerId, LocalDateTime addedAt) {
        this.id = id;
        this.userId = userId;
        this.offerId = offerId;
        this.addedAt = addedAt;
    }

    // Static factory method to convert from Entity to DTO
    public static WishlistResponse fromEntity(Wishlist wishlist) {
        return new WishlistResponse(
                wishlist.getId(),
                wishlist.getUserId(),
                wishlist.getOfferId(),
                wishlist.getAddedAt()
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

    public Long getOfferId() {
        return offerId;
    }

    public void setOfferId(Long offerId) {
        this.offerId = offerId;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}
