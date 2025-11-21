import { axiosInstance } from "../../../../api/axiosInstance";


export const getUsers = async () => {
    const res = await axiosInstance.get("/users")
    return res.data;
}


export const updateUserRole = async ({ id, roleId }) => {
  const res = await axiosInstance.put(`/change-user-role/${id}`, {roleId});
  return res.data;
};

