import axios from "axios";
import { getToken, clearSession } from "../utils/storage";

// Single Axios instance used by every service file. Never call axios
// directly from a component — route all requests through here.
const api = axios.create({
  baseURL: "https://alam-ai.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT bearer token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever responds with 401, the token is no longer valid —
// clear the session so the app redirects back to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
