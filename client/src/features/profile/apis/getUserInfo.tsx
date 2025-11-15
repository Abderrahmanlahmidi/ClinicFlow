import { axiosInstance } from '../../../api/axiosInstance';


export const getUserInfo = async ({ queryKey }) => {
  const userId = queryKey[1];
  const res = await axiosInstance.get(`/user/${userId}`);
  return res.data.user;
};

export const updateUserProfile = async ({ userId, data }) => {
  const res = await axiosInstance.patch(`/update-profile/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updatePassword = async ({data, userId}) => {
  const res = await axiosInstance.put(`/change-password/${userId}`, data);
  return res.data;
};