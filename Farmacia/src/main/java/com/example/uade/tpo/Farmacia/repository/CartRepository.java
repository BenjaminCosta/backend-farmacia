package com.example.uade.tpo.Farmacia.repository;

import java.util.Optional;

import com.example.uade.tpo.Farmacia.entity.Cart;
import com.example.uade.tpo.Farmacia.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    public Optional<Cart> findByUserAndStatus(User user, Cart.Status status);
}