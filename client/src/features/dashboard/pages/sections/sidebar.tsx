import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiBarChart2,
  FiChevronLeft,
  FiMenu,
  FiUsers,
  FiShield,
  FiClock,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import { selectIsOpenClose } from "../../../../app/selectors/selectors";
import { toggle } from "../../../../app/slices/isOpenCloseSlice";
import { useDispatch, useSelector } from "react-redux";

// Types
interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

interface SidebarVariants {
  open: {
    width: number;
    transition: {
      type: string;
      stiffness: number;
      damping: number;
    };
  };
  closed: {
    width: number;
    transition: {
      type: string;
      stiffness: number;
      damping: number;
    };
  };
}

interface ItemVariants {
  open: {
    opacity: number;
    x: number;
    transition: {
      type: string;
      stiffness: number;
      damping: number;
    };
  };
  closed: {
    opacity: number;
    x: number;
    transition: {
      type: string;
      stiffness: number;
      damping: number;
    };
  };
}

const SidebarDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsOpenClose);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { icon: FiBarChart2, label: "Analytics", path: "/dashboard" },
    { icon: FiUsers, label: "Users", path: "/dashboard/users" },
    { icon: FiShield, label: "Roles", path: "/dashboard/roles" },
    { icon: FiClock, label: "Availability", path: "/dashboard/availability" },
    { icon: FiBriefcase, label: "Speciality", path: "/dashboard/speciality" },
    { icon: FiCalendar, label: "Appointment", path: "/dashboard/appointment" },
  ];

  const sidebarVariants: SidebarVariants = {
    open: {
      width: 280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      width: 80,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants: ItemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const handleToggle = (): void => {
    dispatch(toggle());
  };

  const handleOverlayClick = (): void => {
    dispatch(toggle());
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="open"
        animate={isOpen ? "open" : "closed"}
        className="fixed top-0 left-0 h-screen bg-gray-900 shadow-xl z-50 flex flex-col border-r border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          {isOpen ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg font-light text-white">
                  ClinicFlow
                </span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-full flex justify-center"></div>
          )}

          <button
            onClick={handleToggle}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {isOpen ? (
              <FiChevronLeft className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation (scrollable) */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg group transition-colors
                  ${isOpen ? "gap-3 justify-start" : "justify-center"}
                  ${
                    isActive
                      ? "bg-gray-800 text-white border border-gray-600"
                      : "text-gray-300 hover:bg-gray-800"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive
                      ? "text-lime-400"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />

                {isOpen && (
                  <AnimatePresence>
                    <motion.span
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="font-normal text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  </AnimatePresence>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 group transition-colors
              ${isOpen ? "gap-3 justify-start" : "justify-center"}
            `}
          >
            <FiHome className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-300" />

            {isOpen && (
              <AnimatePresence>
                <motion.span
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="font-normal text-sm whitespace-nowrap"
                >
                  Back to Home
                </motion.span>
              </AnimatePresence>
            )}
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarDashboard;