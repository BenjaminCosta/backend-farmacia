package com.example.uade.tpo.Farmacia.controllers.auth;

import com.example.uade.tpo.Farmacia.entity.RoleType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private RoleType role;
}
