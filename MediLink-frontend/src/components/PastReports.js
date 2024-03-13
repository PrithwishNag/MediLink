import { useEffect, useState } from "react";
import { constants } from "../constants/Contants";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PdfViewer from "./PdfViewer";
import { useAlert } from "./AlertContext";

const PastReports = () => {
  const authToken = localStorage.getItem(constants.tokenKey);
  const { showToastMessage } = useAlert();

  const [fetchedReports, setFetchedReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [uploadablePastReport, setUploadablePastReport] = useState(null);

  useEffect(() => {
    fetch(constants.hostUrl + "/api/dashboard/pastReports", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFetchedReports(data.reports);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
        showToastMessage("Error while fetching the data");
      });
  }, []);

  const uploadPastReports = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append("report", uploadablePastReport);
    const response = await fetch(
      constants.hostUrl + "/api/dashboard/pastReports",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${authToken}`,
        },
        body: submissionData,
      }
    );

    if (response.ok) {
      console.log("Upload successful");
      showToastMessage("Past Report Uploaded Successfully");
      
      // Handle success response
    } else {
      console.error("Upload failed");
      showToastMessage("Past Report Uploaded Failed", 'error');
      // Handle error
    }
  };

  return (
    <>
      <Form onSubmit={uploadPastReports} className="d-flex">
        <input
          type="file"
          className="form-control"
          id="uploadDocuments"
          name="selectedFile"
          required
          onChange={(e) => {
            const value =
              e.target.type === "file" ? e.target.files[0] : e.target.value;
            setUploadablePastReport(value);
          }}
          accept=".pdf"
        />
        <Button className="ms-3 btn btn-primary" id="Submit" type="submit">
          Upload
        </Button>
      </Form>
      <hr />
      <h5>Your Reports</h5>
      {fetchedReports && fetchedReports.length ? (
        <ul>
          {fetchedReports.map((report, index) => (
            <li key={index}>
              <Link
                onClick={() => {
                  setSelectedReportId(report.id);
                }}
              >
                {report.report}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        "Nothing Here"
      )}
      {selectedReportId ? (
        <>
          <hr />
          <h5>Preview</h5>
          <PdfViewer
            endpoint={"/api/dashboard/pastReports?reportId=" + selectedReportId}
          />
        </>
      ) : null}
    </>
  );
};

export default PastReports;