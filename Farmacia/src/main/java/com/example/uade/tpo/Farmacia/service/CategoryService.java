package com.example.uade.tpo.Farmacia.service;

import java.util.List;
import java.util.Locale.Category;

import org.springframework.stereotype.Service;

import com.example.uade.tpo.Farmacia.repository.CategoryRepository;

@Service
public class CategoryService {
     
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }
    
    public List<Category> findAll(){
        return categoryRepository.findAll();
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
