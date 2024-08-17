import { fireEvent, render, screen } from "@testing-library/react";
import Footer from "../components/Footer";

test("renders footer component with basic UI elements", () => {
  render(<Footer />);

  // Check for the presence of specific UI elements
  expect(screen.getByText("Contact Us")).toBeInTheDocument();
  expect(screen.getByText("Email: info@jobfinder.com")).toBeInTheDocument();
  expect(screen.getByText("Phone: +1 123 456 7890")).toBeInTheDocument();
  expect(screen.getByText("Socials")).toBeInTheDocument();
  expect(screen.getByTestId("facebook-link")).toBeInTheDocument();
  expect(screen.getByTestId("twitter-link")).toBeInTheDocument();
  expect(screen.getByTestId("reddit-link")).toBeInTheDocument();
  expect(screen.getByTestId("youtube-link")).toBeInTheDocument();
});

test("footer hides when scrolling down and shows when scrolling up", () => {
  render(<Footer />);
  const footer = screen.getByTestId("footer");

  // Simulate scrolling down
  fireEvent.scroll(window, { target: { scrollY: 200 } });

  // Footer should be hidden
  expect(footer).toHaveClass("hide");

  // Simulate scrolling up
  fireEvent.scroll(window, { target: { scrollY: 0 } });

  // Footer should be shown
  expect(footer).not.toHaveClass("hide");
});

test("social media links open correct URLs in new tab", () => {
  render(<Footer />);

  // Test Facebook link
  const facebookLink = screen.getByTestId("facebook-link");
  expect(facebookLink).toBeInTheDocument();
  expect(facebookLink).toHaveAttribute(
    "href",
    "https://www.facebook.com/Jobfinder.support/"
  );
  expect(facebookLink).toHaveAttribute("target", "_blank");
  expect(facebookLink).toHaveAttribute("rel", "noreferrer");

  // Test Twitter link
  const twitterLink = screen.getByTestId("twitter-link");
  expect(twitterLink).toBeInTheDocument();
  expect(twitterLink).toHaveAttribute("href", "https://twitter.com/rukkumari");
  expect(twitterLink).toHaveAttribute("target", "_blank");
  expect(twitterLink).toHaveAttribute("rel", "noreferrer");

  // Test Reddit link
  const redditLink = screen.getByTestId("reddit-link");
  expect(redditLink).toBeInTheDocument();
  expect(redditLink).toHaveAttribute(
    "href",
    "https://www.reddit.com/r/thejobfinder/"
  );
  expect(redditLink).toHaveAttribute("target", "_blank");
  expect(redditLink).toHaveAttribute("rel", "noreferrer");

  // Test YouTube link
  const youtubeLink = screen.getByTestId("youtube-link");
  expect(youtubeLink).toBeInTheDocument();
  expect(youtubeLink).toHaveAttribute(
    "href",
    "https://www.youtube.com/hashtag/jobfinder"
  );
  expect(youtubeLink).toHaveAttribute("target", "_blank");
  expect(youtubeLink).toHaveAttribute("rel", "noreferrer");
});
