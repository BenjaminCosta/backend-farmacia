package com.example.uade.tpo.Farmacia.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.uade.tpo.Farmacia.controllers.auth.AuthenticationResponse;
import com.example.uade.tpo.Farmacia.controllers.dto.AdminCreateUserRequest;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;
import com.example.uade.tpo.Farmacia.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationResponse createUserWithRole(AdminCreateUserRequest request) {
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Buscar el rol específico solicitado
        Role role = roleRepository.findByName(request.getRole().name())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + request.getRole()));

        var user = new User();
        user.setName(request.getFirstname() + " " + request.getLastname());            
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user); 
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().getName())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }
}
