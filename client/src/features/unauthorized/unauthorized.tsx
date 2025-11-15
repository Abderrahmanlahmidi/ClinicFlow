import { FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <div className="flex flex-col items-center">
        <div className="bg-gray-100 p-6 rounded-full mb-6 shadow-sm">
          <FiLock className="text-5xl text-gray-700" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 max-w-md mb-8">
          You don’t have permission to view this page.  
          Please check your account permissions or go back to the homepage.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
          >
            Go Home
          </Link>
        
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

