import React from "react";
import { render, screen, act } from "@testing-library/react";
import HomePage from "../pages/HomePage";
import { AlertProvider } from "../components/AlertContext";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

const mockLocalStorage = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        data: {
          first_name: "John",
          last_name: "Doe",
          doctor_name: "Dr. Smith",
          disease_name: "Common Cold",
          doctor_communication: "Email",
          inception: "2021-01-01",
          hospital_name: "General Hospital",
          precautions: "Rest, Hydration",
          reports: [],
        },
      }),
  })
);

describe("HomePage", () => {
  beforeEach(() => {
    fetch.mockClear();
    window.localStorage.clear();
  });

  it("fetches and displays user data", async () => {
    window.localStorage.setItem("token", "fake-token");

    await act(async () =>
      render(
        <AlertProvider>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </AlertProvider>
      )
    );

    // Use screen to query for elements
    const userNameDisplay = await screen.findByText(/Welcome John/i);
    const diseaseNameDisplay = screen.getByPlaceholderText("Common Cold");
    const hospitalNameDisplay = screen.getByPlaceholderText(/General Hospital/i);
    const doctorDetailsDisplay = screen.getByPlaceholderText(/Dr. Smith/i);

    expect(userNameDisplay).toBeInTheDocument();
    expect(diseaseNameDisplay).toBeInTheDocument();
    expect(hospitalNameDisplay).toBeInTheDocument();
    expect(doctorDetailsDisplay).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(5);
  });
});
