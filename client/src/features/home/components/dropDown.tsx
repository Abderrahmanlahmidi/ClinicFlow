import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLogOut,
  FiHome,
  FiChevronDown,
} from "react-icons/fi";
import LogoutConfirm from "./logoutConfirm";
import { axiosInstance } from "../../../api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../../profile/apis/getUserInfo";

export default function DropdownProfile({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const dropdownRef = useRef(null);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

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

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: getUserInfo,
    enabled: !!userId,
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpenPopUp && (
        <LogoutConfirm setIsOpenPopUp={setIsOpenPopUp} onConfirm={onConfirm} />
      )}

      {/* Profile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-200 p-2 rounded-lg"
      >
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border border-gray-600">
          {data?.imageProfile ? (
            <img 
              src={`http://localhost:8000${data.imageProfile}`} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FiUser className="w-4 h-4 text-gray-300" />
          )}
        </div>
        <FiChevronDown
          className={`w-4 h-4 text-gray-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
        absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 py-2 z-50
        transition-all duration-200 ease-out
        transform origin-top-right
        ${
          isOpen
            ? "opacity-100 max-h-96 translate-y-0 visible"
            : "opacity-0 max-h-0 -translate-y-2 invisible pointer-events-none"
        }
        overflow-hidden
      `}
      >
        {/* User Info */}
        <div
          className={`px-5 py-4 border-b border-gray-700 transition-opacity duration-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm font-semibold text-white">{`${data?.firstName} ${data?.lastName}`}</p>
          <p className="text-sm text-gray-300 truncate mt-1">{`${data?.email}`}</p>
        </div>

        {/* Menu Items */}
        <div
          className={`transition-all duration-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {role === "Admin" && (
            <Link
              to="/dashboard"
              onClick={handleItemClick}
              className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 border-b border-gray-800"
            >
              <FiHome className="w-4 h-4 text-gray-400" />
              Dashboard
            </Link>
          )}

          <Link
            to="/profile"
            onClick={handleItemClick}
            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-200 "
            >
            <FiUser className="w-4 h-4 text-gray-400" />
            My Profile
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-400 text-left border-t border-gray-800 mt-1"
          >
            <FiLogOut className="w-4 h-4 text-red-500" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}