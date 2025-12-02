package com.zenbund.backend.controller;

import com.zenbund.backend.dto.request.CreateCommentRequest;
import com.zenbund.backend.dto.request.UpdateCommentRequest;
import com.zenbund.backend.dto.response.CommentResponse;
import com.zenbund.backend.entity.User;
import com.zenbund.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for comment operations.
 * Handles CRUD operations for comments within threads.
 */
@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * Create a new comment or reply
     *
     * Endpoint: POST /api/comments
     * Request Body: CreateCommentRequest (threadId, text, parentCommentId?)
     * Response: CommentResponse
     * Status: 201 CREATED on success
     *
     * Note: userId is extracted from JWT token (authenticated user)
     *       isAnonymous is fetched from ThreadMember.postAnonymously
     */
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal User user) {
        CommentResponse response = commentService.createComment(request, user.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all comments for a thread (with nested replies)
     *
     * Endpoint: GET /api/comments?threadId={id}
     * Response: List of parent comments with nested replies
     * Status: 200 OK
     *
     * Note: Parent comments are ordered newest first
     *       Replies are ordered oldest first
     */
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsByThread(
            @RequestParam Long threadId) {
        List<CommentResponse> comments = commentService.getCommentsByThreadId(threadId);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get a single comment by ID
     *
     * Endpoint: GET /api/comments/{id}
     * Response: CommentResponse (includes replies if parent comment)
     * Status: 200 OK
     */
    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable Long id) {
        CommentResponse response = commentService.getCommentById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update a comment (only text can be updated)
     *
     * Endpoint: PUT /api/comments/{id}
     * Request Body: UpdateCommentRequest (text)
     * Response: CommentResponse
     * Status: 200 OK
     *
     * Note: Only the comment owner can update
     *       isAnonymous, likes, etc. cannot be changed
     */
    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommentRequest request,
            @AuthenticationPrincipal User user) {
        CommentResponse response = commentService.updateComment(id, request, user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a comment (and all its replies if parent comment)
     *
     * Endpoint: DELETE /api/comments/{id}
     * Status: 204 NO CONTENT
     *
     * Note: Only the comment owner can delete
     *       Deleting a parent comment also deletes all replies
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        commentService.deleteComment(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
