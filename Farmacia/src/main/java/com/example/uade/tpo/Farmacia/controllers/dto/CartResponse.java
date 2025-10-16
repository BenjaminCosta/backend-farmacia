package com.example.uade.tpo.Farmacia.controllers.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartResponse {
    
    private Long id;
    private String status;
    private List<CartLine> items;
    private BigDecimal total;


    public static class CartLine {
        private Long itemId;
        private Long productId;
        private String name;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal unitDiscount;
        private BigDecimal lineTotal;

        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public BigDecimal getUnitDiscount() { return unitDiscount; }
        public void setUnitDiscount(BigDecimal unitDiscount) { this.unitDiscount = unitDiscount; }
        public BigDecimal getLineTotal() { return lineTotal; }
        public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
    }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public List<CartLine> getItems() { return items; }
        public void setItems(List<CartLine> items) { this.items = items; }
        public BigDecimal getTotal() { return total; }
        public void setTotal(BigDecimal total) { this.total = total; }
}


