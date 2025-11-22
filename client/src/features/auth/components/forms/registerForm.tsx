import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../../authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
} from "react-icons/fi";
import Spinner from "../../../../ui/loading/loadingButton";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    console.log("Registration Data:", data);
    dispatch(registerUser(data)).then(() => {
      reset();
      navigate("/login");
    });
  };

  if (error) {
    console.log(error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div className="flex flex-col">
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            {...register("firstName", { required: "first name is required" })}
            type="text"
            placeholder="First Name"
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
        </div>
        <div className="min-h-[18px]">
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="relative">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            {...register("lastName", { required: "last name is required" })}
            type="text"
            placeholder="Last Name"
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
        </div>
        <div className="min-h-[18px]">
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            type="email"
            placeholder="Email Address"
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
        </div>
        <div className="min-h-[18px]">
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <FiEyeOff className="text-sm" />
            ) : (
              <FiEye className="text-sm" />
            )}
          </button>
        </div>
        <div className="min-h-[18px]">
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col">
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? (
              <FiEyeOff className="text-sm" />
            ) : (
              <FiEye className="text-sm" />
            )}
          </button>
        </div>
        <div className="min-h-[18px]">
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="flex flex-col">
        <div className="relative">
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            {...register("numberPhone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,}$/,
                message: "Invalid phone number",
              },
            })}
            type="tel"
            placeholder="Phone Number"
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-gray-800 text-white placeholder-gray-400 text-sm"
          />
        </div>
        <div className="min-h-[18px]">
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {successMessage && (
        <p className="text-green-400 text-sm font-medium text-center">
          {successMessage}
        </p>
      )}

      {/* Register Button */}
      <button
        type="submit"
        className="w-full bg-lime-400 text-gray-900 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Spinner />
            Creating Account...
          </>
        ) : (
          "Register"
        )}
      </button>
    </form>
  );
}
