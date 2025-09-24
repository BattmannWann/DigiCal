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

const initialValues = (radionuclide) => {
  return {
    name: radionuclide? radionuclide.name : "",
    description: radionuclide? radionuclide.description: "",
  };
};
const RadionuclideForm = ({
  setEvents,
  handleClose,
  event,
  selectedDate,
  selectedSample,
  handleDeleteEvent,
  refetch,
  staffOptions,
  radionuclides,
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
  const radionuclide = selectedSample? radionuclides.find( radionuclide => radionuclide.id === selectedSample.radionuclide ) : null;
  const { handleFormSubmit } = useFormSubmit();

  const onSubmit = async (values, actions) => {
    const formattedValues = {
      name: values.name,
      description: values.description,
    };

    const endpoint = radionuclide?
     `/radionuclide/${radionuclide.id}/`
      : "/radionuclide/";

    const method = radionuclide ? "put" : "post";
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
        {radionuclide ? "Edit Radionuclide" : "Add New Radionuclide"}
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
          initialValues={initialValues(radionuclide)}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default RadionuclideForm;
