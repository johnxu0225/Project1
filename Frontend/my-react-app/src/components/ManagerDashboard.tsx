import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { User, Reimbursement } from "../types";
import { useNavigate } from "react-router-dom";

const ManagerDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pendingReimbursements, setPendingReimbursements] = useState<Reimbursement[]>([]);
    const [resolvedReimbursements, setResolvedReimbursements] = useState<Reimbursement[]>([]);
    const [newReimbursement, setNewReimbursement] = useState<{ userId: number; description: string; amount: string }>({
        userId: 0,
        description: "",
        amount: "",
    });
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get("/users/all", { withCredentials: true });
                setUsers(usersResponse.data || []); // Default to empty array if no data

                const pendingResponse = await axios.get("/reimbursements/pending", { withCredentials: true });
                setPendingReimbursements(pendingResponse.data || []); // Default to empty array if no data

                const allResponse = await axios.get("/reimbursements/all", { withCredentials: true });
                setResolvedReimbursements(
                    (allResponse.data || []).filter((r: Reimbursement) => r.status !== "PENDING")
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

    const handleResolveReimbursement = async (id: number, status: string) => {
        try {
            await axios.patch(`/reimbursements/${id}/resolve?status=${status}`, {}, { withCredentials: true });
            setPendingReimbursements(
                pendingReimbursements.filter((reimbursement) => reimbursement.reimbid !== id)
            );
            setResolvedReimbursements([
                ...resolvedReimbursements,
                { ...pendingReimbursements.find((reimbursement) => reimbursement.reimbid === id), status },
            ]);
        } catch (err) {
            setError("Failed to resolve reimbursement.");
        }
    };

    const handleCreateReimbursement = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        try {
            const { userId, description, amount } = newReimbursement;
            const response = await axios.post(
                `/reimbursements/${userId}`, 
                {
                    amount: parseFloat(amount),
                    description,
                },
                { withCredentials: true }
            );
    
            setPendingReimbursements([...pendingReimbursements, response.data]);
            setNewReimbursement({ userId: 0, description: "", amount: "" });
            setSuccess("Reimbursement created successfully!");
        } catch (err) {
            setError("Failed to create reimbursement. Please check the inputs and try again.");
            console.error("Error creating reimbursement:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout", {}, { withCredentials: true });
        } catch (err) {
            console.error("Failed to log out:", err);
        } finally {
            navigate("/");
        }
    };

    const handleUpdateUserRole = async (userId: number, role: string) => {
        try {
            const response = await axios.patch(
                `/users/${userId}/role?role=${role}`,
                {},
                { withCredentials: true }
            );
            setUsers(
                users.map((user) =>
                    user.userId === userId ? { ...user, role: response.data.role } : user
                )
            );
            setSuccess(`User ID ${userId} role updated to ${role}.`);
        } catch (err) {
            setError("Failed to update user role. Please try again.");
            console.error("Error updating role:", err);
        }
    };

    return (
        <div>
            <h2>Manager Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <h3>Create Reimbursement</h3>
            <form onSubmit={handleCreateReimbursement} style={{ marginBottom: "20px" }}>
                <label>
                    User ID:
                    <select
                        value={newReimbursement.userId}
                        onChange={(e) => setNewReimbursement({ ...newReimbursement, userId: parseInt(e.target.value) })}
                        required
                    >
                        <option value="0" disabled>
                            Select User
                        </option>
                        {users.map((user) => (
                            <option key={user.userId} value={user.userId}>
                                {user.username} (ID: {user.userId})
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={newReimbursement.amount}
                        onChange={(e) => setNewReimbursement({ ...newReimbursement, amount: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Description:
                    <input
                        type="text"
                        value={newReimbursement.description}
                        onChange={(e) => setNewReimbursement({ ...newReimbursement, description: e.target.value })}
                        required
                    />
                </label>
                <button type="submit">Create</button>
            </form>

        <h3>Users</h3>
            {/* Users Table */}
            <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user.userId)} style={{ marginRight: "10px" }}>
                                        Delete
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleUpdateUserRole(
                                                user.userId,
                                                user.role === "employee" ? "manager" : "employee"
                                            )
                                        }
                                        style={{
                                            backgroundColor: user.role === "employee" ? "green" : "orange",
                                            color: "white",
                                            padding: "5px 10px",
                                            border: "none",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        {user.role === "employee" ? "Promote to Manager" : "Demote to Employee"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Pending and Resolved Reimbursements */}
            {/* Pending Reimbursements Table */}
            <h3>Pending Reimbursements</h3>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingReimbursements.length > 0 ? (
                        pendingReimbursements.map((reimbursement) => (
                            <tr key={reimbursement.reimbid}>
                                <td>{reimbursement.reimbid}</td>
                                <td>{reimbursement.description}</td>
                                <td>${reimbursement.amount.toFixed(2)}</td>
                                <td>
                                    <button onClick={() => handleResolveReimbursement(reimbursement.reimbid, "APPROVED")}>
                                        Approve
                                    </button>
                                    <button onClick={() => handleResolveReimbursement(reimbursement.reimbid, "DENIED")}>
                                        Deny
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>No pending reimbursements found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>Resolved Reimbursements</h3>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                        {resolvedReimbursements && resolvedReimbursements.length > 0 ? (
                            resolvedReimbursements.map((reimbursement) => (
                                <tr key={reimbursement.reimbid}>
                                    <td>{reimbursement.reimbid}</td>
                                    <td>{reimbursement.description || "No description provided"}</td>
                                    <td>${reimbursement.amount ? reimbursement.amount.toFixed(2) : "0.00"}</td>
                                    <td>{reimbursement.status || "Unknown"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>No resolved reimbursements found.</td>
                            </tr>
                        )}
                </tbody>
            </table>

            {/* Back to Login Button */}
            <button
                onClick={handleLogout}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Back to Login
            </button>
        </div>
    );
};

export default ManagerDashboard;
