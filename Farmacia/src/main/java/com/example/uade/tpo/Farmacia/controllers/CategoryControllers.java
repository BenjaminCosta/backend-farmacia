package com.example.uade.tpo.Farmacia.controllers;

import java.util.List;
import java.util.Locale.Category;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.Farmacia.service.CategoryService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("categories")
public class CategoryControllers {

    private final CategoryService categoryService;

    public CategoryControllers(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @GetMapping("path")
    public List<Category> getAll(){
        return  categoryService.findAll();
    }

    @GetMapping("{id}")
    public Category getById(@PathVariable Long id) {
        return categoryService.findById(id);
    }
    
    @PutMapping("/{id}")
    public Category create (@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        return categoryService.save(category);
    }

    @DeleteMapping ("{id}")
    public void delete(@PathVariable Long id){
        categoryService.delete(id);
    }

}