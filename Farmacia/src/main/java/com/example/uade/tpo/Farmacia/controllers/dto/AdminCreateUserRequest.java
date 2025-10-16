package com.example.uade.tpo.Farmacia.controllers.dto;

import com.example.uade.tpo.Farmacia.entity.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminCreateUserRequest {
    
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private RoleType role; // Solo para uso administrativo
}
