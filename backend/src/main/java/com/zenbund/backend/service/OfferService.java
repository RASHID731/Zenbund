package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateOfferRequest;
import com.zenbund.backend.dto.request.UpdateOfferRequest;
import com.zenbund.backend.dto.response.OfferResponse;
import com.zenbund.backend.dto.response.PagedOffersResponse;

import java.math.BigDecimal;
import java.util.List;

public interface OfferService {

    /**
     * Create a new offer
     *
     * @param request the create offer request
     * @return the created offer response
     */
    OfferResponse createOffer(CreateOfferRequest request);

    /**
     * Get all offers
     *
     * @return list of all offers
     */
    List<OfferResponse> getAllOffers();

    /**
     * Get offer by ID
     *
     * @param id the offer ID
     * @return the offer response
     */
    OfferResponse getOfferById(Long id);

    /**
     * Update an existing offer
     *
     * @param id the offer ID
     * @param request the update offer request
     * @return the updated offer response
     */
    OfferResponse updateOffer(Long id, UpdateOfferRequest request);

    /**
     * Delete an offer
     *
     * @param id the offer ID
     */
    void deleteOffer(Long id);

    /**
     * Get offers by user ID
     *
     * @param userId the user ID
     * @return list of offers by the user
     */
    List<OfferResponse> getOffersByUserId(Long userId);

    /**
     * Get offers by category ID
     *
     * @param categoryId the category ID
     * @return list of offers in the category
     */
    List<OfferResponse> getOffersByCategoryId(Long categoryId);

    /**
     * Get offers with pagination, sorting, and filtering
     *
     * @param page page number (0-indexed)
     * @param limit items per page
     * @param sortBy sort field: "createdAt", "price", "wishlistCount"
     * @param sortDirection "ASC" or "DESC"
     * @param minPrice minimum price filter (optional)
     * @param maxPrice maximum price filter (optional)
     * @return paged offers response
     */
    PagedOffersResponse getOffersWithFilters(
            int page,
            int limit,
            String sortBy,
            String sortDirection,
            BigDecimal minPrice,
            BigDecimal maxPrice
    );
}
