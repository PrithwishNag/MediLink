import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { constants } from "../constants/Contants";
import { useAlert } from "../components/AlertContext";

const AuthPage = () => {
  const { showToastMessage } = useAlert();
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
    address: "",
    mobile_number: "",
    primary_contact_name: "",
    primary_contact_number: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Data:", loginData);
    try {
      const response = await fetch(constants.hostUrl + "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // Login successful
        const jsonResponse = await response.json();
        localStorage.setItem(constants.tokenKey, jsonResponse.token);
        localStorage.setItem(constants.userTypeKey, jsonResponse.userType);
        window.location.reload()
        console.log("Token saved in local storage");
      } else {
        // Handle login error
        const errorData = await response.json();
        showToastMessage(`Login failed: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      showToastMessage("An error occurred during login", 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log("Register Data:", registerData);
    try {
      const response = await fetch(constants.hostUrl + "/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        // Registration successful
        showToastMessage("User registered successfully");
        window.location.reload();
      } else {
        // Handle registration error
        showToastMessage('Registration failed', 'error');
      }
    } catch (error) {
      console.error("Error during registration:", error);
      showToastMessage("An error occurred during registration", 'error');
    }
  };

  const loginForm = () => {
    return (
      <Form onSubmit={handleLoginSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your email"
            name="email"
            required
            value={loginData.email}
            onChange={handleLoginChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            value={loginData.password}
            onChange={handleLoginChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100" id ="SignIn">
          Sign In
        </Button>
      </Form>
    );
  };

  const registerForm = () => {
    return (
      <Form onSubmit={handleRegisterSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            required
            value={registerData.email}
            onChange={handleRegisterChange}
          />
        </Form.Group>
        <div className="d-flex w-100 justify-content-between">
          <Form.Group className="mb-3 w-100">
            <Form.Label>Your First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="first_name"
              required
              value={registerData.first_name}
              onChange={handleRegisterChange}
            />
          </Form.Group>
          <div className="m-2" />
          <Form.Group className="mb-3 w-100">
            <Form.Label>Your Last Name</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Last Name"
              name="last_name"
              required
              value={registerData.last_name}
              onChange={handleRegisterChange}
            />
          </Form.Group>
        </div>
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your address"
            name="address"
            required
            value={registerData.address}
            onChange={handleRegisterChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Your mobile number"
            name="mobile_number"
            required
            value={registerData.mobile_number}
            onChange={handleRegisterChange}
          />
        </Form.Group>
        <div className="d-flex w-100 justify-content-between">
          <Form.Group className="mb-3 w-100">
            <Form.Label>Primary Contact Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Primary contact's name"
              name="primary_contact_name"
              required
              value={registerData.primary_contact_name}
              onChange={handleRegisterChange}
            />
          </Form.Group>
          <div className="m-2" />
          <Form.Group className="mb-3 w-100">
            <Form.Label>Primary Contact Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Primary contact's phone number"
              name="primary_contact_number"
              required
              value={registerData.primary_contact_number}
              onChange={handleRegisterChange}
            />
          </Form.Group>
        </div>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            value={registerData.password}
            onChange={handleRegisterChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirm_password"
            required
            value={registerData.confirm_password}
            onChange={handleRegisterChange}
          />
        </Form.Group>
        <Button variant="success" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    );
  };

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <Container
      fluid
      className="d-flex h-100 p-0 pt-4 pb-4"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <Row className="m-auto align-self-center w-100">
        <Col md={6} className="mx-auto">
          <h3 className="mb-4 text-center display-6">
            Welcome to <strong>MediLink</strong>
          </h3>
          <Card
            className="shadow p-3 mb-4 bg-white rounded"
            style={{ overflowY: "auto", maxHeight: "90vh" }}
          >
            <Card.Body>
              <Card.Title className="text-center mb-3">
                <h6 className="lead">
                  {isLoginView ? "Login to MediLink" : "Register in MediLink"}
                </h6>
              </Card.Title>
              {isLoginView ? loginForm() : registerForm()}
            </Card.Body>
          </Card>
          <div className="text-center">
            <p>
              {isLoginView ? "Need an account? " : "Already have an account? "}
              <a
                href="#!"
                onClick={toggleView}
                style={{ color: isLoginView ? "#0d6efd" : "#198754" }}
              >
                {isLoginView ? "Register" : "Sign In"}
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPage;
