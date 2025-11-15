import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import LoadingPage from "../ui/loading/loadingPage";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();


  useEffect(() => {
    const checkPossibility = async () => {

      try {
        await axiosInstance.get("/auth/check-auth");
        setIsAuthenticated(true);
      } catch (error) {
        console.log("if error private public:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPossibility();
  }, []);

  if (isLoading) return <LoadingPage />;

  if (isAuthenticated) return <Navigate to="/unauthorized" />;

  return children;
}
