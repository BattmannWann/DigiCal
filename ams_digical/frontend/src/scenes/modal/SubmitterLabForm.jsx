import { Box, Typography } from "@mui/material";
import * as yup from "yup";
import CustomForm from "./CustomForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import useFormSubmit from "../../hooks/useFormSubmit";

const userSchema = yup.object().shape({
  name: yup.string().required("required"),
  description: yup.string().optional(),
});

const initialValues = (submitter_lab) => {
  return {
    name: submitter_lab? submitter_lab.name : "",
    description: submitter_lab? submitter_lab.description: "",
  };
};
const SubmitterLabForm = ({
  setEvents,
  handleClose,
  event,
  selectedDate,
  selectedSample,
  handleDeleteEvent,
  refetch,
  submitterLabs,
}) => {
  const fields = [
    { name: "name", label: "Name", gridColumn: "span 4" },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      gridColumn: "span 4",
    },
  ];
  const submitter_lab = selectedSample? submitterLabs.find( submitter_lab => submitter_lab.id === selectedSample.submitter_lab ) : null;
  const { handleFormSubmit } = useFormSubmit();

  const onSubmit = async (values, actions) => {
    const formattedValues = {
      name: values.name,
      description: values.description,
    };

    const endpoint = submitter_lab?
     `/submitter%20lab/${submitter_lab.id}/`
      : "/submitter%20lab/";

    const method = submitter_lab? "put" : "post";
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
        {submitter_lab ? "Edit Submitter Lab" : "Add New Submitter Lab"}
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
          initialValues={initialValues(submitter_lab)}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default SubmitterLabForm;
