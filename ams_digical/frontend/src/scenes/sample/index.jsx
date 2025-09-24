import { React, useState} from "react";
import { Box, Button } from "@mui/material";
import Header from "../global/Header";
import CustomDataGrid from "../global/CustomDataGrid";
import SampleSourceModal from "../modal/SampleSourceModal";
import { format } from "date-fns";

const formatDate = (params) =>{
    if(!params.value) return null;
    const formattedDate = format(new Date(params.value), "dd-MM-yyyy");
    return formattedDate;
} 

const SamplesTableColumns = ({ mode }) => {
  const allCols = [
    {
      field: "title",
      headerName: "Batch",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "date_batch_submitted",
      headerName: "Submitted",
      renderCell: formatDate,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "submitter_lab_name",
      headerName: "Submitter Lab",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "source_name",
      headerName: "Source",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "radionuclide_name",
      headerName: "Radionuclide",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "scheduled_start",
      headerName: "Scheduled Start",
      renderCell: formatDate,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "whiteboard_name",
      headerName: "Abbreviated Name",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "report_sent",
      headerName: "Report Sent",
      renderCell: formatDate,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "staff_assigned",
      headerName: "Operator",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "start",
      headerName: "Analysis Start",
      renderCell: formatDate,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "end",
      headerName: "Analysis End",
      renderCell: formatDate,
      editable: true,
      flex: 1,
      minWidth: 100,
    },
  ];

  // Filter
  if (mode === "dashboard" || mode === "projector") {
    return allCols.filter((column) =>
      ["title", "date_batch_submitted", "start"].includes(column.field)
    );
  }
  return allCols; // Return all columns for editor mode
};

const Sample = ({ mode, data, refetch }) => {
  const samples = data.samples;
  const pageSize = mode === "editor" ? 10 : 5;
  const [showModal, setShowModal] = useState(false);

  const sortedSamples = [...samples].sort((a, b) => {
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

  const [selectedSample, setSelectedSample] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);

  const handleRowClick = (params) => {
    setSelectedSample(params.row);
    setSelectionModel([params.id]);
    setShowModal(true); // Open modal
  };

  return (
    <Box m={mode === "editor" ? "40px" : "5px"}>
      {mode !== "projector" && (
        <>
          {mode === "editor" && (
            <Header title="Batches" subtitle="Batches in lab" />
          )}
          <Box margin="10px" display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              sx={{ fontSize: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Add and Schedule Batches
            </Button>
          </Box>
          <SampleSourceModal
            show={showModal}
            handleClose={() => {setShowModal(false); setSelectedSample(null);}}
            data={data}
            refetch={refetch}
            selectedSample={selectedSample}
            type="sample"
          />
        </>
      )}

      <CustomDataGrid
        table={sortedSamples}
        columns={SamplesTableColumns({ mode })}
        pageSize={pageSize}
        mode={mode}
        onRowClick={handleRowClick}
        selectionModel={selectionModel}
        onRowSelectionModelChange={(newSelection) =>
          setSelectionModel(newSelection)
        }
      />
    </Box>
  );
};

export default Sample;
