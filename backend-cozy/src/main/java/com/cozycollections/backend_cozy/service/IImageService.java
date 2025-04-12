package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.ImageDto;
import com.cozycollections.backend_cozy.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    Image getImageById(Long id);
    void updateImage(MultipartFile file, Long id);
    void deleteImage(Long id);
    List<ImageDto> saveImages(Long productId, List<MultipartFile> files);

}
