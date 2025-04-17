package com.cozycollections.backend_cozy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    public Product(String name, String description, BigDecimal price, int inventory, String material, String brand, String productCode, String color, Double width, Double height, String widthUnit, String heightUnit, Double length, String lengthUnit, Double weight, Category category, String weightUnit) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.inventory = inventory;
        this.material = material;
        this.brand = brand;
        this.productCode = productCode;
        this.color = color;
        this.width = width;
        this.height = height;
        this.widthUnit = widthUnit;
        this.heightUnit = heightUnit;
        this.length = length;
        this.lengthUnit = lengthUnit;
        this.weight = weight;
        this.category = category;
        this.weightUnit = weightUnit;
    }

}
