import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InsuranceClaims from "../components/InsuranceClaims";
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
            <InsuranceClaims />
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

  it("updates claim status when accept/decline button is clicked", async () => {
    const claimId = 1;
    global.confirm = jest.fn(() => true);

    await act(async () =>
      render(
        <AlertProvider>
          <MemoryRouter>
            <InsuranceClaims />
          </MemoryRouter>
        </AlertProvider>
      )
    );
    const acceptButton = screen.getByText("Accept");
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `https://example.com/api/dashboard/claim?claimId=${claimId}&terminalStatus=Accepted`,
        expect.any(Object)
      );
    });
  });

  it("displays preview when a document link is clicked", async () => {
    const document = "Document 1";

    await act(async () =>
      render(
        <AlertProvider>
          <MemoryRouter>
            <InsuranceClaims />
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
