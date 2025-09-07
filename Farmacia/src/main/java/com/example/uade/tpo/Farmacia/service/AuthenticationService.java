package com.example.uade.tpo.Farmacia.service;

import org.springframework.stereotype.Service;

import com.example.uade.tpo.Farmacia.controllers.auth.AuthenticationRequest;
import com.example.uade.tpo.Farmacia.controllers.auth.AuthenticationResponse;
import com.example.uade.tpo.Farmacia.controllers.auth.RegisterRequest;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.security.JwtService;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class AuthenticationService {

      private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        
        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        var user = User.builder()
                .firstName(request.getFirstName())  
                .lastName(request.getLastName())
                .name(request.getName())            
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() == null ? Role.BUYER : request.getRole())
                .build();

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
