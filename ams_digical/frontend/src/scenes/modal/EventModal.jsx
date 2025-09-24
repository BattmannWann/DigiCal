import React, { useState, useEffect } from "react";
import {
  BatchProcessForm,
  MaintenanceForm,
  OthersForm,
  StaffAwayForm,
} from "./index";
import { Box, Typography, Modal, Tab, Tabs, IconButton } from "@mui/material";
import "../../theme/Forms.css";
import useFetchData from "../../hooks/useFetchData";
import deleteData from "../../hooks/deleteData";
import CloseIcon from "@mui/icons-material/Close";

const EventModal = ({
  show,
  handleClose,
  selectedDate,
  event,
  deleteEvent,
  setEvents,
  data,
  refetch,
}) => {
  const [tabConfig, setTabConfig] = useState([
    {
      key: "batch-process",
      label: "Batch Process",
      component: BatchProcessForm,
    },
    { key: "maintenance", label: "Maintenance", component: MaintenanceForm },
    { key: "staff-away", label: "Staff Absence", component: StaffAwayForm },
    { key: "others", label: "Others", component: OthersForm },
  ]);
  const [activeKey, setActiveKey] = useState("others");

  useEffect(() => {
    if (event) {
      if (event.resourcetype === "BatchProcessingEvent") {
        setTabConfig([
          {
            key: "batch-process",
            label: "Batch Process",
            component: BatchProcessForm,
          },
        ]);
        setActiveKey("batch-process");
      } else if (event.resourcetype === "GenericEvent") {
        setTabConfig([
          { key: "others", label: "Others", component: OthersForm },
        ]);
        setActiveKey("others");
      } else if (event.resourcetype === "MaintenanceEvent") {
        setTabConfig([
          {
            key: "maintenance",
            label: "Maintenance",
            component: MaintenanceForm,
          },
        ]);
        setActiveKey("maintenance");
      } else if (event.resourcetype === "StaffAwayEvent") {
        setTabConfig([
          {
            key: "staff-away",
            label: "Staff Absence",
            component: StaffAwayForm,
          },
        ]);
        setActiveKey("staff-away");
      }
    } else {
      setTabConfig([
        {
          key: "batch-process",
          label: "Batch Process",
          component: BatchProcessForm,
        },
        {
          key: "maintenance",
          label: "Maintenance",
          component: MaintenanceForm,
        },
        { key: "staff-away", label: "Staff Absence", component: StaffAwayForm },
        { key: "others", label: "Others", component: OthersForm },
      ]);
      setActiveKey("others");
    }
  }, [event]);

  const staffData = data.staff;
  const [staffOptions, setStaffOptions] = useState([]);

  useEffect(() => {
    const formattedStaffOptions = staffData.map((staff) => ({
      value: `${staff.id}`,
      label: `${staff.staff_name}`,
    }));
    setStaffOptions(formattedStaffOptions);
  }, [staffData]);

  const sources = data.sources;
  const [sourceOptions, setSourceOptions] = useState([]);

  useEffect(() => {
    const formattedSourceOptions = sources.map((source) => ({
      value: `${source.id}`,
      label: `${source.machine_name}`,
    }));
    setSourceOptions(formattedSourceOptions);
  }, [sources]);

  const { data: submitterLabs } = useFetchData("/submitter%20lab/");
  const [labOptions, setLabOptions] = useState([]);

  useEffect(() => {
    const formattedLabOptions = submitterLabs.map((lab) => ({
      value: `${lab.id}`,
      label: `${lab.name}`,
    }));
    setLabOptions(formattedLabOptions);
  }, [submitterLabs]);

  const { data: radionuclides } = useFetchData("/radionuclide/");
  const [radionuclideOptions, setRadionuclideOptions] = useState([]);

  useEffect(() => {
    const formattedRadionuclideOptions = radionuclides.map((radionuclide) => ({
      value: `${radionuclide.id}`,
      label: `${radionuclide.name}`,
    }));
    setRadionuclideOptions(formattedRadionuclideOptions);
  }, [radionuclides]);

  const samples = data.samples;
  const [sampleOptions, setSampleOptions] = useState([]);

  useEffect(() => {
    const formattedSampleOptions = samples.map((sample) => ({
      value: `${sample.id}`,
      label: `${sample.title}`,
    }));
    setSampleOptions(formattedSampleOptions);
  }, [samples]);

  const handleDeleteSample = (batchID) => {
    deleteData(`/batches/${batchID}/`);
    setTimeout(() => {
      refetch();
    }, 100);
    handleClose();
  };
  const handleDeleteEvent = (eventID) => {
    deleteEvent(eventID);
    setTimeout(() => {
      refetch();
    }, 100);
    handleClose();
  };
  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="event-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "95vh",
          overflowY: "auto",
          minHeight: "60vh",
        }}
      >
        {/* Modal Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            id="event-modal-title"
            component="h1"
            variant="title"
            color="text.primary"
            padding="1rem"
          >
            Event Management
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Tabs
          value={activeKey}
          onChange={(event, newValue) => setActiveKey(newValue)}
          variant="fullWidth"
        >
          {tabConfig.map(({ key, label }) => (
            <Tab key={key} label={label} value={key} />
          ))}
        </Tabs>

        <Box mt={3}>
          {tabConfig.map(
            ({ key, component: FormComponent }) =>
              activeKey === key && (
                <FormComponent
                  {...{
                    event,
                    handleClose,
                    selectedDate,
                    handleDeleteEvent,
                    staffOptions,
                    sourceOptions,
                    labOptions,
                    radionuclideOptions,
                    sampleOptions,
                    setEvents,
                    refetch,
                    handleDeleteSample,
                  }}
                />
              )
          )}
        </Box>
      </Box>
    </Modal>
  );
};
export default EventModal;
