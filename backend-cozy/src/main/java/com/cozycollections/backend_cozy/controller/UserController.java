package com.cozycollections.backend_cozy.controller;

import com.cozycollections.backend_cozy.dtos.UserDto;
import com.cozycollections.backend_cozy.model.User;
import com.cozycollections.backend_cozy.request.CreateUserRequest;
import com.cozycollections.backend_cozy.request.UserUpdateRequest;
import com.cozycollections.backend_cozy.response.ApiResponse;
import com.cozycollections.backend_cozy.service.Interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final IUserService userService;

    @GetMapping("/user/{userId}/user")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId)  {
        User user = userService.getUserById(userId);
        UserDto userDto = userService.convertUserToDto(user);
        return ResponseEntity.ok(new ApiResponse("User found!", userDto));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addUser(@RequestBody CreateUserRequest createUserRequest)  {
        User user = userService.createUser(createUserRequest);
        UserDto userDto = userService.convertUserToDto(user);
        return ResponseEntity.ok(new ApiResponse("User created!", userDto));
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<ApiResponse> updateUser(@RequestBody UserUpdateRequest userUpdateRequest, @PathVariable Long userId)  {
        User user = userService.updateUser(userUpdateRequest, userId);
        UserDto userDto = userService.convertUserToDto(user);
        return ResponseEntity.ok(new ApiResponse("User updated!", userDto));
    }
    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId)  {
        userService.deleteUser(userId);
        return ResponseEntity.ok(new ApiResponse("User deleted!", userId));
    }
}
