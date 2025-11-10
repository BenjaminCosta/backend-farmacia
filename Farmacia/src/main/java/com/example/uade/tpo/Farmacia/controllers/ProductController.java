package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.controllers.dto.CreateProductRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.ProductDTO;
import com.example.uade.tpo.Farmacia.entity.Product;
import com.example.uade.tpo.Farmacia.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {
  private final ProductService service;

  @GetMapping
  public ResponseEntity<List<ProductDTO>> list(@RequestParam(required = false) Long categoryId,
                                                @RequestParam(required = false) String q,
                                                @RequestParam(required = false) Boolean inStock) {
    try {
      log.info("GET /products - categoryId: {}, q: '{}', inStock: {}", categoryId, q, inStock);
      List<Product> products = service.list(categoryId, q, inStock);
      
      // Mapear a DTOs
      List<ProductDTO> productDTOs = products.stream()
          .map(this::toProductDTO)
          .collect(Collectors.toList());
      
      log.info("Found {} products", productDTOs.size());
      return ResponseEntity.ok(productDTOs);
    } catch (Exception ex) {
      log.error("Error listing products: {}", ex.getMessage(), ex);
      throw ex;
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductDTO> get(@PathVariable Long id) {
    try {
      log.info("GET /products/{}", id);
      Product product = service.get(id);
      ProductDTO dto = toProductDTO(product);
      log.info("Returning product DTO - name: {}, price: {}, stock: {}", 
               dto.name(), dto.price(), dto.stock());
      return ResponseEntity.ok(dto);
    } catch (Exception ex) {
      log.error("Error getting product {}: {}", id, ex.getMessage());
      throw ex;
    }
  }

  @PostMapping
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<ProductDTO> create(@RequestBody CreateProductRequest request) {
    try {
      log.info("POST /products - Creating product: {}", request.getNombre());
      log.debug("Request details - precio: {}, stock: {}, categoryId: {}", 
                request.getPrecio(), request.getStock(), 
                request.getCategory() != null ? request.getCategory().getId() : null);
      
      Product saved = service.createFromRequest(request);
      ProductDTO dto = toProductDTO(saved);
      
      log.info("✅ Product created with ID: {}", saved.getId());
      
      // Retornar 201 Created con Location header y body ProductDTO
      return ResponseEntity
          .created(URI.create("/api/v1/products/" + saved.getId()))
          .body(dto);
    } catch (Exception ex) {
      log.error("❌ Error creating product: {}", ex.getMessage());
      throw ex;
    }
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('PHARMACIST') or hasRole('ADMIN')")
  public ResponseEntity<ProductDTO> update(@PathVariable Long id, @RequestBody Product p) {
    try {
      log.info("PUT /products/{} - Updating product", id);
      Product updated = service.update(id, p);
      ProductDTO dto = toProductDTO(updated);
      
      // Retornar 200 OK con ProductDTO actualizado
      return ResponseEntity.ok(dto);
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
      
      // Retornar 204 No Content si elimina exitosamente
      return ResponseEntity.noContent().build();
    } catch (Exception ex) {
      log.error("Error deleting product {}: {}", id, ex.getMessage());
      throw ex; // GlobalExceptionHandler manejará ConflictException como 409
    }
  }
  
  // ================= Helper Methods =================
  
  private ProductDTO toProductDTO(Product product) {
    return new ProductDTO(
        product.getId(),
        product.getNombre(), // name
        product.getDescripcion(), // description
        product.getPrecio() != null ? product.getPrecio().doubleValue() : 0.0, // price
        product.getStock(), // stock
        product.getDescuento() != null ? product.getDescuento().doubleValue() : 0.0, // discount
        product.getCategory() != null ? product.getCategory().getId() : null, // categoryId
        product.getCategory() != null ? product.getCategory().getName() : null // categoryName
    );
  }
}
