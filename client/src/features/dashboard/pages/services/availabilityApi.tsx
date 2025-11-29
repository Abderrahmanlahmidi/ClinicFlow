import { axiosInstance } from "../../../../services/axiosInstance";

// Types for availability API
export interface Availability {
  id: string;
  userId: string;
  start: string;
  end: string;
  // Add more fields as needed
}

export interface CreateAvailabilityData {
  userId: string;
  start: string;
  end: string;
  // Add more fields as needed
}

export interface UpdateAvailabilityParams {
  id: string;
  data: Partial<CreateAvailabilityData>;
}

export const getAvailabilities = async (): Promise<Availability[]> => {
  const res = await axiosInstance.get<Availability[]>("/clinic/availabilities");
  return res.data;
};

export const getUserAvailabilities = async (
  userId: string
): Promise<Availability[]> => {
  const res = await axiosInstance.get<Availability[]>(
    `/clinic/availabilities/${userId}`
  );
  return res.data;
};

export const createAvailability = async (
  data: CreateAvailabilityData
): Promise<Availability> => {
  try {
    const res = await axiosInstance.post<Availability>(
      "/clinic/create-availability",
      data
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAvailability = async ({
  id,
  data,
}: UpdateAvailabilityParams): Promise<Availability> => {
  const res = await axiosInstance.put<Availability>(
    `/clinic/update-availability/${id}`,
    data
  );
  return res.data;
};

export const deleteAvailability = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const res = await axiosInstance.delete<{
    success: boolean;
    message?: string;
  }>(`/clinic/delete-availability/${id}`);
  return res.data;
};
