/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#20C6B1",    // Teal color for primary elements such as buttons
          secondary: "#FF6347",  // Tomato color for secondary elements
          accent: "#FFD700",     // Gold color for accent elements
          neutral: "#F5F5F5",    // Light gray for neutral backgrounds
          "base-100": "#FFFFFF", // White for the base background
          info: "#3B82F6",       // Light blue for informational elements
          success: "#10B981",    // Green for success messages
          warning: "#F59E0B",    // Amber for warning messages
          error: "#EF4444",      // Red for error messages
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-flip"),
    require("@tailwindcss/forms"),
  ],
};
