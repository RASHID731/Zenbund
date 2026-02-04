package com.zenbund.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.zenbund.backend.exception.InvalidFileException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class ImageUploadService {

    private final Cloudinary cloudinary;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    private static final int MAX_FILES = 10;

    public ImageUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload multiple images to Cloudinary
     *
     * @param files array of image files
     * @return list of image URLs
     */
    public List<String> uploadImages(MultipartFile[] files) {
        // Validate number of files
        if (files == null || files.length == 0) {
            throw new InvalidFileException("No files provided");
        }

        if (files.length > MAX_FILES) {
            throw new InvalidFileException("Maximum " + MAX_FILES + " images allowed. You uploaded " + files.length);
        }

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            validateFile(file);
            String url = uploadToCloudinary(file, "zenbund/offers");
            imageUrls.add(url);
        }

        return imageUrls;
    }

    /**
     * Upload a single profile picture to Cloudinary
     *
     * @param file profile picture file
     * @return image URL
     */
    public String uploadProfilePicture(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("No file provided");
        }

        validateFile(file);
        return uploadToCloudinary(file, "zenbund/profile-pictures");
    }

    /**
     * Validate file type and size
     */
    private void validateFile(MultipartFile file) {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new InvalidFileException(
                    "Invalid file type: " + contentType + ". Only JPG, JPEG, and PNG are allowed"
            );
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException(
                    "File size exceeds maximum limit of 5MB. File size: " +
                    String.format("%.2f MB", file.getSize() / (1024.0 * 1024.0))
            );
        }
    }

    /**
     * Delete an image from Cloudinary using its URL
     *
     * @param imageUrl the secure URL of the image to delete
     */
    public void deleteImage(String imageUrl) {
        try {
            // Extract public_id from URL
            // Example URL: https://res.cloudinary.com/xxx/image/upload/v123/zenbund/offers/abc123.jpg
            String publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            // Log error but don't throw - we don't want deletion failures to block other operations
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }

    /**
     * Delete multiple images from Cloudinary
     *
     * @param imageUrls array of image URLs to delete
     */
    public void deleteImages(String[] imageUrls) {
        if (imageUrls == null || imageUrls.length == 0) {
            return;
        }
        for (String url : imageUrls) {
            deleteImage(url);
        }
    }

    /**
     * Extract public_id from Cloudinary URL
     * Example: https://res.cloudinary.com/xxx/image/upload/v123/zenbund/offers/abc123.jpg
     * Returns: zenbund/offers/abc123
     */
    private String extractPublicIdFromUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return null;
        }

        try {
            // Find the part after "/upload/"
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex == -1) {
                return null;
            }

            String afterUpload = imageUrl.substring(uploadIndex + 8); // 8 = length of "/upload/"

            // Remove version prefix (e.g., "v1234567890/")
            if (afterUpload.matches("^v\\d+/.*")) {
                afterUpload = afterUpload.substring(afterUpload.indexOf('/') + 1);
            }

            // Remove file extension
            int lastDotIndex = afterUpload.lastIndexOf('.');
            if (lastDotIndex != -1) {
                afterUpload = afterUpload.substring(0, lastDotIndex);
            }

            return afterUpload;
        } catch (Exception e) {
            System.err.println("Failed to extract public_id from URL: " + imageUrl);
            return null;
        }
    }

    /**
     * Upload file to Cloudinary
     *
     * @param file image file to upload
     * @param folder Cloudinary folder path
     * @return secure URL of uploaded image
     */
    @SuppressWarnings("unchecked")
    private String uploadToCloudinary(MultipartFile file, String folder) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image",
                            "quality", "auto",
                            "fetch_format", "auto"
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new InvalidFileException("Failed to upload image: " + e.getMessage());
        }
    }
}
