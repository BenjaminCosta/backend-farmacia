package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.CategoryRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CategoryResponse;
import com.example.uade.tpo.Farmacia.entity.Category;
import com.example.uade.tpo.Farmacia.exception.ConflictException;
import com.example.uade.tpo.Farmacia.repository.CategoryRepository;
import com.example.uade.tpo.Farmacia.repository.ProductRepository;

import com.example.uade.tpo.Farmacia.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class CategoryService {

    private final CategoryRepository repo;
    private final ProductRepository products;

    public List<CategoryResponse> findAll() {
        log.debug("Fetching all categories");
        
        try {
            List<CategoryResponse> categories = repo.findAll().stream()
                .map(this::toResponse)
                .toList();
            
            log.info("Found {} categories", categories.size());
            return categories;
            
        } catch (Exception ex) {
            log.error("Error fetching categories: {}", ex.getMessage(), ex);
            throw new RuntimeException("Error al obtener las categorías: " + ex.getMessage(), ex);
        }
    }

    public CategoryResponse findById(Long id) {
        log.debug("Fetching category with ID: {}", id);
        
        Category c = repo.findById(id)
                .orElseThrow(() -> {
                    log.warn("Category not found with ID: {}", id);
                    return new NotFoundException("Categoría no encontrada con ID: " + id);
                });
        
        return toResponse(c);
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        log.info("Creating new category: {}", req.getName());
        
        try {
            String trimmedName = req.getName().trim();
            
            if (trimmedName.isBlank()) {
                throw new IllegalArgumentException("El nombre de la categoría es obligatorio");
            }
            
            // Usar existsByNameIgnoreCase para validar duplicados case-insensitive
            if (repo.existsByNameIgnoreCase(trimmedName)) {
                log.warn("Category already exists with name: {}", trimmedName);
                throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + trimmedName);
            }
            
            Category c = new Category();
            c.setName(trimmedName);
            c.setDescription(req.getDescription());
            
            Category saved = repo.save(c);
            log.info("Category created successfully with ID: {}", saved.getId());
            
            return toResponse(saved);
            
        } catch (IllegalArgumentException ex) {
            log.error("Validation error creating category: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error creating category: {}", ex.getMessage(), ex);
            throw new RuntimeException("Error al crear la categoría: " + ex.getMessage(), ex);
        }
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        log.info("Updating category with ID: {}", id);
        
        try {
            Category c = repo.findById(id)
                    .orElseThrow(() -> {
                        log.warn("Category not found with ID: {}", id);
                        return new NotFoundException("Categoría no encontrada con ID: " + id);
                    });

            String newName = req.getName().trim();
            
            if (newName.isBlank()) {
                throw new IllegalArgumentException("El nombre de la categoría es obligatorio");
            }
            
            // Usar existsByNameIgnoreCaseAndIdNot para validar duplicados excluyendo el ID actual
            if (repo.existsByNameIgnoreCaseAndIdNot(newName, id)) {
                log.warn("Category already exists with name: {}", newName);
                throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + newName);
            }

            c.setName(newName);
            c.setDescription(req.getDescription());
            
            Category updated = repo.save(c);
            log.info("Category updated successfully: {}", updated.getId());
            
            return toResponse(updated);
            
        } catch (IllegalArgumentException | NotFoundException ex) {
            log.error("Validation error updating category {}: {}", id, ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Unexpected error updating category {}: {}", id, ex.getMessage(), ex);
            throw new RuntimeException("Error al actualizar la categoría: " + ex.getMessage(), ex);
        }
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting category with ID: {}", id);
        
        try {
            if (!repo.existsById(id)) {
                log.warn("Cannot delete - category not found with ID: {}", id);
                throw new NotFoundException("Categoría no encontrada con ID: " + id);
            }
            
            // Validar que la categoría no tenga productos asociados
            boolean hasProducts = products.existsByCategoryId(id);
            if (hasProducts) {
                log.warn("Cannot delete category {} - has associated products", id);
                throw new ConflictException("No se puede eliminar la categoría: tiene productos asociados");
            }
            
            repo.deleteById(id);
            log.info("Category deleted successfully: {}", id);
            
        } catch (NotFoundException | ConflictException ex) {
            throw ex;
        } catch (DataIntegrityViolationException ex) {
            log.error("Data integrity violation deleting category {}: {}", id, ex.getMessage());
            throw new ConflictException("No se puede eliminar la categoría: tiene productos asociados");
        } catch (Exception ex) {
            log.error("Error deleting category {}: {}", id, ex.getMessage(), ex);
            throw new RuntimeException("Error al eliminar la categoría: " + ex.getMessage(), ex);
        }
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription());
    }
}