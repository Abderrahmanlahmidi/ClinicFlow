import { useEffect, useState} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogIn, FiCalendar, FiHome, FiInfo, FiSettings } from "react-icons/fi";
import DropdownProfile from "../components/dropDown";
import { toggle, setOpen } from "../../../app/slices/isOpenCloseSlice";
import { selectIsOpenClose } from "../../../app/selectors/selectors";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const isOpen = useSelector(selectIsOpenClose);
  const dispatch = useDispatch();
  
  const location = useLocation();
  const navigate = useNavigate();
  const checkUserAuth = localStorage.getItem("userId");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("userId"),
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("userId"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  console.log(checkUserAuth);

  const navItems = [
    { href: "#home", label: "Home", icon: FiHome },
    { href: "#about", label: "About", icon: FiInfo },
    { href: "#services", label: "Services", icon: FiSettings },
  ];

  const handleAnchorClick = (href) => {
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    dispatch(setOpen(false));
  };

  const handleAppointmentsClick = () => {
    if (isAuthenticated) {
      navigate("/appointments");
    } else {
      navigate("/login");
    }
    dispatch(setOpen(false));
  };

  const handleNavigation = (path) => {
    navigate(path);
    dispatch(setOpen(false));
  };

  const handleToggle = () => {
    dispatch(toggle());
  };

  const isSectionActive = (href) => {
    if (location.pathname !== '/') return false;
    
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return rect.top <= 100 && rect.bottom >= 100;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-light text-white hover:text-gray-300 transition-colors duration-200"
          >
            ClinicFlow
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = isSectionActive(item.href);
              const IconComponent = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchorClick(item.href);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-normal cursor-pointer ${
                    isActive
                      ? "text-white bg-gray-800"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </a>
              );
            })}

            <button
              onClick={handleAppointmentsClick}
              className="flex items-center gap-2 bg-lime-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-lime-300 transition-colors duration-200 text-sm font-medium"
            >
              <FiCalendar className="w-4 h-4" />
              Book Appointment
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm font-normal"
                >
                  <FiLogIn className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="bg-lime-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-lime-300 transition-colors duration-200 text-sm font-normal font-medium"
                >
                  Create Account
                </button>
              </div>
            ) : (
              <>
                <DropdownProfile onLogout={() => setIsAuthenticated(false)} />
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <>
                <DropdownProfile onLogout={() => setIsAuthenticated(false)} />
              </>
            )}

            <button
              onClick={handleToggle}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <div className="flex flex-col space-y-3 border-t border-gray-700 pt-4">
            {navItems.map((item) => {
              const isActive = isSectionActive(item.href);
              const IconComponent = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnchorClick(item.href);
                  }}
                  className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors duration-200 text-base font-normal cursor-pointer ${
                    isActive
                      ? "text-white bg-gray-800"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </a>
              );
            })}

            <button
              onClick={handleAppointmentsClick}
              className="flex items-center gap-3 bg-lime-400 text-gray-900 p-3 rounded-lg hover:bg-lime-300 transition-colors duration-200 text-base font-medium"
            >
              <FiCalendar className="w-5 h-5" />
              Book Appointment
            </button>

            {!isAuthenticated && (
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="flex items-center gap-3 text-gray-300 hover:text-white p-3 transition-colors duration-200 text-base font-normal rounded-lg hover:bg-gray-800"
                >
                  <FiLogIn className="w-5 h-5" />
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="bg-lime-400 text-gray-900 text-center p-3 rounded-lg hover:bg-lime-300 transition-colors duration-200 text-base font-medium"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}