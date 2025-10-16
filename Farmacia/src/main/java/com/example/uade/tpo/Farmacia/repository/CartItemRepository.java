package com.example.uade.tpo.Farmacia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.uade.tpo.Farmacia.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
 
}