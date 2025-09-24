import React from "react";
import FormFooter from "./FormFooter";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Formik, Form } from "formik";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const CustomForm = ({
  handleClose,
  event,
  selectedSample,
  source,
  onSubmit,
  deleteEvent,
  deleteSample,
  deleteSource,
  initialValues,
  userSchema,
  fields,
}) => {
  const defaultValues = {
    start: "",
    end: "",
    title: "",
    comments: "",
    responsible_staff: "",
  };

  return (
    <Box padding="1rem">
      <Formik
        initialValues={initialValues || defaultValues}
        validationSchema={userSchema}
        enableReinitialize={true}
        onSubmit={(values, formikHelpers) => {
          try {
            onSubmit(values, formikHelpers);
          } catch (error) {
            console.error("Error in onSubmit:", error); // Log failure
          }
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
        }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                {fields.map((field) => {
                  switch (field.type) {
                    case "select":
                    if(field.nullable){
                    return (
                        <FormControl
                          key={field.name}
                          fullWidth
                          variant="filled"
                          error={!!touched[field.name] && !!errors[field.name]}
                          sx={{ gridColumn: field.gridColumn || "span 4" }}
                        >
                          <InputLabel>{field.label}</InputLabel>
                          <Select
                            name={field.name}
                            value={values[field.name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            defaultValue={""}
                          >
                            <MenuItem key="" value={null}></MenuItem>
                            {field.options?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    } else{
                      return (
                        <FormControl
                          key={field.name}
                          fullWidth
                          variant="filled"
                          error={!!touched[field.name] && !!errors[field.name]}
                          sx={{ gridColumn: field.gridColumn || "span 4" }}
                        >
                          <InputLabel>{field.label}</InputLabel>
                          <Select
                            name={field.name}
                            value={values[field.name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {field.options?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    } 
                    case "textarea":
                      return (
                        <TextField
                          key={field.name}
                          fullWidth
                          variant="filled"
                          multiline
                          rows={field.rows || 4}
                          label={field.label}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values[field.name]}
                          name={field.name}
                          error={!!touched[field.name] && !!errors[field.name]}
                          sx={{ gridColumn: field.gridColumn || "span 4" }}
                        />
                      );

                    case "date":
                      return (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          key={field.name}
                          label={field.label}
                          value={values[field.name] || null}
                          onChange={(newValue) =>
                            setFieldValue(field.name, newValue)
                          }
                          referenceDate={
                            values.start ? new Date(values.start) : null
                          }
                          format="dd-MM-yyyy"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              variant="filled"
                              error={
                                !!touched[field.name] && !!errors[field.name]
                              }
                              helperText={errors[field.name] ?? ""}
                            />
                          )}
                          sx={{ gridColumn: field.gridColumn || "span 4" }}
                        />
                        </LocalizationProvider>
                      );

                    default:
                      return (
                        <TextField
                          key={field.name}
                          fullWidth
                          variant="filled"
                          type={field.type || "text"}
                          label={field.label}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values[field.name]}
                          name={field.name}
                          error={!!touched[field.name] && !!errors[field.name]}
                          sx={{ gridColumn: field.gridColumn || "span 4" }}
                        />
                      );
                  }
                })}
              </Box>

              <FormFooter
                event={event}
                handleClose={handleClose}
                selectedSample={selectedSample}
                handleDeleteEvent={() => deleteEvent(event.id)}
                deleteSample={() => deleteSample(selectedSample.id)}
                source={source}
                deleteSource={() => deleteSource(source.id)}
              />
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default CustomForm;
