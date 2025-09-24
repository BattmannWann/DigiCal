import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

export default function StatCard({ title, subtitle, content, mode }) {
  if (mode !== "projector") {
    return (
      <Box height="auto" margin="5px">
        <Card variant="outlined">
          <CardContent
            sx={{ paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography component="h1" variant="title" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ color: "text.secondary" }}>
                {subtitle}
              </Typography>
            </Box>
            <Divider />
            {content}
          </CardContent>
        </Card>
      </Box>
    );
  } else {
    return (
      <Box p="5px">
        <Card variant="outlined">
          <CardContent sx={{ padding: 0 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Typography fontSize="2.4vh" m="0" variant="title" gutterBottom>
                {title}
              </Typography>
            </Box>
            <Divider />
            {content}
          </CardContent>
        </Card>
      </Box>
    );
  }
}
