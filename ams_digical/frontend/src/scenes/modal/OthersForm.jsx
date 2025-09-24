import { Box, Typography } from "@mui/material";
import * as yup from "yup";
import CustomForm from "./CustomForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import useFormSubmit from "../../hooks/useFormSubmit";

const userSchema = yup.object().shape({
  start: yup.date().required("required"),
  end: yup.date().required("required"),
  responsible_staff: yup.string().required("required"),
  comments: yup.string(),
});

const initialValues = (event, selectedDate) => {
  return {
    start: event ? new Date(event.start) : selectedDate? new Date(selectedDate) : "",
    end: event ? new Date(event.end) : "",
    title: event?.title ?? "",
    comments: event? event.description : "",
    responsible_staff: event?.responsible_staff ?? "",
  };
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

const OthersForm = ({
  setEvents,
  handleClose,
  event,
  selectedDate,
  handleDeleteEvent,
  refetch,
  staffOptions,
}) => {
  const fields = [
    { name: "start", label: "Start Date", type: "date", gridColumn: "span 2" },
    { name: "end", label: "End Date", type: "date", gridColumn: "span 2" },
    { name: "title", label: "Event Title", gridColumn: "span 4" },
    {
      name: "comments",
      label: "Comments",
      type: "textarea",
      gridColumn: "span 4",
    },
    {
      name: "responsible_staff",
      label: "Staff Member",
      type: "select",
      gridColumn: "span 4",
      options: staffOptions,
    },
  ];

  const { handleFormSubmit } = useFormSubmit();

  const onSubmit = async (values, actions) => {
    const formattedValues = {
      title: values.title,
      start: formatDate(values.start),
      end: formatDate(values.end),
      description: values.comments,
      responsible_staff: values.responsible_staff,
    };

    const endpoint = event?.id
      ? `/generic%20event/${event.id}/`
      : "/generic%20event/";

    const method = event ? "put" : "post";
 
    handleFormSubmit(
      endpoint,
      formattedValues,
      actions,
      setEvents,
      handleClose,
      method,
    );
    setTimeout(() => {refetch();}, 100);
  };

  return (
    <Box>
      <Typography
        component="h2"
        variant="title"
        color="text.primary"
        sx={{ mb: 2 }}
      >
        {event ? "Edit Event" : "Add New Event"}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CustomForm
          handleClose={handleClose}
          event={event}
          selectedDate={selectedDate}
          onSubmit={onSubmit}
          deleteEvent={handleDeleteEvent}
          userSchema={userSchema}
          fields={fields}
          initialValues={initialValues(event, selectedDate)}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default OthersForm;
