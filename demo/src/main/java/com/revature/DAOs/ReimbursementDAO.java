package com.revature.DAOs;

import com.revature.models.Reimbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReimbursementDAO extends JpaRepository<Reimbursement, Integer> {
    // Add custom query methods here if needed

    public List<Reimbursement> findByUser_UserId(int userId);

    List<Reimbursement> findByUser_UserIdAndStatus(int userId, String status);

    List<Reimbursement> findByStatus(String status);

    void deleteAllByUser_UserId(int userId);
}