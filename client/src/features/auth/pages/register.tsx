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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <FiUserPlus className="text-3xl text-gray-700 mx-auto mb-4" />
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              ClinicFlow
            </h1>
            <h2 className="text-lg font-medium text-gray-700 mb-1">
              Create Account
            </h2>
            <p className="text-sm text-gray-500">
              Join our healthcare network today
            </p>
          </div>

          {/* Form */}
          <RegisterForm/>
          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-gray-800 hover:text-gray-600 font-medium transition-colors duration-200"
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
