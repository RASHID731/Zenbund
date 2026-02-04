package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.CreateOfferRequest;
import com.zenbund.backend.dto.request.UpdateOfferRequest;
import com.zenbund.backend.dto.response.OfferResponse;
import com.zenbund.backend.dto.response.PagedOffersResponse;
import com.zenbund.backend.entity.Offer;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.repository.OfferRepository;
import com.zenbund.backend.service.ImageUploadService;
import com.zenbund.backend.service.OfferService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin(origins = "*")
public class OfferController {

    private final OfferService offerService;
    private final ImageUploadService imageUploadService;
    private final OfferRepository offerRepository;

    public OfferController(OfferService offerService, ImageUploadService imageUploadService, OfferRepository offerRepository) {
        this.offerService = offerService;
        this.imageUploadService = imageUploadService;
        this.offerRepository = offerRepository;
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
     * Update an existing offer with images
     * PUT /api/offers/{id}
     *
     * Accepts multipart/form-data with:
     * - images: array of new image files (optional)
     * - existingImageUrls: JSON array string of URLs to keep (optional)
     * - title: offer title
     * - price: offer price
     * - categoryId: category ID (optional)
     * - pickupLocation: pickup location
     * - description: offer description (optional)
     */
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<OfferResponse> updateOffer(
            @PathVariable Long id,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam(value = "existingImageUrls", required = false) String existingImageUrlsJson,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "pickupLocation", required = false) String pickupLocation,
            @RequestParam(value = "description", required = false) String description
    ) {
        // Get existing offer to compare images
        Offer existingOffer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", id));

        // Parse existing image URLs that should be kept
        List<String> existingImagesToKeep = new ArrayList<>();
        if (existingImageUrlsJson != null && !existingImageUrlsJson.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String[] urlsArray = mapper.readValue(existingImageUrlsJson, String[].class);
                existingImagesToKeep = Arrays.asList(urlsArray);
            } catch (Exception e) {
                // If parsing fails, keep all existing images
                System.err.println("Failed to parse existingImageUrls: " + e.getMessage());
            }
        }

        // Determine which images to delete from Cloudinary
        String[] oldImageUrls = existingOffer.getImageUrls();
        if (oldImageUrls != null) {
            for (String oldUrl : oldImageUrls) {
                if (!existingImagesToKeep.contains(oldUrl)) {
                    // This image was removed - delete from Cloudinary
                    imageUploadService.deleteImage(oldUrl);
                }
            }
        }

        // Upload new images to Cloudinary if provided
        List<String> newImageUrls = new ArrayList<>();
        if (images != null && images.length > 0) {
            List<String> uploadedUrls = imageUploadService.uploadImages(images);
            newImageUrls.addAll(uploadedUrls);
        }

        // Combine existing URLs to keep + newly uploaded URLs
        List<String> allImageUrls = new ArrayList<>(existingImagesToKeep);
        allImageUrls.addAll(newImageUrls);

        // Build update request
        UpdateOfferRequest request = new UpdateOfferRequest();
        request.setImageUrls(allImageUrls.toArray(new String[0]));
        if (title != null) request.setTitle(title);
        if (price != null) request.setPrice(price);
        if (categoryId != null) request.setCategoryId(categoryId);
        if (pickupLocation != null) request.setPickupLocation(pickupLocation);
        if (description != null) request.setDescription(description);

        OfferResponse response = offerService.updateOffer(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Update offer status (mark as sold/available)
     * PUT /api/offers/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<OfferResponse> updateOfferStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        UpdateOfferRequest request = new UpdateOfferRequest();
        request.setStatus(body.get("status"));

        OfferResponse response = offerService.updateOffer(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete an offer and all its images from Cloudinary
     * DELETE /api/offers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        // Get offer to access its images
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", id));

        // Delete all images from Cloudinary
        if (offer.getImageUrls() != null && offer.getImageUrls().length > 0) {
            imageUploadService.deleteImages(offer.getImageUrls());
        }

        // Delete the offer from database
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
