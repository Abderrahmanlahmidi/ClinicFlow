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
      <div className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <FiLogIn className="text-3xl text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-light text-white mb-2">ClinicFlow</h1>
            <h2 className="text-lg font-medium text-gray-300 mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-400">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <LoginForm />
          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-lime-400 font-medium">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
