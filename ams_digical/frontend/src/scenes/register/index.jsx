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
import Header from "../global/Header";
import AxiosInstance from "../../hooks/AxiosInstanceDigicalAPI";
import Message from "../global/Message";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";

const initialValues = {
  first_name: "",
  last_name: "",
  username: "",
  phone: "",
  post: "Staff",
  password: "",
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const userSchema = yup.object().shape({
  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is invalid")
    .required("Phone number is required"),

  post: yup.string().required("Please select a post"),
  
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)")
    .required("Password is required"),

});

const RegisterForm = ({ user }) => {
  const navigate = useNavigate();
  const [ShowErrorMessage, setShowErrorMessage] = useState(false);
  const [ShowSuccessMessage, setShowSuccessMessage] = useState(false);

  const [error, setErrorMessage] = useState("");
  const [success, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    AxiosInstance.post(`/register/`, {
      staff_name: `${values.first_name} ${values.last_name}`,
      first_name: values.first_name,
      last_name: values.last_name,
      username: user.email,
      email: user.email,
      phone: values.phone,
      post: values.post,
      password: values.password,
    })
      .then((response) => {
        setSuccessMessage("Registered Successfully");
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate(`/dashboard`);
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

  return (
    <Box m="20px" position="relative">
      {ShowErrorMessage ? <Message text={error} color={"#EC5A76"} /> : null}
      {ShowSuccessMessage ? <Message text={success} color={"#22c55e"} /> : null}
      <Header
        title="Register"
        subtitle="Register to gain access to the system"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
                label="Phone Number"
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
              
              <TextField
                fullWidth
                variant="filled"
                type={showPassword ? "text" : "password"}
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{
                  gridColumn: "span 4",
                  backgroundColor: "inherit", // Match other input fields
                  "& .MuiFilledInput-root": {
                    backgroundColor:
                      !!touched.password && !errors.password
                        ? "rgba(76, 175, 80, 0.15)" // Light green when valid
                        : "rgba(255, 255, 255, 0.1)", // Default MUI filled background
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)", // Slight hover effect
                    },
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
            />
              <FormControl
                fullWidth
                variant="filled"
                name="post"
                error={!!touched.post && !!errors.post}
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

            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Register
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};
export default RegisterForm;
