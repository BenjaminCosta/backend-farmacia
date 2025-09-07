package com.example.uade.tpo.Farmacia.controllers;


import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.uade.tpo.Farmacia.entity.Cart;
import com.example.uade.tpo.Farmacia.service.CartAddItemRequest;
import com.example.uade.tpo.Farmacia.service.CartService;

import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/cart")
@PreAuthorize("hasRole('BUYER')") 
public class CartController {
    
    private final CartService service;

    public CartController(CartService service){this.service = service;}

    private String currentEmail(Authentication auth){
        return auth.getName();  //email

    }

    //GET 
    @GetMapping
    public Cart getCart(Authentication auth){
        return service.getCartByUserEmail(currentEmail(auth));

    }

    @PostMapping("/items")
    public Cart addItem(
        @RequestParam Long prodcutId,
        @RequestParam Integer quantity,
        Authentication authentication
    ){Authentication auth;
    CartAddItemRequest productId;
    return service.addItem(currentEmail(auth), productId, quantity);}
    

    //PATCH
    @PatchMapping("/items/{itemId}")
    public Cart updateItem(
        @PathVariable Long itemId,
        @RequestParam Integer quantity,
        Authentication auth
    ){ return service.updateItemQuantity(currentEmail(auth), itemId, quantity); }

    //DELETE
    @DeleteMapping("/items/{itemId}")
    public void deleteItem(@PathVariable Long itemId, Authentication auth){
        service.removeItem(currentEmail(auth), itemId);
    }

    //POST 
    @PostMapping("/checkout")
    public Long checkout(Authentication auth){
        return service.checkout(currentEmail(auth));
    }
    
}