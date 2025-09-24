import { Box, Typography } from "@mui/material";
import * as yup from "yup";
import CustomForm from "./CustomForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import useFetchData from '../../hooks/useFetchData';
import { useState, useEffect } from 'react';
import useFormSubmit from '../../hooks/useFormSubmit';

const userSchema = yup.object().shape({
    //define the validation logic for each field
    start: yup.date().required("required"), // "required" pops up if error triggered
    end: yup.date().required("required"), 
    responsible_staff: yup.string().required("required"),
    comments: yup.string().optional(),
    awayType: yup.string().optional(),
})

const initialValues = (event, selectedDate) => {
  return {
    start: event? new Date(event.start) : new Date(selectedDate),
    end: event? new Date(event.end) : "",
    title: event?.title ?? "",
    comments: event? event.description : "",
    responsible_staff: event?.responsible_staff ?? "",
    awayType: event?.away_type ?? "",
  };
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];  // Extract YYYY-MM-DD
};

const StaffAwayForm = ({
  setEvents,
  handleClose,
  event,
  selectedDate,
  handleDeleteEvent,
  refetch,
}) => {
  const { data: staffData } = useFetchData('/staff/'); 
  const [staffOptions, setStaffOptions] = useState([]);

  // Fetch staff data when component mounts
  useEffect(() => {
      const formattedStaffOptions = staffData.map(staff => ({
        value: `${staff.id}`,
        label: `${staff.staff_name}`  // Adjust based on actual field name
      }));
      setStaffOptions(formattedStaffOptions);
  }, [staffData]);  // Empty dependency array to run only once

  const fields = [
    { name: 'start', label: 'Start Date', type: 'date', gridColumn: 'span 2' },
    { name: 'end', label: 'End Date', type: 'date', gridColumn: 'span 2' },
    { name: 'title', label: 'Event Title', gridColumn: 'span 4' },
    { name: 'comments', label: 'Comments', type: 'textarea', gridColumn: 'span 4' },
    {
      name: 'responsible_staff',
      label: 'Staff Member',
      type: 'select',
      gridColumn: 'span 4',
      options: staffOptions,  // Options passed after fetch
    },
    {name: 'awayType', label: 'Away Type', type:'select', gridColumn: 'span 4',
        options:[
            { value: "In Office",  label: "In Office"},
            { value: "Working From Home", label: "Working From Home"},
            { value: "Time off In Lieu",    label: "Time off In Lieu"},
            { value: "Away on official business",   label: "Away on official business"},
            { value: "On Holiday", label: "On Holiday"},],
    }
  ];

  const { 
    handleFormSubmit, 
  } = useFormSubmit();

  const onSubmit = (values,actions) => {
    const formattedValues = {
      title: values.title,
      start: formatDate(values.start),
      end: formatDate(values.end),
      description: values.comments,
      responsible_staff: values.responsible_staff,
      away_type: values.awayType,
    };

    const endpoint = event?.id
    ? `/staff%20away/${event.id}/`
    : "/staff%20away/";

    const method = event ? "put" : "post";
    
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
      <Typography variant='h2'>
        {event ? 'Edit Event' : 'Add Event'}
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
            initialValues={initialValues(event,selectedDate)}
          />
        </LocalizationProvider>
        
    </Box> 
  );
};

export default StaffAwayForm;
