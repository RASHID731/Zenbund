package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateCommentRequest {

    @NotBlank(message = "Comment text is required")
    private String text;

    // No-argument constructor
    public UpdateCommentRequest() {
    }

    // Constructor
    public UpdateCommentRequest(String text) {
        this.text = text;
    }

    // Getters and Setters
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
