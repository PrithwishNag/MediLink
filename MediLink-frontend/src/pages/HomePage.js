import React, { useState, useEffect } from "react";
import NavigationBar from "../components/Navigation";
import { Container, Col, Row, Accordion, Form } from "react-bootstrap";
import { constants } from "../constants/Contants";
import InsuranceClaimForm from "../components/InsuranceClaimForm";
import PatientClaims from "../components/PatientClaims";
import PastReports from "../components/PastReports";
import MedicineTable from "../components/MedicineTable";
import ReportGraph from "../components/ReportGraph";
import { useAlert } from "../components/AlertContext";

const HomePage = () => {
  const authToken = localStorage.getItem(constants.tokenKey);
  const { showToastMessage } = useAlert();

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    doctor_details: "",
    disease: "",
    communication: "",
    inception: "",
    hospitalName: "",
    precautions: "",
    reports: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Get request
    fetch(constants.hostUrl + "/api/dashboard/patient", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const transformData = {
          name: data.data.first_name,
          doctor_details: data.data.doctor_name,
          disease: data.data.disease_name,
          communication: data.data.doctor_communication,
          hospitalName: data.data.hospital_name,
          inception: data.data.inception,
          precautions: data.data.precautions,
          reports: data.data.reports,
        };

        setUserData(transformData);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
        showToastMessage("Error fetching patient data", "Error")
      });
  };

  // Function to insert line breaks before numbers in a string
  const splitString = (str) => {
    // Split the string using regular expression
    const items = str.split(/\d+\./).filter((item) => item.trim() !== "");
    return items.map((item) => item.trim());
  };

  return (
    <Container
      fluid
      className="p-0"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <NavigationBar />
      <Container fluid className="p-3">
        <Row>
          <Col className="p-3">
            <h5 className="mb-3">Patient Dashboard</h5>
            <h1>Welcome {userData.name}</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <img
                    src="/icons/patient-details.png"
                    alt="precaution"
                    width={30}
                    className="me-3"
                  />
                  <h4 className="m-0" id="Patient details">Patient Details</h4>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col>Name </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder={userData.name}
                        aria-label="Disabled input example"
                        readOnly
                      />
                    </Col>
                    <Col>Doctor Details </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder={userData.doctor_details}
                        aria-label="Disabled input example"
                        readOnly
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>Disease </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder={userData.disease}
                        aria-label="Disabled input example"
                        readOnly
                      />
                    </Col>
                    <Col>Doctor Communication </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder={userData.communication}
                        aria-label="Disabled input example"
                        readOnly
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col> Inception</Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder={userData.inception}
                        aria-label="Disabled input example"
                        readOnly
                      />
                    </Col>
                    <Col> Hospital Name</Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder={userData.hospitalName}
                        aria-label="Disabled input example"
                        readOnly
                      />
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
        <Row className="mb-3">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <img
                  src="/icons/medicine.png"
                  alt="precaution"
                  width={30}
                  className="me-3"
                />
                <h4 className="m-0" id="Medication details">Medication Details</h4>
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <MedicineTable />
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
        <Row className="mb-3">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <img
                  src="/icons/precaution.png"
                  alt="precaution"
                  width={30}
                  className="me-3"
                />
                <h4 className="m-0" id ="Precautions">Precautions</h4>
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  {splitString(userData.precautions).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
        <Row className="mb-3">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <img
                  src="/icons/diagnose.png"
                  alt="precaution"
                  width={30}
                  className="me-3"
                />
                <h4 className="m-0" id="Past Medical records">Past Medical Reports</h4>
              </Accordion.Header>
              <Accordion.Body>
                <PastReports />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
        <Row className="mb-3">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <img
                  src="/icons/diagnostic.png"
                  alt="precaution"
                  width={30}
                  className="me-3"
                />
                <h4 className="m-0" id="Graphs">Report Graphs</h4>
              </Accordion.Header>
              <Accordion.Body>
                <ReportGraph data={userData.reports} />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
        <Row className="mb-3">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <img
                  src="/icons/health-insurance.png"
                  alt="precaution"
                  width={30}
                  className="me-3"
                />
                <h4 className="m-0" id="MedicalClaims">Medical Claims</h4>
              </Accordion.Header>
              <Accordion.Body>
                <InsuranceClaimForm />
                <div className="m-3"></div>
                <PatientClaims />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Row>
      </Container>
    </Container>
  );
};

export default HomePage;
