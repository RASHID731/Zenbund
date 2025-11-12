package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateOfferRequest;
import com.zenbund.backend.dto.request.UpdateOfferRequest;
import com.zenbund.backend.dto.response.OfferResponse;
import com.zenbund.backend.entity.Offer;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.repository.OfferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;

    public OfferServiceImpl(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
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
                .map(OfferResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OfferResponse getOfferById(Long id) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", id));
        return OfferResponse.fromEntity(offer);
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
                .map(OfferResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersByCategoryId(Long categoryId) {
        return offerRepository.findByCategoryId(categoryId).stream()
                .map(OfferResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
