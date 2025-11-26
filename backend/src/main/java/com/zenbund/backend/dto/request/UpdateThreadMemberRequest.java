package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for updating thread member settings.
 * Currently only supports updating the anonymous posting preference.
 */
public class UpdateThreadMemberRequest {

    @NotNull(message = "Post anonymously setting is required")
    private Boolean postAnonymously;

    // No-argument constructor
    public UpdateThreadMemberRequest() {
    }

    // Constructor with all fields
    public UpdateThreadMemberRequest(Boolean postAnonymously) {
        this.postAnonymously = postAnonymously;
    }

    // Getters and Setters
    public Boolean getPostAnonymously() {
        return postAnonymously;
    }

    public void setPostAnonymously(Boolean postAnonymously) {
        this.postAnonymously = postAnonymously;
    }

    @Override
    public String toString() {
        return "UpdateThreadMemberRequest{" +
                "postAnonymously=" + postAnonymously +
                '}';
    }
}
