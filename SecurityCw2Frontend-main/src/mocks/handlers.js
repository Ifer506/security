// src/mocks/handlers.js
import { rest } from "msw";

// Use a relative URL for the mock handlers
export const handlers = [
  // Handles a POST /auth/login request
  rest.post("/auth/login", (req, res, ctx) => {
    console.log(req.body);
    return res(
      ctx.status(200),
      ctx.json({
        status: "login success",
        token: "some token",
      })
    );
  }),

  // Handles a GET /auth request
  rest.get("/auth", (req, res, ctx) => {
    // You can define a mock response for this route if needed
    return res(
      ctx.status(200),
      ctx.json({
        // Your mock response here
      })
    );
  }),
];
