package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.ImageDto;
import com.cozycollections.backend_cozy.model.Image;
import com.cozycollections.backend_cozy.model.Product;
import com.cozycollections.backend_cozy.repository.ImageRepository;
import com.cozycollections.backend_cozy.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {
    private final ImageRepository imageRepository;

    @Override
    public Image getImageById(Long id) {
        return imageRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("Image not found"));
    }

    @Override
    public void updateImage(MultipartFile file, Long id) {
        Image image = getImageById(id);
        try {
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setImage(new SerialBlob(file.getBytes()));
            imageRepository.save(image);

        } catch (IOException | SQLException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void deleteImage(Long id) {
      imageRepository.findById(id).ifPresentOrElse(imageRepository::delete,()->{
          throw new EntityNotFoundException("Image not found");
      });
    }

    @Override
    public List<ImageDto> saveImages(Long productId, List<MultipartFile> files) {
        return null;
    }
}
