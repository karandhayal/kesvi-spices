// Centralized API Configuration
// Uses environment variable REACT_APP_API_URL if available, otherwise defaults to Hostinger backend

const rawApiUrl =
  process.env.REACT_APP_API_URL ||
  "https://wheat-chough-880353.hostingersite.com/api";

export const API_BASE_URL = rawApiUrl
  .trim()
  .replace(/^HTTPS:/i, "https:")
  .replace(/^HTTP:/i, "http:")
  .replace(/\/+$/, "");

export default API_BASE_URL;
