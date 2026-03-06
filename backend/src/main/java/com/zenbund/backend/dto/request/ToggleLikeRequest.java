package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotNull;

public class ToggleLikeRequest {

    @NotNull(message = "Comment ID is required")
    private Long commentId;

    public ToggleLikeRequest() {
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }
}
