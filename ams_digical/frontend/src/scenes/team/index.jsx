import { Box, Typography } from "@mui/material";
import CustomDataGrid from "../global/CustomDataGrid";
import Header from "../global/Header";
import { useGridApiRef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { columnsStateInitializer } from "@mui/x-data-grid/internals";

const TeamTableColumns = ({ mode }) => {
  const allCols = [
    {
      field: "staff_name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "user",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => {
        return params.email || "N/A";
      },
    },
    {
      field: "post",
      headerName: "Post",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
  ];
  // Filter
  if (mode === "dashboard" || mode === "projector") {
    return allCols.filter((column) =>
      ["staff_name", "post", "status"].includes(column.field)
    );
  }
  return allCols; // Return all columns for editor mode
};

const Team = ({ mode, data }) => {
  const team = data.staff;
  const apiRef = useGridApiRef();

  return (
    <Box m={mode === "editor" ? "40px" : "5px"}>
      {mode === "editor" ? (
        <Header title="Team" subtitle="Contact and Status of Team Members" />
      ) : null}

      <CustomDataGrid
        title="Team"
        table={team}
        columns={TeamTableColumns({ mode })}
        pageSize={20}
        apiRef={apiRef}
        mode={mode}
      />
      {mode !== "projector" && (
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ textAlign: "center", padding: "20px" }}
        >
          Staff Information Incorrect?{" "}
          <Link
            to="/edit-staff-info"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            Update it Here
          </Link>
        </Typography>
      )}
    </Box>
  );
};

export default Team;
