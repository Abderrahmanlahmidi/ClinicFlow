import { useState } from "react";
import Sidebar from "../pages/sections/sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`flex-1 bg-gray-900 p-6 transition-all duration-300 ${
          isOpen ? "ml-70" : "ml-20"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
