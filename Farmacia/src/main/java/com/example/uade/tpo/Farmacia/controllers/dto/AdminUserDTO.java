package com.example.uade.tpo.Farmacia.controllers.dto;

public record AdminUserDTO(
    Long id,
    String email,
    String name,
    RoleDTO role
) {}
