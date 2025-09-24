import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Header from "../global/Header";
import CustomDataGrid from "../global/CustomDataGrid";
import { useGridApiRef } from "@mui/x-data-grid";
import SampleSourceModal from "../modal/SampleSourceModal";
import { useState } from "react";
import { format } from "date-fns";

const formatDate = (params) =>{
    if(!params.value) return null;
    const formattedDate = format(new Date(params.value), "dd-MM-yyyy");
    return formattedDate;
} 

const SourcesTableColumns = ({ mode }) => {
  const allCols = [
    {
      field: "title",
      headerName: "Batch",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "start",
      headerName: "Analysis Starts on",
      renderCell: formatDate,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "end",
      headerName: "Analysis Ends on",
      renderCell: formatDate,
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => {
        return !params ? "" : new Date(params).toISOString().split("T")[0];
      },
    },
  ];

  if (mode === "projector") {
    return allCols.filter((column) => ["title", "end"].includes(column.field));
  }
  return allCols;
};

const Source = ({ mode, data, refetch }) => {
  const sources = data.sources;
  const samples = data.samples;
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

  const apiRef = useGridApiRef();
  const [source, setSource] = React.useState(0);
  const [batches_processed, setBatchesProcessed] = React.useState(0);
  const [last_maintenance, setLastCleaned] = React.useState("N/A");
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    if (sources.length > 0) {
      const initialSource = sources[0];
      setBatchesProcessed(initialSource ? initialSource.batches_processed : 0);
      setLastCleaned(initialSource ? initialSource.last_maintenance : "N/A");
    }
  }, [sources]);

  const pageSize = mode === "editor" ? 10 : 5;

  const handleSourceChange = (event, newSourceIndex) => {
    setSource(newSourceIndex);

    // Update batches_processed and last cleaned with the source
    const sourceData = sources[newSourceIndex];
    setBatchesProcessed(sourceData ? sourceData.batches_processed : 0);
    setLastCleaned(sourceData ? sourceData.last_maintenance : "N/A");
  };

  // Filter samples by source
  const getFilteredRows = (sourceLabel) => {
    return sortedSamples.filter(
      (row) => Number(row.source) === Number(sourceLabel)
    );
  };

  // Render the "Projector View" layout
  const renderProjectorView = () => (
    <Box display="flex" flexWrap="wrap" flexDirection="column">
      {sources.map((src, index) => (
        <Box display="flex">
          <Box
            key={src.machine_name}
            p={1}
            borderRadius={2}
            boxShadow={1}
            flex="1 1 20%"
          >
            <Typography fontSize="1.9rem" pt="5px" m="0" gutterBottom>
              {src.machine_name}
            </Typography>
            <CustomDataGrid
              title={src.machine_name}
              source={index}
              sources={sources}
              table={getFilteredRows(src.id)}
              columns={SourcesTableColumns({ mode })}
              batches_processed={src.batches_processed}
              last_maintenance={src.last_maintenance}
              apiRef={apiRef}
              pageSize={pageSize}
              mode={mode}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
  // Render the "Dashboard" or "Editor" layout
  const renderToggleView = () => (
    <>
      <Box margin="10px" display="flex" justifyContent="center">
        <Button
          variant="outlined"
          color="primary"
          sx={{ fontSize: "100%" }}
          onClick={() => setShowModal(true)}
        >
          Add Batch and Edit Source
        </Button>
      </Box>
      <CustomDataGrid
        title="Sources"
        table={getFilteredRows(sources[source]?.id)}
        columns={SourcesTableColumns({ mode })}
        source={source}
        onChange={handleSourceChange}
        apiRef={apiRef}
        pageSize={pageSize}
        mode={mode}
        sources={sources}
        batches_processed={batches_processed}
        last_maintenance={last_maintenance}
      />
      <SampleSourceModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        data={data}
        refetch={refetch}
        type="source"
        source = {sources[source]}
      />
    </>
  );

  return (
    <Box m={mode === "editor" ? "40px" : "5px"}>
      {mode === "editor" ? (
        <Header title="Source" subtitle="Detailed Lab Sources" />
      ) : null}

      {mode === "projector" ? renderProjectorView() : renderToggleView()}
    </Box>
  );
};

export default Source;
