package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class SendMessageRequest {

    @NotBlank(message = "Message text is required")
    private String text;

    // Constructors
    public SendMessageRequest() {
    }

    public SendMessageRequest(String text) {
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
