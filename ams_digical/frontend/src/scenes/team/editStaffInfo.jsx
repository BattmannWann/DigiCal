import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import AxiosInstance from "../../hooks/AxiosInstanceDigicalAPI";
import Message from "../global/Message";
import Header from "../global/Header";

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Invalid phone number")
    .required("Required"),
  post: yup.string().required("Required"),
});

const EditStaffInfo = ({ data }) => {
  const team = data.staff;
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setErrorMessage] = useState("");
  const [success, setSuccessMessage] = useState("");

  const handleStaffSelection = (staffId) => {
    const staffMember = team.find((staff) => staff.id === staffId);
    setSelectedStaff(staffMember || null);
    console.log("Staff member selected info: ", staffMember);
  };

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    console.log("Form values: ", values);
    console.log(selectedStaff.user);
    AxiosInstance.post(`/edit-profile/`, {
      staff_id: selectedStaff.id,
      staff_name: `${values.first_name} ${values.last_name}`,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      username: selectedStaff.user.username,
      phone: values.phone,
      post: values.post,
      status: values.status,
    })
      .then(() => {
        setSuccessMessage("Profile updated successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          window.location.reload();
        }, 4000);
        resetForm();
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(
          error.response?.data?.errors || "An unexpected error occurred."
        );
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 4000);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const postOptions = [
    { value: "Manager", label: "Manager" },
    { value: "Researcher", label: "Researcher" },
    { value: "Temporary Staff / Intern", label: "Intern" },
    { value: "Contractor", label: "Contractor" },
    { value: "Maintainer", label: "Maintainer" },
    { value: "Staff", label: "Staff"},
  ];

  const statusOptions = [
    { value: "In Office", label: "In Office" },
    { value: "Working From Home", label: "WFH" },
    { value: "Time Off In Lieu", label: "TOIL" },
    { value: "Away On Official Business", label: "Leave" },
    { value: "On Holiday", label: "Holiday" },
  ];

  return (
    <Box m="20px" position="relative">
      {showError && <Message text={error} color={"#EC5A76"} />}
      {showSuccess && <Message text={success} color={"#22c55e"} />}

      <Header
        title="Edit Staff Information"
        subtitle="Select from the DropBox Below to View and Update Staff Information"
      />

      <FormControl fullWidth variant="filled" sx={{ mb: 3 }}>
        <InputLabel>Select Staff Member</InputLabel>
        <Select
          value={selectedStaff?.id || ""}
          onChange={(e) => handleStaffSelection(e.target.value)}
        >
          {team.map((staff) => (
            <MenuItem key={staff.id} value={staff.id}>
              {staff.staff_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedStaff && (
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={{
            first_name: selectedStaff.user.first_name || "",
            last_name: selectedStaff.user.last_name || "",
            phone: selectedStaff.phone || "",
            post: selectedStaff.post || "Staff",
            status: selectedStaff.status || "In Office",
            staff_id: selectedStaff.id,
            staff_name: selectedStaff.staff_name,
            email: selectedStaff.user.email,
            username: selectedStaff.user.email,
          }}
          enableReinitialize
          validationSchema={userSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Email"
                  disabled="disabled"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.first_name}
                  name="first_name"
                  error={!!touched.first_name && !!errors.first_name}
                  helperText={touched.first_name && errors.first_name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.last_name}
                  name="last_name"
                  error={!!touched.last_name && !!errors.last_name}
                  helperText={touched.last_name && errors.last_name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  name="phone"
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
                  sx={{ gridColumn: "span 2" }}
                />
                <FormControl
                  fullWidth
                  variant="filled"
                  sx={{ gridColumn: "span 2" }}
                >
                  <InputLabel>Post</InputLabel>
                  <Select
                    name="post"
                    value={values.post}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {postOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="filled"
                  name="status"
                  error={!!touched.status && !!errors.status}
                  sx={{
                    gridColumn: "span 2",
                  }}
                >
                  <InputLabel>{"Status"}</InputLabel>
                  <Select
                    name="status"
                    value={values["status"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box display="flex" justifyContent="end" mt="20px" gap="30px">
                <Button type="submit" color="secondary" variant="contained">
                  Update Staff Information
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default EditStaffInfo;
