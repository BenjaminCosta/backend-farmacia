package com.example.uade.tpo.Farmacia.service;

import com.example.uade.tpo.Farmacia.controllers.dto.CartAddItemRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CartUpdateItemRequest;
import com.example.uade.tpo.Farmacia.controllers.dto.CartResponse;
import com.example.uade.tpo.Farmacia.entity.*;
import com.example.uade.tpo.Farmacia.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.CacheRequest;

@RequiredArgsConstructor
@Service
public class CartService {

    private final CartRepository carts;
    private final CartItemRepository items;
    private final UserRepository users;
    private final ProductRepository products;
    private final OrderRepository orders;
    private final OrderItemRepository orderItems;

    //api
    public CartResponse getCart(String email) {
        User u = users.findByEmail(email).orElseThrow();
        Cart c = carts.findByUserAndStatus(u, Cart.Status.OPEN)
                      .orElseGet(() -> carts.save(newCart(u)));
        return toResponse(c);
    }

    @Transactional
    public CartResponse addItem(String email, CartAddItemRequest req) {
        if (req.getQuantity() == null || req.getQuantity() < 1)
            throw new IllegalArgumentException("Cantidad inválida");

        User u = users.findByEmail(email).orElseThrow();
        Product p = products.findById(req.getProductId()).orElseThrow();

        if (p.getStock() == null || p.getStock() <= 0)
            throw new IllegalStateException("Producto sin stock");
        if (req.getQuantity() > p.getStock())
            throw new IllegalStateException("Cantidad supera stock disponible");

        Cart c = carts.findByUserAndStatus(u, Cart.Status.OPEN)
                      .orElseGet(() -> carts.save(newCart(u)));

        CartItem existing = c.getItems().stream()
                .filter(ci -> ci.getProduct().getId().equals(p.getId()))
                .findFirst().orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + req.getQuantity());
            existing.setUnitPrice(p.getPrecio());
            existing.setUnitDiscount(p.getDescuento());
            existing.recomputeLineTotal();
            items.save(existing);
            return toResponse(carts.save(c));
        }

        CartItem ci = new CartItem();
        ci.setCart(c);
        ci.setProduct(p);
        ci.setQuantity(req.getQuantity());
        ci.setUnitPrice(p.getPrecio());
        ci.setUnitDiscount(p.getDescuento());
        ci.recomputeLineTotal();

        c.getItems().add(ci);
        carts.save(c); // cascade crea el item
        return toResponse(c);
    }

    @Transactional
    public CartResponse updateItem(String email, Long itemId, CartUpdateItemRequest req) {
        if (req.getQuantity() == null || req.getQuantity() < 1)
            throw new IllegalArgumentException("Cantidad inválida");

        User u = users.findByEmail(email).orElseThrow();
        Cart c = carts.findByUserAndStatus(u, Cart.Status.OPEN)
                      .orElseThrow(() -> new IllegalStateException("No hay carrito abierto"));

        CartItem ci = items.findById(itemId).orElseThrow();
        if (!ci.getCart().getId().equals(c.getId()))
            throw new IllegalStateException("El ítem no pertenece al carrito del usuario");

        if (req.getQuantity() > ci.getProduct().getStock())
            throw new IllegalStateException("Cantidad supera stock");

        ci.setQuantity(req.getQuantity());
        // mantenemos snapshots previos
        ci.recomputeLineTotal();
        items.save(ci);
        return toResponse(carts.save(c));
    }

    @Transactional
    public Cart updateItemQuantity(String email, Long itemId, Integer quantity) {
        if (quantity == null || quantity < 1)
            throw new IllegalArgumentException("Cantidad inválida");

        User u = users.findByEmail(email).orElseThrow();
        Cart c = carts.findByUserAndStatus(u, Cart.Status.OPEN)
                      .orElseThrow(() -> new IllegalStateException("No hay carrito abierto"));

        CartItem ci = items.findById(itemId).orElseThrow();
        if (!ci.getCart().getId().equals(c.getId()))
            throw new IllegalStateException("El ítem no pertenece al carrito del usuario");

        if (quantity > ci.getProduct().getStock())
            throw new IllegalStateException("Cantidad supera stock");

        ci.setQuantity(quantity);
        ci.recomputeLineTotal();
        items.save(ci);
        return carts.save(c);
    }

    @Transactional
    public void removeItem(String email, Long itemId) {
        User u = users.findByEmail(email).orElseThrow();
        Cart c = carts.findByUserAndStatus(u, Cart.Status.OPEN)
                      .orElseThrow(() -> new IllegalStateException("No hay carrito abierto"));

        CartItem ci = items.findById(itemId).orElseThrow();
        if (!ci.getCart().getId().equals(c.getId()))
            throw new IllegalStateException("El ítem no pertenece al carrito del usuario");

        c.getItems().remove(ci);
        items.delete(ci);
        carts.save(c);
    }

    @Transactional
    public Long checkout(String email) {
        User u = users.findByEmail(email).orElseThrow();
        Cart c = carts.findByUserAndStatus(u, Cart.Status.OPEN)
                      .orElseThrow(() -> new IllegalStateException("No hay carrito abierto"));

        if (c.getItems().isEmpty())
            throw new IllegalStateException("Carrito vacío");

        // 1) validar stock
        for (CartItem it : c.getItems()) {
            if (it.getQuantity() > it.getProduct().getStock()) {
                throw new IllegalStateException("Sin stock para " + it.getProduct().getNombre());
            }
        }

        //2) descontar stock
        for (CartItem it : c.getItems()) {
            Product p = it.getProduct();
            p.setStock(p.getStock() - it.getQuantity());
            products.save(p);
        }

        //3) crear orden + items snapshot
        Order order = new Order();
        order.setUser(u);
        order.setTotal(
            c.getItems().stream()
             .map(CartItem::getLineTotal)
             .reduce(BigDecimal.ZERO, BigDecimal::add)
        );
        order = orders.save(order);

        for (CartItem it : c.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(it.getProduct());
            oi.setQuantity(it.getQuantity());
            oi.setUnitPrice(it.getUnitPrice());
            oi.setUnitDiscount(it.getUnitDiscount());
            oi.setLineTotal(it.getLineTotal());
            orderItems.save(oi);
        }

        //4 cerrar carrito
        c.setStatus(Cart.Status.CHECKED_OUT);
        carts.save(c);

        return order.getId();
    }

    //helpers

    private Cart newCart(User u) {
        Cart c = new Cart();
        c.setUser(u);
        c.setStatus(Cart.Status.OPEN);
        return c;
    }

    private CartResponse toResponse(Cart c) {
        var lines = c.getItems().stream().map(it -> {
            var l = new CartResponse.CartLine();
            l.setItemId(it.getId());
            l.setProductId(it.getProduct().getId());
            l.setName(it.getProduct().getNombre()); 
            l.setQuantity(it.getQuantity());
            l.setUnitPrice(it.getUnitPrice());
            l.setUnitDiscount(it.getUnitDiscount());
            l.setLineTotal(it.getLineTotal());
            return l;
        }).toList();

        var total = lines.stream()
                .map(CartResponse.CartLine::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        var dto = new CartResponse();
        dto.setId(c.getId());
        dto.setStatus(c.getStatus().name());
        dto.setItems(lines);
        dto.setTotal(total);
        return dto;
    }

    public Cart getCartByUserEmail(String email) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getCartByUserEmail'");
    }

    public Cart additem(String email, CacheRequest productId, Integer quantity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'additem'");
    }
}