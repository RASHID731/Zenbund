package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateCommentRequest;
import com.zenbund.backend.dto.request.UpdateCommentRequest;
import com.zenbund.backend.dto.response.CommentResponse;

import java.util.List;

public interface CommentService {

    /**
     * Create a new comment
     * @param request Comment creation request
     * @param userId The authenticated user's ID (from JWT token)
     * @return Created comment response
     */
    CommentResponse createComment(CreateCommentRequest request, Long userId);

    /**
     * Get all comments for a thread with nested replies
     * @param threadId The thread ID
     * @return List of parent comments with nested replies
     */
    List<CommentResponse> getCommentsByThreadId(Long threadId);

    /**
     * Get a single comment by ID
     * @param id Comment ID
     * @return Comment response
     */
    CommentResponse getCommentById(Long id);

    /**
     * Update a comment (only text can be updated)
     * @param id Comment ID
     * @param request Update request
     * @param userId The authenticated user's ID (for ownership verification)
     * @return Updated comment response
     */
    CommentResponse updateComment(Long id, UpdateCommentRequest request, Long userId);

    /**
     * Delete a comment and all its replies
     * @param id Comment ID
     * @param userId The authenticated user's ID (for ownership verification)
     */
    void deleteComment(Long id, Long userId);
}
