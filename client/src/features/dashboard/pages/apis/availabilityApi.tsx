import { axiosInstance } from "../../../../api/axiosInstance";

export const getAvailabilities = async () => {
  const res = await axiosInstance.get("/clinic/availabilities");
  return res.data;
};

export const getUserAvailabilities = async (userId) => {
  const res = await axiosInstance.get(`/clinic/availabilities/${userId}`);
  return res.data;
};

export const createAvailability = async (data) => {
  console.log(data);
  try{
    const res = await axiosInstance.post("/clinic/create-availability", data);
    return res.data;
  }catch(error){
    console.log(error);
  }
};

export const updateAvailability = async ({ id, data }) => {
  const res = await axiosInstance.put(`/clinic/update-availability/${id}`, data);
  return res.data;
};

export const deleteAvailability = async (id) => {
  const res = await axiosInstance.delete(`/clinic/delete-availability/${id}`);
  return res.data;
};

