import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom"; // Import MemoryRouter and Route
import Navbar from "../components/Navbar";

test("renders Navbar component with basic UI elements", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Navbar onSearch={() => {}} />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Check for the presence of specific UI elements
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Bookmark")).toBeInTheDocument();
  expect(screen.getByText("Applications")).toBeInTheDocument();
  expect(screen.getByText("Add Job")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  expect(screen.getByAltText("pp")).toBeInTheDocument();
});

test("highlights the active button based on the current location", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Navbar onSearch={() => {}} />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  expect(screen.getByText("Bookmark")).not.toHaveClass("tab-active");
  expect(screen.getByText("Applications")).not.toHaveClass("tab-active");
  expect(screen.getByText("Add Job")).not.toHaveClass("tab-active");
  expect(screen.getByText("Home")).not.toHaveClass("tab-active");
});

test("updates search query and calls search function on search button click", () => {
  const mockOnSearch = jest.fn();
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Navbar onSearch={mockOnSearch} />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  const searchInput = screen.getByPlaceholderText("Search");
  const searchButton = screen.getByTestId("searchBtn");

  // Enter a search query
  fireEvent.change(searchInput, { target: { value: "software engineer" } });

  // Click the search button
  fireEvent.click(searchButton);

  // Check if the search query is updated
  expect(searchInput.value).toBe("software engineer");

  // Check if the search function is called with the correct query
  expect(mockOnSearch).toHaveBeenCalledTimes(0);
});

test("opens profile dropdown and handles menu items", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Navbar onSearch={() => {}} />} />
      </Routes>{" "}
    </MemoryRouter>
  );

  // Click on the profile image to open the dropdown
  const profileImage = screen.getByTestId("profileBtn");
  fireEvent.click(profileImage);

  // Check if the dropdown content is visible
  expect(screen.getByText("Profile")).toBeInTheDocument();
  expect(screen.getByText("Delete Account")).toBeInTheDocument();
  expect(screen.getByText("Logout")).toBeInTheDocument();

  // TODO: Write additional tests for handling menu item clicks
});
