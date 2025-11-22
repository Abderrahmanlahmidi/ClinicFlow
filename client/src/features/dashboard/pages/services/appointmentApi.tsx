import { axiosInstance } from "../../../../services/axiosInstance";

export const getAppointments = async () => {
  const response = await axiosInstance.get("/clinic/appointments");
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await axiosInstance.post(
    "/clinic/create-appointment",
    appointmentData,
  );
  return response.data;
};

export const updateAppointment = async ({ id, data }) => {
  const response = await axiosInstance.patch(
    `/clinic/update-appointment/${id}`,
    data,
  );
  return response.data;
};

export const updateAppointmentStatus = async ({ id, status }) => {
  const response = await axiosInstance.patch(
    `/clinic/update-appointment-status/${id}`,
    { status },
  );
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await axiosInstance.delete(`/clinic/appointment/${id}`);
  return response.data;
};
