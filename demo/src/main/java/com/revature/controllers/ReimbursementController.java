package com.revature.controllers;

import com.revature.aspects.AdminOnly;
import com.revature.models.Reimbursement;
import com.revature.services.ReimbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reimbursements")
public class ReimbursementController {

    private final ReimbursementService reimbursementService;

    @Autowired
    public ReimbursementController(ReimbursementService reimbursementService) {
        this.reimbursementService = reimbursementService;
    }

    /**
     * Create a new reimbursement for a specific user
     *
     * @param reimbursement Reimbursement object with details
     * @param userId ID of the user submitting the reimbursement
     * @return ResponseEntity containing the created reimbursement
     */
    @PostMapping("/{userId}")
    public ResponseEntity<Reimbursement> createReimbursement(@RequestBody Reimbursement reimbursement, @PathVariable int userId) {
        Reimbursement savedReimbursement = reimbursementService.insertReimbursement(reimbursement, userId);
        return ResponseEntity.status(201).body(savedReimbursement);
    }

    /**
     * Get all reimbursements for a specific user
     *
     * @param userId ID of the user
     * @return ResponseEntity containing a list of reimbursements for the user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reimbursement>> getUserReimbursements(@PathVariable int userId) {
        List<Reimbursement> reimbursements = reimbursementService.getReimbursementsByUserID(userId);

        if (reimbursements.isEmpty()) {
            return ResponseEntity.status(404).body(List.of()); // Return an empty list instead of a string
        }
        return ResponseEntity.ok(reimbursements);
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
     *
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
}