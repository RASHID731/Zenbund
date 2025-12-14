package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateWishlistRequest;
import com.zenbund.backend.dto.response.WishlistResponse;
import com.zenbund.backend.dto.response.WishlistWithOfferResponse;
import com.zenbund.backend.entity.Offer;
import com.zenbund.backend.entity.Wishlist;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.repository.OfferRepository;
import com.zenbund.backend.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final OfferRepository offerRepository;

    public WishlistServiceImpl(WishlistRepository wishlistRepository, OfferRepository offerRepository) {
        this.wishlistRepository = wishlistRepository;
        this.offerRepository = offerRepository;
    }

    @Override
    public WishlistResponse addToWishlist(Long userId, CreateWishlistRequest request) {
        Long offerId = request.getOfferId();

        // Check if offer exists
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", offerId));

        // Check if already wishlisted
        if (wishlistRepository.existsByUserIdAndOfferId(userId, offerId)) {
            throw new IllegalStateException("Offer is already in wishlist");
        }

        // Create wishlist item
        Wishlist wishlist = new Wishlist(userId, offerId);
        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        // Increment offer's wishlist count
        offer.setWishlistCount(offer.getWishlistCount() + 1);
        offerRepository.save(offer);

        return WishlistResponse.fromEntity(savedWishlist);
    }

    @Override
    public void removeFromWishlist(Long userId, Long wishlistId) {
        Wishlist wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "id", wishlistId));

        // Ensure the wishlist item belongs to the user
        if (!wishlist.getUserId().equals(userId)) {
            throw new IllegalStateException("Unauthorized to remove this wishlist item");
        }

        // Decrement offer's wishlist count
        Offer offer = offerRepository.findById(wishlist.getOfferId())
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", wishlist.getOfferId()));

        if (offer.getWishlistCount() > 0) {
            offer.setWishlistCount(offer.getWishlistCount() - 1);
            offerRepository.save(offer);
        }

        // Delete wishlist item
        wishlistRepository.delete(wishlist);
    }

    @Override
    public void removeFromWishlistByOfferId(Long userId, Long offerId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndOfferId(userId, offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist", "userId and offerId", userId + ", " + offerId));

        // Decrement offer's wishlist count
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", offerId));

        if (offer.getWishlistCount() > 0) {
            offer.setWishlistCount(offer.getWishlistCount() - 1);
            offerRepository.save(offer);
        }

        // Delete wishlist item
        wishlistRepository.delete(wishlist);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishlistWithOfferResponse> getUserWishlistWithOffers(Long userId) {
        List<Wishlist> wishlists = wishlistRepository.findByUserId(userId);

        return wishlists.stream()
                .map(wishlist -> {
                    // Fetch the offer for each wishlist item
                    Offer offer = offerRepository.findById(wishlist.getOfferId())
                            .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", wishlist.getOfferId()));

                    // Set the offer relationship for the DTO factory method
                    wishlist.setOffer(offer);

                    return WishlistWithOfferResponse.fromEntity(wishlist);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isOfferWishlisted(Long userId, Long offerId) {
        return wishlistRepository.existsByUserIdAndOfferId(userId, offerId);
    }

    @Override
    @Transactional(readOnly = true)
    public WishlistResponse getWishlistByUserAndOffer(Long userId, Long offerId) {
        return wishlistRepository.findByUserIdAndOfferId(userId, offerId)
                .map(WishlistResponse::fromEntity)
                .orElse(null);
    }
}
