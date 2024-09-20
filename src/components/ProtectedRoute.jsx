/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AppContextProvider";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  // Check if user is authenticated
  // if (!user) {
  //   // If not authenticated, redirect to the login page
  //   return <Navigate to="/login" />;
  // }

  // Otherwise, render the children (the actual component)
  return children;
};

export default ProtectedRoute;
