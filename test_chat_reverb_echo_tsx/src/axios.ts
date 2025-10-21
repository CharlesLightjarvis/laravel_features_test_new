import axios from "axios";

const apiUrl = "http://talkenoo.test";

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true, // Utilisation du cookie CSRF
});

export const getCsrfToken = async () => {
  try {
    await api.get("/sanctum/csrf-cookie");
  } catch (error) {
    throw error;
  }
};

// Add request interceptor to include auth token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Optionally redirect to login page
      localStorage.removeItem("auth_token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
