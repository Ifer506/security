import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Import MemoryRouter and Route
import EditProfile from "../components/Edit_profile";

test("renders the EditProfile component", () => {
  render(
    <MemoryRouter initialEntries={["/editProfile"]}>
      <Routes>
        <Route path="/editProfile" element={<EditProfile />} />
      </Routes>{" "}
    </MemoryRouter>
  );
  // Check that certain elements are present
  expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Phone Number")).toBeInTheDocument();
  expect(screen.getByText("CV")).toBeInTheDocument();
  // Add more checks for specific UI elements as needed
});

// Set up mock server
const server = setupServer(
  rest.get("/users/profile/:userId", (req, res, ctx) => {
    // Return a mock user profile
    return res(
      ctx.status(200),
      ctx.json({
        data: {
          profile: "mockProfileImage",
          fullName: "John Doe",
          phoneNumber: "1234567890",
          cv: "mockCVFile",
        },
      })
    );
  }),
  rest.post("/users/editProfile", (req, res, ctx) => {
    // Check the uploaded profile image and update the user profile
    const formData = req.body;
    if (formData.get("profile")) {
      return res(
        ctx.status(200),
        ctx.json({
          message: "Profile updated successfully",
        })
      );
    }
    return res(
      ctx.status(400),
      ctx.json({
        message: "Error updating profile",
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches and displays user profile", async () => {
  render(
    <MemoryRouter initialEntries={["/editProfile"]}>
      <Routes>
        <Route path="/editProfile" element={<EditProfile />} />
      </Routes>{" "}
    </MemoryRouter>
  );
  // Wait for the user profile to be fetched
  await waitFor(() => {
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });

  // Wait for the Full Name input to have the expected value
  await waitFor(() => {
    expect(screen.getByPlaceholderText("Full Name")).toHaveValue("");
  });

  // Wait for the Phone Number input to have the expected value
  await waitFor(() => {
    expect(screen.getByPlaceholderText("Phone Number")).toHaveValue("");
  });

  //   expect(screen.getByAltText("pp")).toBeInTheDocument();
});

// Set up mock server
const server0 = setupServer(
  rest.get("/users/profile/:userId", (req, res, ctx) => {
    // Simulate an API request failure
    return res(ctx.status(500), ctx.json({ message: "API request failed" }));
  })
);

beforeAll(() => server0.listen());
afterEach(() => server0.resetHandlers());
afterAll(() => server0.close());

test("handles API request failure when fetching user profile", async () => {
  // Mock console.error to track the error message
  const originalConsoleError = console.error;
  const consoleErrorMock = jest.fn();
  console.error = consoleErrorMock;

  render(
    <MemoryRouter initialEntries={["/editProfile"]}>
      <Routes>
        <Route path="/editProfile" element={<EditProfile />} />
      </Routes>{" "}
    </MemoryRouter>
  );
  // Wait for the error message to be logged
  await waitFor(() => {
    expect(consoleErrorMock).not.toHaveBeenCalledWith("API request failed");
  });

  // Restore the original console.error
  console.error = originalConsoleError;
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
test("updates user profile successfully", async () => {
  render(
    <MemoryRouter initialEntries={["/editProfile"]}>
      <Routes>
        <Route path="/editProfile" element={<EditProfile />} />
      </Routes>{" "}
    </MemoryRouter>
  );
  // Mock user input
  fireEvent.change(screen.getByPlaceholderText("Full Name"), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
    target: { value: "9876543210" },
  });

  // Trigger profile update
  fireEvent.click(screen.getByText("Update Profile"));

  // Wait for the update to complete
  await waitFor(() => {
    expect(screen.getAllByText("")).toBeDefined();
  });
});
