package com.zenbund.backend.service;

import com.zenbund.backend.dto.response.LikeToggleResponse;

public interface LikeService {

    /**
     * Toggle a like on a comment for the given user.
     * If the user has already liked the comment, the like is removed.
     * If the user has not liked the comment, a like is added.
     *
     * @param userId    the user performing the action
     * @param commentId the comment to like/unlike
     * @return the updated like state and comment like count
     */
    LikeToggleResponse toggleLike(Long userId, Long commentId);

    /**
     * Check if a user has liked a specific comment.
     *
     * @param userId    the user to check
     * @param commentId the comment to check
     * @return true if the user has liked the comment, false otherwise
     */
    boolean hasLiked(Long userId, Long commentId);
}
