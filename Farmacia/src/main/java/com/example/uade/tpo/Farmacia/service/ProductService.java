package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.entity.Product;
import com.example.uade.tpo.Farmacia.repository.ProductRepository;
import com.example.uade.tpo.Farmacia.repository.CategoryRepository;
import exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
  private final ProductRepository repo;
  private final CategoryRepository categories;

  public List<Product> list(Long categoryId, String q, Boolean inStock) {
    List<Product> base;
    if (categoryId != null) base = repo.findByCategoryId(categoryId);
    else if (q != null && !q.isBlank()) base = repo.findByNombreContainingIgnoreCase(q);
    else base = repo.findAll();

    if (Boolean.TRUE.equals(inStock)) {
      base = base.stream().filter(p -> p.getStock() != null && p.getStock() > 0).toList();
    }
    return base;
  }

  public Product get(Long id) {
    return repo.findById(id).orElseThrow(() -> new NotFoundException("Producto no encontrado"));
  }

  public Product create(Product p) {
    return repo.save(p);
  }

  public Product update(Long id, Product p) {
    Product db = get(id);
    db.setNombre(p.getNombre());
    db.setDescripcion(p.getDescripcion());
    db.setPrecio(p.getPrecio());
    db.setStock(p.getStock());
    db.setDescuento(p.getDescuento());
    db.setCategory(p.getCategory());
    return repo.save(db);
  }

  public void delete(Long id) {
    repo.deleteById(id);
  }
}