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
            String url = uploadToCloudinary(file);
            imageUrls.add(url);
        }

        return imageUrls;
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
     * Upload file to Cloudinary
     */
    @SuppressWarnings("unchecked")
    private String uploadToCloudinary(MultipartFile file) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "zenbund/offers",
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
