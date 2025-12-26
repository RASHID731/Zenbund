package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.CreateOfferRequest;
import com.zenbund.backend.dto.request.UpdateOfferRequest;
import com.zenbund.backend.dto.response.OfferResponse;
import com.zenbund.backend.dto.response.PagedOffersResponse;
import com.zenbund.backend.service.ImageUploadService;
import com.zenbund.backend.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin(origins = "*")
public class OfferController {

    private final OfferService offerService;
    private final ImageUploadService imageUploadService;

    public OfferController(OfferService offerService, ImageUploadService imageUploadService) {
        this.offerService = offerService;
        this.imageUploadService = imageUploadService;
    }

    /**
     * Create a new offer with images
     * POST /api/offers
     *
     * Accepts multipart/form-data with:
     * - images: array of image files (optional)
     * - userId: user ID
     * - title: offer title
     * - price: offer price
     * - categoryId: category ID
     * - pickupLocation: pickup location
     * - description: offer description (optional)
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<OfferResponse> createOffer(
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam("userId") Long userId,
            @RequestParam("title") String title,
            @RequestParam("price") BigDecimal price,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("pickupLocation") String pickupLocation,
            @RequestParam(value = "description", required = false) String description
    ) {
        // Upload images to Cloudinary if provided
        String[] imageUrls = new String[0];
        if (images != null && images.length > 0) {
            List<String> uploadedUrls = imageUploadService.uploadImages(images);
            imageUrls = uploadedUrls.toArray(new String[0]);
        }

        // Create offer request with uploaded image URLs
        CreateOfferRequest request = new CreateOfferRequest();
        request.setUserId(userId);
        request.setImageUrls(imageUrls);
        request.setTitle(title);
        request.setPrice(price);
        request.setCategoryId(categoryId);
        request.setPickupLocation(pickupLocation);
        request.setDescription(description != null ? description : "");

        OfferResponse response = offerService.createOffer(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all offers with optional pagination, sorting, and filtering
     * GET /api/offers
     *
     * Query Parameters:
     * - page: page number (0-indexed, optional)
     * - limit: items per page (optional, default: 20, max: 50)
     * - sortBy: sort field - createdAt, price, wishlistCount (optional, default: createdAt)
     * - sortDirection: ASC or DESC (optional, default: DESC)
     * - minPrice: minimum price filter (optional)
     * - maxPrice: maximum price filter (optional)
     */
    @GetMapping
    public ResponseEntity<?> getAllOffers(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        // If pagination params provided, use new paginated response
        if (page != null || limit != null) {
            PagedOffersResponse pagedResponse = offerService.getOffersWithFilters(
                    page != null ? page : 0,
                    limit != null ? limit : 20,
                    sortBy,
                    sortDirection,
                    minPrice,
                    maxPrice
            );
            return ResponseEntity.ok(pagedResponse);
        }

        // Legacy behavior: return all offers for backward compatibility
        List<OfferResponse> offers = offerService.getAllOffers();
        return ResponseEntity.ok(offers);
    }

    /**
     * Get offer by ID
     * GET /api/offers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<OfferResponse> getOfferById(@PathVariable Long id) {
        OfferResponse response = offerService.getOfferById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update an existing offer
     * PUT /api/offers/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<OfferResponse> updateOffer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOfferRequest request) {
        OfferResponse response = offerService.updateOffer(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete an offer
     * DELETE /api/offers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get offers by user ID
     * GET /api/offers/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OfferResponse>> getOffersByUserId(@PathVariable Long userId) {
        List<OfferResponse> offers = offerService.getOffersByUserId(userId);
        return ResponseEntity.ok(offers);
    }

    /**
     * Get offers by category ID
     * GET /api/offers/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<OfferResponse>> getOffersByCategoryId(@PathVariable Long categoryId) {
        List<OfferResponse> offers = offerService.getOffersByCategoryId(categoryId);
        return ResponseEntity.ok(offers);
    }
}
