package com.cozycollections.backend_cozy.request;

import lombok.Data;

@Data
public class PaymentRequest {
    private int amount;
    private String currency;
}
