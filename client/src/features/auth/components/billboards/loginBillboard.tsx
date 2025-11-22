import { FiHeart } from "react-icons/fi";
import FeatureItem from "../featureItem";
import { features } from "../../constants/featureItemConstants";

const loginBillboard = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gray-900 items-center justify-center p-12 border-r border-gray-700">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <FiHeart className="text-3xl text-lime-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-white mb-3">
          Welcome Back to <span className="text-gray-400">ClinicFlow</span>
        </h1>
        <p className="text-sm text-gray-300 mb-10 max-w-md mx-auto">
          Manage your clinic operations, appointments, and patient data
          efficiently — all from one platform.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-300 text-sm">
          {features.map((item) => (
            <FeatureItem icon={item.icon} label={item.label} />
          ))}
        </div>

        {/* Trusted */}
        <div className="mt-10 text-xs text-gray-400">
          Trusted by{" "}
          <span className="font-medium text-gray-300">500+ Clinics</span> •
          <span className="font-medium text-gray-300"> 10,000+ Providers</span>
        </div>
      </div>
    </div>
  );
};

export default loginBillboard;
