package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateMessageRequest {

    @NotBlank(message = "Message text is required")
    private String text;

    // Constructors
    public UpdateMessageRequest() {
    }

    public UpdateMessageRequest(String text) {
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
