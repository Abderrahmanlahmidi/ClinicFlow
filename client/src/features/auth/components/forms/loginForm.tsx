import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import Spinner from "../../../../ui/loading/loadingButton";
import { useNavigate } from "react-router-dom";
import FormAlert from "../../../../ui/alerts/formAlert";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../apis/authLogin";


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", data.user.id);

      reset();
      
      setAlert({
        show: true,
        message: data?.message || "Login successful!",
        type: 'success'
      });

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    },
    onError: (error) => {
      console.log(error);
      const errorMessage = error?.response?.data?.message || "Invalid credentials";
      
      setAlert({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Alert Component */}
      {alert.show && (
        <FormAlert
          type={alert.type}
          message={alert.message}
          onClose={handleCloseAlert}
        />
      )}

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
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
          />
        </div>
        <div className="min-h-[18px]">
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            {...register("password", { required: "Password is required" })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {/* Forgot Password */}
      <div className="text-right">
        <Link
          to={"/forgot-password"}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Spinner />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};

export default LoginForm;