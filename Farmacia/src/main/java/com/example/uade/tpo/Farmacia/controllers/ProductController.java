package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.entity.Product;
import com.example.uade.tpo.Farmacia.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
  private final ProductService service;

  @GetMapping
  public List<Product> list(@RequestParam(required = false) Long categoryId,
                            @RequestParam(required = false) String q,
                            @RequestParam(required = false) Boolean inStock) {
    return service.list(categoryId, q, inStock);
  }

  @GetMapping("/{id}")
  public Product get(@PathVariable Long id) { return service.get(id); }

  @PostMapping
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<Product> create(@RequestBody Product p) {
    Product saved = service.create(p);
    return ResponseEntity.created(URI.create("/products/" + saved.getId())).body(saved);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public Product update(@PathVariable Long id, @RequestBody Product p) {
    return service.update(id, p);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) { service.delete(id); }
}
