package com.example.uade.tpo.Farmacia.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@Entity
@Table(name = "carts")
public class Cart {

    public enum Status {OPEN, CHECKED_OUT, CANCELLED }

    @Id @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) 
    @JoinColumn(name = "user_id", nullable= false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    @OneToMany(mappedBy= "cart", cascade= CascadeType.ALL, orphanRemoval= true)
    private List<CartItem> items = new ArrayList<>();

    @Column(nullable=false)
    private Instant createdAt = Instant.now();

    private Instant updateAt;

    @PreUpdate
    public void PreUpdate(){ this.updateAt = Instant.now();}

}