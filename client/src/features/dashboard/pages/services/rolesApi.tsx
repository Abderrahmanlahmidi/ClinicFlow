import { axiosInstance } from "../../../../services/axiosInstance";

// Types for roles API
export interface Role {
  id: string;
  name: string;
  // Add more fields as needed
}

export interface CreateRoleData {
  name: string;
  // Add more fields as needed
}

export interface UpdateRoleParams {
  id: string;
  data: Partial<CreateRoleData>;
}

export const getRoles = async (): Promise<Role[]> => {
  const res = await axiosInstance.get<Role[]>("/clinic/get-roles");
  return res.data;
};

export const createRole = async (data: CreateRoleData): Promise<Role> => {
  const res = await axiosInstance.post<Role>("/clinic/create-role", data);
  return res.data;
};

export const updateRole = async ({
  id,
  data,
}: UpdateRoleParams): Promise<Role> => {
  const res = await axiosInstance.patch<Role>(
    `/clinic/update-role/${id}`,
    data
  );
  return res.data;
};

export const deleteRole = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const res = await axiosInstance.delete<{
    success: boolean;
    message?: string;
  }>(`/clinic/delete-role/${id}`);
  return res.data;
};
