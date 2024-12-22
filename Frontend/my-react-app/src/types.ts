export interface User {
    userId: number;
    username: string;
    role: string;
}

export interface Reimbursement {
    reimbid: number;
    description: string;
    amount: number;
    status: string;
    userId: number; 
}