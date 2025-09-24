import React, { useState, useEffect } from "react";
import { MaintenanceForm,} from "./index";
import { Box, Typography, Modal, Tab, Tabs, IconButton } from "@mui/material";
import "../../theme/Forms.css";
import CloseIcon from "@mui/icons-material/Close";

const tabConfig = [
    {key: "maintenance", label: "Maintenance", component: MaintenanceForm },
];

const MaintenanceModal = ({
  show,
  handleClose,
  selectedDate,
  event,
  deleteEvent,
  setEvents,
  data,
  refetch,
}) => {

    const [activeKey, setActiveKey] = useState("maintenance");

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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              id="event-modal-title"
              component="h1"
              variant="title"
              color="text.primary"
              padding="1rem"
            >
              Maintenance Management
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
                      setEvents,
                      refetch,
                    }}
                  />
                )
            )}
          </Box>
        </Box>
      </Modal>
    );
  };
export default MaintenanceModal;
