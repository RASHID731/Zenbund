package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.CreateWishlistRequest;
import com.zenbund.backend.dto.response.WishlistResponse;
import com.zenbund.backend.dto.response.WishlistWithOfferResponse;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for wishlist management.
 * Handles adding, removing, and retrieving wishlist items.
 * All endpoints require authentication.
 */
@RestController
@RequestMapping("/api/wishlists")
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    /**
     * Add an offer to the authenticated user's wishlist
     * POST /api/wishlists
     *
     * Requires authentication (JWT token in Authorization header).
     * Request Body: CreateWishlistRequest (offerId)
     * Response: WishlistResponse with wishlist item details
     * Status: 201 CREATED on success
     */
    @PostMapping
    public ResponseEntity<WishlistResponse> addToWishlist(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateWishlistRequest request) {
        WishlistResponse response = wishlistService.addToWishlist(user.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Remove a wishlist item by its ID
     * DELETE /api/wishlists/{id}
     *
     * Requires authentication (JWT token in Authorization header).
     * Only the owner can remove their own wishlist items.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        wishlistService.removeFromWishlist(user.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist successfully"));
    }

    /**
     * Remove a wishlist item by offer ID
     * DELETE /api/wishlists/offer/{offerId}
     *
     * Requires authentication (JWT token in Authorization header).
     * This endpoint is useful for toggling wishlist status from the listing detail page.
     */
    @DeleteMapping("/offer/{offerId}")
    public ResponseEntity<Map<String, String>> removeFromWishlistByOfferId(
            @AuthenticationPrincipal User user,
            @PathVariable Long offerId) {
        wishlistService.removeFromWishlistByOfferId(user.getId(), offerId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist successfully"));
    }

    /**
     * Get the authenticated user's wishlist with full offer details
     * GET /api/wishlists
     *
     * Requires authentication (JWT token in Authorization header).
     * Returns list of wishlist items with complete offer information.
     */
    @GetMapping
    public ResponseEntity<List<WishlistWithOfferResponse>> getUserWishlist(
            @AuthenticationPrincipal User user) {
        List<WishlistWithOfferResponse> wishlist = wishlistService.getUserWishlistWithOffers(user.getId());
        return ResponseEntity.ok(wishlist);
    }

    /**
     * Check if a specific offer is in the user's wishlist
     * GET /api/wishlists/check/{offerId}
     *
     * Requires authentication (JWT token in Authorization header).
     * Returns boolean indicating whether the offer is wishlisted.
     */
    @GetMapping("/check/{offerId}")
    public ResponseEntity<Map<String, Boolean>> checkIfWishlisted(
            @AuthenticationPrincipal User user,
            @PathVariable Long offerId) {
        boolean isWishlisted = wishlistService.isOfferWishlisted(user.getId(), offerId);
        return ResponseEntity.ok(Map.of("isWishlisted", isWishlisted));
    }

    /**
     * Get wishlist item by offer ID
     * GET /api/wishlists/offer/{offerId}
     *
     * Requires authentication (JWT token in Authorization header).
     * Returns the wishlist item if it exists, 404 otherwise.
     */
    @GetMapping("/offer/{offerId}")
    public ResponseEntity<WishlistResponse> getWishlistByOfferId(
            @AuthenticationPrincipal User user,
            @PathVariable Long offerId) {
        WishlistResponse wishlist = wishlistService.getWishlistByUserAndOffer(user.getId(), offerId);
        if (wishlist == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wishlist);
    }
}
