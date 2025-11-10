package com.example.uade.tpo.Farmacia.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Entidad que almacena las imágenes de productos en la DB
@Entity
@Table(name = "product_images", indexes = {
    @Index(name = "idx_product_id", columnList = "product_id"), // índice para búsquedas por producto
    @Index(name = "idx_sha256", columnList = "sha256") // índice para deduplicación
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "mime_type", nullable = false, length = 50)
    private String mimeType; // image/jpeg, image/png, image/webp
    
    @Lob
    @Column(name = "bytes", nullable = false, columnDefinition = "LONGBLOB")
    private byte[] bytes; // contenido binario de la imagen
    
    @Column(name = "width", nullable = false)
    private Integer width; // ancho en pixels
    
    @Column(name = "height", nullable = false)
    private Integer height; // alto en pixels
    
    @Column(name = "size_bytes", nullable = false)
    private Long sizeBytes; // tamaño del archivo
    
    @Column(name = "sha256", nullable = false, length = 64)
    private String sha256; // hash para evitar duplicados
    
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false; // imagen principal del producto
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
