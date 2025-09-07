// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.uade.tpo.demo.controllers.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.Generated;

import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
   private static final String SecurityContextHolder = null;
   private final JwtService jwtService;
   private final UserDetailsService userDetailsService;

   protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
      String authHeader = request.getHeader("Authorization");
      if (authHeader != null && authHeader.startsWith("Bearer")) {
         String jwt = authHeader.substring(7);
         String userEmail = this.jwtService.extractUsername(jwt);
         if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if (this.jwtService.isTokenValid(jwt, userDetails)) {
               UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, (Object)null, userDetails.getAuthorities());
               authToken.setDetails((new WebAuthenticationDetailsSource()).buildDetails(request));
               SecurityContextHolder.getContext().setAuthentication(authToken);
            }
         }

         filterChain.doFilter(request, response);
      } else {
         filterChain.doFilter(request, response);
      }
   }

   @Generated
   public JwtAuthenticationFilter(final JwtService jwtService, final UserDetailsServiceAutoConfiguration userDetailsService) {
      this.jwtService = jwtService;
      this.userDetailsService = userDetailsService;
   }
}
