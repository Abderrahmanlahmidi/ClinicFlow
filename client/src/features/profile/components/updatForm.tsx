import React, {useEffect} from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiMail, FiPhone, FiSave, FiEdit } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../apis/getUserInfo";
import { useToast } from "../../../ui/toasts/toast";

const ProfileUpdateForm = ({ userData }) => {


  const userId = localStorage.getItem("userId");
  const queryClient = useQueryClient();
  const {toast} = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: userData,
  });

  useEffect(() => {
    reset(userData);
  }, [userData, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateUserProfile({ userId, data }),

    onSuccess: () => {
      queryClient.invalidateQueries(["user", userId]);

      toast.success("Profile updated successfully!")

    },
    onError: (err) => {
      console.error("Error updating profile:", err);
      toast.error("Error updating profile")
    },
  });

  const onSubmit = async (data) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    reset(userData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-normal text-gray-900">
          Personal Information
        </h3>
        <FiEdit className="w-5 h-5 text-gray-500" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your first name"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your last name"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              {...register("numberPhone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Phone number must contain only numbers",
                },
                minLength: {
                  value: 10,
                  message: "Phone number must be at least 10 digits",
                },
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your phone number"
            />
          </div>
          {errors.numberPhone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.numberPhone.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 font-normal"
          >
            <FiSave className="w-4 h-4" />
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-normal"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
