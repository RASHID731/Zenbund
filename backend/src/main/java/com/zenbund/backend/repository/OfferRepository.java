package com.zenbund.backend.repository;

import com.zenbund.backend.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    // Find offers by user ID
    List<Offer> findByUserId(Long userId);

    // Find offers by category ID
    List<Offer> findByCategoryId(Long categoryId);

    // Find offers by status
    List<Offer> findByStatus(String status);

    // Find offers by user ID and status
    List<Offer> findByUserIdAndStatus(Long userId, String status);
}
