import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogIn } from "react-icons/fi";
import DropdownProfile from "../components/dropDown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const checkUserAuth = localStorage.getItem("userId");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("userId")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("userId"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  console.log(checkUserAuth);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/appointments", label: "Appointments" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-light text-gray-900 hover:text-gray-700 transition-colors duration-200"
          >
            ClinicFlow
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-normal transition-colors duration-200 ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-normal"
                >
                  <FiLogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-normal"
                >
                  Create Account
                </Link>
              </div>
            ) : (
              <>
                <DropdownProfile onLogout={() => setIsAuthenticated(false)} />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <>
                <DropdownProfile onLogout={() => setIsAuthenticated(false)} />
              </>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className=" p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation with Better Animation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <div className="flex flex-col space-y-4 border-t border-gray-100 pt-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-normal transition-colors duration-200 p-2 rounded-lg ${
                    isActive
                      ? "text-gray-900 bg-gray-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 py-2 transition-colors duration-200 text-base font-normal"
                >
                  <FiLogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-900 text-white text-center py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-base font-normal"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
