import React, { useState } from "react";
import ProfileUpdateForm from "../components/updatForm";
import PasswordChangeForm from "../components/passwordForm";
import { FiUser, FiCamera } from "react-icons/fi";
import { GetYear } from "../constants/getYear";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../apis/getUserInfo";
import LoadingPage from "../../../ui/loading/loadingPage";
import { useToast } from "../../../ui/toasts/toast";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../apis/getUserInfo";

export default function ProfilePage() {
  const { toast } = useToast();
  const userId = localStorage.getItem("userId");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: getUserInfo,
    enabled: !!userId,
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();

      if (selectedImage) {
        formData.append("imageProfile", selectedImage);
      }

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      return updateUserProfile({ userId, data: formData });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["user", userId]);
      toast.success("Profile updated successfully!");
    },

    onError: (err) => {
      console.error("Error updating profile:", err);

      toast.error(
        err?.response?.data?.message || "Error updating profile!"
      );
    },
  });

  const onSubmitImage = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <LoadingPage />;
  if (error) return toast.error("Something went wrong. Please try again.");

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-white mb-4">
            Profile Settings
          </h1>
          <p className="text-lg text-gray-300">
            Manage your account information and security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-700 p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mx-auto overflow-hidden border-4 border-gray-700 shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : userData.imageProfile ? (
                    <img
                      src={`http://localhost:8000${userData.imageProfile}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                {/* Image Upload Button */}
                <form
                  onSubmit={handleSubmit(onSubmitImage)}
                  className="absolute bottom-0 right-0"
                >
                  <label
                    htmlFor="profileImageUpload"
                    className="bg-lime-400 text-gray-900 p-2 rounded-full cursor-pointer shadow-lg flex items-center justify-center"
                  >
                    <FiCamera className="w-4 h-4" />
                  </label>
                  <input
                    id="profileImageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("profileImage", {
                      required: "Profile image is required",
                      onChange: handleImageChange,
                    })}
                  />
                </form>
              </div>

              <h2 className="text-xl font-normal text-white mb-2">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="text-gray-300 mb-2">{userData.email}</p>
              <p className="text-gray-400 text-sm">{`${userData.roleId.name}`}</p>

              {/* Submit button for image upload */}
              {selectedImage && (
                <form onSubmit={handleSubmit(onSubmitImage)} className="mt-4">
                  <button
                    type="submit"
                    className="bg-lime-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-normal font-medium"
                  >
                    Update Profile Image
                  </button>
                </form>
              )}
            </div>

            <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-700 p-6">
              <h3 className="text-lg font-normal text-white mb-4">
                Account Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Member since</span>
                  <span className="text-white font-medium">{`${GetYear(
                    userData.createdAt
                  )}`}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Appointments</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status</span>
                  <span className="text-lime-400 font-medium">
                    {userData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ProfileUpdateForm userData={userData} />
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </div>
  );
}