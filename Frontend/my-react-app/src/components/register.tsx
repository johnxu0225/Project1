import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const navigate = useNavigate(); // Initialize navigate

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post("/users", {
                firstName,
                lastName,
                username,
                password,
            });

            setSuccess(`User ${response.data.username} registered successfully!`);
            setFirstName("");
            setLastName("");
            setUsername("");
            setPassword("");
            setError("");

            // Redirect to login page after successful registration (optional)
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError("Failed to register. Please try again.");
            setSuccess("");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <label>First Name:</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <label>Last Name:</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Register</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            {/* Back to Login button */}
            <button onClick={() => navigate("/")}>Back to Login</button>
        </div>
    );
};

export default Register;
