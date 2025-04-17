package com.cozycollections.backend_cozy.request;

import com.cozycollections.backend_cozy.model.Category;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductUpdateRequest {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int inventory;
    private String material;
    private String brand;
    private String productCode;
    private  String color;
    private Double width;
    private String widthUnit;
    private Double height;
    private String heightUnit;
    private Double length;
    private String lengthUnit;
    private Double weight;
    private String weightUnit;
    private Category category;
}
