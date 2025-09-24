import { Container, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Profile = ({ user }) => {
  return (
    <Container>
      <Card sx={{ p: 10, textAlign: "left", boxShadow: 3, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h1" fontWeight="bold" color = "text.secondary" gutterBottom sx={{ textAlign: "center" }}>
            Hello {user.model.staff_name}!
          </Typography>

          <Typography variant="h4" color="text.secondary">
            <strong>Email:</strong> {user.email}
          </Typography>

          <Typography variant="h4" color="text.secondary">
            <strong>Phone Number:</strong> {user.model.phone}
          </Typography>

          <Typography variant="h4" color="text.secondary">
            <strong>Role:</strong> {user.post}
          </Typography>

          <Typography variant="h4" color="text.secondary">
            <strong>Status:</strong> {user.model.status}
          </Typography>

          <Typography variant="h5" color="text.secondary" sx={{ textAlign: "center", padding: "20px" }}>
            Need to update some of this information?{" "}
            <Link to="/edit-profile" style={{ textDecoration: "none", fontWeight: "bold", color: "#1976d2" }} user={user}>
              Click here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
