// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.example.uade.tpo.Farmacia.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
   @Value("${application.security.jwt.secretKey}")
   private String secretKey;
   @Value("${application.security.jwt.expiration}")
   private long jwtExpiration;

   public JwtService() {
   }

   public String generateToken(UserDetails userDetails) {
      return this.buildToken(userDetails, this.jwtExpiration);
   }

   private String buildToken(UserDetails userDetails, long expiration) {
      return Jwts.builder().subject(userDetails.getUsername()).issuedAt(new Date(System.currentTimeMillis())).claim("Gisele", 1234567).expiration(new Date(System.currentTimeMillis() + expiration)).signWith(this.getSecretKey()).compact();
   }

   public boolean isTokenValid(String token, UserDetails userDetails) {
      String username = (String)this.extractClaim(token, Claims::getSubject);
      return username.equals(userDetails.getUsername()) && !this.isTokenExpired(token);
   }

   private boolean isTokenExpired(String token) {
      return ((Date)this.extractClaim(token, Claims::getExpiration)).before(new Date());
   }

   public String extractUsername(String token) {
      return (String)this.extractClaim(token, Claims::getSubject);
   }

   public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
      Claims claims = this.extractAllClaims(token);
      return claimsResolver.apply(claims);
   }

   private Claims extractAllClaims(String token) {
      return (Claims)Jwts.parser().verifyWith(this.getSecretKey()).build().parseSignedClaims(token).getPayload();
   }

   private SecretKey getSecretKey() {
      SecretKey secretKeySpec = Keys.hmacShaKeyFor(this.secretKey.getBytes(StandardCharsets.UTF_8));
      return secretKeySpec;
   }
}
