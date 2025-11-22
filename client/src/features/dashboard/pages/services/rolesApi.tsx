import { axiosInstance } from "../../../../services/axiosInstance";

export const getRoles = async () => {
  const res = await axiosInstance.get("/clinic/get-roles");
  return res.data;
};

export const createRole = async (data) => {
  const res = await axiosInstance.post("/clinic/create-role", data);
  return res.data;
};

export const updateRole = async ({ id, data }) => {
  const res = await axiosInstance.patch(`/clinic/update-role/${id}`, data);
  return res.data;
};

export const deleteRole = async (id) => {
  const res = await axiosInstance.delete(`/clinic/delete-role/${id}`);
  return res.data;
};
