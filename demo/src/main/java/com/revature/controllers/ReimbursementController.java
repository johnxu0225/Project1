package com.revature.controllers;

import com.revature.aspects.AdminOnly;
import com.revature.models.Reimbursement;
import com.revature.services.ReimbursementService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reimbursements")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReimbursementController {

    private final ReimbursementService reimbursementService;

    @Autowired
    public ReimbursementController(ReimbursementService reimbursementService) {
        this.reimbursementService = reimbursementService;
    }

    @PostMapping("/user/self")
    public ResponseEntity<Reimbursement> createReimbursementForLoggedInUser(
            @RequestBody Reimbursement reimbursement,
            HttpSession session
    ) {
        // Retrieve the logged-in user's ID from the session
        Integer userId = (Integer) session.getAttribute("userId");

        if (userId == null) {
            // Return 401 Unauthorized if no user is logged in
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // Delegate reimbursement creation to the service
            Reimbursement savedReimbursement = reimbursementService.insertReimbursement(reimbursement, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReimbursement);
        } catch (IllegalArgumentException e) {
            // Handle bad input and return 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reimbursement>> getUserReimbursements(@PathVariable int userId, HttpSession session) {
        Integer sessionUserId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (sessionUserId == null) {
            // User not logged in
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!role.equals("manager") && !sessionUserId.equals(userId)) {
            // Employee trying to access another user's data
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Fetch reimbursements for the user
        List<Reimbursement> reimbursements = reimbursementService.getReimbursementsByUserID(userId);

        return ResponseEntity.ok(reimbursements); // Return empty list with 200 if no reimbursements
    }

    /**
     * Get all reimbursements (Admin Only)
     *
     * @return ResponseEntity containing a list of all reimbursements
     */

    @AdminOnly
    @GetMapping("/all")
    public ResponseEntity<List<Reimbursement>> getAllReimbursements() {
        List<Reimbursement> reimbursements = reimbursementService.getAllReimbursements();

        if (reimbursements.isEmpty()) {
            return ResponseEntity.status(204).body(List.of()); // 204 No Content for empty lists
        }
        return ResponseEntity.ok(reimbursements);
    }

    /**
     * Get all pending reimbursements for a specific user
     *
     * @param userId ID of the user
     * @return ResponseEntity containing a list of pending reimbursements for the user
     */
    @GetMapping("/user/{userId}/pending")
    public ResponseEntity<List<Reimbursement>> getUserPendingReimbursements(@PathVariable int userId) {
        List<Reimbursement> reimbursements = reimbursementService.getUserPendingReimbursements(userId);
        return ResponseEntity.ok(reimbursements);
    }

    /**
     * Get all pending reimbursements (Admin Only)
     * @return ResponseEntity containing a list of all pending reimbursements
     */
    @AdminOnly
    @GetMapping("/pending")
    public ResponseEntity<List<Reimbursement>> getPendingReimbursements() {
        List<Reimbursement> reimbursements = reimbursementService.getPendingReimbursements();

        if (reimbursements.isEmpty()) {
            return ResponseEntity.status(204).body(List.of());
        }
        return ResponseEntity.ok(reimbursements);
    }

    /**
     * Resolve a reimbursement (Admin Only)
     *
     * @param id ID of the reimbursement to resolve
     * @param status New status for the reimbursement (APPROVED or DENIED)
     * @return ResponseEntity containing the updated reimbursement
     */
    @AdminOnly
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Reimbursement> resolveReimbursement(@PathVariable int id, @RequestParam String status) {
        Reimbursement resolvedReimbursement = reimbursementService.resolveReimbursement(id, status);
        return ResponseEntity.ok(resolvedReimbursement);
    }

    @GetMapping("/user/self")
    public ResponseEntity<List<Reimbursement>> getReimbursementsForLoggedInUser(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Reimbursement> reimbursements = reimbursementService.getReimbursementsByUserID(userId);

        return ResponseEntity.ok(reimbursements);
    }

    @AdminOnly
    @PostMapping("/{userId}")
    public ResponseEntity<Reimbursement> createReimbursementForSpecificUser(
            @RequestBody Reimbursement reimbursement,
            @PathVariable int userId,
            HttpSession session
    ) {
        Integer sessionUserId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (sessionUserId == null || role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Allow only managers to use this endpoint
        if (!role.equals("manager")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Reimbursement savedReimbursement = reimbursementService.insertReimbursement(reimbursement, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReimbursement);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}