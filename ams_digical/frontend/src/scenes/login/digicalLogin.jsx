import { useState } from "react";
import { Box, Button, responsiveFontSizes, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery"; //responsive layout if required
import Header from "../global/Header";
import AxiosInstance from "../../hooks/AxiosInstanceDigicalAPI";
import { useNavigate } from "react-router-dom";
import Message from "../global/Message";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";


const initialValues = {
  email: "",
  password: "",
};

const userSchema = yup.object().shape({

  email: yup.string().required("required"),
  password: yup.string().required("required")
});

const DigicalLogin = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const navigate = useNavigate();
  const [ShowErrorMessage, setShowErrorMessage] = useState(false);
  const [ShowSuccessMessage, setShowSuccessMessage] = useState(false);

  const [error, setErrorMessage] = useState(""); 
  const [success, setSuccessMessage] = useState(""); 

  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    AxiosInstance.post(`digical-login/`, {
      email: values.email,
      password: values.password,
    })
      .then((response) => {
        localStorage.setItem("digicalAccessToken", response.data.token);
        setSuccessMessage("Logged In Successfully");
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
            error.response.data.errors.email || "An error occurred.";

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

  return (
    <Box m="20px">
      {ShowErrorMessage ? <Message text={error} color={"#EC5A76"} /> : null}
      {ShowSuccessMessage ? <Message text={success} color={"#22c55e"} /> : null}
      
      <Header title="Login" subtitle="Log in to DigiCal" />

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
              gridTemplateColumns="repeat(4, minmax(0, 1fr))" // 1fr = 1 fraction of the space
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
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
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Log In
              </Button>
            </Box>

          </form>
        )}
      </Formik>
    </Box>
  );
};
export default DigicalLogin;
