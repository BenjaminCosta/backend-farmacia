package com.example.uade.tpo.Farmacia.controllers.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    
    private String fullName;
    private String email;
    private String phone;
    private String deliveryMethod;
    private String paymentMethod;
    private AddressDTO address;
    private List<OrderItemRequest> items;
    
    @Data
    public static class AddressDTO {
        private String street;
        private String city;
        private String zip;
    }
    
    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
