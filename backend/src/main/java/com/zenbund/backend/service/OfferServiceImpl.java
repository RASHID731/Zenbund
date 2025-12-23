package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateOfferRequest;
import com.zenbund.backend.dto.request.UpdateOfferRequest;
import com.zenbund.backend.dto.response.OfferResponse;
import com.zenbund.backend.entity.Offer;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.repository.OfferRepository;
import com.zenbund.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;
    private final UserRepository userRepository;

    public OfferServiceImpl(OfferRepository offerRepository, UserRepository userRepository) {
        this.offerRepository = offerRepository;
        this.userRepository = userRepository;
    }

    // Helper method to enrich OfferResponse with user information
    private OfferResponse enrichOfferResponseWithUserInfo(Offer offer) {
        OfferResponse response = OfferResponse.fromEntity(offer);

        // Fetch user details and populate userName and profilePicture
        Optional<User> user = userRepository.findById(offer.getUserId());
        user.ifPresent(u -> {
            response.setUserName(u.getName());
            response.setUserProfilePicture(u.getProfilePicture());
        });

        return response;
    }

    @Override
    public OfferResponse createOffer(CreateOfferRequest request) {
        Offer offer = new Offer();
        offer.setUserId(request.getUserId());
        offer.setImageUrls(request.getImageUrls());
        offer.setTitle(request.getTitle());
        offer.setPrice(request.getPrice());
        offer.setCategoryId(request.getCategoryId());
        offer.setPickupLocation(request.getPickupLocation());
        offer.setDescription(request.getDescription());
        offer.setStatus("available");
        offer.setWishlistCount(0);

        Offer savedOffer = offerRepository.save(offer);
        return OfferResponse.fromEntity(savedOffer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getAllOffers() {
        return offerRepository.findAll().stream()
                .map(this::enrichOfferResponseWithUserInfo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OfferResponse getOfferById(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", id));
        return enrichOfferResponseWithUserInfo(offer);
    }

    @Override
    public OfferResponse updateOffer(Long id, UpdateOfferRequest request) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", id));

        // Update only the fields that are provided (partial update)
        if (request.getImageUrls() != null) {
            offer.setImageUrls(request.getImageUrls());
        }
        if (request.getTitle() != null) {
            offer.setTitle(request.getTitle());
        }
        if (request.getPrice() != null) {
            offer.setPrice(request.getPrice());
        }
        if (request.getCategoryId() != null) {
            offer.setCategoryId(request.getCategoryId());
        }
        if (request.getPickupLocation() != null) {
            offer.setPickupLocation(request.getPickupLocation());
        }
        if (request.getDescription() != null) {
            offer.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            offer.setStatus(request.getStatus());
        }

        Offer updatedOffer = offerRepository.save(offer);
        return OfferResponse.fromEntity(updatedOffer);
    }

    @Override
    public void deleteOffer(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", id));
        offerRepository.delete(offer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersByUserId(Long userId) {
        return offerRepository.findByUserId(userId).stream()
                .map(this::enrichOfferResponseWithUserInfo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersByCategoryId(Long categoryId) {
        return offerRepository.findByCategoryId(categoryId).stream()
                .map(this::enrichOfferResponseWithUserInfo)
                .collect(Collectors.toList());
    }
}
