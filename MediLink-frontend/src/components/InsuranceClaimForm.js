import React, { useState, useEffect } from "react";
import { constants } from "../constants/Contants";
import { Accordion, Form } from "react-bootstrap";
import { useAlert } from "./AlertContext";

const InsuranceClaimForm = () => {
  const authToken = localStorage.getItem(constants.tokenKey);
  const { showToastMessage } = useAlert();

  // State to hold the list of insurance companies
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);

  // Fetch insurance companies on component mount
  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      const response = await fetch(constants.hostUrl + "/api/dashboard/insuranceCompanies", {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInsuranceCompanies(data);
      } else {
        // Handle fetch error
        console.error("Failed to fetch insurance companies");
        showToastMessage("Failed to fetch insurance companies", "error")
      }
    };

    fetchInsuranceCompanies();
  }, []); // Empty dependency array means this effect runs once on mount

  const [formData, setFormData] = useState({
    insuranceCompany: "",
    claimDescription: "",
    selectedFile: null,
  });

  const handleChange = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append("insurance_company_name", formData.insuranceCompany);
    submissionData.append("claim_description", formData.claimDescription);
    submissionData.append("document", formData.selectedFile);

    // Example: POST request using fetch API
    const response = await fetch(constants.hostUrl + "/api/dashboard/claim", {
      method: "POST",
      headers: {
        Authorization: `Token ${authToken}`,
      },
      body: submissionData,
    });

    if (response.ok) {
      console.log("Upload successful");
      showToastMessage("Claim initiated successfully")
      // Handle success response
    } else {
      console.error("Upload failed");
      showToastMessage("Claim initiation failed", "error")
      // Handle error
    }
  };

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <strong id="SubmitClaims">Submit a claim</strong>
        </Accordion.Header>
        <Accordion.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="insuranceCompany" className="form-label">
                Insurance Company
              </label>
              <Form.Select
                id="insuranceCompany"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleChange}
                aria-label="Select an insurance company"
                required
              >
                <option value="">Select an insurance company</option>
                {insuranceCompanies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="mb-3">
              <label htmlFor="claimDescription" className="form-label">
                Claim Description
              </label>
              <textarea
                className="form-control"
                id="claimDescription"
                name="claimDescription"
                required
                rows="3"
                value={formData.claimDescription}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="uploadDocuments" className="form-label">
                Upload Documents
              </label>
              <input
                type="file"
                className="form-control"
                id="uploadDocuments"
                name="selectedFile"
                required
                onChange={handleChange}
                accept=".pdf"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default InsuranceClaimForm;
