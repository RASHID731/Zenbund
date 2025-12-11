package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.UpdateProfileRequest;
import com.zenbund.backend.dto.response.UpdateProfileResponse;
import com.zenbund.backend.service.ImageUploadService;
import com.zenbund.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for user profile management.
 * Handles profile updates and profile picture uploads.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final ImageUploadService imageUploadService;

    public UserController(UserService userService, ImageUploadService imageUploadService) {
        this.userService = userService;
        this.imageUploadService = imageUploadService;
    }

    /**
     * Update user profile information.
     * PUT /api/users/profile
     *
     * Accepts JSON body with optional fields:
     * - name: user's display name
     * - bio: user biography
     * - profilePicture: URL to profile picture
     * - university: university name
     * - major: field of study
     * - year: year of study
     * - instagramLink: Instagram profile link
     *
     * Requires authentication (JWT token in Authorization header).
     */
    @PutMapping("/profile")
    public ResponseEntity<UpdateProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        // Get authenticated user's email from Spring Security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        // Update profile
        UpdateProfileResponse response = userService.updateProfile(userEmail, request);

        return ResponseEntity.ok(response);
    }

    /**
     * Upload profile picture to Cloudinary.
     * POST /api/users/profile-picture
     *
     * Accepts multipart/form-data with:
     * - image: profile picture file (JPG, PNG) - max 5MB
     *
     * Returns the Cloudinary URL of the uploaded image.
     * Note: This only uploads the image, does not update the user's profilePicture field.
     * To update the profile picture field, call PUT /api/users/profile with the returned URL.
     *
     * Requires authentication (JWT token in Authorization header).
     */
    @PostMapping(value = "/profile-picture", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @RequestParam("image") MultipartFile image) {
        // Upload image to Cloudinary
        String imageUrl = imageUploadService.uploadProfilePicture(image);

        // Return the URL in a JSON response
        Map<String, String> response = new HashMap<>();
        response.put("url", imageUrl);
        response.put("message", "Profile picture uploaded successfully");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
