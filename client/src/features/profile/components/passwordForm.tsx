import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { updatePassword } from "../apis/getUserInfo";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "../../../ui/toasts/toast";

const PasswordChangeForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const userId = localStorage.getItem("userId");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const newPassword = watch("newPassword");

  const passwordMutation = useMutation({
    mutationFn: (data) => updatePassword({ userId, data }),

    onSuccess: () => {
      queryClient.invalidateQueries(["user", userId]);

      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      console.error("Error updating profile:", err);
      toast.error("Error updating profile");
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    passwordMutation.mutate(data);
  };

  const handleClear = () => {
    reset();
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-normal text-white">Change Password</h3>
        <FiShield className="w-5 h-5 text-gray-400" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                {...register("oldPassword", {
                  required: "Current password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showCurrentPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? (
                <FiEyeOff className="w-4 h-4" />
              ) : (
                <FiEye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30">
          <h4 className="text-sm font-medium text-blue-300 mb-2">
            Password Requirements
          </h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• At least 6 characters long</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Include numbers and special characters</li>
            <li>• Not similar to your personal information</li>
          </ul>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-lime-400 text-gray-900 px-8 py-3 rounded-lg flex items-center gap-2 font-normal font-medium"
          >
            <FiLock className="w-4 h-4" />
            Update Password
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-normal"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;