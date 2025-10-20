package com.example.uade.tpo.Farmacia.repository;

import com.example.uade.tpo.Farmacia.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByUserEmail(String email);
  List<Order> findByUserId(Long userId);
  
  @Query("SELECT DISTINCT o FROM Order o " +
         "LEFT JOIN FETCH o.items i " +
         "LEFT JOIN FETCH i.product p " +
         "WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
  List<Order> findAllByUserIdWithItems(@Param("userId") Long userId);
  
  @Query("SELECT o FROM Order o " +
         "LEFT JOIN FETCH o.items i " +
         "LEFT JOIN FETCH i.product p " +
         "WHERE o.id = :id AND o.user.id = :userId")
  Optional<Order> findByIdAndUserIdWithItems(@Param("id") Long id, @Param("userId") Long userId);
  
  @Query("SELECT DISTINCT o FROM Order o " +
         "LEFT JOIN FETCH o.items i " +
         "LEFT JOIN FETCH i.product p " +
         "ORDER BY o.createdAt DESC")
  List<Order> findAllWithItems();
}