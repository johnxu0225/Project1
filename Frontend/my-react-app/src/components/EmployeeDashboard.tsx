import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Reimbursement } from "../types";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [newReimbursement, setNewReimbursement] = useState({
        amount: "",
        description: "",
    });
    const [editingReimbursement, setEditingReimbursement] = useState<Reimbursement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReimbursements = async () => {
            try {
                const response = await axios.get("/reimbursements/user/self", {
                    withCredentials: true,
                });
                setReimbursements(response.data);
            } catch (error: any) {
                console.error("Error fetching reimbursements:", error);
                if (error.response?.status === 401) {
                    setError("You are not authorized. Redirecting to login...");
                    setTimeout(() => navigate("/"), 2000);
                } else {
                    setError("Failed to fetch reimbursements.");
                }
            }
        };

        fetchReimbursements();
    }, [navigate]);

    const handleCreateReimbursement = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                "/reimbursements/user/self",
                {
                    amount: parseFloat(newReimbursement.amount),
                    description: newReimbursement.description,
                },
                { withCredentials: true }
            );

            setReimbursements([...reimbursements, response.data]);
            setNewReimbursement({ amount: "", description: "" });
            setSuccess("Reimbursement created successfully!");
        } catch (err) {
            setError("Failed to create reimbursement. Please try again.");
        }
    };

    const handleUpdateReimbursement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReimbursement) return;

        setError("");
        setSuccess("");

        try {
            const response = await axios.patch(
                `/reimbursements/user/self/${editingReimbursement.reimbid}`,
                {
                    amount: editingReimbursement.amount,
                    description: editingReimbursement.description,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setReimbursements(
                reimbursements.map((reimbursement) =>
                    reimbursement.reimbid === editingReimbursement.reimbid
                        ? response.data
                        : reimbursement
                )
            );
            setEditingReimbursement(null);
            setSuccess("Reimbursement updated successfully!");
        } catch (err) {
            setError("Failed to update reimbursement. Please try again.");
        }
    };

    return (
        <div>
            <h2>Your Reimbursements</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            {!error && reimbursements.length > 0 && (
                <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reimbursements.map((reimbursement) => (
                            <tr key={reimbursement.reimbid}>
                                <td>{reimbursement.reimbid}</td>
                                <td>{reimbursement.description}</td>
                                <td>${reimbursement.amount.toFixed(2)}</td>
                                <td>{reimbursement.status}</td>
                                <td>
                                    {reimbursement.status.toUpperCase() === "PENDING" && (
                                        <button
                                            onClick={() => setEditingReimbursement(reimbursement)}
                                            style={{
                                                backgroundColor: "orange",
                                                color: "white",
                                                padding: "5px 10px",
                                                border: "none",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {editingReimbursement && (
                <div>
                    <h3>Edit Reimbursement</h3>
                    <form onSubmit={handleUpdateReimbursement}>
                        <div>
                            <label htmlFor="editAmount">Amount:</label>
                            <input
                                type="number"
                                id="editAmount"
                                value={editingReimbursement.amount || ""}
                                onChange={(e) =>
                                    setEditingReimbursement({
                                        ...editingReimbursement,
                                        amount: parseFloat(e.target.value) || 0,
                                    })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="editDescription">Description:</label>
                            <input
                                type="text"
                                id="editDescription"
                                value={editingReimbursement.description || ""}
                                onChange={(e) =>
                                    setEditingReimbursement({
                                        ...editingReimbursement,
                                        description: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <button type="submit">Save Changes</button>
                        <button
                            type="button"
                            onClick={() => setEditingReimbursement(null)}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
            {!error && reimbursements.length === 0 && <p>No reimbursements found.</p>}

            <h3>Create New Reimbursement</h3>
            <form onSubmit={handleCreateReimbursement} style={{ marginBottom: "20px" }}>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        placeholder="Enter amount"
                        value={newReimbursement.amount}
                        onChange={(e) => setNewReimbursement({ ...newReimbursement, amount: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        placeholder="Enter description"
                        value={newReimbursement.description}
                        onChange={(e) => setNewReimbursement({ ...newReimbursement, description: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Create Reimbursement</button>
            </form>

            <button
                onClick={() => navigate("/")}
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

export default EmployeeDashboard;
