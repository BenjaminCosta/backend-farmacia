package com.example.uade.tpo.Farmacia.repository;

import com.example.uade.tpo.Farmacia.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findbyName(String name);
    Optional<Role> findbyDescription(String description);}
