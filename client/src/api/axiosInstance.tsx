import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;


      const { data } = await axiosInstance.post("/auth/refresh"); 
      localStorage.setItem("access_token", data.accessToken);

      originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);
