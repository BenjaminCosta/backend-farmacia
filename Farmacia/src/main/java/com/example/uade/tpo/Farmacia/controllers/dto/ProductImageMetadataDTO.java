package com.example.uade.tpo.Farmacia.controllers.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageMetadataDTO {
    private Long id;
    private Boolean isPrimary;
    private Integer width;
    private Integer height;
    private Long sizeBytes;
}
