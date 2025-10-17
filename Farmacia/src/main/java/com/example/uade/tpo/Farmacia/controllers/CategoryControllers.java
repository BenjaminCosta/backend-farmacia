package com.example.uade.tpo.Farmacia.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.uade.tpo.Farmacia.controllers.dto.CategoryRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CategoryResponse;
import com.example.uade.tpo.Farmacia.service.CategoryService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/categories")
@Slf4j
public class CategoryControllers {

    private final CategoryService categoryService;

    public CategoryControllers(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll(){
        try {
            log.info("GET /categories - Fetching all categories");
            List<CategoryResponse> categories = categoryService.findAll();
            log.info("Found {} categories", categories.size());
            return ResponseEntity.ok(categories);
        } catch (Exception ex) {
            log.error("Error fetching categories: {}", ex.getMessage(), ex);
            throw ex;
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<CategoryResponse> getById(@PathVariable Long id) {
        try {
            log.info("GET /categories/{}", id);
            CategoryResponse category = categoryService.findById(id);
            return ResponseEntity.ok(category);
        } catch (Exception ex) {
            log.error("Error getting category {}: {}", id, ex.getMessage());
            throw ex;
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequest request) {
        try {
            log.info("POST /categories - Creating category: {}", request.getName());
            CategoryResponse created = categoryService.create(request);
            log.info("Category created with ID: {}", created.id());
            return ResponseEntity.ok(created);
        } catch (Exception ex) {
            log.error("Error creating category: {}", ex.getMessage());
            throw ex;
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id, @RequestBody CategoryRequest request) {
        try {
            log.info("PUT /categories/{} - Updating category", id);
            CategoryResponse updated = categoryService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception ex) {
            log.error("Error updating category {}: {}", id, ex.getMessage());
            throw ex;
        }
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        try {
            log.info("DELETE /categories/{}", id);
            categoryService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex) {
            log.error("Error deleting category {}: {}", id, ex.getMessage());
            throw ex;
        }
    }
}