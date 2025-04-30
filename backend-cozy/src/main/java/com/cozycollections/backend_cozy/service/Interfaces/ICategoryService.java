package com.cozycollections.backend_cozy.service.Interfaces;

import com.cozycollections.backend_cozy.model.Category;

import java.util.List;

public interface ICategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category getCategoryByName(String name);
    void deleteCategory(Long id);
    Category addCategory(Category category);
    Category updateCategory(Category category,Long id);


}
