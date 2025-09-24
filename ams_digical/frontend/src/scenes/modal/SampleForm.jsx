import { Box, Typography } from "@mui/material";
import * as yup from "yup";
import CustomForm from "./CustomForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import useFormSubmit from "../../hooks/useFormSubmit";

const userSchema = yup.object().shape({
  //define the validation logic for each field
  title: yup.string().required("required"),
  full_name: yup.string().optional(),
  whiteboard_name: yup.string().optional(),
  submissionDate: yup.date().required("required"), // "required" pops up if error triggered
  numSamples: yup.number().required("required"),
  submitterLab: yup.string().required("required"),
  radionuclideAnalyzed: yup.string().required("required"),
  scheduledStartDate: yup.date().optional(),
  source: yup.string().optional(),
  reportSentDate: yup.date().optional(),
  comments: yup.string().optional(),
  approvalSignature: yup.string(),
});

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

const initialValues = (batch, selectedDate) => {
  return {
    title: batch?.title ?? "",
    whiteboard_name: batch?.whiteboard_name ?? "",
    full_name: batch?.full_name ?? "",
    submissionDate: batch?.date_batch_submitted
      ? new Date(batch.date_batch_submitted)
      : (selectedDate ?? ""),
    numSamples: batch?.number_of_samples ?? "",
    submitterLab: batch?.submitter_lab ?? "",
    radionuclideAnalyzed: batch?.radionuclide ?? "",
    scheduledStartDate: batch?.scheduled_start
      ? new Date(batch.scheduled_start)
      : "",
    source: batch?.source ?? "",
    reportSentDate: batch?.report_sent ? new Date(batch.report_sent) : "",
    comments: batch?.comment ?? "",
    approvalSignature: batch?.approved_by ?? "",
  };
};

const SampleForm = ({
  handleClose,
  event,
  selectedDate,
  handleDeleteSample,
  staffOptions,
  sourceOptions,
  labOptions,
  radionuclideOptions,
  refetch,
  selectedSample,
}) => {
  const fields = [
    { name: "title", label: "Batch Name", gridColumn: "span 4" },
    { name: "full_name", label: "Full Name", gridColumn: "span 4" },
    { name: "whiteboard_name", label: "Whiteboard Name", gridColumn: "span 4" },
    {
      name: "numSamples",
      label: "Number of Samples",
      type: "numeric",
      gridColumn: "span 2",
    },

    {
      name: "submissionDate",
      label: "Submission Date",
      type: "date",
      gridColumn: "span 2",
    },
    {
      name: "submitterLab",
      label: "Submitter Lab",
      type: "select",
      options: labOptions,
      gridColumn: "span 2",
    },
    {
      name: "source",
      label: "Source",
      type: "select",
      options: sourceOptions,
      gridColumn: "span 2",
      nullable: true,
    },
    {
      name: "radionuclideAnalyzed",
      label: "Radionuclide",
      type: "select",
      options: radionuclideOptions,
      gridColumn: "span 2",
    },

    {
      name: "scheduledStartDate",
      label: "Scheduled Start",
      type: "date",
      gridColumn: "span 2",
    },
    {
      name: "reportSentDate",
      label: "Report Sent on",
      type: "date",
      gridColumn: "span 2",
    },
    {
      name: "approvalSignature",
      label: "Approved By",
      type: "select",
      options: staffOptions,
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
      full_name: values.full_name,
      whiteboard_name: values.whiteboard_name,
      date_batch_submitted: formatDate(values.submissionDate),
      scheduled_start: formatDate(values.scheduledStartDate),
      report_sent: formatDate(values.reportSentDate),
      number_of_samples: values.numSamples,
      comment: values.comments,
      source: values.source,
      approved_by: values.approvalSignature,
      radionuclide: values.radionuclideAnalyzed,
      submitter_lab: values.submitterLab,
    };
    if (selectedSample) {
      handleFormSubmit(
        `/batches/${selectedSample.id}/`,
        formattedValues,
        actions,
        null,
        handleClose,
        "put",
        () => {
          refetch();
        }
      );
    } else {
      handleFormSubmit(
        "/batches/",
        formattedValues,
        actions,
        null,
        handleClose,
        "post",
        () => {
          refetch();
        }
      );
    }
  };

  return (
    <Box>
      <Typography
        component="h2"
        variant="title"
        color="text.primary"
        sx={{ mb: 2 }}
      >
        {selectedSample ? "Edit Batch" : "Add New Batch"}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CustomForm
          handleClose={handleClose}
          event={event}
          selectedDate={selectedDate}
          onSubmit={onSubmit}
          deleteSample={handleDeleteSample}
          initialValues={initialValues(selectedSample, selectedDate)}
          userSchema={userSchema}
          fields={fields}
          selectedSample={selectedSample}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default SampleForm;
