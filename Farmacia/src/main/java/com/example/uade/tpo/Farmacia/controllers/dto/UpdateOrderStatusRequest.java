package com.example.uade.tpo.Farmacia.controllers.dto;

import com.example.uade.tpo.Farmacia.entity.Order;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private Order.Status status;
}
