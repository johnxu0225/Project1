package com.revature.controllers;

import com.revature.aspects.AdminOnly;
import com.revature.models.DTOs.IncomingUserDTO;
import com.revature.models.User;
import com.revature.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //Inserting user
    @PostMapping
    public ResponseEntity<User> insertUser(@RequestBody IncomingUserDTO userDTO){
        //send the UserDTO to the service, which will process it and send it to the DAO
        User user = userService.insertUser(userDTO);
        return ResponseEntity.status(201).body(user);
    }

    @AdminOnly
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @AdminOnly
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable int userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @AdminOnly
    @PatchMapping("/{userId}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable int userId,
            @RequestParam String role
    ) {
        try {
            User updatedUser = userService.updateUserRole(userId, role);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
