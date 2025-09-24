import { useState } from "react";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../global/Header";
import AxiosInstance from "../../hooks/AxiosInstanceDigicalAPI";
import Message from "../global/Message";
import { useNavigate } from "react-router-dom";

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
  
  first_name: yup.string().required("required"), 
  last_name: yup.string().required("required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is invalid")
    .required("required"),

  post: yup.string().required("required"),
  status: yup.string().required("required"),
});

const EditProfile = ({user}) => {
  const navigate = useNavigate();
  const [ShowErrorMessage, setShowErrorMessage] = useState(false);
  const [ShowSuccessMessage, setShowSuccessMessage] = useState(false);

  const [error, setErrorMessage] = useState(""); 
  const [success, setSuccessMessage] = useState("");

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    AxiosInstance.post(`/edit-profile/`, {
      staff_name: `${values.first_name} ${values.last_name}`,
      first_name: values.first_name,
      last_name: values.last_name,
      email: user.email ,
      username: user.model.user.username,
      phone: values.phone,
      post: values.post,
      status: values.status,

    })
      .then((response) => {

        setSuccessMessage("Profile has been Updated Successfully");
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate(`/`);
          window.location.reload();
        }, 4000);
        resetForm();
      })
      .catch((error) => {
        let errorMessage = "An unexpected error occurred."; 

        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          errorMessage =
            error.response.data.errors.username || "An error occurred.";
        } else if (error.message) {
          
          errorMessage = error.message;
        }
        setErrorMessage(errorMessage);
        setShowErrorMessage(true);

        setTimeout(() => {
          setShowErrorMessage(false);
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
  ];

  const statusOptions = [
    { value: "In Office", label: "In Office"},
    { value: "Working From Home", label: "WFH"},
    { value: "Time Off In Lieu", label: "TOIL"},
    { value: "Away On Official Business", label: "Leave"},
    { value: "On Holiday", label: "Holiday"},
  ]

  return (
    <Box m="20px" position="relative">
      {ShowErrorMessage ? <Message text={error} color={"#EC5A76"} /> : null}
      {ShowSuccessMessage ? <Message text={success} color={"#22c55e"} /> : null}
      <Header
        title="Edit Profile"
        subtitle="Fill in the Details Below to Change the Information Stored on Your Account"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          first_name: user.model.user.first_name || "",
          last_name: user.model.user.last_name || "",
          phone: user.model.phone || "",
          post: user.model.post || "Staff",
          status: user.model.status || "In Office",
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
              sx={{
                "& > div": {
                  gridColumn: "span 4",
                },
              }}
            >
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
                sx={{
                  gridColumn: "span 2",
                }}
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
                sx={{
                  gridColumn: "span 2",
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{
                  gridColumn: "span 4",
                }}
              />
              <FormControl
                  fullWidth
                  variant="filled"
                  name="post"
                  error={
                    !!touched.post &&
                    !!errors.post
                  }
                  sx={{
                    gridColumn: "span 2",
                  }}
                >
                  <InputLabel>{"Post"}</InputLabel>
                  <Select
                    name="post"
                    value={values["post"]}
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
                  error={
                    !!touched.status &&
                    !!errors.status
                  }
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
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Edit Profile
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};
export default EditProfile;
