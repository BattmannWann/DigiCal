import React from "react";
import { Box, useTheme, Typography, Button } from "@mui/material";
import { tokens } from "../../theme";

const FormFooter = ({ event, handleClose, handleDeleteEvent, selectedSample, deleteSample, source, deleteSource }) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      mt="10px"
      justifyContent="end"
      sx={{
        "& .btn#submit ": {
          backgroundColor: "success.main",
          border: "none",
          margin: "10px",

          "&:hover": {
            backgroundColor: "success.dark",
          },
        },
        "& .btn#cancel ": {
          backgroundColor: "warning.main",
          border: "none",
          margin: "10px",
          "&:hover": {
            backgroundColor: "warning.dark",
          },
        },
        "& .btn#delete ": {
          backgroundColor: "error.main",
          border: "none",
          margin: "10px",
          "&:hover": {
            backgroundColor: "error.dark",
          },
        },
      }}
    >
      {/* Modal Footer */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button type="submit" color="primary">
          <Typography
            component="h5"
            variant="subtitle1"
            color="palette.primary.main"
          >
            Submit
          </Typography>
        </Button>
        <Button onClick={handleClose} color="secondary">
          <Typography
            component="h5"
            variant="subtitle1"
            color="palette.primary.main"
          >
            Cancel
          </Typography>
        </Button>
        {event && (
          <Button onClick={handleDeleteEvent} color="error">
            <Typography
              component="h5"
              variant="subtitle1"
              color="palette.primary.main"
            >
              Delete
            </Typography>
          </Button>
        )}
        {selectedSample && (
          <Button onClick={deleteSample} color="error">
            <Typography
              component="h5"
              variant="subtitle1"
              color="palette.primary.main"
            >
              Delete
            </Typography>
          </Button>
        )}
        {source && (
          <Button onClick={deleteSource} color="error">
            <Typography
              component="h5"
              variant="subtitle1"
              color="palette.primary.main"
            >
              Delete
            </Typography>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FormFooter;
