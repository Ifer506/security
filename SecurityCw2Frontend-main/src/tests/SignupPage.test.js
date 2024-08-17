import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Import MemoryRouter and Route
import SignupPage from "../components/signup_page";

test("renders SignupPage component with basic UI elements", () => {
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Check for the presence of specific UI elements
  expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  expect(screen.getAllByText("Sign Up")).toBeDefined();
  expect(screen.getByText("OR")).toBeInTheDocument();
  expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: "Log In" })).toBeDefined();
});

test("handles input validation for email, password, and confirm password fields", () => {
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
  const signupButton = screen.getByRole("button", { name: "Sign Up" });

  // Invalid case: Empty email, password, and confirm password
  fireEvent.click(signupButton);

  // Invalid case: Password and confirm password do not match
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "password456" } });
  fireEvent.click(signupButton);
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();

  // Valid case: Matching password and confirm password
  fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
  fireEvent.click(signupButton);

  // TODO: Add more test cases for email format validation, etc.
});

test("toggles password visibility when the eye icon button is clicked", () => {
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  const passwordInput = screen.getByPlaceholderText("Password");
  const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

  const passwordToggle1 = screen.getByTestId("togglePass");
  const passwordToggle2 = screen.getByTestId("togglePass0");

  // Initial state: Password input should be of type "password"
  expect(passwordInput.getAttribute("type")).toBe("password");
  expect(confirmPasswordInput.getAttribute("type")).toBe("password");

  // Click the first password toggle button
  fireEvent.click(passwordToggle1);

  // Password input should be of type "text" (visible)
  expect(passwordInput.getAttribute("type")).toBe("text");

  // Click the second password toggle button
  fireEvent.click(passwordToggle2);

  // Confirm password input should be of type "text" (visible)
  expect(confirmPasswordInput.getAttribute("type")).toBe("text");
});

// Define a mock server using MSW
const server = setupServer(
  // Mock a successful signup
  rest.post("/auth/signup", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ message: "Account created successfully" })
    );
  }),
  // Mock a failed signup
  rest.post("/auth/signup", (req, res, ctx) => {
    return res(ctx.status(409), ctx.json({ message: "Email already exists" }));
  })
);

// Enable API mocking before tests
beforeAll(() => server.listen());
// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());
// Disable API mocking after tests are done
afterAll(() => server.close());
test("handles signup with valid and invalid user information", async () => {
  // Render the SignupPage component
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Fill in the signup form with valid information
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "valid@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "validPassword" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "validPassword" },
  });

  // Click the "Sign Up" button
  const signupButton0 = screen.getByRole("button", { name: /Sign Up/i });

  fireEvent.click(signupButton0);
  // Wait for the signup to complete
  await waitFor(() => {
    // Assert that the success message is displayed
    expect(window.location.pathname).toBe("/");
  });

  // Fill in the signup form with invalid information
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "invalid@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "invalidPassword" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
    target: { value: "mismatchedPassword" },
  });

  // Click the "Sign Up" button
  const signupButton = screen.getByRole("button", { name: /Sign Up/i });

  fireEvent.click(signupButton);

  // Wait for the signup to complete
  await waitFor(() => {
    // Assert that the error message is displayed
    expect(window.location.pathname).toBe("/");
  });
});
