package com.zenbund.backend.repository;

import com.zenbund.backend.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    // Find all wishlist items for a user
    List<Wishlist> findByUserId(Long userId);

    // Find a specific wishlist item by user and offer
    Optional<Wishlist> findByUserIdAndOfferId(Long userId, Long offerId);

    // Check if a wishlist item exists
    boolean existsByUserIdAndOfferId(Long userId, Long offerId);

    // Delete a specific wishlist item by user and offer
    void deleteByUserIdAndOfferId(Long userId, Long offerId);
}
