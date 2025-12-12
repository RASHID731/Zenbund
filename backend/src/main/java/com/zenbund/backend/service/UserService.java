package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.LoginRequest;
import com.zenbund.backend.dto.request.RegisterRequest;
import com.zenbund.backend.dto.request.UpdateProfileRequest;
import com.zenbund.backend.dto.response.AuthResponse;
import com.zenbund.backend.dto.response.UpdateProfileResponse;
import com.zenbund.backend.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Service interface for user-related operations.
 * Extends UserDetailsService for Spring Security integration.
 */
public interface UserService extends UserDetailsService {

    /**
     * Register a new user account.
     * Validates email uniqueness and hashes password before saving.
     * For Phase 1: Automatically sets user as verified.
     *
     * @param request Registration data (email, password, name, etc.)
     * @return Authentication response with JWT token and user info
     * @throws com.zenbund.backend.exception.DuplicateEmailException if email already exists
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticate user and generate JWT token.
     * Validates credentials and returns token if successful.
     *
     * @param request Login credentials (email and password)
     * @return Authentication response with JWT token and user info
     * @throws org.springframework.security.authentication.BadCredentialsException if credentials are invalid
     * @throws com.zenbund.backend.exception.AccountNotVerifiedException if account not verified
     */
    AuthResponse login(LoginRequest request);

    /**
     * Find user by email address.
     * Used internally by UserDetailsService for authentication.
     *
     * @param email User's email address
     * @return User entity if found
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if user not found
     */
    User findByEmail(String email);

    /**
     * Update user profile information.
     * Updates only the fields provided in the request (non-null values).
     *
     * @param email User's email address
     * @param request Profile update data
     * @return Updated profile response with new user info
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if user not found
     */
    UpdateProfileResponse updateProfile(String email, UpdateProfileRequest request);

    /**
     * Delete user account permanently.
     * Validates password before deletion, removes all user data and listings.
     *
     * @param userId User's ID
     * @param password User's password for confirmation
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if user not found
     * @throws org.springframework.security.authentication.BadCredentialsException if password is incorrect
     */
    void deleteAccount(Long userId, String password);
}
