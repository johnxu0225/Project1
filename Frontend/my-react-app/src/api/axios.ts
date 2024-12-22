import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:4444", // Backend base URL
    withCredentials: true,           // Ensures cookies are sent with requests
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
