// HOOK FOR HANDLING EVENTS IN THE CALENDAR COMPONENT
//import { EnergySavingsLeafTwoTone } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import useFetchData from './useFetchData';
import addData from './addData';
import updateData from './updateData';
import deleteData from './deleteData';

export const useEventHandler = (option = "all") => {
    const endpoint = option === "upcoming" ? "/events/?upcoming=true" : "/events/";
    const {data: fetchedEvents} = useFetchData(endpoint);
    const [events, setEvents] = useState([]);

    useEffect(() =>{
        if(fetchedEvents){
            setEvents(fetchedEvents);
        }
    }, [fetchedEvents]);

    // add new event
    const addEvent = (newEventData) => {
        addData(`/events/`, newEventData);
        setEvents((prevEvents) => [...prevEvents, newEventData]);
    };

    // update existing event
    const updateEvent = (eventID, updatedEventData) => {
        updateData('/events/', eventID, updatedEventData);
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === eventID ? {...event, ...updatedEventData } : event
            )
        );  
    };

    // delete event
    const deleteEvent = async (eventID) => { 
        deleteData(`/events/${eventID}/`);
        setEvents(events.filter(event => event.id !== eventID));
    };

    return {
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        setEvents,
    };
};