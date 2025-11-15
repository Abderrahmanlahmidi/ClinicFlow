import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import LoadingPage from "../ui/loading/loadingPage";
import { Navigate, useLocation } from "react-router-dom";


export default function PrivateRoute({ children, allowedRoles=[] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/auth/check-auth");
        const userRole = localStorage.getItem("role");
        if(allowedRoles && !allowedRoles.includes(userRole)){
            setIsAuthenticated(false)
        }else{
            setIsAuthenticated(true)
        }
      } catch (error) {
        console.log("if error private route:", error)
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if(isLoading) return <LoadingPage/>
  

  if(!isAuthenticated) return <Navigate to="/login"/>;

  return children;
}
