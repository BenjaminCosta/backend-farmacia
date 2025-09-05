package com.example.uade.tpo.Farmacia.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.Farmacia.entity.Cart;
import com.example.uade.tpo.Farmacia.entity.CartItem;
import com.example.uade.tpo.Farmacia.entity.User;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {

    Optional<Cart> findByUserAndStatus(User user, Cart.Status status);
}