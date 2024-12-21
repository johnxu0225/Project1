package com.revature.services;

import com.revature.DAOs.ReimbursementDAO;
import com.revature.DAOs.UserDAO;
import com.revature.models.DTOs.IncomingUserDTO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    //constructor inject
    private final UserDAO userDAO;
    private final ReimbursementDAO reimbursementDAO;

    @Autowired
    public UserService(UserDAO userDAO, ReimbursementDAO reimbursementDAO){
        this.userDAO = userDAO;
        this.reimbursementDAO = reimbursementDAO;

    }

    public User insertUser(IncomingUserDTO userDTO){
        if (userDTO.getUsername() == null || userDTO.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or blank.");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or blank.");
        }

        if (userDAO.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }

        String role = (userDTO.getRole() == null || userDTO.getRole().isBlank()) ? "employee" : userDTO.getRole();

        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setUsername(userDTO.getUsername());
        user.setPassword((userDTO.getPassword()));
        user.setRole(role);

        return userDAO.save(user);
    }

    public List<User> getAllUsers() {
        return userDAO.findAll();
    }

    @Transactional
    public void deleteUser(int userId) {
        if (!userDAO.existsById(userId)) {
            throw new IllegalArgumentException("User not found.");
        }

        // Delete all reimbursements related to the user
        reimbursementDAO.deleteAllByUser_UserId(userId);

        // Delete the user
        userDAO.deleteById(userId);
    }
}
