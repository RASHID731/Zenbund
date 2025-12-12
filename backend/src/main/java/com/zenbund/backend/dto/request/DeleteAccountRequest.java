package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for account deletion.
 * Contains password for confirmation before deleting the account.
 */
public class DeleteAccountRequest {

    @NotBlank(message = "Password is required to confirm account deletion")
    private String password;

    // No-argument constructor
    public DeleteAccountRequest() {
    }

    // Constructor with all fields
    public DeleteAccountRequest(String password) {
        this.password = password;
    }

    // Getters and Setters
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "DeleteAccountRequest{}";
        // Note: Don't include password in toString() for security
    }
}
