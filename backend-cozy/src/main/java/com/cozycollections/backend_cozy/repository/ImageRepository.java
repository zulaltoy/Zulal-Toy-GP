package com.cozycollections.backend_cozy.repository;

import com.cozycollections.backend_cozy.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
