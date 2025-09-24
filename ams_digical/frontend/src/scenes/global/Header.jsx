import { Typography, Box } from "@mui/material";

const Header = ({ title, subtitle }) => {
  return (
    <Box mb="30px">
      <Typography
        component="h1"
        variant="title"
        color="text.primary"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography variant="h3" sx={{ color: "text.secondary" }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
