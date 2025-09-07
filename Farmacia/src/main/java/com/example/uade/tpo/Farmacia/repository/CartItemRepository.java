package com.example.uade.tpo.Farmacia.repository;

import org.springframework.stereotype.Repository;

import com.example.uade.tpo.Farmacia.entity.CartItem;

@Repository
public class CartItemRepository extends JpaRepository<CartItem, Long> {
 
}