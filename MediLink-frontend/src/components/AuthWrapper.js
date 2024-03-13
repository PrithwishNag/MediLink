import { useState, useEffect } from "react";
import { constants } from "../constants/Contants";
import { useLocation, Outlet, Navigate } from "react-router-dom";

const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  async function checkAuthentication() {
    const token = localStorage.getItem(constants.tokenKey);
    if (!token) return;
    try {
      const response = await fetch(constants.hostUrl + "/api/auth/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        console.log("Token still valid");
        setIsAuthenticated(true);
      } else {
        console.error("Token invalid");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("An unexpected error has occurred:", error);
    }
  }

  useEffect(() => {
    checkAuthentication();
  }, []);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" replace state={{ from: location }} />
  );
};

export default AuthWrapper;
