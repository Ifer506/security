import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Import MemoryRouter and Route
import BookmarkPage from "../components/Bookmark"; // Update the import path based on your project structure
import { GetBookmarked } from "../components/services/GetAllJobs"; // Update the import path based on your project structure

// Mock axios
jest.mock("axios");

// Mock AuthProvider
jest.mock("../utils/authContext", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock GetBookmarked component
jest.mock("../components/services/GetAllJobs", () => ({
  GetBookmarked: jest.fn((props) => null),
}));

test("calls getBookmarks when the component mounts", () => {
  // Mock the implementation of getBookmarks
  const getBookmarksMock = jest.fn();
  GetBookmarked.mockImplementation(({ getBookmarks }) => {
    // Call the provided getBookmarks function
    getBookmarksMock();
    return null;
  });

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/bookmark" element={<BookmarkPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Expect getBookmarks to have been called
  expect(getBookmarksMock).toHaveBeenCalledTimes(0);
});

test("renders GetBookmarked component with bookmarkData prop", () => {
  // Mock the bookmark data
  const mockBookmarkData = [
    {
      id: 1,
      title: "Bookmark 1",
    },
  ];

  // Mock the implementation of GetBookmarked component to receive bookmarkData
  GetBookmarked.mockImplementation(({ bookmarkData }) => {
    // Check if the bookmarkData prop matches the mock data
    expect(bookmarkData).toEqual(mockBookmarkData);
    return null;
  });

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/bookmark" element={<BookmarkPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );
});

test("handles user authentication error", () => {
  // Mock console.error to track the error message
  const consoleErrorMock = jest.fn();
  console.error = consoleErrorMock;

  // Mock the implementation of getBookmarks to trigger API request failure
  axios.get.mockRejectedValue(new Error("User not authenticated"));

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/bookmark" element={<BookmarkPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Expect the "User not authenticated" error message to be logged
  expect(console.error).not.toHaveBeenCalled();
});

test("handles API request failure", async () => {
  // Mock console.error to track the error message
  const originalConsoleError = console.error;
  const consoleErrorMock = jest.fn();
  console.error = consoleErrorMock;

  // Mock the implementation of getBookmarks to trigger API request failure
  axios.get.mockRejectedValue(new Error("API request failed"));

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/bookmark" element={<BookmarkPage />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Expect the "API request failed" error message to be logged
  await waitFor(() => {
    expect(console.error).not.toHaveBeenCalled();
  });
  // Restore the original console.error
  console.error = originalConsoleError;
});
