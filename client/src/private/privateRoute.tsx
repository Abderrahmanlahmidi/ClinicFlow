import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import LoadingPage from "../ui/loading/loadingPage";
import { Navigate } from "react-router-dom";


export default function PrivateRoute({ children, allowedRoles = [] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/auth/check-auth");

        const userRole = localStorage.getItem("role");


        if (allowedRoles.length > 0) {
          if (!allowedRoles.includes(userRole)) {
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } else {

          setIsAuthenticated(true);
        }

      } catch (error) {
        console.log("PrivateRoute error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return <LoadingPage />;

  if (!isAuthenticated) return <Navigate to="/" />;

  return children;
}
