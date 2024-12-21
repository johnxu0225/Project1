package com.revature.services;


import com.revature.DAOs.ReimbursementDAO;
import com.revature.DAOs.UserDAO;
import com.revature.models.Reimbursement;
import com.revature.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service //business logic
public class ReimbursementService {

    private final ReimbursementDAO reimbursementDAO;
    private final UserDAO userDAO;

    @Autowired
    public ReimbursementService(ReimbursementDAO reimbursementDAO, UserDAO userDAO){
        this.reimbursementDAO = reimbursementDAO;
        this.userDAO = userDAO;
    }

    public Reimbursement insertReimbursement(Reimbursement reimbursement, int userId) {

        //check to see if amount less than 0
        if (reimbursement.getAmount() <= 0) {
            throw new IllegalArgumentException("Reimbursement amount must be greater than zero.");
        }
        //check to see if description is valid
        if (reimbursement.getDescription() == null || reimbursement.getDescription().isBlank()) {
            throw new IllegalArgumentException("Reimbursement description cannot be null or blank.");
        }

        //fetch the user from the database
        Optional<User> userOptional = userDAO.findById(userId);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + userId + " not found.");
        }

        //link the user to the reimbursement
        User user = userOptional.get();
        reimbursement.setUser(user);

        // Set default status to "PENDING" (if not provided)
        if (reimbursement.getStatus() == null || reimbursement.getStatus().isBlank()) {
            reimbursement.setStatus("PENDING");
        }

        // Save the reimbursement
        return reimbursementDAO.save(reimbursement);
    }

    //get reimbursement by userId
    public List<Reimbursement> getReimbursementsByUserID(int userId){
        return reimbursementDAO.findByUser_UserId(userId);
    }

    //get all reimbursement
    public List<Reimbursement> getAllReimbursements(){
        return reimbursementDAO.findAll();
    }

    public List<Reimbursement> getUserPendingReimbursements(int userId) {
        return reimbursementDAO.findByUser_UserIdAndStatus(userId, "PENDING");
    }

    public List<Reimbursement> getPendingReimbursements() {
        return reimbursementDAO.findByStatus("PENDING");
    }

    public Reimbursement resolveReimbursement(int reimbursementId, String status) {
        if (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("DENIED")) {
            throw new IllegalArgumentException("Invalid status. Status must be 'APPROVED' or 'DENIED'.");
        }

        Reimbursement reimbursement = reimbursementDAO.findById(reimbursementId)
                .orElseThrow(() -> new IllegalArgumentException("Reimbursement not found."));

        if (!"PENDING".equalsIgnoreCase(reimbursement.getStatus())) {
            throw new IllegalArgumentException("Only pending reimbursements can be resolved.");
        }

        reimbursement.setStatus(status.toUpperCase());
        return reimbursementDAO.save(reimbursement);
    }
}
