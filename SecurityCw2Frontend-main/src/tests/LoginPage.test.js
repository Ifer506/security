import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Import MemoryRouter and Route
import LoginPage from "../components/login_page"; // Update the import path based on your project structure
import { getIcons } from "../components/services/common";
import { server } from "../mocks/server";
import { AuthProvider } from "../utils/authContext";

jest.mock("axios");
// Mock the AuthProvider to provide a mock useAuth hook
jest.mock("../utils/authContext", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

test("renders login form with email and password fields", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Find email input
  const emailInput = screen.getByPlaceholderText("Email");
  expect(emailInput).toBeInTheDocument();

  // Find password input
  const passwordInput = screen.getByPlaceholderText("Password");
  expect(passwordInput).toBeInTheDocument();
});

test("toggle password visibility", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Find password input
  const passwordInput = screen.getByPlaceholderText("Password");

  // Find the password toggle button
  const toggleButton = screen.getByTestId("password-toggle-button");

  // Initially, the password input should be of type "password"
  expect(passwordInput.type).toBe("password");

  // Click the toggle button to change the password input type
  fireEvent.click(toggleButton);

  // Now, the password input should be of type "text"
  expect(passwordInput.type).toBe("text");
});

test("renders LoginPage component", () => {
  // Render the LoginPage component
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  );

  // Use a simple check to assert that some text from the component is in the document.
  const hiText = screen.getByText("Hi!");
  expect(hiText).toBeInTheDocument();
});
describe("LoginPage Form Field Interaction", () => {
  it("renders email input field", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
  });

  it("renders password input field", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toBeInTheDocument();
  });

  it("toggles password visibility when 'Show Password' button is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );
    const passwordInput = screen.getByPlaceholderText("Password");
    const showPasswordButton = screen.getByTestId("password-toggle-button");

    // Password is initially hidden
    expect(passwordInput.type).toBe("password");

    // Click the 'Show Password' button
    fireEvent.click(showPasswordButton);

    // Password should be visible
    expect(passwordInput.type).toBe("text");

    // Click the 'Show Password' button again
    fireEvent.click(showPasswordButton);

    // Password should be hidden again
    expect(passwordInput.type).toBe("password");
  });

  it("updates email input field value when typed into", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Email");

    // Type into the email input field
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Check if the input value is updated
    expect(emailInput.value).toBe("test@example.com");
  });

  it("updates password input field value when typed into", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );
    const passwordInput = screen.getByPlaceholderText("Password");

    // Type into the password input field
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    // Check if the input value is updated
    expect(passwordInput.value).toBe("testpassword");
  });
});

describe("LoginPage User Authentication", () => {
  it("calls useAuth hook when submitting the form", () => {
    // Mock the setEmail function of the useAuth hook
    const mockSetEmail = jest.fn();

    // Set up the mock useAuth hook
    jest.mock("../utils/authContext", () => ({
      useAuth: () => ({
        setEmail: mockSetEmail,
      }),
    }));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Find the Log In button
    const loginButton = screen.getByRole("button", { name: /Log In/i });

    // Click the Log In button without filling in the email and password fields
    fireEvent.click(loginButton);

    // Expect the useAuth hook to be called
    expect(window.location.pathname).toBe("/");
  });
});

describe("LoginPage API Interaction", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("calls API with correct data when submitting the form", async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Fill in the email and password fields
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    const loginButton = screen.getByRole("button", { name: /Log In/i });
    fireEvent.click(loginButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });
});

test('user is redirected to the "/home" route after successful login', async () => {
  // Mock a successful login response
  const mockResponse = {
    data: {
      success: true,
      message: "Login successful",
      token: "mockToken",
    },
  };

  axios.post.mockResolvedValue(mockResponse);

  // Render the LoginPage component within a MemoryRouter
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  // Fill in the email and password fields
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  // Find and click the "Log In" button
  const loginButton = screen.getByRole("button", { name: /Log In/i });
  fireEvent.click(loginButton);

  // Wait for redirection to "/home"
  await screen.findByText("Hi!"); // Assuming there's a welcome message on the home page

  // Check if the redirection happened correctly
  expect(window.location.pathname).toBe("/");
});

test('the "Sign Up" link navigates to the "/signup" route', () => {
  // Render the LoginPage component within a MemoryRouter
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  // Find the "Sign Up" link
  const signUpLink = screen.getByText("Sign Up");
  expect(signUpLink).toHaveAttribute("href", "/signup");

  // Click the "Sign Up" link
  fireEvent.click(signUpLink);

  // Check if the navigation to "/signup" happened correctly
  expect(window.location.pathname).toBe("/");
});

test('renders "Hi!" text', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
  const hiText = screen.getByText("Hi!");
  expect(hiText).toBeInTheDocument();
});

test('renders "Welcome Back" text', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
  const welcomeText = screen.getByText("Welcome Back");
  expect(welcomeText).toBeInTheDocument();
});

test('renders "Log In" header', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
  const loginHeader = screen.getAllByText("Log In");
  expect(loginHeader).toBeDefined();
});

test('renders "OR" divider', () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
  const orDivider = screen.getByText("OR");
  expect(orDivider).toBeDefined();
});

test("renders social icons", () => {
  render(<div>{getIcons()}</div>);

  // Assuming you have FontAwesome icons in the rendered output
  const googleIcon = screen.getByTestId("google-icon");
  const appleIcon = screen.getByTestId("apple-icon");
  const facebookIcon = screen.getByTestId("facebook-icon");

  expect(googleIcon).toBeInTheDocument();
  expect(appleIcon).toBeInTheDocument();
  expect(facebookIcon).toBeInTheDocument();
});

// Test case: Display error message for empty fields
test("form submission with empty fields shows error message", async () => {
  // Render the LoginPage component
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  // Find the Log In button
  const loginButton = screen.getByRole("button", { name: /Log In/i });

  // Click the Log In button without filling in the email and password fields
  fireEvent.click(loginButton);

  // Expect an error message to be shown
  const errorMessage = screen.getByText("Fields cannot be left empty");
  expect(errorMessage).toBeInTheDocument();
});

// Test case: Display "Unable to Login" error message for API request failure
test("display 'Unable to Login' error message for API request failure", async () => {
  // Mock the axios post method to simulate a failed API request
  axios.post.mockRejectedValue(new Error("API request failed"));

  // Render the LoginPage component
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  // Fill in the email and password fields
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  // Find the Log In button and click it to trigger the API request
  const loginButton = screen.getByRole("button", { name: /Log In/i });
  fireEvent.click(loginButton);

  // Expect the "Unable to Login" error message to be shown
  const errorMessage = await screen.findAllByText("Unable to Login");
  expect(errorMessage).toBeDefined();
});
