import { useState } from "react";
import AxiosInstance from "./AxiosInstance";

const useFormSubmit = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleFormSubmit = async (url, values, actions, setData, handleClose, method, callback) => {

    try {
      JSON.stringify(values);
    } catch (error) {
      console.error("Circular reference detected:", error);
      return;
    }

    actions.setSubmitting(true);

    try {
      const response = await AxiosInstance({
        method,
        url,
        data: values,
      });
      setSuccessMessage("Submitted Successfully");
      setShowSuccessMessage(true);
      
      if(setData){
        setData((prevData) =>
          method === "post" ? [...prevData, response.data] : prevData.map((item) => (item.id === response.data.id ? response.data : item))
        );
      }
  
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
  
      actions.resetForm();
      handleClose();
      callback?.();
    } catch (error) {
        console.log(error);
        let errorMessage = "An unexpected error occurred.";

        if (error.response?.data?.errors) {
          errorMessage = error.response.data.errors.username || "An error occurred.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        setErrorMessage(errorMessage);
        setShowErrorMessage(true);

        setTimeout(() => {
          setShowErrorMessage(false);
        }, 4000);
      } finally {
        actions.setSubmitting(false);
      }
  };

  return {
    handleFormSubmit,
    successMessage,
    showSuccessMessage,
    errorMessage,
    showErrorMessage,
  };
};

export default useFormSubmit;