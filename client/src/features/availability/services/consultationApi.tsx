import { axiosInstance } from "../../../services/axiosInstance";

// Types for consultation API
export interface Consultation {
  _id: string;
  userId: string;
  consultationDate: string;
  consultationReason: string;
  diagnosis: string;
  doctorNotes: string;
  allergies: string;
  bloodType: string;
  weight: number;
  height: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: number;
  heartRate: number;
  createdAt?: string;
  updatedAt?: string;
  patient?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    imageProfile?: string;
  };
  doctor?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface CreateConsultationData {
  userId: string;
  consultationDate: string;
  consultationReason: string;
  diagnosis: string;
  doctorNotes: string;
  allergies: string;
  bloodType: string;
  weight: number;
  height: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: number;
  heartRate: number;
}

export interface UpdateConsultationParams {
  id: string;
  data: Partial<CreateConsultationData>;
}

// Get all consultations
export const getAllConsultations = async (): Promise<Consultation[]> => {
  const response = await axiosInstance.get<Consultation[]>(
    "/clinic/consultations"
  );
  return response.data;
};

// Get consultations for specific user
export const getUserConsultations = async (
  userId: string
): Promise<Consultation[]> => {
  const response = await axiosInstance.get<Consultation[]>(
    `/clinic/user-consultations/${userId}`
  );
  return response.data;
};

// Get consultations for current doctor
export const getDoctorConsultations = async (
  doctorId: string
): Promise<Consultation[]> => {
  const response = await axiosInstance.get<Consultation[]>(
    `/clinic/doctor-consultations/${doctorId}`
  );
  return response.data;
};

// Get consultations for current patient
export const getPatientConsultations = async (
  patientId: string
): Promise<Consultation[]> => {
  const response = await axiosInstance.get<Consultation[]>(
    `/clinic/patient-consultations/${patientId}`
  );
  return response.data;
};

// Create new consultation
export const createConsultation = async (
  consultationData: CreateConsultationData
): Promise<Consultation> => {
  console.log("Creating consultation with data:", consultationData);
  const response = await axiosInstance.post<Consultation>(
    "/clinic/create-consultation",
    consultationData
  );
  return response.data;
};

// Update consultation
export const updateConsultation = async ({
  id,
  data,
}: UpdateConsultationParams): Promise<Consultation> => {
  console.log("Updating consultation ID:", id);
  console.log("Update data:", data);
  const response = await axiosInstance.patch<Consultation>(
    `/clinic/update-consultation/${id}`,
    data
  );
  return response.data;
};

// Delete consultation
export const deleteConsultation = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await axiosInstance.delete<{
    success: boolean;
    message?: string;
  }>(`/clinic/delete-consultation/${id}`);
  return response.data;
};