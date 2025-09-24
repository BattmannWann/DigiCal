import { Box, Typography } from "@mui/material";
import * as yup from "yup";
import CustomForm from "./CustomForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import useFormSubmit from "../../hooks/useFormSubmit";

const userSchema = yup.object().shape({
  //define the validation logic for each field
  machine_name: yup.string().required("required"), // "required" pops up if error triggered
  last_maintenance: yup.date().required().optional(),
  status: yup.string().required("required"),
  description: yup.string().required().optional(),
  batches_processed: yup.number().required().optional(),
});

const initialValues = (source) => {
  return {
    machine_name: source? source.machine_name: "",
    last_maintenance: source? new Date(source.last_maintenance): "",
    status: source? source.status : "",
    description: source? source.description : "",
    batches_processed: source? source.batches_processed : "",
  };
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

const SourceForm = ({ handleClose, refetch, source, handleDeleteSource,}) => {
  const fields = [
    { name: "machine_name", label: "Name", gridColumn: "span 2" },
    {
      name: "last_maintenance",
      label: "Last Maintenance",
      type: "date",
      gridColumn: "span 2",
    },
    {
      name: "description",
      label: "Comments",
      type: "textarea",
      gridColumn: "span 4",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      gridColumn: "span 2",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Working", label: "Working" },
        { value: "Broken", label: "Broken" },
      ],
    },
    {
      name: "batches_processed",
      label: "Batches Processed",
      type: "numeric",
      gridColumn: "span 2",
    },
  ];

  const { handleFormSubmit } = useFormSubmit();

  const onSubmit = async (values, actions) => {
    const formattedValues = {
      machine_name: values.machine_name,
      last_maintenance: formatDate(values.last_maintenance),
      description: values.description,
      status: values.status,
      batches_processed: values.batches_processed,
    };
    const endpoint = source? `/machines/${source.id}/` : "/machines/";
    const method = source? "put": "post";

    handleFormSubmit(
      endpoint,
      formattedValues,
      actions,
      null,
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
        {"Edit Source"}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CustomForm
          handleClose={handleClose}
          onSubmit={onSubmit}
          userSchema={userSchema}
          fields={fields}
          initialValues={initialValues(source)}
          deleteSource={handleDeleteSource}
          source={source}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default SourceForm;
