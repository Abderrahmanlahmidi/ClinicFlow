import React, { useEffect, useState } from "react";
import { axiosInstance } from "../services/axiosInstance";
import LoadingPage from "../ui/loading/loadingPage";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axiosInstance.get("/auth/check-auth", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) return <LoadingPage />;

  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}
