import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Import MemoryRouter and Route
import ApplicationPage from "../components/apaplications_page"; // Update the import path based on your project structure
import {
  GetAppliedJobs,
  GetCreatedJobs,
} from "../components/services/GetAllJobs"; // Update the import path based on your project structure

// Mock axios
jest.mock("axios");

// Mock AuthProvider
jest.mock("../utils/authContext", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock GetAppliedJobs and GetCreatedJobs components
jest.mock("../components/services/GetAllJobs", () => ({
  GetAppliedJobs: jest.fn((props) => null),
  GetCreatedJobs: jest.fn((props) => null),
}));

test("switches to 'Received' tab when clicked", () => {
  render(
    <MemoryRouter initialEntries={["/application"]}>
      <Routes>
        <Route path="/application" element={<ApplicationPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Find the "Received" tab and click it
  const receivedTab = screen.getByText("Received");
  fireEvent.click(receivedTab);

  // Expect the "Received" tab to be active
  expect(receivedTab.classList).toContain("tab-active");

  // Expect the "Applied" tab to not be active
  const appliedTab = screen.getByText("Applied");
  expect(appliedTab.classList).not.toContain("tab-active");
});

test("calls getAppliedJobs when the component mounts", () => {
  // Mock the implementation of getAppliedJobs
  const getAppliedJobsMock = jest.fn();
  GetAppliedJobs.mockImplementation(({ getAppliedJobs }) => {
    // Call the provided getAppliedJobs function
    getAppliedJobsMock();
    return null;
  });

  render(
    <MemoryRouter initialEntries={["/application"]}>
      <Routes>
        <Route path="/application" element={<ApplicationPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Expect getAppliedJobs to have been called
  expect(getAppliedJobsMock).toHaveBeenCalledTimes(1);
});

test("calls getCreatedJobs when 'Received' tab is active", async () => {
  // Mock the implementation of getCreatedJobs
  const getCreatedJobsMock = jest.fn();
  GetCreatedJobs.mockImplementation(({ getCreatedJobs }) => {
    // Call the provided getCreatedJobs function
    getCreatedJobsMock();
    return null;
  });

  render(
    <MemoryRouter initialEntries={["/application"]}>
      <Routes>
        <Route path="/application" element={<ApplicationPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Find the "Received" tab and click it
  const receivedTab = screen.getByText("Received");
  fireEvent.click(receivedTab);

  // Wait for getCreatedJobs to be called
  await waitFor(() => {
    expect(getCreatedJobsMock).toHaveBeenCalledTimes(1);
  });
});
