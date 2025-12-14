package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateWishlistRequest;
import com.zenbund.backend.dto.response.WishlistResponse;
import com.zenbund.backend.dto.response.WishlistWithOfferResponse;

import java.util.List;

public interface WishlistService {

    /**
     * Add an offer to user's wishlist
     *
     * @param userId the user ID
     * @param request the create wishlist request
     * @return the created wishlist response
     */
    WishlistResponse addToWishlist(Long userId, CreateWishlistRequest request);

    /**
     * Remove an offer from user's wishlist
     *
     * @param userId the user ID
     * @param wishlistId the wishlist item ID
     */
    void removeFromWishlist(Long userId, Long wishlistId);

    /**
     * Remove an offer from user's wishlist by offer ID
     *
     * @param userId the user ID
     * @param offerId the offer ID
     */
    void removeFromWishlistByOfferId(Long userId, Long offerId);

    /**
     * Get all wishlist items for a user with full offer details
     *
     * @param userId the user ID
     * @return list of wishlist items with offer details
     */
    List<WishlistWithOfferResponse> getUserWishlistWithOffers(Long userId);

    /**
     * Check if an offer is in user's wishlist
     *
     * @param userId the user ID
     * @param offerId the offer ID
     * @return true if offer is wishlisted, false otherwise
     */
    boolean isOfferWishlisted(Long userId, Long offerId);

    /**
     * Get wishlist item by user and offer ID
     *
     * @param userId the user ID
     * @param offerId the offer ID
     * @return the wishlist response if exists, null otherwise
     */
    WishlistResponse getWishlistByUserAndOffer(Long userId, Long offerId);
}
