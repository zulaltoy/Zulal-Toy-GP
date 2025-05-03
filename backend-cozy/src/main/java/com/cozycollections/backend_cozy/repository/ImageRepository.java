package com.cozycollections.backend_cozy.repository;

import com.cozycollections.backend_cozy.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {  //JpaRepository: Spring’in sağladığı veritabanı işlemlerini otomatik hale getirir (kaydet, sil, bul…).
    List<Image> findImagesByProductId(Long id);
}
