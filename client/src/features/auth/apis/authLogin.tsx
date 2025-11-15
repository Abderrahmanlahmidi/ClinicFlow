import { axiosInstance } from "../../../api/axiosInstance";


export const loginUser = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};