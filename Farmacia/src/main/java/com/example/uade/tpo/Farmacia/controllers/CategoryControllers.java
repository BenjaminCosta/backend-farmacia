package com.example.uade.tpo.Farmacia.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.uade.tpo.Farmacia.controllers.dto.CategoryRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CategoryResponse;
import com.example.uade.tpo.Farmacia.service.CategoryService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("categories")
public class CategoryControllers {

    private final CategoryService categoryService;

    public CategoryControllers(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> getAll(){
        return categoryService.findAll();
    }

    @GetMapping("{id}")
    public CategoryResponse getById(@PathVariable Long id) {
        return categoryService.findById(id);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
    public CategoryResponse create(@RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
    public CategoryResponse update(@PathVariable Long id, @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
    public void delete(@PathVariable Long id){
        categoryService.delete(id);
    }
}