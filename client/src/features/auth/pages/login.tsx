import { FiLogIn } from "react-icons/fi";
import LoginForm from "../components/forms/loginForm";
import LogginBillboard from "../components/billboards/loginBillboard.js";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex">
      {/* Billboard / Left Section */}
      <LogginBillboard />
      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <FiLogIn className="text-3xl text-gray-700 mx-auto mb-4" />
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              ClinicFlow
            </h1>
            <h2 className="text-lg font-medium text-gray-700 mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <LoginForm />
          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-gray-800 hover:text-gray-600 font-medium transition-colors duration-200"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
