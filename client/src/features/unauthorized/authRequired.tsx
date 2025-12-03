import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLogIn, FiUserPlus, FiLock } from "react-icons/fi";

interface AuthRequiredPageProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showLoginButton?: boolean;
  showRegisterButton?: boolean;
}

const AuthRequiredPage: React.FC<AuthRequiredPageProps> = ({
  title = "Authentication Required",
  message = "You need to authenticate to access this page.",
  showBackButton = true,
  showLoginButton = true,
  showRegisterButton = true
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-gray-800 rounded-full border border-gray-700">
            <FiLock className="w-16 h-16 text-lime-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-light text-white text-center mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-gray-400 text-center mb-8">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700 hover:text-white transition-all duration-200 group"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Go Back</span>
            </button>
          )}

          {showLoginButton && (
            <button
              onClick={handleGoToLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-lime-400 text-gray-900 rounded-lg hover:bg-lime-300 transition-all duration-200 group"
            >
              <FiLogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">Login to Continue</span>
            </button>
          )}

          {showRegisterButton && (
            <button
              onClick={handleGoToRegister}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 transition-all duration-200 group"
            >
              <FiUserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Create Account</span>
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-500 text-center">
            Need help?{" "}
            <a 
              href="/contact" 
              className="text-lime-400 hover:text-lime-300 transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredPage;