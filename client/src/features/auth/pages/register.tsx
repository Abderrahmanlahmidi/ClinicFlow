import {FiUserPlus} from "react-icons/fi";
import RegisterBillboard from "../components/billboards/registerBillboard";
import RegisterForm from "../components/forms/registerForm";
import { Link } from "react-router-dom";

export default function Register() {

  return (
    <div className="min-h-screen flex">
      {/* Professional Billboard Side Section */}
      <RegisterBillboard/>
      {/* Registration Form Section */}
      <div className="w-full bg-gray-900 lg:w-1/2 flex items-center justify-center p-6">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <FiUserPlus className="text-3xl text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-light text-white mb-2">
              ClinicFlow
            </h1>
            <h2 className="text-lg font-medium text-gray-300 mb-1">
              Create Account
            </h2>
            <p className="text-sm text-gray-400">
              Join our healthcare network today
            </p>
          </div>

          {/* Form */}
          <RegisterForm/>
          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-lime-400 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}