package com.example.uade.tpo.Farmacia.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
   
   @Value("${application.security.jwt.expiration:86400000}")
   private long jwtExpiration;

   // Generar una clave segura automáticamente
   private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

   public String generateToken(UserDetails userDetails) {
      return buildToken(userDetails, jwtExpiration);
   }

   private String buildToken(UserDetails userDetails, long expiration) {
      return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact();
   }

   public boolean isTokenValid(String token, UserDetails userDetails) {
      String username = extractClaim(token, Claims::getSubject);
      return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
   }

   private boolean isTokenExpired(String token) {
      return extractClaim(token, Claims::getExpiration).before(new Date());
   }

   public String extractUsername(String token) {
      return extractClaim(token, Claims::getSubject);
   }

   public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
      Claims claims = extractAllClaims(token);
      return claimsResolver.apply(claims);
   }

   private Claims extractAllClaims(String token) {
      return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
   }
}
