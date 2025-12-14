package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotNull;

public class CreateWishlistRequest {

    @NotNull(message = "Offer ID is required")
    private Long offerId;

    // Constructors
    public CreateWishlistRequest() {
    }

    public CreateWishlistRequest(Long offerId) {
        this.offerId = offerId;
    }

    // Getters and Setters
    public Long getOfferId() {
        return offerId;
    }

    public void setOfferId(Long offerId) {
        this.offerId = offerId;
    }
}
