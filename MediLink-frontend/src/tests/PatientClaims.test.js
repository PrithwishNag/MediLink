import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PatientClaims from "../components/PatientClaims";
import "@testing-library/jest-dom";
import { AlertProvider } from "../components/AlertContext";

jest.mock("../constants/Contants", () => ({
  constants: {
    hostUrl: "https://example.com",
  },
}));

describe("PatientClaims", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const ongoingClaimsResponse = [
      {
        id: 1,
        status: "Pending",
        patient_first_name: "John",
        patient_last_name: "Doe",
        claim_description: "Description 1",
        document: "Document 1",
      },
    ];
    const completedClaimsResponse = [
      {
        id: 2,
        status: "Completed",
        patient_first_name: "Jane",
        patient_last_name: "Smith",
        claim_description: "Description 2",
        document: "Document 2",
      },
    ];

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve(ongoingClaimsResponse),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(completedClaimsResponse),
      });
    localStorage.setItem("token", "fake-token");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", async () => {
    await act(async () =>
      render(
        <AlertProvider>
          <MemoryRouter>
            <PatientClaims />
          </MemoryRouter>
        </AlertProvider>
      )
    );
    const pendingClaimsAccordion = screen.getByText("Pending claims");
    const completedClaimsAccordion = screen.getByText("Completed claims");
    expect(pendingClaimsAccordion).toBeInTheDocument();
    expect(completedClaimsAccordion).toBeInTheDocument();
    const pendingClaim = screen.getByText("Description 1");
    const completedClaim = screen.getByText("Description 2");
    expect(pendingClaim).toBeInTheDocument();
    expect(completedClaim).toBeInTheDocument();
  });

  it("displays preview when a document link is clicked", async () => {
    const document = "Document 1";

    await act(async () =>
      render(
        <AlertProvider>
          <MemoryRouter>
            <PatientClaims />
          </MemoryRouter>
        </AlertProvider>
      )
    );
    const documentLink = screen.getByText(document);
    fireEvent.click(documentLink);

    await waitFor(() => {
      const previewText = screen.getByText("Preview");
      expect(previewText).toBeInTheDocument();
    });
  });
});
