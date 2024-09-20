/* eslint-disable no-unused-vars */
import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

// API call for user registration
export const registerUserApiCall = async (userData) => {
  try {
    const res = await axios.post(
      `${BACKEND_BASE_URL}/api/auth/register`,
      userData,
      {
        withCredentials: true, // Send credentials (cookies)
      }
    );
    return res.data; // Success response data
  } catch (error) {
    console.error(
      "Registration failed:",
      error?.response?.data || error.message
    );
    // Optionally return error response to handle in the frontend
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

// API call for user login
export const loginUserApiCall = async (userData) => {
  try {
    const res = await axios.post(
      `${BACKEND_BASE_URL}/api/auth/login`,
      userData,
      {
        withCredentials: true, // Send credentials (cookies)
      }
    );
    return res.data; // Success response data
  } catch (error) {
    console.error("Login failed:", error?.response?.data || error.message);
    // Optionally return error response to handle in the frontend
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};
