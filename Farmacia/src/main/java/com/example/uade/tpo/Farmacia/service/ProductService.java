package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.CreateProductRequest;
import com.example.uade.tpo.Farmacia.entity.Product;
import com.example.uade.tpo.Farmacia.entity.Category;
import com.example.uade.tpo.Farmacia.exception.ConflictException;
import com.example.uade.tpo.Farmacia.repository.ProductRepository;
import com.example.uade.tpo.Farmacia.repository.CategoryRepository;
import com.example.uade.tpo.Farmacia.repository.OrderItemRepository;
import com.example.uade.tpo.Farmacia.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
  private final ProductRepository repo;
  private final CategoryRepository categories;
  private final OrderItemRepository orderItems;

  public List<Product> list(Long categoryId, String q, Boolean inStock, Boolean rx) {
    log.debug("Listing products with filters - categoryId: {}, query: '{}', inStock: {}, rx: {}", 
              categoryId, q, inStock, rx);
    
    List<Product> base;
    
    try {
      if (categoryId != null) {
        log.debug("Filtering by category ID: {}", categoryId);
        base = repo.findByCategoryId(categoryId);
      } else if (q != null && !q.isBlank()) {
        log.debug("Searching by name: '{}'", q);
        base = repo.findByNombreContainingIgnoreCase(q);
      } else {
        log.debug("Fetching all products");
        base = repo.findAll();
      }

      if (Boolean.TRUE.equals(inStock)) {
        int originalSize = base.size();
        base = base.stream().filter(p -> p.getStock() != null && p.getStock() > 0).toList();
        log.debug("Filtered by stock: {} -> {} products", originalSize, base.size());
      }
      
      // Filtro por receta médica
      if (rx != null) {
        int originalSize = base.size();
        base = base.stream().filter(p -> rx.equals(p.getRequiresPrescription())).toList();
        log.debug("Filtered by requiresPrescription={}: {} -> {} products", rx, originalSize, base.size());
      }
      
      log.info("Returning {} products", base.size());
      return base;
      
    } catch (Exception ex) {
      log.error("Error listing products: {}", ex.getMessage(), ex);
      throw ex;
    }
  }

  public Product get(Long id) {
    log.debug("Fetching product with ID: {}", id);
    
    return repo.findById(id)
        .orElseThrow(() -> {
          log.warn("Product not found with ID: {}", id);
          return new NotFoundException("Producto no encontrado con ID: " + id);
        });
  }

  public Product createFromRequest(CreateProductRequest request) {
    log.info("📦 Creating new product from request: {}", request.getNombre());
    
    try {
      // Validaciones
      if (request.getNombre() == null || request.getNombre().isBlank()) {
        throw new IllegalArgumentException("El nombre del producto es obligatorio");
      }
      
      if (request.getPrecio() == null || request.getPrecio() <= 0) {
        throw new IllegalArgumentException("El precio debe ser mayor a 0");
      }
      
      if (request.getStock() == null || request.getStock() < 0) {
        throw new IllegalArgumentException("El stock no puede ser negativo");
      }
      
      if (request.getCategory() == null || request.getCategory().getId() == null) {
        throw new IllegalArgumentException("La categoría es obligatoria");
      }
      
      // Validar que la categoría exista
      Category category = categories.findById(request.getCategory().getId())
          .orElseThrow(() -> {
            log.warn("❌ Category not found with ID: {}", request.getCategory().getId());
            return new NotFoundException("Categoría no encontrada con ID: " + request.getCategory().getId());
          });
      
      // Crear producto
      Product product = new Product();
      product.setNombre(request.getNombre());
      product.setDescripcion(request.getDescripcion());
      product.setPrecio(BigDecimal.valueOf(request.getPrecio()));
      product.setStock(request.getStock());
      product.setDescuento(request.getDescuento() != null ? BigDecimal.valueOf(request.getDescuento()) : BigDecimal.ZERO);
      product.setRequiresPrescription(request.getRequiresPrescription() != null ? request.getRequiresPrescription() : false);
      product.setCategory(category);
      
      Product saved = repo.save(product);
      log.info("✅ Product created successfully with ID: {} - Category: {}", 
               saved.getId(), category.getName());
      return saved;
      
    } catch (IllegalArgumentException | NotFoundException ex) {
      log.error("❌ Validation error creating product: {}", ex.getMessage());
      throw ex;
    } catch (Exception ex) {
      log.error("❌ Unexpected error creating product: {}", ex.getMessage(), ex);
      throw new RuntimeException("Error al crear el producto: " + ex.getMessage(), ex);
    }
  }
  
  public Product create(Product p) {
    log.info("Creating new product: {}", p.getNombre());
    
    try {
      // Validar que el producto tenga los campos requeridos
      if (p.getNombre() == null || p.getNombre().isBlank()) {
        throw new IllegalArgumentException("El nombre del producto es obligatorio");
      }
      
      if (p.getPrecio() == null || p.getPrecio().compareTo(java.math.BigDecimal.ZERO) <= 0) {
        throw new IllegalArgumentException("El precio debe ser mayor a 0");
      }
      
      if (p.getStock() == null || p.getStock() < 0) {
        throw new IllegalArgumentException("El stock no puede ser negativo");
      }
      
      // Validar que la categoría exista
      if (p.getCategory() == null || p.getCategory().getId() == null) {
        throw new IllegalArgumentException("La categoría es obligatoria");
      }
      
      Category category = categories.findById(p.getCategory().getId())
          .orElseThrow(() -> {
            log.warn("Category not found with ID: {}", p.getCategory().getId());
            return new NotFoundException("Categoría no encontrada con ID: " + p.getCategory().getId());
          });
      
      p.setCategory(category);
      
      Product saved = repo.save(p);
      log.info("Product created successfully with ID: {}", saved.getId());
      return saved;
      
    } catch (IllegalArgumentException | NotFoundException ex) {
      log.error("Validation error creating product: {}", ex.getMessage());
      throw ex;
    } catch (Exception ex) {
      log.error("Unexpected error creating product: {}", ex.getMessage(), ex);
      throw new RuntimeException("Error al crear el producto: " + ex.getMessage(), ex);
    }
  }

  public Product update(Long id, Product p) {
    log.info("Updating product with ID: {}", id);
    
    try {
      Product db = get(id);
      
      // Validar campos
      if (p.getNombre() != null && !p.getNombre().isBlank()) {
        db.setNombre(p.getNombre());
      }
      
      if (p.getDescripcion() != null) {
        db.setDescripcion(p.getDescripcion());
      }
      
      if (p.getPrecio() != null) {
        if (p.getPrecio().compareTo(java.math.BigDecimal.ZERO) <= 0) {
          throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        db.setPrecio(p.getPrecio());
      }
      
      if (p.getStock() != null) {
        if (p.getStock() < 0) {
          throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        db.setStock(p.getStock());
      }
      
      if (p.getDescuento() != null) {
        db.setDescuento(p.getDescuento());
      }
      
      // Actualizar requiresPrescription
      if (p.getRequiresPrescription() != null) {
        db.setRequiresPrescription(p.getRequiresPrescription());
      }
      
      // Validar y actualizar categoría si se proporciona
      if (p.getCategory() != null && p.getCategory().getId() != null) {
        Category category = categories.findById(p.getCategory().getId())
            .orElseThrow(() -> {
              log.warn("Category not found with ID: {}", p.getCategory().getId());
              return new NotFoundException("Categoría no encontrada con ID: " + p.getCategory().getId());
            });
        db.setCategory(category);
      }
      
      Product updated = repo.save(db);
      log.info("Product updated successfully: {}", updated.getId());
      return updated;
      
    } catch (IllegalArgumentException | NotFoundException ex) {
      log.error("Validation error updating product {}: {}", id, ex.getMessage());
      throw ex;
    } catch (Exception ex) {
      log.error("Unexpected error updating product {}: {}", id, ex.getMessage(), ex);
      throw new RuntimeException("Error al actualizar el producto: " + ex.getMessage(), ex);
    }
  }

  public void delete(Long id) {
    log.info("Deleting product with ID: {}", id);
    
    try {
      // Verificar que el producto existe antes de eliminar
      if (!repo.existsById(id)) {
        log.warn("Cannot delete - product not found with ID: {}", id);
        throw new NotFoundException("Producto no encontrado con ID: " + id);
      }
      
      // Validar que el producto no esté referenciado en order_items
      boolean hasOrders = orderItems.existsByProductId(id);
      if (hasOrders) {
        log.warn("Cannot delete product {} - referenced in orders", id);
        throw new ConflictException("No se puede eliminar: el producto pertenece a órdenes existentes");
      }
      
      repo.deleteById(id);
      log.info("Product deleted successfully: {}", id);
      
    } catch (NotFoundException | ConflictException ex) {
      throw ex;
    } catch (DataIntegrityViolationException ex) {
      log.error("Data integrity violation deleting product {}: {}", id, ex.getMessage());
      throw new ConflictException("No se puede eliminar: el producto pertenece a órdenes existentes");
    } catch (Exception ex) {
      log.error("Error deleting product {}: {}", id, ex.getMessage(), ex);
      throw new RuntimeException("Error al eliminar el producto: " + ex.getMessage(), ex);
    }
  }
}