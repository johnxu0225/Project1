import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { User, Reimbursement } from "../types";

const ManagerDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pendingReimbursements, setPendingReimbursements] = useState<Reimbursement[]>([]);
    const [resolvedReimbursements, setResolvedReimbursements] = useState<Reimbursement[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get("/users/all", { withCredentials: true });
                setUsers(usersResponse.data);

                const pendingResponse = await axios.get("/reimbursements/pending", { withCredentials: true });
                setPendingReimbursements(pendingResponse.data);

                const resolvedResponse = await axios.get("/reimbursements/all", { withCredentials: true });
                setResolvedReimbursements(
                    resolvedResponse.data.filter((r: Reimbursement) => r.status !== "PENDING")
                );
            } catch (err) {
                setError("Failed to fetch data.");
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (userId: number) => {
        try {
            await axios.delete(`/users/${userId}`, { withCredentials: true });
            setUsers(users.filter((user) => user.userId !== userId));
        } catch (err) {
            setError("Failed to delete user.");
        }
    };

    return (
        <div>
            <h2>Manager Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.userId}>
                        {user.username} ({user.role}){" "}
                        <button onClick={() => handleDeleteUser(user.userId)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Pending Reimbursements</h3>
            <ul>
                {pendingReimbursements.map((reimbursement) => (
                    <li key={reimbursement.reimbid}>
                        {reimbursement.description} - ${reimbursement.amount}
                    </li>
                ))}
            </ul>

            <h3>Resolved Reimbursements</h3>
            <ul>
                {resolvedReimbursements.map((reimbursement) => (
                    <li key={reimbursement.reimbid}>
                        {reimbursement.description} - ${reimbursement.amount} ({reimbursement.status})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManagerDashboard;