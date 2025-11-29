import { axiosInstance } from "../../../../services/axiosInstance";

// Types for speciality API
export interface Speciality {
  id: string;
  name: string;
  // Add more fields as needed
}

export interface CreateSpecialityData {
  name: string;
  // Add more fields as needed
}

export interface UpdateSpecialityParams {
  id: string;
  data: Partial<CreateSpecialityData>;
}

export const getSpecialities = async (): Promise<Speciality[]> => {
  const response = await axiosInstance.get<Speciality[]>(
    "/clinic/specialities"
  );
  return response.data;
};

export const createSpeciality = async (
  specialityData: CreateSpecialityData
): Promise<Speciality> => {
  const response = await axiosInstance.post<Speciality>(
    "/clinic/create-speciality",
    specialityData
  );
  return response.data;
};

export const updateSpeciality = async ({
  id,
  data,
}: UpdateSpecialityParams): Promise<Speciality> => {
  const response = await axiosInstance.patch<Speciality>(
    `/clinic/update-speciality/${id}`,
    data
  );
  return response.data;
};

export const deleteSpeciality = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await axiosInstance.delete<{
    success: boolean;
    message?: string;
  }>(`/clinic/delete-speciality/${id}`);
  return response.data;
};
