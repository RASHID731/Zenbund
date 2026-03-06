package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.ToggleLikeRequest;
import com.zenbund.backend.dto.response.LikeToggleResponse;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.service.LikeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for like operations.
 * Handles toggling likes on comments and checking like status.
 */
@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "*")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    /**
     * Toggle a like on a comment.
     * If the user has already liked the comment, the like is removed.
     * If not, a like is added.
     *
     * Endpoint: POST /api/likes/toggle
     * Request Body: { "commentId": 123 }
     * Response: LikeToggleResponse { liked, commentLikes }
     * Status: 200 OK
     */
    @PostMapping("/toggle")
    public ResponseEntity<LikeToggleResponse> toggleLike(
            @Valid @RequestBody ToggleLikeRequest request,
            @AuthenticationPrincipal User user) {
        LikeToggleResponse response = likeService.toggleLike(user.getId(), request.getCommentId());
        return ResponseEntity.ok(response);
    }

    /**
     * Check if the authenticated user has liked a specific comment.
     *
     * Endpoint: GET /api/likes/check?commentId=123
     * Response: { "liked": true/false }
     * Status: 200 OK
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkLike(
            @RequestParam Long commentId,
            @AuthenticationPrincipal User user) {
        boolean liked = likeService.hasLiked(user.getId(), commentId);
        return ResponseEntity.ok(Map.of("liked", liked));
    }
}
