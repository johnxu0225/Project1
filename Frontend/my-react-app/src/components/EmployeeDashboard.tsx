import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Reimbursement } from "../types";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const EmployeeDashboard: React.FC = () => {
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [newReimbursement, setNewReimbursement] = useState({
        amount: "",
        description: "",
    });
    const navigate = useNavigate(); // Initialize navigate

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
                    setTimeout(() => navigate("/"), 2000); // Redirect to login page after 2 seconds
                } else {
                    setError("Failed to fetch reimbursements.");
                }
            }
        };

        fetchReimbursements();
    }, [navigate]); // Include navigate as a dependency

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

            // Update reimbursements list with the new reimbursement
            setReimbursements([...reimbursements, response.data]);
            setNewReimbursement({ amount: "", description: "" });
            setSuccess("Reimbursement created successfully!");
        } catch (err) {
            setError("Failed to create reimbursement. Please try again.");
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
                        </tr>
                    </thead>
                    <tbody>
                        {reimbursements.map((reimbursement) => (
                            <tr key={reimbursement.reimbid}>
                                <td>{reimbursement.reimbid}</td>
                                <td>{reimbursement.description}</td>
                                <td>${reimbursement.amount.toFixed(2)}</td>
                                <td>{reimbursement.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

            {/* Back to Login Button */}
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
