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
     * Acepta multipart/form-data con múltiples archivos
     * Solo PHARMACIST o ADMIN
     */
    @PostMapping("/products/{productId}/images")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<List<ProductImageMetadataDTO>> uploadImages(
        @PathVariable Long productId,
        @RequestParam("files") MultipartFile[] files // acepta múltiples archivos
    ) throws IOException {
        List<ProductImageMetadataDTO> results = productImageService.uploadImages(productId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(results); // 201 Created
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
     * Si era la imagen primary, automáticamente promueve la siguiente
     * Solo PHARMACIST o ADMIN
     */
    @DeleteMapping("/products/{productId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<Void> deleteImage(
        @PathVariable Long productId,
        @PathVariable Long imageId
    ) {
        productImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    /**
     * Marcar imagen como principal
     * Desmarca automáticamente la anterior imagen primary
     * Solo PHARMACIST o ADMIN
     */
    @PutMapping("/products/{productId}/images/{imageId}/primary")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<Void> setImageAsPrimary(
        @PathVariable Long productId,
        @PathVariable Long imageId
    ) {
        productImageService.setImageAsPrimary(imageId);
        return ResponseEntity.ok().build(); // 200 OK
    }

    /**
     * Reemplazar una imagen existente
     * Mantiene el ID pero actualiza el contenido
     * Solo PHARMACIST o ADMIN
     */
    @PutMapping("/products/{productId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('PHARMACIST', 'ADMIN')")
    public ResponseEntity<ProductImageMetadataDTO> replaceImage(
        @PathVariable Long productId,
        @PathVariable Long imageId,
        @RequestParam("file") MultipartFile file // un solo archivo
    ) throws IOException {
        ProductImageMetadataDTO result = productImageService.replaceImage(imageId, file);
        return ResponseEntity.ok(result); // 200 OK con nuevos metadatos
    }
}
