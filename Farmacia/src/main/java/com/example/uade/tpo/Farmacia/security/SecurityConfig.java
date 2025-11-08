package com.example.uade.tpo.Farmacia.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(req -> 
                req
                    // Permitir OPTIONS para CORS preflight
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    
                    // Público: registro y login sin autenticación
                    .requestMatchers("/api/v1/auth/**").permitAll()
                    
                    // Público: errors y actuator
                    .requestMatchers("/error/**").permitAll()
                    .requestMatchers("/actuator/**").permitAll()
                    
                    // Catálogo público: cualquiera puede ver productos y categorías
                    .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                    
                    // Rutas de ADMIN: solo acceso con rol ADMIN
                    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                    
                    // Rutas de órdenes y gestión: ADMIN tiene acceso total
                    .requestMatchers("/api/v1/orders/all").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/orders/*/status").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers(HttpMethod.PATCH, "/api/v1/orders/*/status").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers(HttpMethod.POST, "/api/v1/categories/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers(HttpMethod.PUT, "/api/v1/categories/**").hasAnyRole("ADMIN", "PHARMACIST")
                    .requestMatchers(HttpMethod.DELETE, "/api/v1/categories/**").hasAnyRole("ADMIN", "PHARMACIST")
                    
                    // Cart y Orders requieren autenticación (manejado por @PreAuthorize en controllers)
                    .requestMatchers("/api/v1/cart/**").authenticated()
                    .requestMatchers("/api/v1/orders/**").authenticated()
                    
                    // Payments requieren autenticación
                    .requestMatchers("/api/v1/payments/**").authenticated()
                    
                    // Todo lo demás requiere autenticación
                    .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Orígenes permitidos
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:8080",
            "http://localhost:8081"
        ));
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // Headers permitidos
        configuration.setAllowedHeaders(List.of(
            "Authorization", "Content-Type", "Accept"
        ));
        
        // Headers expuestos en la respuesta
        configuration.setExposedHeaders(List.of("Authorization"));
        
        // Permitir credenciales (cookies, auth headers)
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}