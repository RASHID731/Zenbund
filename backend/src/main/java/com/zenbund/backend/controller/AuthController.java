package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.LoginRequest;
import com.zenbund.backend.dto.request.RegisterRequest;
import com.zenbund.backend.dto.response.AuthResponse;
import com.zenbund.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
     * Request Body: RegisterRequest (email, password, name, university, major, year?)
     * Response: AuthResponse with JWT token and user info
     * Status: 201 CREATED on success
     *
     * Example request:
     * {
     *   "email": "student@uni-rostock.de",
     *   "password": "SecurePass123",
     *   "name": "Alex Johnson",
     *   "university": "University of Rostock",
     *   "major": "Computer Science",
     *   "year": "3rd Year"
     * }
     *
     * Example response:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "type": "Bearer",
     *   "userId": 1,
     *   "email": "student@uni-rostock.de",
     *   "name": "Alex Johnson",
     *   "university": "University of Rostock",
     *   "major": "Computer Science"
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
     *   "university": "University of Rostock",
     *   "major": "Computer Science"
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
}
