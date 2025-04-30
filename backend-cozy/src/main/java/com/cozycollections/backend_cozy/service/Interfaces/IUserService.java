package com.cozycollections.backend_cozy.service.Interfaces;

import com.cozycollections.backend_cozy.dtos.UserDto;
import com.cozycollections.backend_cozy.model.User;
import com.cozycollections.backend_cozy.request.CreateUserRequest;
import com.cozycollections.backend_cozy.request.UserUpdateRequest;

public interface IUserService {
    User getUserById(Long userId);
    User createUser(CreateUserRequest userRequest);
    User updateUser (UserUpdateRequest updateRequest, Long userId);
    void deleteUser (Long userId);
    User getAuthenticatedUser();
    UserDto convertUsertoDto(User user);
}
