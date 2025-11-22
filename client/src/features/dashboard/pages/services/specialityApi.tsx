import { axiosInstance } from "../../../../services/axiosInstance";

export const getSpecialities = async () => {
  const response = await axiosInstance.get("/clinic/specialities");
  return response.data;
};

export const createSpeciality = async (specialityData) => {
  const response = await axiosInstance.post(
    "/clinic/create-speciality",
    specialityData,
  );
  return response.data;
};

export const updateSpeciality = async ({ id, data }) => {
  const response = await axiosInstance.patch(
    `/clinic/update-speciality/${id}`,
    data,
  );
  return response.data;
};

export const deleteSpeciality = async (id) => {
  const response = await axiosInstance.delete(
    `/clinic/delete-speciality/${id}`,
  );
  return response.data;
};
