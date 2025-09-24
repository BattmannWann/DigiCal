import { Box, Typography } from "@mui/material";
import * as yup from "yup";
import CustomForm from "./CustomForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const userSchema = yup.object().shape({
  //define the validation logic for each field
  startCleanDate: yup.date().required("required"), // "required" pops up if error triggered
  endCleanDate: yup.date().required("required"),
  scheduledOperator: yup.string().required("required"),
  sourceName: yup.string().required("required"),
  comments: yup.string(),
  approvalSignature: yup.string().required("required"),
});
const initialValues = (event, selectedDate) => {
  return {
    startCleanDate: event ? event.startCleanDate : selectedDate,
    endCleanDate: event ? event.endCleanDate : null,
    scheduledOperator: event ? event.scheduledOperator : null,
    sourceName: event ? event.source : null,
    comments: event ? event.description : null,
    approvalSignature: event ? event.approvalSignature : null,
  };
};
const fields = [
  {
    name: "startCleanDate",
    label: "Clean Start Date",
    type: "date",
    gridColumn: "span 2",
  },
  {
    name: "endCleanDate",
    label: "Clean End Date",
    type: "date",
    gridColumn: "span 2",
  },
  {
    name: "scheduledOperator",
    label: "Assigned To",
    type: "select",
    options: [
      { value: "op1", label: "Operator 1" },
      { value: "op2", label: "Operator 2" },
      { value: "op3", label: "Operator 3" },
    ],
    gridColumn: "span 2",
  },
  {
    name: "sourceName",
    label: "Source",
    type: "select",
    options: [
      { value: "s1", label: "Source 1" },
      { value: "s2", label: "Source 2" },
      { value: "s3", label: "Source 3" },
    ],
    gridColumn: "span 2",
  },
  {
    name: "comments",
    label: "Comments",
    type: "textarea",
    gridColumn: "span 4",
  },
  {
    name: "approvalSignature",
    label: "Approved By",
    type: "select",
    options: [
      { value: "op1", label: "Operator 1" },
      { value: "op2", label: "Operator 2" },
      { value: "op3", label: "Operator 3" },
    ],
    gridColumn: "span 2",
  },
];
const SourceCleanForm = ({
  handleClose,
  event,
  selectedDate,
  onSubmit,
  deleteEvent,
}) => {
  return (
    <Box>
      <Typography
        component="h2"
        variant="title"
        color="text.primary"
        sx={{ mb: 2 }}
      >
        {event ? "Edit Source Clean" : "Add New Source Clean"}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CustomForm
          handleClose={handleClose}
          event={event}
          selectedDate={selectedDate}
          onSubmit={onSubmit}
          deleteEvent={deleteEvent}
          initialValues={initialValues}
          userSchema={userSchema}
          fields={fields}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default SourceCleanForm;
