package com.cozycollections.backend_cozy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.sql.Blob;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fileName;
    private String fileType;

    @Lob // Large Object: Veritabanında büyük veri olarak saklanır
    private Blob image;

    private String downloadUrl;

    @ManyToOne
    @JoinColumn(name = "product_id")// Bu alan `product_id` sütununu oluşturur (foreign key)
    private Product product;
}
