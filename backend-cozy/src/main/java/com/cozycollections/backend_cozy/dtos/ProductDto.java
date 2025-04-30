package com.cozycollections.backend_cozy.dtos;

import com.cozycollections.backend_cozy.model.Category;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
@Data
public class ProductDto {
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
    private List<ImageDto> images;

}
