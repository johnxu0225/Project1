package com.revature.services;

import com.revature.DAOs.UserDAO;
import com.revature.models.DTOs.LoginDTO;
import com.revature.models.DTOs.OutgoingUserDTO;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserDAO userDAO;

    @Autowired
    public AuthService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public OutgoingUserDTO login(LoginDTO loginDTO) {
        // Fetch the user by username
        Optional<User> optionalUser = userDAO.findByUsername(loginDTO.getUsername());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (loginDTO.getPassword().equals(user.getPassword())) {
                // Return an OutgoingUserDTO if credentials are valid
                return new OutgoingUserDTO(user.getUserId(), user.getUsername(), user.getRole());
            }
        }

        // Return null if credentials are invalid
        return null;
    }
}