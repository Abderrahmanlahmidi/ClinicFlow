import { axiosInstance } from "../../../../services/axiosInstance";


export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;

}

export interface CreatePharmacyData {
  name: string;
  address: string;
  phone?: string;

}

export interface UpdatePharmacyParams {
  id: string;
  data: Partial<CreatePharmacyData>;
}

export const getPharmacies = async (): Promise<Pharmacy[]> => {
  const response = await axiosInstance.get<Pharmacy[]>("/clinic/pharmacies");
  return response.data;
};

export const createPharmacy = async (
  pharmacyData: CreatePharmacyData
): Promise<Pharmacy> => {
  const response = await axiosInstance.post<Pharmacy>(
    "/clinic/create-pharmacy",
    pharmacyData
  );
  return response.data;
};

export const updatePharmacy = async ({
  id,
  data,
}: UpdatePharmacyParams): Promise<Pharmacy> => {
  const response = await axiosInstance.patch<Pharmacy>(
    `/clinic/update-pharmacy/${id}`,
    data
  );
  return response.data;
};

export const deletePharmacy = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await axiosInstance.delete<{
    success: boolean;
    message?: string;
  }>(`/clinic/delete-pharmacy/${id}`);
  return response.data;
};
