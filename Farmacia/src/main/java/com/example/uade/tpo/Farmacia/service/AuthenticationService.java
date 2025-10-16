package com.example.uade.tpo.Farmacia.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.uade.tpo.Farmacia.controllers.auth.AuthenticationRequest;
import com.example.uade.tpo.Farmacia.controllers.auth.AuthenticationResponse;
import com.example.uade.tpo.Farmacia.controllers.auth.RegisterRequest;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.entity.RoleType;
import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;
import com.example.uade.tpo.Farmacia.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // SEGURIDAD: Siempre asignar rol USER por defecto, ignorar cualquier intento de escalada
        Role role = roleRepository.findByName(RoleType.USER.name())
                .orElseThrow(() -> new IllegalArgumentException("Rol USER no encontrado en el sistema"));

        var user = new User();
        user.setName(request.getFirstname() + " " + request.getLastname());            
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        repository.save(user);

        var jwtToken = jwtService.generateToken(user); 
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user); 
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }
}
