package com.example.uade.tpo.Farmacia.repository;

import com.example.uade.tpo.Farmacia.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    
    // Obtener imágenes ordenadas (primary primero, luego por fecha)
    List<ProductImage> findByProductIdOrderByIsPrimaryDescCreatedAtAsc(Long productId);
    
    // Buscar imagen por hash (para evitar duplicados)
    Optional<ProductImage> findByProductIdAndSha256(Long productId, String sha256);
    
    // Obtener la imagen principal de un producto
    Optional<ProductImage> findByProductIdAndIsPrimaryTrue(Long productId);
    
    // Contar imágenes de un producto (límite de 10)
    long countByProductId(Long productId);
    
    @Modifying
    @Query("UPDATE ProductImage pi SET pi.isPrimary = false WHERE pi.productId = ?1")
    void clearPrimaryForProduct(Long productId); // resetear primary antes de asignar nueva
}
