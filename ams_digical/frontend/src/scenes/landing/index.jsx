import {
  Box,
  Button,
  Typography,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import axios from "axios";
import { useColorScheme } from "@mui/material/styles";
import { tokens } from "../../theme";

function Landing() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showLogin, setShowLogin] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { mode, setMode } = useColorScheme();
  const accessToken = localStorage.getItem("accessToken");
  const digicalAccessToken = localStorage.getItem("digicalAccessToken");

  useEffect(() => {
    // Prevent unnecessary API calls
    if (user || (!accessToken && !digicalAccessToken)) {
      return;
    }
  
    let apiUrl = "";
    let headers = {};
  
    if (accessToken) {
      apiUrl = "http://localhost:8000/digical/api/user/"; // Microsoft SSO API
      headers = { Authorization: `Bearer ${accessToken}` };
    } else if (digicalAccessToken) {
      apiUrl = "http://localhost:8000/digical/api/digical-user/"; // DigiCal API
      headers = { Authorization: `Token ${digicalAccessToken}` };
    }
  
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        console.log("Invalid token, logging out...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("digicalAccessToken");
        setUser(null);
      });
  }, [accessToken, digicalAccessToken, user]);

  useEffect(() => {
    if (user) {
      console.log("User authenticated, redirecting to dashboard...");
      navigate("/dashboard", {replace: true});
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 1500);

    const zoomTimer = setTimeout(() => {
      setZoomOut(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(zoomTimer);
    };
  }, []);

  const handleSSOLogin = () => {
    console.log("Logging in with Microsoft SSO...");
    window.location.href = "http://localhost:8000/oauth2/login/";
  };

  const handleDigicalLogin = () => {
    console.log("Logging in with Digical...");
    navigate("/digical-login");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          theme.palette.mode === "dark"
            ? "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)"
            : "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* Glassmorphic Container on left side with blurry background */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          zIndex: 1, // Behind the login box
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 2,
          width: "50vw",
          minHeight: "60vh",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 4,
          padding: 4,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          animation: zoomOut
            ? "zoomOut 1.5s ease-out forwards"
            : "fadeIn 1.5s ease-out forwards",
        }}
      >
        {/* Logo and Title */}
        <Box
          sx={{
            textAlign: "center",
            marginBottom: 5,
          }}
        >
          <TodayRoundedIcon sx={{ fontSize: 80, color: "text.primary" }} />
          <Typography
            variant="h1"
            mt="5rem"
            color="text.primary"
            sx={{
              fontWeight: "bold",
              animation: zoomOut
                ? "zoomOut 1.5s ease-out forwards"
                : "fadeIn 1.5s ease-out forwards",
            }}
          >
            Welcome to DigiCal
          </Typography>
        </Box>

        {/* Login Section */}
        {showLogin && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 0,
            animation: "fadeInButton 1s ease-out forwards 1s",
          }}
        >
          <Divider sx={{ width: "100%", marginBottom: 3 }}>
            <Typography variant="h5" color="text.secondary">
              Continue with
            </Typography>
          </Divider>

          {/* Microsoft SSO Button */}
          <Button
            onClick={handleSSOLogin}
            sx={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "#333333",
              color: "#ffffff",
              border: "1px solid #ddd",
              marginBottom: "1rem",
              "&:hover": { backgroundColor: "#242424" },
            }}
          >
            <MicrosoftIcon sx={{ marginRight: "1rem" }} />
            <Typography variant="h6">Log in with Microsoft</Typography>
          </Button>

          {/* DigiCal SSO Button */}
          <Button
            onClick={handleDigicalLogin}
            sx={{
              width: "100%",
              padding: "1rem",
              backgroundColor: theme.palette.primary.main,
              color: "#ffffff",
              border: "1px solid #ddd",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            <TodayRoundedIcon sx={{ marginRight: "1rem" }} />
            <Typography variant="h6">Log in with DigiCal</Typography>
          </Button>
        </Box>
      )}

      </Box>

      {/* RIGHT SIDE background cover */}
      {/* Right Side - Background Image */}
      <Box
        sx={{
          zIndex: 2,
          flex: 1,
          height: "100vh",
          backgroundImage:
            theme.palette.mode === "dark"
              ? "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)"
              : "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "filter 0.3s ease-in-out",
        }}
      />
      {/* Dark Mode Toggle */}
      <IconButton
        onClick={() => {
          const newMode = theme.palette.mode === "dark" ? "light" : "dark";
          setMode(newMode);
        }}
        sx={{
          zIndex: 2,
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(8px)",
        }}
      >
        {theme.palette.mode === "dark" ? (
          <DarkModeRoundedIcon />
        ) : (
          <LightModeRoundedIcon />
        )}
      </IconButton>

      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInButton {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes zoomOut {
            from { transform: scale(1); opacity: 1; }
            to { transform: scale(0.9) translateY(-20px); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}

export default Landing;
