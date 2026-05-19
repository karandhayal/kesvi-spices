// Centralized API Configuration
// Uses environment variable REACT_APP_API_URL if available, otherwise defaults to Hostinger backend

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://wheat-chough-880353.hostingersite.com/api";

export default API_BASE_URL;
