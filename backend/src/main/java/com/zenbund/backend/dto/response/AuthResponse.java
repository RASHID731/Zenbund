package com.zenbund.backend.dto.response;

/**
 * Data Transfer Object for authentication response.
 * Sent to the frontend after successful login or registration.
 * Contains JWT token and basic user information.
 */
public class AuthResponse {

    private String token;
    private String type = "Bearer";  // Token type (always "Bearer" for JWT)
    private Long userId;
    private String email;
    private String name;
    private String university;
    private String major;

    // No-argument constructor
    public AuthResponse() {
    }

    // Constructor with essential fields
    public AuthResponse(String token, Long userId, String email, String name, String university, String major) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.university = university;
        this.major = major;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    @Override
    public String toString() {
        return "AuthResponse{" +
                "type='" + type + '\'' +
                ", userId=" + userId +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", university='" + university + '\'' +
                ", major='" + major + '\'' +
                '}';
        // Note: Don't include token in toString() for security (logs)
    }
}
