import { Box, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Calendar from "./scenes/calendar";
import Team from "./scenes/team";
import Sample from "./scenes/sample";
import Source from "./scenes/source";
import Maintenance from "./scenes/maintenance";
import Projector from "./scenes/projector";
import RegisterForm from "./scenes/register";
import Landing from "./scenes/landing";
import OAuthCallback from "./scenes/entraID/AuthCallback";
import ProtectedRoute from "./scenes/entraID/ProtectedRoute";
import LoadData from "./scenes/helpers/LoadData";
import LoadingScreen from "./scenes/helpers/LoadingScreen";
import { dataGridCustomizations } from "./theme/customizations/dataGrid";
import AppTheme from "./theme/AppTheme";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import Profile from "./scenes/profile/profile";
import EditProfile from "./scenes/profile/editProfile";
import EditStaffInfo from "./scenes/team/editStaffInfo";
import { createTheme } from "@mui/material";
import DigicalLogin from "./scenes/login/digicalLogin";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function App({ props }) {
  const [user, setUser] = useState(null);
  const accessToken = localStorage.getItem("accessToken"); // Microsoft token
  const digicalAccessToken = localStorage.getItem("digicalAccessToken"); // DigiCal token

  useEffect(() => {
    if (!accessToken && !digicalAccessToken) {
      setUser(null);
      console.log("No access tokens found");
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
        if (accessToken) {
          localStorage.removeItem("accessToken");
        } else if (digicalAccessToken) {
          localStorage.removeItem("digicalAccessToken");
        }
        setUser(null);
      });
  }, [accessToken, digicalAccessToken]);


  // useEffect to load data on visiting the app - done in one go for performance
  const { data, loading, error, refetchAll } = LoadData();

  const [loadingScreen, setLoading] = useState(true);
  useEffect(() => {
    if (error) {
      setLoading(false);
      console.log("Error fetching data:", error); // Log the error for debugging
    }

    if (!loading && !error) {
      setLoading(false);
    }
  }, [loading, error]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const drawerWidth = 350;
  const collapsedWidth = 150;
  const xThemeComponents = {
    ...dataGridCustomizations,
  };
  return (
    <AppTheme {...props} themeComponents={xThemeComponents} theme={lightTheme}>
      <CssBaseline enableColorScheme />
      <LoadingScreen loading={loadingScreen}>
        {user && (
          <SideBar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            drawerWidth={drawerWidth}
            collapsedWidth={collapsedWidth}
            user={user}
          />
        )}

        <Box
          component="main"
          className="MainContent"
          overflow="auto"
          sx={(theme) => ({
            flexGrow: 1,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            marginLeft: user ? `${collapsedWidth}px` : 0,

            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
          })}
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/oauth2/callback" element={<OAuthCallback />} />
            <Route path="/login" element={<Landing user={user}/>} />
            <Route path="/register" element={<RegisterForm user={user} />} />
            <Route path="/digical-login" element={<DigicalLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={<Dashboard data={data} refetch={refetchAll} />}
              />
              <Route
                path="/team"
                element={<Team mode="editor" data={data} />}
              />
              <Route
                path="/sample"
                element={
                  <Sample mode="editor" data={data} refetch={refetchAll} />
                }
              />
              <Route
                path="/source"
                element={
                  <Source mode="editor" data={data} refetch={refetchAll} />
                }
              />
              <Route
                path="/maintenance"
                element={<Maintenance mode="editor" data={data} refetch={refetchAll}/>}
              />
              <Route
                path="/projector"
                element={<Projector data={data} refetch={refetchAll} />}
              />
              <Route
                path="/calendar"
                element={
                  <Calendar mode="editor" data={data} refetch={refetchAll} />
                }
              />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route
                path="/edit-profile"
                element={<EditProfile user={user} />}
              />
              <Route
                path="/edit-staff-info"
                element={<EditStaffInfo data={data} />}
              />
            </Route>
          </Routes>
        </Box>
      </LoadingScreen>
    </AppTheme>
  );
}

export default App;
