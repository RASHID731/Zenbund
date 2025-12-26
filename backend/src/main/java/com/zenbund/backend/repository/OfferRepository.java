package com.zenbund.backend.repository;

import com.zenbund.backend.entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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

    // Pageable methods for pagination and sorting
    Page<Offer> findAll(Pageable pageable);

    Page<Offer> findByStatus(String status, Pageable pageable);

    // Price range filtering with pagination
    Page<Offer> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // Combined price and status filtering with pagination
    Page<Offer> findByPriceBetweenAndStatus(BigDecimal minPrice, BigDecimal maxPrice, String status, Pageable pageable);
}
