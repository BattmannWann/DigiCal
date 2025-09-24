import { formatDate } from "@fullcalendar/core";
import {
    List,
    ListItem,
    ListItemText,
    Typography,
  } from "@mui/material";
import { useEffect, useState } from "react";

const EventList = ({data}) => {
    const [events, setEvents] = useState(data?.upcomingEvents || []);
    useEffect(() => {
      setTimeout(() => setEvents([...(data?.upcomingEvents || [])]), 0);
    }, [data]);
    
    return(
        <List>
        {events.map((event) => (
          <ListItem
            key={event.id}
            sx={{
              backgroundColor:  event.color.startsWith("#") ? event.color : `#${event.color}`,
              margin: "10px 0",
              borderRadius: "2px",
              color: "white",
            }}
          >
            <ListItemText
              primary={event.title}
              secondary={
                <Typography>
                  {formatDate(event.start, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    locale: "en-GB"
                  })}
                   - 
                  {formatDate(event.end, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    locale: "en-GB"
                  })}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    );
    
};

export default EventList;
