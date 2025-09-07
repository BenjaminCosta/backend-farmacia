// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.uade.tpo.demo.controllers.config;

import com.uade.tpo.demo.entity.Role;
import lombok.Generated;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
   private final JwtAuthenticationFilter jwtAuthFilter;
   private final AuthenticationProvider authenticationProvider;

   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http.csrf(AbstractHttpConfigurer::disable).authorizeHttpRequests((req) -> {
         ((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)req.requestMatchers(new String[]{"/api/v1/auth/**"})).permitAll().requestMatchers(new String[]{"/error/**"})).permitAll().requestMatchers(new String[]{"/categories/**"})).hasAnyAuthority(new String[]{Role.USER.name()}).anyRequest()).authenticated();
      }).sessionManagement((session) -> {
         session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
      }).authenticationProvider(this.authenticationProvider).addFilterBefore(this.jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
      return (SecurityFilterChain)http.build();
   }

   @Generated
   public SecurityConfig(final JwtAuthenticationFilter jwtAuthFilter, final AuthenticationProvider authenticationProvider) {
      this.jwtAuthFilter = jwtAuthFilter;
      this.authenticationProvider = authenticationProvider;
   }
}