package com.example.uade.tpo.Farmacia.service;

import java.math.BigDecimal;

import javax.resource.spi.IllegalStateException;

import org.springframework.stereotype.Service;

import com.example.uade.tpo.Farmacia.entity.Cart;
import com.example.uade.tpo.Farmacia.entity.CartItem;
import com.example.uade.tpo.Farmacia.entity.OrderItem;
import com.example.uade.tpo.Farmacia.entity.Product;
import com.example.uade.tpo.Farmacia.entity.User;
import com.example.uade.tpo.Farmacia.repository.CartItemRepository;
import com.example.uade.tpo.Farmacia.repository.CartRepository;
import com.example.uade.tpo.Farmacia.repository.OrderItemRepository;
import com.example.uade.tpo.Farmacia.repository.OrderRepository;
import com.example.uade.tpo.Farmacia.repository.ProductRepository;
import com.example.uade.tpo.Farmacia.repository.UserRepository;
import jakarta.transaction.Transactional;


@Service
public class CartService {
    

    private final CartRepository carts;
    private final CartItemRepository items;
    private final UserRepository users;
    private final ProductRepository products;
    private final OrderRepository orders;
    private final OrderItemRepository orderItems;

    public CartService(
        CartRepository carts, CartItemRepository items, UserRepository users,
      ProductRepository products, OrderRepository orders, OrderItemRepository orderItems
    ) {
        this.carts = carts; this.items = items; this.users = users;
    this.products = products; this.orders = orders; this.orderItems = orderItems;
    }

    private Cart getOrCreateOpenCart(User user){
        return carts.findByUserAndStatus(user, Cart.Status.OPEN)
        .orElseGet(() ->{
            Cart c = new Cart();
            c.setUser(user);
            c.setStatus(Cart.Status.OPEN);
            return carts.save(c);
        });
    }

    public Cart getCartByUserEmail(String email){
        User u = users.findByEmail(email).orElseThrow();
        return getOrCreateOpenCart(u);
  }

    @Transactional
    public Cart addItem(String email, Long productId, Integer quantity){
        if (quantity == null || quantity < 1) throw new IllegalArgumentException("Cantidad inválida");
        User u = users.findByEmail(email).orElseThrow();
        Product p = products.findById(productId).orElseThrow();

        if (p.getStock() <= 0) throw new java.lang.IllegalStateException("Producto sin stock");
        if (quantity> p.getStock()) throw new java.lang.IllegalStateException("Cantidad supera stock disponible");

        Cart c = getOrCreateOpenCart(u);

        //si existe item para el producto se suma la cantidad
        CartItem existing = c.getItems().stream()
            .filter(ci -> ci.getProduct().getId().equals(p.getId()))
            .findFirst().orElse(null);

        if (existing!= null){
         existing.setQuantity(existing.getQuantity() + quantity);
         //snapshot con precio actual +desc actual
         existing.setUnitPrice(p.getPrecio());
         existing.setUnitDiscount(p.getDescuento()); // puede ser null
         existing.recomputeLineTotal();
         items.save(existing);
         return carts.save(c);
        }

        CartItem ci = new CartItem();
        ci.setCart(c);
        ci.setProduct(p);
        ci.setQuantity(quantity);
        ci.setUnitPrice(p.getPrecio());
        ci.setUnitDiscount(p.getDescuento()); // absoluto
        ci.recomputeLineTotal();

        c.getItems().add(ci);
        return carts.save(c); 
    }


    @Transactional
    public Cart updateItemQuantity(String email, Long itemId, Integer quantity){
     if (quantity == null || quantity < 1) throw new IllegalArgumentException("Cantidad inválida");

     User u = users.findByEmail(email).orElseThrow();
     Cart c = getOrCreateOpenCart(u);
     CartItem ci = items.findById(itemId).orElseThrow();

     if (!ci.getCart().getId().equals(c.getId()))
      throw new IllegalStateException("El ítem no pertenece al carrito del usuario");

    Product p = ci.getProduct();
    if (quantity > p.getStock()) throw new IllegalStateException("Cantidad supera stock");
    ci.setQuantity(quantity);
    //mantenemos snapshot original (no se recalcula precio ni descuento salvo que quieras)
    ci.recomputeLineTotal();
    items.save(ci);
    return carts.save(c);
  }

    
    @Transactional
    public void removeItem(String email, Long itemId){
        User u = users.findByEmail(email).orElseThrow();
        Cart c = getOrCreateOpenCart(u);
        CartItem ci = items.findById(itemId).orElseThrow();

        if (!ci.getCart().getId().equals(c.getId())) throw new IllegalStateException("Item no pertenece al carrito del usuario");
        c.getItems().remove(ci);
        items.delete(ci);
        carts.save(c);
    }

    @Transactional
    public Long checkout(String email ){
         User u = users.findByEmail(email).orElseThrow();
         Cart c = carts.findByUserAndStatus(u, Cart.Status.OPEN)
         .orElseThrow(() -> new IllegalStateException("No hay carrito abierto"));

    if (c.getItems().isEmpty()) throw new IllegalStateException("Carrito vacío");

    // 1- Validar stock
    for (CartItem it : c.getItems()) {
       if (it.getQuantity() > it.getProduct().getStock())
        throw new IllegalStateException("Sin stock para " + it.getProduct().getNombre());
    }

    //2- Descontar stock
    for (CartItem it : c.getItems()) {
      Product p = it.getProduct();
      p.setStock(p.getStock() - it.getQuantity());
      products.save(p);
    }

    // 3) Crear orden + items (con snapshots)
    Order order = new Order();
    order.setUser(u);
    order.setTotal(c.getItems().stream()
        .map(CartItem::getLineTotal)
        .reduce(BigDecimal.ZERO, BigDecimal::add));
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

    // 4) Cerrar carrito
    c.setStatus(Cart.Status.CHECKED_OUT);
    carts.save(c);

    return order.getId();

    }    
}