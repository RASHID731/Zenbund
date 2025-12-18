package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotNull;

public class CreateChatRequest {

    @NotNull(message = "Other user ID is required")
    private Long otherUserId;

    // Constructors
    public CreateChatRequest() {
    }

    public CreateChatRequest(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    // Getters and Setters
    public Long getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }
}
