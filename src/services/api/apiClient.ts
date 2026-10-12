import axios, { type AxiosInstance } from "axios";
import { clearStoredAuth, TOKEN_KEY } from "@/utils/authUtils";

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5084/api",
  timeout: 15000,
  // ★ No default Content-Type. Axios auto-detects:
  //   - plain object body → application/json
  //   - FormData         → multipart/form-data; boundary=...
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearStoredAuth();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    } else if (status === 403) {
      window.dispatchEvent(new Event("api-forbidden"));
    }
    return Promise.reject(error);
  },
);

export default apiClient;
