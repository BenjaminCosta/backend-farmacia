package com.example.uade.tpo.Farmacia.controllers;

import com.example.uade.tpo.Farmacia.entity.ProductImage;
import com.example.uade.tpo.Farmacia.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * Controller separado para servir imágenes públicas
 * Fuera de /api/v1 para URLs más limpias (ej: /images/123?w=320)
 */
@RestController
@RequiredArgsConstructor
public class ImageServingController {

    private final ProductImageService productImageService;

    /**
     * Servir imagen binaria con caching y resize opcional
     * Público - sin autenticación
     * Query param ?w=320 o ?w=800 para thumbnails automáticos
     */
    @GetMapping("/images/{imageId}")
    public ResponseEntity<byte[]> getImage(
        @PathVariable Long imageId,
        @RequestParam(required = false) Integer w // width para resize
    ) throws IOException {
        ProductImage image = productImageService.getImageById(imageId);
        
        byte[] imageBytes;
        // Solo permitir resize a 320px o 800px (thumbnails predefinidos)
        if (w != null && (w == 320 || w == 800)) {
            imageBytes = productImageService.getResizedImage(imageId, w);
        } else {
            imageBytes = image.getBytes(); // original
        }
        
        // ETag único para cada combinación imagen+tamaño (para caching)
        String etag = w != null ? image.getSha256() + "-" + w : image.getSha256();
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(image.getMimeType()))
            .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic()) // cachear 1 año
            .eTag(etag) // para validación de cache
            .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(imageBytes.length))
            .body(imageBytes);
    }
}
