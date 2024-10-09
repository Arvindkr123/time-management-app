/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  createContext,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details
  const [accessToken, setAccessToken] = useState(null); // Store access token in memory
  const navigate = useNavigate();

  // Function to fetch new access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}/api/auth/refresh`, {
        withCredentials: true,
      });
      setAccessToken(response.data.accessToken); // Store new access token in memory
      return response.data.accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  // Function to validate user session on page load
  const validateUserSession = async () => {
    try {
      const token = await refreshAccessToken(); // Refresh token if needed
      if (token) {
        const response = await axios.get(`${BACKEND_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user); // Set user details after successful validation
        navigate("/");
      } else {
        setUser(null);
        navigate("/login"); // Redirect to login if refresh fails
      }
    } catch (error) {
      console.error("Error validating user session:", error);
      setUser(null);
      navigate("/login");
    }
  };

  // useLayoutEffect to validate user session on first load
  useLayoutEffect(() => {
    validateUserSession();
  }, [accessToken]);

  // Axios interceptor to handle token expiration and retry requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized), try to refresh the token
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Prevent endless loops of retries

          // Refresh the access token
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            // Retry the original request with the new access token
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axios(originalRequest); // Retry the failed request
          } else {
            // If token refresh fails, call validateUserSession to check the user's session
            await validateUserSession();
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup function to remove the interceptors when the component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, accessToken, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
