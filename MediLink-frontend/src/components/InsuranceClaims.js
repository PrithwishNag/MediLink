import React, { useState, useEffect } from "react";
import { Accordion, Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { constants } from "../constants/Contants";
import PdfViewer from "./PdfViewer";
import { useAlert } from "./AlertContext";

const PatientClaims = () => {
  const authToken = localStorage.getItem("token");
  const { showToastMessage } = useAlert();

  const [ongoingClaims, setOngoingClaims] = useState([]);
  const [completedClaims, setCompletedClaims] = useState([]);
  const [selectedClaimId, setSelectedClaimId] = useState();
  const [selectedDocument, setSelectedDocument] = useState();

  const updateClaimStatus = async (claimId, status) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to update this claim request?"
    );
    if (isConfirmed) {
      const response = await fetch(
        constants.hostUrl +
          "/api/dashboard/claim?claimId=" +
          claimId +
          "&terminalStatus=" +
          status,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      if (response.ok) {
        console.log("Update successful");
        showToastMessage("Claim status updated");
        // Handle success response
      } else {
        console.error("Update failed");
        showToastMessage("Claim status update failed", 'error');
        // Handle error
      }
    }
  };

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
            From {claim.patient_first_name} {claim.patient_last_name}
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
          <div className="d-flex mt-3">
            {claim.status === "Pending" ? (
              <>
                <Button
                  variant="outline-success"
                  className="w-100"
                  onClick={() => {
                    updateClaimStatus(claim.id, "Accepted");
                  }}
                >
                  Accept
                </Button>
                <div className="me-3"></div>
                <Button
                  variant="outline-danger"
                  className="w-100"
                  onClick={() => {
                    updateClaimStatus(claim.id, "Declined");
                  }}
                >
                  Decline
                </Button>
              </>
            ) : null}
          </div>
        </Card.Body>
      </Card>
    );
  };

  const ClaimsAccordion = ({ icon, title, claims }) => {
    return (
      <Accordion key="0" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <img src={icon} alt="precaution" width={30} className="me-3" />
            <h4 className="m-0">{title}</h4>
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
      <ClaimsAccordion
        icon="/icons/clock.png"
        title="Pending claims"
        claims={ongoingClaims}
      />
      <div className="m-3"></div>
      <ClaimsAccordion
        icon="/icons/check-mark.png"
        title="Completed claims"
        claims={completedClaims}
      />
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
