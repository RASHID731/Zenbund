package com.zenbund.backend.repository;

import com.zenbund.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Find a category by its name.
     * Used for checking uniqueness before creating or updating categories.
     *
     * @param name the category name
     * @return an Optional containing the category if found
     */
    Optional<Category> findByName(String name);
}
