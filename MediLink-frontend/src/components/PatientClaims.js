import React, { useState, useEffect } from "react";
import { Accordion, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { constants } from "../constants/Contants";
import PdfViewer from "./PdfViewer";

const PatientClaims = () => {
  const authToken = localStorage.getItem("token");
  const [ongoingClaims, setOngoingClaims] = useState([]);
  const [completedClaims, setCompletedClaims] = useState([]);
  const [selectedClaimId, setSelectedClaimId] = useState();
  const [selectedDocument, setSelectedDocument] = useState();

  const ClaimItem = ({ claim }) => {
    const getStatusVariant = () => {
      return claim.status === "Pending"
        ? "warning"
        : claim.terminal_status === "Accepted"
        ? "success"
        : "danger";
    };

    return (
      <Card className="mb-2">
        <Card.Body>
          <Card.Title>
            To {claim.insurance_company_name}
            <Badge bg={getStatusVariant()} className="ms-2">
              {claim.status === "Pending"
                ? claim.status
                : claim.terminal_status}
            </Badge>
          </Card.Title>
          <hr />
          <h5>Description</h5>
          <Card.Text>{claim.claim_description}</Card.Text>
          <hr />
          <h5>Document</h5>
          <li>
            <Link
              onClick={() => {
                setSelectedClaimId(claim.id);
                setSelectedDocument(claim.document);
              }}
            >
              {claim.document}
            </Link>
          </li>
        </Card.Body>
      </Card>
    );
  };

  const ClaimsAccordion = ({ title, claims }) => {
    return (
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <strong id="PendingClaim">{title}</strong>
          </Accordion.Header>
          <Accordion.Body>
            {claims && claims.length
              ? claims.map((claim, index) => (
                  <ClaimItem claim={claim} key={index} />
                ))
              : "Nothing here"}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  useEffect(() => {
    fetch(constants.hostUrl + "/api/dashboard/claim?status=Pending", {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setOngoingClaims(data));

    fetch(constants.hostUrl + "/api/dashboard/claim?status=Completed", {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCompletedClaims(data));
  }, []);

  return (
    <>
      <ClaimsAccordion title="Pending claims" claims={ongoingClaims} />
      <div className="m-3"></div>
      <ClaimsAccordion title="Completed claims" claims={completedClaims} />
      <div className="m-3"></div>
      {selectedClaimId ? (
        <>
          <hr />
          <h5>Preview</h5>
          <p>{selectedDocument}</p>
          <div className="m-3"></div>
          <PdfViewer
            endpoint={"/api/dashboard/claim?claimId=" + selectedClaimId}
          />
        </>
      ) : null}
    </>
  );
};

export default PatientClaims;
