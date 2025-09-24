import { useState } from "react";
import { useEventHandler } from "../../hooks/eventHandler";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, useTheme } from "@mui/material";
import Header from "../global/Header";
import { tokens } from "../../theme";
import EventModal from "../modal/EventModal";
import EventList from "../events/EventTable";
import Copyright from "../../Copyright";
import StatCard from "../global/StatCard";

const Calendar = ({ mode, data, refetch }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { events, deleteEvent, setEvents } = useEventHandler();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleEventClick = (info) => {
    const event = events.find((e) => String(e.id) === String(info.event.id));
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setShowModal(true);
  };

  const handleDayClick = (arg) => {
    setSelectedEvent(null);
    setSelectedDate(arg.dateStr);
    setShowModal(true);
  };

  const projectionFont = mode === "projector" ? "calc(1rem + 1vh)" : "1vw";

  const fixEvents = (events) =>{
    return events.map(event => ({
      ...event,
      end: new Date(event.end + "T23:59:59"),
    }));
  };

  const calendarStyles = {
    "& .fc": { width: "100%", fontSize: "calc(0.5rem + 1vh)" },
    "& .fc-toolbar.fc-header-toolbar": { marginBottom: "0" },
    "& thead": { backgroundColor: "background.paper" },
    "& .fc .fc-button": {
      backgroundColor: `${colors.blueAccent[900]} !important`,
      color: `${colors.grey[700]} !important`,
      border: "none",
      boxShadow: "inset 0 3px 5px rgba(0, 0, 0, 0.2)",
      transition: "all 0.5s ease",
      "&:hover": {
        backgroundColor: `${colors.grey[900]} !important`,
        color: `${colors.grey[100]} !important`,
      },
    },
    "& .fc-day-today": { backgroundColor: `${colors.grey[900]} !important` },
    "& .fc a": {
      color: `${colors.grey[100]} !important`,
      textDecoration: "none",
      fontSize: "1vw",
    },
    "& .fc-event-title": {
      color: "#fff",
      paddingLeft: "0.2vw",
    },
    "& .fc-daygrid-day:hover": { cursor: "pointer" },
    "& .fc .fc-daygrid-day-number": { fontSize: "1.6rem" },
    "& .fc-event": {
      display: "flex",
      alignItems: "center",
      padding: "2px 5px",
      margin: "1px",
      minWidth: "40px",
      borderRadius: "5px",
      height: mode === "projector" ? "2vh" : null,
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "1vh",
    },
  };

  const renderCalendar = (headerToolbar, aspectRatio) => (
    <FullCalendar
      height="auto"
      plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
      headerToolbar={headerToolbar}
      initialView="dayGridMonth"
      selectable={true}
      selectMirror={true}
      dayMaxEvents={5}
      select={handleDayClick}
      eventClick={handleEventClick}
      events={fixEvents(events)}
      eventContent={(arg) => (
        <div
          style={{
            backgroundColor: `#${arg.event.extendedProps.color || "999999"}`,
          }}
        >
          {arg.event.title}
        </div>
      )}
      views={{
        dayGridMonth: {
          type: "dayGrid",
          duration: { months: 2 },
          fixedWeekCount: false,
          dateIncrement: { months: 1 },
        },
      }}
      initialDate={new Date()}
      dateClick={handleDayClick}
      aspectRatio={aspectRatio}
      buttonText={{ dayGridMonth:'month', list:'list'}}
    />
  );

  if (mode === "projector") {
    return (
      <Box m="10px" sx={calendarStyles}>
        {renderCalendar(
          { left: "prev,next", center: "title", right: false },
          3
        )}
      </Box>
    );
  }

  return (
    <Box m="40px" display="flex" flexDirection="column" flexGrow={1}>
      {mode === "editor" && (
        <Header title="Calendar" subtitle="Interactive Calendar Page" />
      )}
      <Box display="flex" justifyContent="space-between" height="100%">
        {mode === "editor" && (
          <Box flex="1 1 20%" p="15px">
            <StatCard
              title="Events"
              subtitle="Latest Events"
              content={<EventList data={data} />}
            />
          </Box>
        )}
        <Box flex="1 1 80%" height="auto" sx={calendarStyles}>
          {renderCalendar(
            {
              left: "prev,next,today",
              center: "title",
              right: "dayGridMonth,listMonth",
            },
            2.2
          )}
          {mode === "editor" && <Copyright sx={{ my: 4, mb: 10 }} />}
        </Box>
        <EventModal
          show={showModal}
          event={selectedEvent}
          selectedDate={selectedDate}
          handleClose={() => setShowModal(false)}
          deleteEvent={deleteEvent}
          data={data}
          events={events}
          setEvents={setEvents}
          refetch={refetch}
        />
      </Box>
    </Box>
  );
};

export default Calendar;
