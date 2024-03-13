import Navbar from "react-bootstrap/Navbar";
import { Container, Button } from "react-bootstrap";
import { constants } from "../constants/Contants";
import { useAlert } from "./AlertContext";

function NavigationBar() {
  const { showToastMessage } = useAlert();
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (!confirmed) {
      return;
    }

    const authToken = localStorage.getItem(constants.tokenKey);
    try {
      const response = await fetch(constants.hostUrl + "/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.ok) {
        console.log("Logout successful");
        window.location.reload();
      } else {
        console.error("Logout failed");
        showToastMessage("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      showToastMessage("An unexpected error occurred during logout.");
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary p-0">
      <Container
        fluid
        className="m-0 p-3"
        style={{ backgroundColor: "var(--primary-color)" }}
      >
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <img src="/icons/logo.png" alt="logo" width={40} className="me-3" />
          <h4 className="m-0" style={{ color: "white" }}>
            {constants.appName}
          </h4>
        </Navbar.Brand>
        <Button variant="outline-dark" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
