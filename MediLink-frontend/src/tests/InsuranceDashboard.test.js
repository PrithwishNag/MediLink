import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { InsuranceDashboard } from "../pages/InsuranceDashboard";
import { AlertProvider } from "../components/AlertContext";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

describe("InsuranceDashboard", () => {
  it("fetches user data and displays it", async () => {
    const mockUserData = { first_name: "John Doe", name: "Insurance Corp" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: mockUserData,
          }),
      })
    );

    await act(async () =>
      render(
        <AlertProvider>
          <MemoryRouter>
            <InsuranceDashboard />
          </MemoryRouter>
        </AlertProvider>
      )
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          `Welcome ${mockUserData.first_name} (${mockUserData.name})`
        )
      ).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });
});
