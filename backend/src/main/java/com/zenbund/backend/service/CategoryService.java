package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateCategoryRequest;
import com.zenbund.backend.dto.request.UpdateCategoryRequest;
import com.zenbund.backend.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    /**
     * Create a new category.
     * Validates that the category name is unique.
     *
     * @param request the category creation request
     * @return the created category response
     * @throws com.zenbund.backend.exception.DuplicateCategoryException if category with same name already exists
     */
    CategoryResponse createCategory(CreateCategoryRequest request);

    /**
     * Get all categories.
     *
     * @return list of all category responses
     */
    List<CategoryResponse> getAllCategories();

    /**
     * Get a category by ID.
     *
     * @param id the category ID
     * @return the category response
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if category not found
     */
    CategoryResponse getCategoryById(Long id);

    /**
     * Update an existing category.
     * Validates that the new name is unique (if name is being updated).
     *
     * @param id the category ID
     * @param request the category update request
     * @return the updated category response
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if category not found
     * @throws com.zenbund.backend.exception.DuplicateCategoryException if new name conflicts with existing category
     */
    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);

    /**
     * Delete a category by ID.
     * Allows deletion even if category has associated offers.
     *
     * @param id the category ID
     * @throws com.zenbund.backend.exception.ResourceNotFoundException if category not found
     */
    void deleteCategory(Long id);
}
