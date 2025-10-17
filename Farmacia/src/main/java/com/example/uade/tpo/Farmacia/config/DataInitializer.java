package com.example.uade.tpo.Farmacia.config;

import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.uade.tpo.Farmacia.entity.Role;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.repository.RoleRepository;
import com.example.uade.tpo.Farmacia.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initData() {
        // Crear roles por defecto si no existen
        createRoleIfNotExists("USER", "Usuario estándar");
        createRoleIfNotExists("ADMIN", "Administrador del sistema");
        createRoleIfNotExists("CUSTOMER", "Cliente de la farmacia");
        createRoleIfNotExists("PHARMACIST", "Farmacéutico");
        
        // Crear usuario PHARMACIST de prueba
        createPharmacistUserIfNotExists();
    }

    private void createRoleIfNotExists(String name, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name, description);
            roleRepository.save(role);
            System.out.println("Rol creado: " + name);
        }
    }
    
    private void createPharmacistUserIfNotExists() {
        String email = "farmaceutico@farmacia.com";
        String password = "farmacia123";
        
        var existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isEmpty()) {
            // Crear nuevo usuario
            Role pharmacistRole = roleRepository.findByName("PHARMACIST")
                    .orElseThrow(() -> new RuntimeException("Rol PHARMACIST no encontrado"));
            
            User pharmacist = new User();
            pharmacist.setEmail(email);
            pharmacist.setName("María Farmacéutica");
            pharmacist.setPassword(passwordEncoder.encode(password));
            pharmacist.setRole(pharmacistRole);
            
            userRepository.save(pharmacist);
            System.out.println("✅ Usuario PHARMACIST de prueba creado:");
            System.out.println("   Email: " + email);
            System.out.println("   Contraseña: " + password);
        } else {
            // Actualizar contraseña del usuario existente
            User user = existingUser.get();
            user.setPassword(passwordEncoder.encode(password));
            
            // Asegurar que tenga el rol PHARMACIST
            Role pharmacistRole = roleRepository.findByName("PHARMACIST")
                    .orElseThrow(() -> new RuntimeException("Rol PHARMACIST no encontrado"));
            user.setRole(pharmacistRole);
            
            userRepository.save(user);
            System.out.println("✅ Usuario PHARMACIST actualizado:");
            System.out.println("   Email: " + email);
            System.out.println("   Contraseña: " + password);
        }
    }
}
