package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.controllers.dto.ProductImageMetadataDTO;
import com.example.uade.tpo.Farmacia.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ProductImageController {

    private final ProductImageService productImageService;

    /**
     * Subir múltiples imágenes para un producto
     * Solo PHARMACIST o ADMIN
     */
    @PostMapping("/products/{productId}/images")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<List<ProductImageMetadataDTO>> uploadImages(
        @PathVariable Long productId,
        @RequestParam("files") MultipartFile[] files
    ) throws IOException {
        List<ProductImageMetadataDTO> results = productImageService.uploadImages(productId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(results);
    }

    /**
     * Obtener metadatos de todas las imágenes de un producto
     * Público (para catálogo)
     */
    @GetMapping("/products/{productId}/images")
    public ResponseEntity<List<ProductImageMetadataDTO>> getImageMetadata(
        @PathVariable Long productId
    ) {
        List<ProductImageMetadataDTO> metadata = productImageService.getImageMetadata(productId);
        return ResponseEntity.ok(metadata);
    }

    /**
     * Eliminar una imagen
     * Solo PHARMACIST o ADMIN
     */
    @DeleteMapping("/products/{productId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<Void> deleteImage(
        @PathVariable Long productId,
        @PathVariable Long imageId
    ) {
        productImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Marcar imagen como principal
     * Solo PHARMACIST o ADMIN
     */
    @PutMapping("/products/{productId}/images/{imageId}/primary")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<Void> setImageAsPrimary(
        @PathVariable Long productId,
        @PathVariable Long imageId
    ) {
        productImageService.setImageAsPrimary(imageId);
        return ResponseEntity.ok().build();
    }

    /**
     * Reemplazar una imagen existente
     * Solo PHARMACIST o ADMIN
     */
    @PutMapping("/products/{productId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ProductImageMetadataDTO> replaceImage(
        @PathVariable Long productId,
        @PathVariable Long imageId,
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        ProductImageMetadataDTO result = productImageService.replaceImage(imageId, file);
        return ResponseEntity.ok(result);
    }
}
