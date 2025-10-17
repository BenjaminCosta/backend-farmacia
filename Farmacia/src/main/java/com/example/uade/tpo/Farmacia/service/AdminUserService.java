package com.example.uade.tpo.Farmacia.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.uade.tpo.Farmacia.controllers.dto.AdminUserDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.CreateUserRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.RoleDTO;
import com.example.uade.tpo.Farmacia.controllers.dto.UpdateUserRoleRequest;
import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;
import com.example.uade.tpo.Farmacia.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Listar todos los usuarios del sistema
     */
    public List<AdminUserDTO> getAllUsers() {
        log.info("👥 Listando todos los usuarios");
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener un usuario por ID
     */
    public AdminUserDTO getUserById(Long id) {
        log.info("🔍 Buscando usuario con ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + id));
        return toDTO(user);
    }

    /**
     * Crear un nuevo usuario con rol específico
     */
    public AdminUserDTO createUser(CreateUserRequest request) {
        log.info("➕ Creando usuario: {}", request.email());
        
        // Validar que el email no exista
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado: " + request.email());
        }
        
        // Buscar el rol
        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + request.roleId()));
        
        // Crear el usuario
        User user = new User();
        user.setEmail(request.email());
        user.setName(request.name());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);
        
        User savedUser = userRepository.save(user);
        log.info("✅ Usuario creado: {} con rol {}", savedUser.getEmail(), role.getName());
        
        return toDTO(savedUser);
    }
    
    /**
     * Actualizar el rol de un usuario
     */
    public AdminUserDTO updateUserRole(Long userId, UpdateUserRoleRequest request) {
        log.info("🔄 Actualizando rol del usuario ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + userId));
        
        Role newRole = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + request.roleId()));
        
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        
        log.info("✅ Rol actualizado: usuario {} ahora es {}", updatedUser.getEmail(), newRole.getName());
        
        return toDTO(updatedUser);
    }
    
    /**
     * Eliminar un usuario
     */
    public void deleteUser(Long userId) {
        log.info("🗑️ Eliminando usuario ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + userId));
        
        userRepository.delete(user);
        log.info("✅ Usuario eliminado: {}", user.getEmail());
    }
    
    /**
     * Listar todos los roles disponibles
     */
    public List<RoleDTO> getAllRoles() {
        log.info("📋 Listando todos los roles");
        return roleRepository.findAll().stream()
                .map(role -> new RoleDTO(role.getId(), role.getName(), role.getDescription()))
                .collect(Collectors.toList());
    }
    
    /**
     * Convertir entidad User a DTO
     */
    private AdminUserDTO toDTO(User user) {
        RoleDTO roleDTO = new RoleDTO(
            user.getRole().getId(),
            user.getRole().getName(),
            user.getRole().getDescription()
        );
        
        return new AdminUserDTO(
            user.getId(),
            user.getEmail(),
            user.getName(),
            roleDTO
        );
    }
}
