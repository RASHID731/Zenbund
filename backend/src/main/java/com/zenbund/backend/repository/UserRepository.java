package com.zenbund.backend.repository;

import com.zenbund.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 * JpaRepository provides CRUD operations automatically (save, findById, delete, etc.)
 * We only need to define custom query methods.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email address.
     * Spring Data JPA automatically creates the SQL query from the method name:
     * SELECT * FROM users WHERE email = ?
     *
     * @param email The email address to search for
     * @return Optional containing the user if found, empty if not found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user exists with the given email.
     * Useful for registration validation to prevent duplicate emails.
     *
     * @param email The email address to check
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);
}
