import { Box, Typography } from "@mui/material";
import * as yup from "yup";
import CustomForm from "./CustomForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import useFormSubmit from "../../hooks/useFormSubmit";

const userSchema = yup.object().shape({
  title: yup.string().required("required"),
  area: yup.string().required("required"),
  start: yup.date().optional(),
  end: yup.date().optional(),
  report_date: yup.date().optional(),
  report_by: yup.string().optional(),
  responsible_staff: yup.string().optional(),
  asso_machine: yup.string(),
  status: yup.string().required("required"),
  comments: yup.string().optional(),
});

const initialValues = (event, selectedDate) => {
  return {
    title: event ? event.title : "",
    area: event ? event.area : "",
    start: event?.start ? new Date(event.start) : "",
    end: event?.end ? new Date(event.end) : "",
    report_date: event?.report_date
      ? new Date(event.report_date)
      : selectedDate
        ? new Date(selectedDate)
        : "",
    status: event ? event.status : "",
    report_by: event ? event.report_by : "",
    responsible_staff: event ? event.responsible_staff : "",
    asso_machine: event ? event.asso_machine : "",
    comments: event ? event.description : "",
  };
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

const MaintenanceForm = ({
  event,
  handleClose,
  selectedDate,
  handleDeleteEvent,
  staffOptions,
  sourceOptions,
  setEvents,
  refetch,
}) => {
  const fields = [
    { name: "title", label: "Maintenance Task", gridColumn: "span 4" },
    {
      name: "area",
      label: "Maintenance Area",
      type: "select",
      options: [
        { value: "Source clean", label: "Source clean" },
        { value: "Pumps", label: "Pumps" },
        { value: "Indexer", label: "Indexer" },
        { value: "Detector", label: "Detector" },
        { value: "Tank", label: "Tank" },
        { value: "Plant", label: "Plant" },
        { value: "Tandem", label: "Tandem" },
        { value: "SSAMS", label: "SSAMS" },
        { value: "PIMS", label: "PIMS" },
        { value: "Others", label: "Others" },
      ],
      gridColumn: "span 2",
    },
    {
      name: "start",
      label: "Scheduled Start",
      type: "date",
      gridColumn: "span 2",
    },
    { name: "end", label: "Scheduled End", type: "date", gridColumn: "span 2" },
    {
      name: "report_date",
      label: "Report Date",
      type: "date",
      gridColumn: "span 2",
    },
    {
      name: "responsible_staff",
      label: "Assigned To",
      type: "select",
      options: staffOptions,
      gridColumn: "span 2",
    },
    {
      name: "report_by",
      label: "Reported By",
      type: "select",
      options: staffOptions,
      gridColumn: "span 2",
    },
    {
      name: "asso_machine",
      label: "Machine",
      type: "select",
      options: sourceOptions,
      gridColumn: "span 2",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "In Progress", label: "In Progress" },
        { value: "Finished", label: "Finished" },
      ],
      gridColumn: "span 4",
    },
    {
      name: "comments",
      label: "Description",
      type: "textarea",
      gridColumn: "span 4",
    },
  ];

  const { handleFormSubmit } = useFormSubmit();

  const onSubmit = async (values, actions) => {
    const formattedValues = {
      title: values.title,
      area: values.area,
      start: formatDate(values.start),
      end: formatDate(values.end),
      report_date: formatDate(values.report_date),
      status: values.status,
      description: values.comments,
      responsible_staff: values.responsible_staff,
      asso_machine: values.asso_machine || "",
    };

    const endpoint = event?.id ? `/maintenance/${event.id}/` : "/maintenance/";

    const method = event ? "put" : "post";

    handleFormSubmit(
      endpoint,
      formattedValues,
      actions,
      setEvents,
      handleClose,
      method
    );

    setTimeout(() => {
      refetch();
    }, 100);
  };

  return (
    <Box>
      <Typography
        component="h2"
        variant="title"
        color="text.primary"
        sx={{ mb: 2 }}
      >
        {event ? "Edit Maintenance" : "Add New Maintenance"}
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

export default MaintenanceForm;
