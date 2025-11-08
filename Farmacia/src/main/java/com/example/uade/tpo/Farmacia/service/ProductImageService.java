package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.ProductImageMetadataDTO;
import com.example.uade.tpo.Farmacia.entity.ProductImage;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductImageService {
    
    List<ProductImageMetadataDTO> uploadImages(Long productId, MultipartFile[] files) throws IOException;
    
    List<ProductImageMetadataDTO> getImageMetadata(Long productId);
    
    ProductImage getImageById(Long imageId);
    
    void deleteImage(Long imageId);
    
    void setImageAsPrimary(Long imageId);
    
    ProductImageMetadataDTO replaceImage(Long imageId, MultipartFile file) throws IOException;
    
    byte[] getResizedImage(Long imageId, Integer width) throws IOException;
}
