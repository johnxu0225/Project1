package com.revature.models;

import jakarta.persistence.*;
import org.springframework.stereotype.Component;

@Component //make class a bean
@Entity //makes a DB based table on this class
@Table(name = "reimbursement")

public class Reimbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//makes primary key auto-increment
    private int reimbid;

    @Column(nullable = false) //must have a value
    private double amount;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String status = "PENDING"; //PENDING(default), APPROVED, DENIED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    private User user;

    public Reimbursement() {
    }

    public Reimbursement(int reimbid, double amount, String description, String status, User user) {
        this.reimbid = reimbid;
        this.amount = amount;
        this.description = description;
        this.status = status;
        this.user = user;
    }

    public int getReimbid() {
        return reimbid;
    }

    public void setReimbid(int reimbid) {
        this.reimbid = reimbid;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Reimbursement{" +
                "reimbid=" + reimbid +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", user=" + user +
                '}';
    }
}
