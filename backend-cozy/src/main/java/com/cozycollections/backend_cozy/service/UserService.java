package com.cozycollections.backend_cozy.service;

import com.cozycollections.backend_cozy.dtos.UserDto;
import com.cozycollections.backend_cozy.model.Role;
import com.cozycollections.backend_cozy.model.User;
import com.cozycollections.backend_cozy.repository.AddressRepository;
import com.cozycollections.backend_cozy.repository.RoleRepository;
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
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final RoleRepository roleRepository;
    private final AddressRepository addressRepository;

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(()->new EntityNotFoundException("User not found"));
    }

    @Override
    public User createUser(CreateUserRequest userRequest) {
        Role userRole = Optional.ofNullable(roleRepository.findByName("ROLE_USER"))
                .orElseThrow(()->new EntityNotFoundException("Role not found"));

        return Optional.of(userRequest)
                .filter(user -> !userRepository.existsByEmail(userRequest.getEmail()))
                .map( req -> {
                    User user = new User();
                    user.setFirstName(userRequest.getFirstName());
                    user.setLastName(userRequest.getLastName());
                    user.setEmail(userRequest.getEmail());
                    user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
                    user.setRoles(Set.of(userRole));
                    User savedUser = userRepository.save(user);
                    Optional.ofNullable(req.getAddresses()).ifPresent(addresses -> {
                        addresses.forEach(address -> {
                            address.setUser(savedUser);
                            addressRepository.save(address);

                        });
                    });
                    return savedUser;
                }).orElseThrow(() ->
                        new EntityExistsException("Oops! " + userRequest.getEmail() + " already exists!"));
    }

    @Override
    public User updateUser(UserUpdateRequest updateRequest,Long userId) {
        return userRepository.findById(userId).map(existingUser ->{
            existingUser.setFirstName(updateRequest.getFirstName());
            existingUser.setLastName(updateRequest.getLastName());
            existingUser.setEmail(updateRequest.getEmail());
            existingUser.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); //Giriş yapan kullanıcıyı güvenlik bağlamından (SecurityContext) alır.
        String email = authentication.getName();

        return Optional.ofNullable(userRepository.findByEmail(email))
                .orElseThrow(()->new EntityNotFoundException("Log in required!"));
    }

    @Override
    public UserDto convertUserToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}
