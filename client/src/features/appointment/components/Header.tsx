import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isDoctor: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDoctor }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <h1 className="text-2xl md:text-3xl font-light text-white mb-2">
        Create Appointment
      </h1>
      <p className="text-gray-400">
        {isDoctor 
          ? "Schedule an appointment with a patient" 
          : "Book an appointment with a doctor"
        }
      </p>
    </div>
  );
};

export default Header;