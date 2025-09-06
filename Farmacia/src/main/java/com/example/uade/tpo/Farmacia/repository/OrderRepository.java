package com.example.uade.tpo.Farmacia.repository;

import com.example.uade.tpo.Farmacia.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByUserEmail(String email);
  List<Order> findByUserId(Long userId);
}