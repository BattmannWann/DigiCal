import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = ({ loading, message = "Loading...", children }) => {
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={100} />
        <Typography variant="h3" mt={2}>
          {message}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>; //renders wrapped components when done
};

export default LoadingScreen;
