package com.example.uade.tpo.Farmacia.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.uade.tpo.Farmacia.controllers.auth.AuthenticationRequest;
import com.example.uade.tpo.Farmacia.controllers.auth.AuthenticationResponse;
import com.example.uade.tpo.Farmacia.controllers.auth.RegisterRequest;
import com.example.uade.tpo.Farmacia.controllers.auth.UserInfoResponse;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.entity.RoleType;
import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;
import com.example.uade.tpo.Farmacia.security.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository repository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        
        // Validación: campos no nulos ni vacíos
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email no puede estar vacío");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }
        if (request.getFirstname() == null || request.getFirstname().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        if (request.getLastname() == null || request.getLastname().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido no puede estar vacío");
        }
        
        // Validación: email único
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        try {
            // SEGURIDAD: Siempre asignar rol USER por defecto, ignorar cualquier intento de escalada
            Role role = roleRepository.findByName(RoleType.USER.name())
                    .orElseThrow(() -> new IllegalArgumentException("Rol USER no encontrado en el sistema"));

            // Crear usuario con todos los campos obligatorios
            String fullName = request.getFirstname().trim() + " " + request.getLastname().trim();
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            
            // Validar que la contraseña se haya encriptado correctamente
            if (encodedPassword == null || encodedPassword.isEmpty()) {
                throw new RuntimeException("Error al encriptar la contraseña");
            }
            
            User user = new User();
            user.setName(fullName);            
            user.setEmail(request.getEmail().trim().toLowerCase());
            user.setPassword(encodedPassword);
            user.setRole(role);
            
            // Validar que el usuario tenga todos los campos antes de guardar
            if (user.getName() == null || user.getEmail() == null || 
                user.getPassword() == null || user.getRole() == null) {
                throw new RuntimeException("Error: usuario con campos nulos antes de guardar");
            }

            // Guardar usuario en la base de datos
            User savedUser = repository.save(user);
            
            // Validar que el usuario se guardó correctamente
            if (savedUser == null || savedUser.getId() == 0) {
                throw new RuntimeException("Error al guardar el usuario en la base de datos");
            }
            
            log.info("Usuario registrado exitosamente: {} (ID: {})", savedUser.getEmail(), savedUser.getId());

            // Generar token JWT
            String jwtToken = jwtService.generateToken(savedUser);
            
            // Validar que el token se generó correctamente
            if (jwtToken == null || jwtToken.isEmpty()) {
                throw new RuntimeException("Error al generar el token JWT");
            }
            
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .role(savedUser.getRole().getName())
                    .email(savedUser.getEmail())
                    .name(savedUser.getName())
                    .build();
                    
        } catch (IllegalArgumentException e) {
            // Re-lanzar excepciones de validación (400)
            throw e;
        } catch (Exception e) {
            log.error("Error inesperado durante el registro: {}", e.getMessage(), e);
            throw new RuntimeException("Error al registrar el usuario: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        
        // Validación: campos no nulos ni vacíos
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email no puede estar vacío");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }
        
        try {
            // Intentar autenticar con Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().trim().toLowerCase(),
                            request.getPassword()
                    )
            );
            
            // Si llegamos aquí, la autenticación fue exitosa
            User user = repository.findByEmail(request.getEmail().trim().toLowerCase())
                    .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));
            
            // Validar que el usuario tenga todos los campos necesarios
            if (user.getEmail() == null || user.getPassword() == null || user.getRole() == null) {
                log.error("Usuario con campos nulos: {}", user.getEmail());
                throw new RuntimeException("Error: datos de usuario incompletos");
            }
            
            log.info("Usuario autenticado exitosamente: {}", user.getEmail());
            
            // Generar token JWT
            String jwtToken = jwtService.generateToken(user);
            
            // Validar que el token se generó correctamente
            if (jwtToken == null || jwtToken.isEmpty()) {
                throw new RuntimeException("Error al generar el token JWT");
            }
            
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .role(user.getRole().getName())
                    .email(user.getEmail())
                    .name(user.getName())
                    .build();
                    
        } catch (BadCredentialsException e) {
            log.warn("Intento de autenticación fallido para: {}", request.getEmail());
            throw new BadCredentialsException("Email o contraseña incorrectos");
        } catch (Exception e) {
            log.error("Error inesperado durante la autenticación: {}", e.getMessage(), e);
            throw new RuntimeException("Error al autenticar el usuario: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public UserInfoResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));
        
        return UserInfoResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().getName())
                .build();
    }
}
