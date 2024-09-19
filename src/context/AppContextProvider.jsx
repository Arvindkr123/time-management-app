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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details
  const [accessToken, setAccessToken] = useState(null); // Store access token in memory
  const navigate = useNavigate();

  // Function to fetch new access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
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
        const response = await axios.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user); // Set user details after successful validation
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
  }, []);

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
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken(); // Get a new access token
          if (newAccessToken) {
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axios(originalRequest); // Retry the failed request
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
