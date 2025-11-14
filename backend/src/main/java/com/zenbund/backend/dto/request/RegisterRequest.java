package com.zenbund.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for user registration.
 * Contains all required fields to create a new user account.
 */
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "University is required")
    @Size(max = 100, message = "University must not exceed 100 characters")
    private String university;

    @NotBlank(message = "Major is required")
    @Size(max = 100, message = "Major must not exceed 100 characters")
    private String major;

    @Size(max = 20, message = "Year must not exceed 20 characters")
    private String year;

    // No-argument constructor
    public RegisterRequest() {
    }

    // Constructor with all required fields
    public RegisterRequest(String email, String password, String name, String university, String major) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.university = university;
        this.major = major;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    @Override
    public String toString() {
        return "RegisterRequest{" +
                "email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", university='" + university + '\'' +
                ", major='" + major + '\'' +
                ", year='" + year + '\'' +
                '}';
        // Note: Don't include password in toString() for security
    }
}
