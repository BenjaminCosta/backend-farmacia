package com.example.uade.tpo.Farmacia.controllers.dto;

import com.example.uade.tpo.Farmacia.entity.Order;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderDTO {
    private Long id;
    private String userEmail;
    private String userName;
    private Order.Status status;
    private BigDecimal total;
    private Instant createdAt;
    private List<OrderItemDTO> items;

    public OrderDTO() {}

    public OrderDTO(Long id, String userEmail, String userName,
                    Order.Status status, BigDecimal total,
                    Instant createdAt, List<OrderItemDTO> items) {
        this.id = id;
        this.userEmail = userEmail;
        this.userName = userName;
        this.status = status;
        this.total = total;
        this.createdAt = createdAt;
        this.items = items;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Order.Status getStatus() { return status; }
    public void setStatus(Order.Status status) { this.status = status; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}
