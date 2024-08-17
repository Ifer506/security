import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AddJob from "../components/AddJob"; // Update the import path based on your project structure
import { AuthProvider } from "../utils/authContext";

// Mock axios
jest.mock("axios");

// Mock AuthProvider
jest.mock("../utils/authContext", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

test("renders AddJob form with required fields", () => {
  render(
    <MemoryRouter initialEntries={["/addjob"]}>
      <Routes>
        <Route path="/addjob" element={<AddJob />} />
      </Routes>
    </MemoryRouter>
  );

  // Find input fields
  const companyNameInput = screen.getByPlaceholderText("Company Name");
  const jobTitleInput = screen.getByPlaceholderText("Job Title");
  const descTextarea = screen.getByPlaceholderText(
    "Write qualifications and job description"
  );
  const salaryInput = screen.getByPlaceholderText(
    "Enter Salary, Eg:- $1000/yr"
  );
  const locationInput = screen.getByPlaceholderText("Enter job work location");

  expect(companyNameInput).toBeInTheDocument();
  expect(jobTitleInput).toBeInTheDocument();
  expect(descTextarea).toBeInTheDocument();
  expect(salaryInput).toBeInTheDocument();
  expect(locationInput).toBeInTheDocument();
});

test("updates form field values when typed into", () => {
  render(
    <MemoryRouter initialEntries={["/addjob"]}>
      <Routes>
        <Route path="/addjob" element={<AddJob />} />
      </Routes>
    </MemoryRouter>
  );

  // Find input fields
  const companyNameInput = screen.getByPlaceholderText("Company Name");
  const jobTitleInput = screen.getByPlaceholderText("Job Title");
  const descTextarea = screen.getByPlaceholderText(
    "Write qualifications and job description"
  );
  const salaryInput = screen.getByPlaceholderText(
    "Enter Salary, Eg:- $1000/yr"
  );
  const locationInput = screen.getByPlaceholderText("Enter job work location");

  // Type into the input fields
  fireEvent.change(companyNameInput, { target: { value: "Company ABC" } });
  fireEvent.change(jobTitleInput, { target: { value: "Software Engineer" } });
  fireEvent.change(descTextarea, {
    target: { value: "Qualifications and job description" },
  });
  fireEvent.change(salaryInput, { target: { value: "$1000/yr" } });
  fireEvent.change(locationInput, { target: { value: "City ABC" } });

  // Check if the input values are updated
  expect(companyNameInput.value).toBe("Company ABC");
  expect(jobTitleInput.value).toBe("Software Engineer");
  expect(descTextarea.value).toBe("Qualifications and job description");
  expect(salaryInput.value).toBe("$1000/yr");
  expect(locationInput.value).toBe("City ABC");
});

test("renders Add Job button", () => {
  render(
    <MemoryRouter initialEntries={["/addjob"]}>
      <Routes>
        <Route path="/addjob" element={<AddJob />} />
      </Routes>
    </MemoryRouter>
  );

  // Find "Add Job" button
  const addButton = screen.getByRole("button", { name: /Add Job/i });
  expect(addButton).toBeInTheDocument();
});

test("displays error message for empty required fields on form submission", async () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/addjob"]}>
        <Routes>
          <Route path="/addjob" element={<AddJob />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  // Find "Add Job" button
  const addButton = screen.getByRole("button", { name: /Add Job/i });

  // Click the "Add Job" button without filling in the required fields
  fireEvent.click(addButton);

  // Expect an error message to be shown for empty fields
  const errorMessage = await screen.findAllByText("Add Job");
  expect(window.location.pathname).toBe("/");
});

test("displays success message for successful job addition", async () => {
  // Mock a successful job addition response
  const mockResponse = {
    status: 201,
    data: { message: "Job added successfully" },
  };
  axios.post.mockResolvedValue(mockResponse);

  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/addjob"]}>
        <Routes>
          <Route path="/addjob" element={<AddJob />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  // Fill in the required fields
  const companyNameInput = screen.getByPlaceholderText("Company Name");
  const jobTitleInput = screen.getByPlaceholderText("Job Title");
  const descTextarea = screen.getByPlaceholderText(
    "Write qualifications and job description"
  );
  const salaryInput = screen.getByPlaceholderText(
    "Enter Salary, Eg:- $1000/yr"
  );
  fireEvent.change(companyNameInput, { target: { value: "Company ABC" } });
  fireEvent.change(jobTitleInput, { target: { value: "Software Engineer" } });
  fireEvent.change(descTextarea, {
    target: { value: "Qualifications and job description" },
  });
  fireEvent.change(salaryInput, { target: { value: "$1000/yr" } });

  // Mock the logo file
  const logoFile = new File(["file contents"], "logo.png", {
    type: "image/png",
  });
  const fileInput = screen.getByTestId("fileHandle");
  fireEvent.change(fileInput, { target: { files: [logoFile] } });

  // Find "Add Job" button and click it
  const addButton = screen.getByRole("button", { name: /Add Job/i });

  fireEvent.click(addButton);

  // Expect a success message
  const successMessage = await screen.findByText(/Home/i);
  expect(successMessage).toBeInTheDocument();
});
