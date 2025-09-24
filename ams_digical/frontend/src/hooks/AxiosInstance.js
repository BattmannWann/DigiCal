import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 5000,
  withCredentials: true,  // Ensure cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,  // Allow credentials (cookies, authorization headers) with cross-origin requests
});

// Remove token-based authentication
// Django authentication is now handled via sessions

export default AxiosInstance;
