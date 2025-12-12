package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.DeleteAccountRequest;
import com.zenbund.backend.dto.request.LoginRequest;
import com.zenbund.backend.dto.request.RegisterRequest;
import com.zenbund.backend.dto.response.AuthResponse;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for authentication endpoints.
 * Handles user registration and login.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")  // Allow all origins for development
public class AuthController {

    private final UserService userService;

    /**
     * Constructor injection of UserService.
     */
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Register a new user account.
     *
     * Endpoint: POST /api/auth/register
     * Request Body: RegisterRequest (email, password, name)
     * Response: AuthResponse with JWT token and user info
     * Status: 201 CREATED on success
     *
     * Note: University, major, year, and other profile fields can be set later
     * through the PUT /api/users/profile endpoint.
     *
     * Example request:
     * {
     *   "email": "student@uni-rostock.de",
     *   "password": "SecurePass123",
     *   "name": "Alex Johnson"
     * }
     *
     * Example response:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "type": "Bearer",
     *   "userId": 1,
     *   "email": "student@uni-rostock.de",
     *   "name": "Alex Johnson",
     *   "university": null,
     *   "major": null,
     *   "year": null,
     *   "bio": null,
     *   "profilePicture": null,
     *   "instagramLink": null
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // @Valid triggers validation annotations in RegisterRequest
        // If validation fails, Spring returns 400 BAD REQUEST automatically
        AuthResponse response = userService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Login with existing account.
     *
     * Endpoint: POST /api/auth/login
     * Request Body: LoginRequest (email, password)
     * Response: AuthResponse with JWT token and user info
     * Status: 200 OK on success
     *
     * Example request:
     * {
     *   "email": "student@uni-rostock.de",
     *   "password": "SecurePass123"
     * }
     *
     * Example response:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "type": "Bearer",
     *   "userId": 1,
     *   "email": "student@uni-rostock.de",
     *   "name": "Alex Johnson",
     *   "university": null,
     *   "major": null,
     *   "year": null,
     *   "bio": null,
     *   "profilePicture": null,
     *   "instagramLink": null
     * }
     *
     * Error responses:
     * - 401 UNAUTHORIZED: Invalid email or password
     * - 403 FORBIDDEN: Account not verified
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete user account permanently.
     *
     * Endpoint: DELETE /api/auth/account
     * Request Body: DeleteAccountRequest (password for confirmation)
     * Response: Success message
     * Status: 200 OK on success
     *
     * Requires authentication (JWT token in Authorization header).
     * User can only delete their own account.
     *
     * This will:
     * - Verify password is correct
     * - Delete all user's offers/listings
     * - Anonymize all user's comments (preserve conversations)
     * - Delete all thread memberships
     * - Permanently delete the user account
     *
     * Example request:
     * {
     *   "password": "UserPassword123"
     * }
     *
     * Example response:
     * {
     *   "message": "Account deleted successfully"
     * }
     *
     * Error responses:
     * - 401 UNAUTHORIZED: Invalid or missing JWT token
     * - 400 BAD REQUEST: Password is required
     * - 403 FORBIDDEN: Incorrect password
     */
    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DeleteAccountRequest request) {
        // User is automatically extracted from JWT by Spring Security
        userService.deleteAccount(user.getId(), request.getPassword());
        return ResponseEntity.ok().body(java.util.Map.of("message", "Account deleted successfully"));
    }
}
