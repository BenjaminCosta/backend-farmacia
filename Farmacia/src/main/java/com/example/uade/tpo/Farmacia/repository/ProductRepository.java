package com.example.uade.tpo.Farmacia.repository;

import com.example.uade.tpo.Farmacia.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByCategoryId(Long categoryId);
  List<Product> findByNombreContainingIgnoreCase(String q);
  
  // Verificar si existe algún producto en una categoría
  boolean existsByCategoryId(Long categoryId);
}
