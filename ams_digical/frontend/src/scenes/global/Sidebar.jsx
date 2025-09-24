import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Typography,
  Divider,
  useTheme,
  Backdrop,
} from "@mui/material";
import { tokens } from "../../theme";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import { useColorScheme } from "@mui/material/styles";
import LightModeRoundedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeOutlined";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { Menu as MenuIcon } from "@mui/icons-material";

const SideBar = ({
  isSidebarOpen,
  toggleSidebar,
  drawerWidth,
  collapsedWidth,
  user,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode } = useColorScheme();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("digicalAccessToken");
    navigate("/");
    window.location.reload();
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <DashboardRoundedIcon />,
      path: "/dashboard",
    },
    {
      title: "Screen Project",
      icon: <TvOutlinedIcon />,
      path: "/projector",
    },
    {
      title: "Calendar",
      icon: <CalendarTodayOutlinedIcon />,
      path: "/calendar",
    },
    {
      title: "Profile",
      icon: <PersonOutlinedIcon />,
      path: "/profile",
    },
    {
      title: "Contact Team",
      icon: <PeopleOutlinedIcon />,
      path: "/team",
    },
    {
      title: "Samples",
      icon: <ScienceOutlinedIcon />,
      path: "/sample",
    },
    {
      title: "Sources",
      icon: <BiotechOutlinedIcon />,
      path: "/source",
    },
    {
      title: "Maintenance",
      icon: <ConstructionOutlinedIcon />,
      path: "/maintenance",
    },
  ];

  return (
    <>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <Backdrop
          open={isSidebarOpen}
          onClick={toggleSidebar}
          sx={{ zIndex: 999, backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        />
      )}
      <Box
        className="Sidebar"
        overflow="auto"
        overflowX="hidden"
        sx={{
          position: "fixed",
          top: 0,
          height: "100vh",
          backgroundColor: theme.palette.background.paper,
          boxShadow: 3,
          p: 2,
          width: isSidebarOpen ? `${drawerWidth}px` : `${collapsedWidth}px`,
          transform: isSidebarOpen
            ? "translateX(0)"
            : `translateX(-${collapsedWidth})`,
          transition: "transform 1s, width 0.9s",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRight: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {!isSidebarOpen && (
            <>
              <TodayRoundedIcon sx={{ fontSize: 30, color: "text.primary" }} />
              <IconButton onClick={toggleSidebar}>
                <MenuIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </>
          )}
          {isSidebarOpen && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <TodayRoundedIcon
                sx={{
                  fontSize: 30,
                  color: "text.primary",
                }}
              />
              <Typography component="h2" variant="title" color="text.primary">
                DigiCAL
              </Typography>

              <IconButton onClick={toggleSidebar}>
                <MenuIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          )}
        </Box>
        <Divider />
        {/* User Info */}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <AccountCircleOutlinedIcon
            sx={{
              fontSize: isSidebarOpen ? 80 : 40,
              mb: 1,
              color: "text.primary",
            }}
          />
          {isSidebarOpen && (
            <>
              <Typography component="h3" variant="title" color="text.primary">
                {user ? user.name : "Guest"}
              </Typography>
              <Typography
                component="h5"
                variant="subtitle"
                color="text.secondary"
              >
                {user ? user.post || "User" : "Not Logged In"}
              </Typography>
            </>
          )}

          <IconButton
            onClick={() => {
              const newMode = theme.palette.mode === "dark" ? "light" : "dark";
              setMode(newMode);
            }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeRoundedIcon />
            ) : (
              <LightModeRoundedIcon />
            )}
          </IconButton>
        </Box>
        <Divider />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <List>
            {menuItems.map(({ title, icon, path }) => {
              const isSelected = location.pathname === path;
              return (
                <ListItem key={title}>
                  <IconButton
                    onClick={() => isSidebarOpen && toggleSidebar()}
                    component={Link}
                    to={path}
                    sx={{
                      backgroundColor: isSelected
                        ? colors.primary[900]
                        : "transparent",
                    }}
                  >
                    <Box>{icon}</Box>
                    {isSidebarOpen && (
                      <Typography fontSize="1.6vh" color="text.primary">
                        {title}
                      </Typography>
                    )}
                  </IconButton>
                </ListItem>
              );
            })}
            <Divider />
            {/* Authentication Options */}
            {user && (
              <ListItem>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon color="colors.primary[900]" />
                  </ListItemIcon>
                  {isSidebarOpen && (
                    <Typography fontSize="1.6vh" color="text.primary">
                      Log Out
                    </Typography>
                  )}
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default SideBar;
