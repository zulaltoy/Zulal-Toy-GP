package com.cozycollections.backend_cozy.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Category(String name) {
        this.name = name;
    }

    private String name;

    @OneToMany(mappedBy = "category")
    private List<Product> products;
}
