package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.CategoryRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CategoryResponse;
import com.example.uade.tpo.Farmacia.entity.Category;
import com.example.uade.tpo.Farmacia.repository.CategoryRepository;

import exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoryService {

    private final CategoryRepository repo;

    public List<CategoryResponse> findAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public CategoryResponse findById(Long id) {
        Category c = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoría no encontrada"));
        return toResponse(c);
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        if (repo.existsByName(req.getName().trim())) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }
        Category c = Category.builder()
                .name(req.getName().trim())
                .description(req.getDescription())
                .build();
        return toResponse(repo.save(c));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category c = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoría no encontrada"));

        String newName = req.getName().trim();
        if (!c.getName().equalsIgnoreCase(newName) && repo.existsByName(newName)) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }

        c.setName(newName);
        c.setDescription(req.getDescription());
        return toResponse(repo.save(c));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Categoría no encontrada");
        }
        repo.deleteById(id);
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription());
    }
}
