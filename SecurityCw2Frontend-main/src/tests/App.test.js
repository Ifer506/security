import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Import MemoryRouter and Route
import App from "../App"; // Update the path to your App component

test("renders App component without crashing", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>{" "}
    </MemoryRouter>
  );
});

// Mock the localStorage.getItem method
const originalLocalStorageGetItem = window.localStorage.getItem;
window.localStorage.getItem = jest.fn();
describe("App component loading state", () => {
  afterEach(() => {
    // Clear the mock implementation after each test
    window.localStorage.getItem = [];
  });

  test("renders loading message initially", () => {
    // Simulate loading state by not setting a token
    window.localStorage.getItem = originalLocalStorageGetItem;

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>{" "}
      </MemoryRouter>
    );

    // Verify that the loading message is displayed
    const loadingMessage = screen.getByText(/account/i);
    expect(loadingMessage).toBeInTheDocument();
  });

  test("displays content after token check", () => {
    // Simulate token present in local storage
    window.localStorage.getItem = [];

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>{" "}
      </MemoryRouter>
    );

    // Verify that the loading message disappears
    const loadingMessage = screen.queryByText(/account/i);
    expect(loadingMessage).toBeDefined();

    // Verify that the component renders the correct content based on the token's presence
    // For this test, let's assume that we have a "HomePage" component and a "LoginPage" component
    // and the "HomePage" component is displayed if the user is authenticated
    const homePageContent = screen.getByText(/account/i);
    expect(homePageContent).toBeInTheDocument();
  });

  test("displays login page when token is absent", () => {
    // Simulate no token in local storage
    window.localStorage.getItem = [];

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>{" "}
      </MemoryRouter>
    );

    // Verify that the loading message disappears
    const loadingMessage = screen.queryByText(/account/i);
    expect(loadingMessage).toBeInTheDocument();

    // Verify that the component renders the LoginPage when the token is absent
    const loginPageContent = screen.getByText("Hi!");
    expect(loginPageContent).toBeInTheDocument();
  });
});
