package com.example.uade.tpo.Farmacia.service.impl;

import com.example.uade.tpo.Farmacia.controllers.dto.ProductImageMetadataDTO;
import com.example.uade.tpo.Farmacia.entity.ProductImage;
import com.example.uade.tpo.Farmacia.repository.ProductImageRepository;
import com.example.uade.tpo.Farmacia.repository.ProductRepository;
import com.example.uade.tpo.Farmacia.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductImageServiceImpl implements ProductImageService {

    // Límites de seguridad
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB máximo por imagen
    private static final int MAX_IMAGES_PER_PRODUCT = 10; // máximo 10 imágenes por producto
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        "image/jpeg", "image/png", "image/webp"
    );
    
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public List<ProductImageMetadataDTO> uploadImages(Long productId, MultipartFile[] files) throws IOException {
        // Verificar que el producto existe
        productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar límite de imágenes
        long currentCount = productImageRepository.countByProductId(productId);
        if (currentCount + files.length > MAX_IMAGES_PER_PRODUCT) {
            throw new RuntimeException("Máximo " + MAX_IMAGES_PER_PRODUCT + " imágenes por producto");
        }

        List<ProductImageMetadataDTO> results = new ArrayList<>();
        boolean isFirstImage = currentCount == 0; // la primera imagen será la primary

        for (MultipartFile file : files) {
            validateFile(file); // valida tamaño, tipo y contenido
            
            byte[] bytes = file.getBytes();
            String sha256 = calculateSHA256(bytes);
            
            // Deduplicar: si ya existe esta imagen (mismo hash), skip
            Optional<ProductImage> existing = productImageRepository.findByProductIdAndSha256(productId, sha256);
            if (existing.isPresent()) {
                log.info("Imagen duplicada detectada para producto {}, sha256: {}", productId, sha256);
                continue;
            }
            
            // Extraer dimensiones usando ImageIO
            BufferedImage img = ImageIO.read(new ByteArrayInputStream(bytes));
            if (img == null) {
                throw new RuntimeException("No se pudo leer la imagen");
            }
            
            ProductImage productImage = new ProductImage();
            productImage.setProductId(productId);
            productImage.setMimeType(file.getContentType());
            productImage.setBytes(bytes);
            productImage.setWidth(img.getWidth());
            productImage.setHeight(img.getHeight());
            productImage.setSizeBytes((long) bytes.length);
            productImage.setSha256(sha256);
            productImage.setIsPrimary(isFirstImage && results.isEmpty()); // auto-primary si es la primera
            
            productImage = productImageRepository.save(productImage);
            
            results.add(toMetadataDTO(productImage));
        }

        return results;
    }

    @Override
    public List<ProductImageMetadataDTO> getImageMetadata(Long productId) {
        List<ProductImage> images = productImageRepository.findByProductIdOrderByIsPrimaryDescCreatedAtAsc(productId);
        return images.stream().map(this::toMetadataDTO).toList();
    }

    @Override
    public ProductImage getImageById(Long imageId) {
        return productImageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
    }

    @Override
    @Transactional
    public void deleteImage(Long imageId) {
        ProductImage image = getImageById(imageId);
        boolean wasPrimary = image.getIsPrimary();
        Long productId = image.getProductId();
        
        productImageRepository.delete(image);
        
        // Si borramos la imagen primary, promover la siguiente
        if (wasPrimary) {
            List<ProductImage> remaining = productImageRepository.findByProductIdOrderByIsPrimaryDescCreatedAtAsc(productId);
            if (!remaining.isEmpty()) {
                ProductImage newPrimary = remaining.get(0);
                newPrimary.setIsPrimary(true);
                productImageRepository.save(newPrimary);
            }
        }
    }

    @Override
    @Transactional
    public void setImageAsPrimary(Long imageId) {
        ProductImage image = getImageById(imageId);
        
        // Desmarcar la imagen primary actual del producto
        productImageRepository.clearPrimaryForProduct(image.getProductId());
        
        // Marcar esta imagen como primary
        image.setIsPrimary(true);
        productImageRepository.save(image);
    }

    @Override
    @Transactional
    public ProductImageMetadataDTO replaceImage(Long imageId, MultipartFile file) throws IOException {
        ProductImage image = getImageById(imageId);
        
        validateFile(file);
        
        byte[] bytes = file.getBytes();
        BufferedImage img = ImageIO.read(new ByteArrayInputStream(bytes));
        if (img == null) {
            throw new RuntimeException("No se pudo leer la imagen");
        }
        
        image.setMimeType(file.getContentType());
        image.setBytes(bytes);
        image.setWidth(img.getWidth());
        image.setHeight(img.getHeight());
        image.setSizeBytes((long) bytes.length);
        image.setSha256(calculateSHA256(bytes));
        
        image = productImageRepository.save(image);
        
        return toMetadataDTO(image);
    }

    @Override
    public byte[] getResizedImage(Long imageId, Integer targetWidth) throws IOException {
        ProductImage image = getImageById(imageId);
        
        // Si no se pide resize o ya es más chica, devolver original
        if (targetWidth == null || targetWidth >= image.getWidth()) {
            return image.getBytes();
        }
        
        BufferedImage original = ImageIO.read(new ByteArrayInputStream(image.getBytes()));
        if (original == null) {
            return image.getBytes();
        }
        
        // Calcular nuevo alto manteniendo aspect ratio
        int newWidth = targetWidth;
        int newHeight = (int) ((double) targetWidth / original.getWidth() * original.getHeight());
        
        // Resize con interpolación bilinear para calidad
        BufferedImage resized = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = resized.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(original, 0, 0, newWidth, newHeight, null);
        g.dispose();
        
        // Convertir de vuelta a bytes en el formato original
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        String format = image.getMimeType().substring(6); // "image/jpeg" -> "jpeg"
        if (format.equals("jpg")) format = "jpeg";
        ImageIO.write(resized, format, baos);
        
        return baos.toByteArray();
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Archivo vacío");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("Archivo muy grande. Máximo 5MB");
        }
        
        if (!ALLOWED_MIME_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Tipo de archivo no permitido. Solo JPG, PNG, WEBP");
        }
    }

    // Calcular hash SHA-256 para deduplicación y ETags
    private String calculateSHA256(byte[] bytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(bytes);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error calculando SHA-256", e);
        }
    }

    private ProductImageMetadataDTO toMetadataDTO(ProductImage image) {
        return new ProductImageMetadataDTO(
            image.getId(),
            image.getIsPrimary(),
            image.getWidth(),
            image.getHeight(),
            image.getSizeBytes()
        );
    }
}
