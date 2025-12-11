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
    private String year;
    private String instagramLink;
    private String bio;
    private String profilePicture;

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

    // Constructor with all fields
    public AuthResponse(String token, Long userId, String email, String name, String university, String major,
                       String year, String instagramLink, String bio, String profilePicture) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.university = university;
        this.major = major;
        this.year = year;
        this.instagramLink = instagramLink;
        this.bio = bio;
        this.profilePicture = profilePicture;
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

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getInstagramLink() {
        return instagramLink;
    }

    public void setInstagramLink(String instagramLink) {
        this.instagramLink = instagramLink;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
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
                ", year='" + year + '\'' +
                ", instagramLink='" + instagramLink + '\'' +
                '}';
        // Note: Don't include token, bio, or profilePicture in toString() for security/brevity
    }
}
