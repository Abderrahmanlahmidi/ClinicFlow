import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
  FiChevronDown,
} from "react-icons/fi";
import LogoutConfirm from "./logoutConfirm";
import { axiosInstance } from "../../../api/axiosInstance";

export default function DropdownProfile({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    setIsOpenPopUp(true);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  const onConfirm = async () => {
    try {
      localStorage.removeItem("userId");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");

      await axiosInstance.post("/auth/logout");

      setIsOpenPopUp(false);

      if (typeof onLogout === "function") onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpenPopUp && (
        <LogoutConfirm setIsOpenPopUp={setIsOpenPopUp} onConfirm={onConfirm} />
      )}

      {/* Profile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-all duration-200 p-2 rounded-lg hover:bg-gray-50"
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <FiUser className="w-4 h-4" />
        </div>
        <FiChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu with Slide Animation */}
      <div
        className={`
        absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50
        transition-all duration-300 ease-in-out
        transform origin-top-right
        ${
          isOpen
            ? "opacity-100 max-h-96 translate-y-0 visible"
            : "opacity-0 max-h-0 -translate-y-4 invisible pointer-events-none"
        }
        overflow-hidden
      `}
      >
        {/* User Info */}
        <div
          className={`px-4 py-3 border-b border-gray-100 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm font-medium text-gray-900">John Doe</p>
          <p className="text-sm text-gray-600">john@example.com</p>
        </div>

        {/* Menu Items */}
        <div
          className={`transition-all duration-300 ${
            isOpen ? "opacity-100 delay-100" : "opacity-0"
          }`}
        >
          {}

          {role === "Admin" && (
            <Link
              to="/dashboard"
              onClick={handleItemClick}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
            >
              <FiHome className="w-4 h-4" />
              Dashboard
            </Link>
          )}

          <Link
            to="/profile"
            onClick={handleItemClick}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
          >
            <FiUser className="w-4 h-4" />
            My Profile
          </Link>

          <Link
            to="/settings"
            onClick={handleItemClick}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
          >
            <FiSettings className="w-4 h-4" />
            Settings
          </Link>

          {/* Divider */}
          <div className="my-1 border-t border-gray-100"></div>

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1 text-left"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
