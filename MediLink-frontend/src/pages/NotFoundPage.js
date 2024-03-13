import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center text-center p-0"
      style={{ height: "100vh", backgroundColor: "var(--background-color)" }}
    >
      <img
        className="mb-5"
        src="/icons/not-found-icon.png"
        alt={"Not found Error"}
        width={"100px"}
      />
      <h1 className="display-4">404 - Page Not Found</h1>
      <p className="lead mb-5">
        <strong>Oops! The page you are looking for does not exist.</strong>
      </p>
      <Link to="/home">Return to MediLink Homepage</Link>
    </Container>
  );
};

export default NotFoundPage;
