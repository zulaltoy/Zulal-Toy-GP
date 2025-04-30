package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.UserDto;
import com.cozycollections.backend_cozy.model.User;
import com.cozycollections.backend_cozy.repository.UserRepository;
import com.cozycollections.backend_cozy.request.CreateUserRequest;
import com.cozycollections.backend_cozy.request.UserUpdateRequest;
import com.cozycollections.backend_cozy.service.Interfaces.IUserService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(()->new EntityNotFoundException("User not found"));
    }

    @Override
    public User createUser(CreateUserRequest userRequest) {
        return Optional.of(userRequest)
                .filter(user -> !userRepository.existsByEmail(userRequest.getEmail()))
                .map( req -> {
                    User user = new User();
                    user.setFirstName(userRequest.getFirstName());
                    user.setLastName(userRequest.getLastName());
                    user.setEmail(userRequest.getEmail());
                    user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
                    return userRepository.save(user);
                }).orElseThrow(()-> new EntityExistsException(userRequest.getEmail() + "already exists!"));

    }

    @Override
    public User updateUser(UserUpdateRequest updateRequest,Long userId) {
        return userRepository.findById(userId).map(existingUser ->{
            existingUser.setFirstName(updateRequest.getFirstName());
            existingUser.setLastName(updateRequest.getLastName());
            existingUser.setEmail(updateRequest.getEmail());
            existingUser.setPassword(updateRequest.getPassword());
            return userRepository.save(existingUser);
        }).orElseThrow(()-> new EntityNotFoundException("User not found!"));
    }

    @Override
    public void deleteUser(Long userId) {

        userRepository.findById(userId).ifPresentOrElse(userRepository::delete, () -> {
            throw new EntityNotFoundException("User not found!");
        });
    }

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(()->new EntityNotFoundException("Log in required!"));
    }

    @Override
    public UserDto convertUsertoDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}
