package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.entity.Product;
import com.example.uade.tpo.Farmacia.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {
  private final ProductService service;

  @GetMapping
  public ResponseEntity<List<Product>> list(@RequestParam(required = false) Long categoryId,
                                             @RequestParam(required = false) String q,
                                             @RequestParam(required = false) Boolean inStock) {
    try {
      log.info("GET /products - categoryId: {}, q: '{}', inStock: {}", categoryId, q, inStock);
      List<Product> products = service.list(categoryId, q, inStock);
      log.info("Found {} products", products.size());
      return ResponseEntity.ok(products);
    } catch (Exception ex) {
      log.error("Error listing products: {}", ex.getMessage(), ex);
      throw ex;
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<Product> get(@PathVariable Long id) {
    try {
      log.info("GET /products/{}", id);
      Product product = service.get(id);
      return ResponseEntity.ok(product);
    } catch (Exception ex) {
      log.error("Error getting product {}: {}", id, ex.getMessage());
      throw ex;
    }
  }

  @PostMapping
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<Product> create(@RequestBody Product p) {
    try {
      log.info("POST /products - Creating product: {}", p.getNombre());
      Product saved = service.create(p);
      log.info("Product created with ID: {}", saved.getId());
      return ResponseEntity.created(URI.create("/products/" + saved.getId())).body(saved);
    } catch (Exception ex) {
      log.error("Error creating product: {}", ex.getMessage());
      throw ex;
    }
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product p) {
    try {
      log.info("PUT /products/{} - Updating product", id);
      Product updated = service.update(id, p);
      return ResponseEntity.ok(updated);
    } catch (Exception ex) {
      log.error("Error updating product {}: {}", id, ex.getMessage());
      throw ex;
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    try {
      log.info("DELETE /products/{}", id);
      service.delete(id);
      return ResponseEntity.noContent().build();
    } catch (Exception ex) {
      log.error("Error deleting product {}: {}", id, ex.getMessage());
      throw ex;
    }
  }
}
