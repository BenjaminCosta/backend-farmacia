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
            .authorizeHttpRequests(req -> 
                req
                    // Público: registro, login, errors, actuator
                    .requestMatchers("/api/v1/auth/**")
                    .permitAll()
                    .requestMatchers("/auth/**")
                    .permitAll()
                    .requestMatchers("/error/**")
                    .permitAll()
                    .requestMatchers("/actuator/**")
                    .permitAll()
                    
                    // Catálogo público: cualquiera puede ver productos y categorías
                    .requestMatchers(HttpMethod.GET, "/products/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/categories/**")
                    .permitAll()
                    
                    // Solo PHARMACIST: gestión de productos y categorías
                    .requestMatchers(HttpMethod.POST, "/products/**")
                    .hasAnyRole("PHARMACIST", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/products/**")
                    .hasAnyRole("PHARMACIST", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/products/**")
                    .hasAnyRole("PHARMACIST", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/categories/**")
                    .hasAnyRole("PHARMACIST", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/categories/**")
                    .hasAnyRole("PHARMACIST", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/categories/**")
                    .hasAnyRole("PHARMACIST", "ADMIN")
                    
                    // Flujo de compra: solo usuarios autenticados (principalmente USER)
                    .requestMatchers("/cart/**")
                    .hasAnyRole("USER", "PHARMACIST", "ADMIN")
                    .requestMatchers("/orders/**")
                    .hasAnyRole("USER", "PHARMACIST", "ADMIN")
                    
                    // Administración: solo ADMIN
                    .requestMatchers("/api/v1/admin/**")
                    .hasRole("ADMIN")
                    
                    // Todo lo demás requiere autenticación
                    .anyRequest()
                    .authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}