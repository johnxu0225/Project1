export interface User {
    userId: number;
    username: string;
    role: string;
}

export interface Reimbursement {
    reimbid: number;
    amount: number;
    description: string;
    status: string;
    user: User;
}
