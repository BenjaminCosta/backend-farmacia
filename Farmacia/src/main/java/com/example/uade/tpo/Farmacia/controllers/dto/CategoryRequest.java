package com.example.uade.tpo.Farmacia.controllers.dto;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CategoryRequest {

    @NotBlank
    private String name;

    private String description;

}