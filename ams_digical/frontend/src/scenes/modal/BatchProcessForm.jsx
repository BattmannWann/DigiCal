import { Box, Typography } from "@mui/material";
import * as yup from "yup";
import CustomForm from "./CustomForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import useFormSubmit from "../../hooks/useFormSubmit";

const userSchema = yup.object().shape({
  asso_batch: yup.string().required("required"),
  responsible_staff: yup.string().required("required"),
  start: yup.date().required("required"),
  end: yup.date().required("required"),
  comments: yup.string().required().optional(),
});

const initialValues = (event, selectedSample, selectedDate) => {
  return {
    asso_batch: event?.asso_batch ?? selectedSample?.id ?? "",
    responsible_staff: event?.responsible_staff ?? "",
    start: event
      ? new Date(event.start)
      : selectedDate
        ? new Date(selectedDate)
        : "",
    end: event ? new Date(event.end) : "",
    comments: event? event.description : "",
    title: event?.title ?? "",
  };
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

const BatchProcessForm = ({
  handleClose,
  event,
  selectedDate,
  selectedSample,
  handleDeleteEvent,
  staffOptions,
  sampleOptions,
  setEvents,
  refetch,
}) => {
  const fields = [
    { name: "title", label: "Batch Process Title", gridColumn: "span 4" },
    {
      name: "asso_batch",
      label: "Batch",
      type: "select",
      gridColumn: "span 4",
      options: sampleOptions,
    },
    {
      name: "responsible_staff",
      label: "Scheduled Operator",
      type: "select",
      options: staffOptions,
      gridColumn: "span 2",
    },
    {
      name: "start",
      label: "Analysis Start",
      type: "date",
      gridColumn: "span 2",
    },
    {
      name: "end",
      label: "Analysis End",
      type: "date",
      gridColumn: "span 2",
    },
    {
      name: "comments",
      label: "Comments",
      type: "textarea",
      gridColumn: "span 4",
    },
  ];

  const { handleFormSubmit } = useFormSubmit();

  const onSubmit = async (values, actions) => {
    const formattedValues = {
      title: values.title,
      start: formatDate(values.start),
      end: formatDate(values.end),
      description: values.comments,
      asso_batch: values.asso_batch,
      responsible_staff: values.responsible_staff,
    };

    const endpoint = event?.id
    ? `/batch%20process/${event.id}/`
    : "/batch%20process/";

    const method = event? "put": "post";

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
        {event ? "Edit Batch Process" : "Schedule Batch Process"}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CustomForm
          handleClose={handleClose}
          event={event}
          selectedDate={selectedDate}
          onSubmit={onSubmit}
          deleteEvent={handleDeleteEvent}
          initialValues={initialValues(event, selectedSample, selectedDate)}
          userSchema={userSchema}
          fields={fields}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default BatchProcessForm;
