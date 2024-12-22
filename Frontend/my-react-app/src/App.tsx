import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ManagerDashboard from "./components/ManagerDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Register from "./components/register";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        </Routes>
    );
};

export default App;
