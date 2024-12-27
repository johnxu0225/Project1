import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("/auth", { username, password });
            const { role } = response.data;

            // Redirect based on role
            if (role === "manager") {
                navigate("/manager-dashboard");
            } else if (role === "employee") {
                navigate("/employee-dashboard");
            }
        } catch (err) {
            setError("Invalid username or password.");
        }
    };

    return (
        <div>
            <h2>Reimbursement System</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
                Don't have an account? <Link to="/register">Register here</Link>.
            </p>
        </div>
        
    );
};

export default Login;
