import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "../App";
import store from "../redux/store";

test("renders the App component without crashing", () => {
  render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
});

test("Provider wraps App with Redux store", () => {
  // Render the App component wrapped with Provider and BrowserRouter
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  const appElement = screen.getByText(/have/i);
  expect(appElement).toBeDefined();
});

test("renders App component within BrowserRouter", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Check if a component or text within the App component is present
  const someTextInsideAppComponent = screen.getByText(/an/i);
  expect(someTextInsideAppComponent).toBeInTheDocument();
});
