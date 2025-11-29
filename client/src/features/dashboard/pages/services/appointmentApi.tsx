import { axiosInstance } from "../../../../services/axiosInstance";

// Types for appointment API
export interface Appointment {
  id: string;
  date: string;
  status: string;
  doctorId: string;
  patientId: string;
  // Add more fields as needed
}

export interface CreateAppointmentData {
  date: string;
  doctorId: string;
  patientId: string;
  // Add more fields as needed
}

export interface UpdateAppointmentParams {
  id: string;
  data: Partial<CreateAppointmentData>;
}

export interface UpdateAppointmentStatusParams {
  id: string;
  status: string;
}

export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get<Appointment[]>(
    "/clinic/appointments"
  );
  return response.data;
};

export const createAppointment = async (
  appointmentData: CreateAppointmentData
): Promise<Appointment> => {
  const response = await axiosInstance.post<Appointment>(
    "/clinic/create-appointment",
    appointmentData
  );
  return response.data;
};

export const updateAppointment = async ({
  id,
  data,
}: UpdateAppointmentParams): Promise<Appointment> => {
  const response = await axiosInstance.patch<Appointment>(
    `/clinic/update-appointment/${id}`,
    data
  );
  return response.data;
};

export const updateAppointmentStatus = async ({
  id,
  status,
}: UpdateAppointmentStatusParams): Promise<Appointment> => {
  const response = await axiosInstance.patch<Appointment>(
    `/clinic/update-appointment-status/${id}`,
    { status }
  );
  return response.data;
};

export const deleteAppointment = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await axiosInstance.delete<{
    success: boolean;
    message?: string;
  }>(`/clinic/appointment/${id}`);
  return response.data;
};
