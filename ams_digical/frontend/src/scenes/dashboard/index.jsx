import { Box } from "@mui/material";
import Header from "../global/Header";
import Sample from "../sample";
import Source from "../source";
import Maintenance from "../maintenance";
import Team from "../team";
import Calendar from "../calendar";
import StatCard from "../global/StatCard";
import Copyright from "../../Copyright";

const Dashboard = ({ data, refetch }) => {
  return (
    <Box m="40px" height="100vh" display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Dashboard"
          subtitle="The Official SUERC AMS Laboratory's Digital Calendar"
        />
      </Box>
      <Box display="flex" flexDirection="row" gap="5px" padding="10px">
        <Box
          sx={{
            flex: "1 1 50%",
            display: "flex",
            gap: "5px",
            flexDirection: "column",
          }}
        >
          <StatCard
            title="Staff"
            subtitle="Team status"
            content={<Team data={data} mode="dashboard" />}
          />
          <StatCard
            title="Batches"
            subtitle="Batches in lab"
            content={<Sample data={data} mode="dashboard" refetch={refetch} />}
          />

          <StatCard
            title="Maintenances and Faults"
            subtitle="Reported faults and Maintenance"
            content={
              <Maintenance mode="dashboard" data={data} refetch={refetch} />
            }
            mode="dashboard"
          />
        </Box>
        <Box
          sx={{
            flex: "1 1 50%",
            display: "flex",
            gap: "5px",
            flexDirection: "column",
          }}
        >
          <StatCard
            title="Sources"
            subtitle="Machines Status"
            content={<Source data={data} mode="dashboard" refetch={refetch} />}
          />
          <StatCard
            title="Calendar"
            subtitle="Upcoming Events"
            content={
              <Calendar mode="dashboard" data={data} refetch={refetch} />
            }
            mode="dashboard"
          />
        </Box>
      </Box>

      <Box>
        <Copyright sx={{ my: 4, mb: 10 }} />
      </Box>
    </Box>
  );
};

export default Dashboard;
