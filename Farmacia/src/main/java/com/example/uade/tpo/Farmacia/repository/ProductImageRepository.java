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
    
    List<ProductImage> findByProductIdOrderByIsPrimaryDescCreatedAtAsc(Long productId);
    
    Optional<ProductImage> findByProductIdAndSha256(Long productId, String sha256);
    
    Optional<ProductImage> findByProductIdAndIsPrimaryTrue(Long productId);
    
    long countByProductId(Long productId);
    
    @Modifying
    @Query("UPDATE ProductImage pi SET pi.isPrimary = false WHERE pi.productId = ?1")
    void clearPrimaryForProduct(Long productId);
}
