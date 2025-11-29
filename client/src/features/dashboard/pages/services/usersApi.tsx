import { axiosInstance } from "../../../../services/axiosInstance";

// Types for user API
export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  specialityId?: string;
  // Add more fields as needed
}

export interface UpdateUserRoleParams {
  id: string;
  roleId: string;
}

export interface UpdateUserSpecialityParams {
  userId: string;
  specialityId: string;
}

export const getUsers = async (): Promise<User[]> => {
  const res = await axiosInstance.get<User[]>("/users");
  return res.data;
};

export const updateUserRole = async ({
  id,
  roleId,
}: UpdateUserRoleParams): Promise<User> => {
  const res = await axiosInstance.put<User>(`/change-user-role/${id}`, {
    roleId,
  });
  return res.data;
};

export const updateUserSpeciality = async ({
  userId,
  specialityId,
}: UpdateUserSpecialityParams): Promise<User> => {
  const res = await axiosInstance.patch<User>(
    `/update-speciality-doctor/${userId}`,
    { specialityId }
  );
  return res.data;
};
