import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("access");
      const refreshToken = urlParams.get("refresh");
      const newUser = urlParams.get("new_user") === "true";

      if (!accessToken) {
        console.error("Missing access token in callback URL");
        return;
      }

      if (!refreshToken) {
        console.error("Missing refresh token in callback URL");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      console.log("Tokens stored, user authenticated.");

      if (newUser) {
        console.log("New user detected, redirecting to registration page...");
        navigate("/register", { replace: true }); 
      } else {
        console.log("Existing user, proceeding to dashboard.");
        navigate("/dashboard", { replace: true }); 
      }
    
    }

    handleOAuthCallback();
  }, [location, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuthCallback;
