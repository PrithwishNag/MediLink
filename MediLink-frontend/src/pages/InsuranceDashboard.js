import { Container, Row, Col } from "react-bootstrap";
import NavigationBar from "../components/Navigation";
import { constants } from "../constants/Contants";
import { useEffect, useState } from "react";
import InsuranceClaims from "../components/InsuranceClaims";
import { useAlert } from "../components/AlertContext";

export const InsuranceDashboard = () => {
  const { showToastMessage } = useAlert();
  const authToken = localStorage.getItem(constants.tokenKey);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    companyName: "",
  });

  const fetchUserData = async () => {
    // Get request
    fetch(constants.hostUrl + "/api/dashboard/insuranceCompany", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const transformData = {
          name: data.data.first_name,
          companyName: data.data.name,
        };

        setUserData(transformData);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
        showToastMessage("Error while fetching the data", 'error');
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Container
      fluid
      className="p-0"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <NavigationBar />
      <Container
        fluid
        className="p-3"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <Row>
          <Col className="p-3">
            <h5 className="mb-3">Insurance Dashboard</h5>
            <h1>
              {`Welcome ${userData.name} (${userData.companyName})`}
            </h1>
          </Col>
        </Row>
        <InsuranceClaims />
      </Container>
    </Container>
  );
};
