package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.LoginRequest;
import com.zenbund.backend.dto.request.RegisterRequest;
import com.zenbund.backend.dto.response.AuthResponse;
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
}
