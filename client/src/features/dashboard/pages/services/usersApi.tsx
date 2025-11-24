import { axiosInstance } from "../../../../services/axiosInstance";

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const updateUserRole = async ({ id, roleId }) => {
  const res = await axiosInstance.put(`/change-user-role/${id}`, { roleId });
  return res.data;
};

export const updateUserSpeciality = async ({ userId, specialityId }) => {
  const res = await axiosInstance.patch(`/update-speciality-doctor/${userId}`, { specialityId });
  return res.data;
};
