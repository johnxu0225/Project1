package com.revature.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.springframework.stereotype.Component;

@Component //make class a bean
@Entity //makes a DB based table on this class
@Table(name = "reimbursements")

public class Reimbursement {
}
