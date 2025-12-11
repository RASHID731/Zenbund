package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for updating user profile.
 * All fields are optional since users can update any subset of their profile.
 */
public class UpdateProfileRequest {

    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    @Size(max = 255, message = "Profile picture URL must not exceed 255 characters")
    private String profilePicture;

    @Size(max = 100, message = "University name must not exceed 100 characters")
    private String university;

    @Size(max = 100, message = "Major must not exceed 100 characters")
    private String major;

    @Size(max = 20, message = "Year must not exceed 20 characters")
    private String year;

    @Size(max = 255, message = "Instagram link must not exceed 255 characters")
    private String instagramLink;

    // No-argument constructor
    public UpdateProfileRequest() {
    }

    // Getters and Setters
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
        return "UpdateProfileRequest{" +
                "name='" + name + '\'' +
                ", bio='" + bio + '\'' +
                ", university='" + university + '\'' +
                ", major='" + major + '\'' +
                ", year='" + year + '\'' +
                ", instagramLink='" + instagramLink + '\'' +
                '}';
    }
}
