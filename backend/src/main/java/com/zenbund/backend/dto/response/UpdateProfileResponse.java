package com.zenbund.backend.dto.response;

/**
 * Data Transfer Object for profile update response.
 * Returns updated user profile information without authentication token.
 */
public class UpdateProfileResponse {

    private Long userId;
    private String email;
    private String name;
    private String bio;
    private String profilePicture;
    private String university;
    private String major;
    private String year;
    private String instagramLink;

    // No-argument constructor
    public UpdateProfileResponse() {
    }

    // Constructor with all fields
    public UpdateProfileResponse(Long userId, String email, String name, String bio, String profilePicture,
                                String university, String major, String year, String instagramLink) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.university = university;
        this.major = major;
        this.year = year;
        this.instagramLink = instagramLink;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "UpdateProfileResponse{" +
                "userId=" + userId +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", university='" + university + '\'' +
                ", major='" + major + '\'' +
                ", year='" + year + '\'' +
                ", instagramLink='" + instagramLink + '\'' +
                '}';
    }
}
