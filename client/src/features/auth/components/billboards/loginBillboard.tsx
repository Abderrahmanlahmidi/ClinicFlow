import {FiHeart} from "react-icons/fi";
import FeatureItem from "../featureItem";
import { features } from "../../constants/featureItemConstants";

const loginBillboard = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12 border-r border-gray-100">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto shadow-md">
            <FiHeart className="text-3xl text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Welcome Back to <span className="text-gray-500">ClinicFlow</span>
        </h1>
        <p className="text-sm text-gray-600 mb-10 max-w-md mx-auto">
          Manage your clinic operations, appointments, and patient data
          efficiently — all from one platform.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-700 text-sm">
          {features.map((item) => (
            <FeatureItem icon={item.icon} label={item.label} />
          ))}
        </div>

        {/* Trusted */}
        <div className="mt-10 text-xs text-gray-500">
          Trusted by{" "}
          <span className="font-medium text-gray-700">500+ Clinics</span> •
          <span className="font-medium text-gray-700"> 10,000+ Providers</span>
        </div>
      </div>
    </div>
  );
};

export default loginBillboard;
