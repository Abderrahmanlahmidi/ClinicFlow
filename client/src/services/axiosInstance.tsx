import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// === REQUEST INTERCEPTOR === //
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR (REFRESH TOKEN) === //
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // IMPORTANT: use axiosInstance with full URL
        const { data } = await axios.post(
          "http://localhost:8000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // save new token
        localStorage.setItem("accessToken", data.accessToken);

        // attach new token then retry
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
