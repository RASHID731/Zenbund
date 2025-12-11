package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.LoginRequest;
import com.zenbund.backend.dto.request.RegisterRequest;
import com.zenbund.backend.dto.request.UpdateProfileRequest;
import com.zenbund.backend.dto.response.AuthResponse;
import com.zenbund.backend.dto.response.UpdateProfileResponse;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.repository.UserRepository;
import com.zenbund.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of UserService with authentication logic.
 * Handles user registration, login, and Spring Security integration.
 */
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /**
     * Constructor injection of dependencies.
     * Spring automatically provides these beans.
     */
    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Register a new user.
     *
     * Flow:
     * 1. Check if email already exists (validation)
     * 2. Hash the password with BCrypt
     * 3. Create new User entity
     * 4. Save to database
     * 5. Generate JWT token
     * 6. Return AuthResponse with token + user info
     */
    @Override
    public AuthResponse register(RegisterRequest request) {
        // Step 1: Validate email is not already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // Step 2: Hash the password
        // BCrypt automatically generates a salt and hashes the password
        // The result is a 60-character string like: $2a$12$R9h/cIPz0gi.URNNX3kh2O...
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Step 3: Create new User entity with basic required fields only
        User user = new User(
                request.getEmail(),
                hashedPassword,
                request.getName()
        );

        // Phase 1: Auto-verify users (no email verification yet)
        // In Phase 2, this will be false and require email confirmation
        user.setIsVerified(true);

        // Step 4: Save user to database
        // JPA automatically sets createdAt and updatedAt via @PrePersist
        User savedUser = userRepository.save(user);

        // Step 5: Generate JWT token
        // Uses user as UserDetails (our User entity implements UserDetails)
        String token = jwtUtil.generateToken(savedUser);

        // Step 6: Return response with token and user info
        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getUniversity(),
                savedUser.getMajor(),
                savedUser.getYear(),
                savedUser.getInstagramLink(),
                savedUser.getBio(),
                savedUser.getProfilePicture()
        );
    }

    /**
     * Login existing user.
     *
     * Flow:
     * 1. Use Spring Security to authenticate (checks password)
     * 2. If successful, fetch user from database
     * 3. Generate JWT token
     * 4. Return AuthResponse with token + user info
     */
    @Override
    public AuthResponse login(LoginRequest request) {
        // Step 1: Authenticate user with Spring Security
        // This calls loadUserByUsername() internally, which fetches the user
        // Then compares the provided password with the hashed password using BCrypt
        // If password doesn't match, throws BadCredentialsException
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Step 2: If we reach here, authentication succeeded - fetch user details
        User user = findByEmail(request.getEmail());

        // Check if account is verified
        // In Phase 1, all accounts are auto-verified
        // In Phase 2+, this will prevent login until email is confirmed
        if (!user.getIsVerified()) {
            throw new RuntimeException("Account not verified. Please check your email.");
        }

        // Step 3: Generate JWT token for the authenticated user
        String token = jwtUtil.generateToken(user);

        // Step 4: Return response with token and user info
        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getUniversity(),
                user.getMajor(),
                user.getYear(),
                user.getInstagramLink(),
                user.getBio(),
                user.getProfilePicture()
        );
    }

    /**
     * Find user by email.
     * Used internally and by other services.
     */
    @Override
    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    /**
     * Load user by username (email) for Spring Security.
     * This is called by Spring Security during authentication.
     *
     * Required by UserDetailsService interface.
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // findByEmail() returns our User entity, which implements UserDetails
        // Spring Security uses this to check password and account status
        return findByEmail(email);
    }

    /**
     * Update user profile information.
     * Only updates fields that are provided (non-null).
     */
    @Override
    public UpdateProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        // Find the user
        User user = findByEmail(email);

        // Update only non-null fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }
        if (request.getUniversity() != null) {
            user.setUniversity(request.getUniversity());
        }
        if (request.getMajor() != null) {
            user.setMajor(request.getMajor());
        }
        if (request.getYear() != null) {
            user.setYear(request.getYear());
        }
        if (request.getInstagramLink() != null) {
            user.setInstagramLink(request.getInstagramLink());
        }

        // Save updated user
        // JPA automatically updates the updatedAt field via @PreUpdate
        User updatedUser = userRepository.save(user);

        // Return response with updated user info
        return new UpdateProfileResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getName(),
                updatedUser.getBio(),
                updatedUser.getProfilePicture(),
                updatedUser.getUniversity(),
                updatedUser.getMajor(),
                updatedUser.getYear(),
                updatedUser.getInstagramLink()
        );
    }
}
