import { Box } from "@mui/material";

const Message = ({ text, color }) => {
  return (
    <Box
      sx={{
        backgroundColor: color,
        color: "#FFFFFF",
        width: "100%",
        height: "40px",
        top: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {text}
    </Box>
  );
};

export default Message;
