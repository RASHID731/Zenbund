package com.zenbund.backend.service;

import com.zenbund.backend.dto.request.CreateCategoryRequest;
import com.zenbund.backend.dto.request.UpdateCategoryRequest;
import com.zenbund.backend.dto.response.CategoryResponse;
import com.zenbund.backend.entity.Category;
import com.zenbund.backend.exception.DuplicateCategoryException;
import com.zenbund.backend.exception.ResourceNotFoundException;
import com.zenbund.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@SuppressWarnings("null")
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        // Check if category with same name already exists
        Optional<Category> existingCategory = categoryRepository.findByName(request.getName());
        if (existingCategory.isPresent()) {
            throw new DuplicateCategoryException("Category with name '" + request.getName() + "' already exists");
        }

        // Create and save new category
        Category category = new Category(request.getName(), request.getEmoji());
        Category savedCategory = categoryRepository.save(category);

        return CategoryResponse.fromEntity(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        return CategoryResponse.fromEntity(category);
    }

    @Override
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        // Find existing category
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Update name if provided
        if (request.getName() != null && !request.getName().isBlank()) {
            // Check if the new name conflicts with another category
            Optional<Category> existingCategory = categoryRepository.findByName(request.getName());
            if (existingCategory.isPresent() && !existingCategory.get().getId().equals(id)) {
                throw new DuplicateCategoryException("Category with name '" + request.getName() + "' already exists");
            }
            category.setName(request.getName());
        }

        // Update emoji if provided
        if (request.getEmoji() != null && !request.getEmoji().isBlank()) {
            category.setEmoji(request.getEmoji());
        }

        // Save updated category
        Category updatedCategory = categoryRepository.save(category);

        return CategoryResponse.fromEntity(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        // Check if category exists
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        // Delete the category (allows deletion even if it has associated offers)
        categoryRepository.delete(category);
    }
}
