import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Header from "../global/Header";
import CustomDataGrid from "../global/CustomDataGrid";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import MaintenanceModal from "../modal/MaintenanceModal";
import { format } from "date-fns";

const formatDate = (params) =>{
    if(!params.value) return null;
    const formattedDate = format(new Date(params.value), "dd-MM-yyyy");
    return formattedDate;
} 

const ScheduledTableColumns = ({ mode }) => {
  const allCols = [
    { field: "title", headerName: "Task", flex: 1 },
    { field: "area", headerName: "Maintenance Area", flex: 1 },
    { field: "responsible_staff_name", headerName: "Assigned To", flex: 1 },
    { field: "asso_machine_name", headerName: "Machine", flex:1},
    { field: "start", headerName: "Scheduled start", renderCell: formatDate, flex: 1 },
    { field: "end", headerName: "Scheduled end", renderCell: formatDate, flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];
  if (mode === "dashboard" || mode === "projector") {
    return allCols.filter((column) =>
      ["title", "start", "status"].includes(column.field)
    );
  }
  return allCols;
};

const UnscheduledTableColumns = ({ mode }) => {
  const allCols = [
    { field: "title", headerName: "Issue", flex: 1 },
    { field: "area", headerName: "Maintenance Area", flex: 1 },
    { field: "asso_machine_name", headerName: "Machine", flex:1},
    { field: "report_by_name", headerName: "Reported By", flex: 1 },
    {
      field: "report_date",
      headerName: "Reported on",
      renderCell: formatDate,
      flex: 1,
    },
    { field: "status", headerName: "Status", flex: 1 },
  ];
  if (mode === "dashboard" || mode === "projector") {
    return allCols.filter((column) =>
      ["title", "report_date", "status"].includes(column.field)
    );
  }
  return allCols;
};

const Maintenance = ({ mode, data, refetch }) => {
  const maintenance = data.maintenance;
  const scheduledData = maintenance.filter((event) => event.start != null);
  const unscheduledData = maintenance.filter((event) => event.start == null);

  const sortedMaintenance = [...scheduledData].sort((a, b) => {
    const now = new Date();
    const startA = a.start ? new Date(a.start) : null;
    const startB = b.start ? new Date(b.start) : null;
    const endA = a.end ? new Date(a.end) : null;
    const endB = b.end ? new Date(b.end) : null;

    const isPastA = endA && endA < now;
    const isPastB = endB && endB < now;

    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;

    if (!startA && !startB) return 0;
    if (!startA) return 1;
    if (!startB) return -1;

    return startA - startB;
  });

  const [view, setView] = useState("scheduled"); // Toggles between scheduled and unscheduled
  const pageSize = mode === "editor" ? 10 : 5;

  const [showModal, setShowModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  
  const handleRowClick = (params) => {
      setSelectedMaintenance(params.row);
      setSelectionModel([params.id]);
      setShowModal(true);
  };

  const renderContent = () => {
    const isScheduled = view === "scheduled";
    const columns = isScheduled
      ? ScheduledTableColumns({ mode })
      : UnscheduledTableColumns({ mode });
    const tableData = isScheduled? sortedMaintenance : unscheduledData;

    return (
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="10px"
          sx={{
            fontSize: "6rem",
          }}
        >
          <Typography fontSize="2vh" p="10px" m="0">
            {isScheduled ? "Maintenance" : "Faults"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontSize: "1.4vh",
            }}
            onClick={() => setView(isScheduled ? "unscheduled" : "scheduled")}
          >
            {isScheduled ? "View Faults" : "View Maintenance"}
            <DoubleArrowIcon
              sx={{
                fontSize: "1.4vh",
              }}
            />
          </Button>
          <Box margin="10px" display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontSize: "1rem" }}
              onClick={() => setShowModal(true)}
            >
              Add Maintenance
            </Button>
          </Box>
          <MaintenanceModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            data={data}
            refetch={refetch}
            event={selectedMaintenance}
          />
        </Box>

        <CustomDataGrid
          table={tableData}
          columns={columns}
          pageSize={pageSize}
          mode={mode}
          onRowClick={handleRowClick}
          selectionModel={selectionModel}
          onRowSelectionModelChange={(newSelection) =>
            setSelectionModel(newSelection)
          }
        />
      </>
    );
  };

  return (
    <Box
      m={mode === "editor" ? "40px" : "5px"}
    >
      {mode === "editor" && (
        <>
          <Header
            title="Scheduled Maintenance"
            subtitle="Upcoming and Current Maintenances"
          />
          <Box margin="10px" display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontSize: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Add Maintenance
            </Button>
          </Box>
          <MaintenanceModal
            show={showModal}
            handleClose={() => {setShowModal(false); setSelectedMaintenance(null);}}
            data={data}
            refetch={refetch}
            event={selectedMaintenance}
          />

          <CustomDataGrid
            table={sortedMaintenance}
            columns={ScheduledTableColumns({ mode })}
            pageSize={pageSize}
            onRowClick={handleRowClick}
            selectionModel={selectionModel}
            onRowSelectionModelChange={(newSelection) =>
              setSelectionModel(newSelection)
            }
          />
          <Box m="50px" />
          <Header
            title="Unscheduled Maintenance"
            subtitle="Faults Reported in Lab"
          />
          <Box margin="10px" display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontSize: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Add Maintenance
            </Button>
          </Box>
          {/* table={maintenance?.type === "unscheduled" || []} */}
          <CustomDataGrid
            table={unscheduledData}
            columns={UnscheduledTableColumns({ mode })}
            pageSize={pageSize}
            onRowClick={handleRowClick}
            selectionModel={selectionModel}
            onRowSelectionModelChange={(newSelection) =>
              setSelectionModel(newSelection)
            }
          />
        </>
      )}
      {mode !== "editor" && renderContent()}
    </Box>
  );
};

export default Maintenance;
