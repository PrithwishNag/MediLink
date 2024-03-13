import { useState, useEffect } from "react";
import { constants } from "../constants/Contants";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return isAuthenticated;
};

export default useAuth;
