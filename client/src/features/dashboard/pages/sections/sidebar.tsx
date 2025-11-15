import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiBarChart2,
  FiChevronLeft,
  FiMenu,
  FiUsers
} from 'react-icons/fi';

const SidebarDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: FiBarChart2, label: 'Analytics', path: '/dashboard' },
    { icon: FiUsers, label: 'Users', path: '/dashboard/users' },
  ];

  const sidebarVariants = {
    open: {
      width: 280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: 80,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="open"
        animate={isOpen ? "open" : "closed"}
        className="fixed lg:relative h-screen bg-white shadow-sm z-50 flex flex-col border-r border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {isOpen ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg font-light text-gray-900">ClinicFlow</span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="w-full flex justify-center"></div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700"
          >
            {isOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isOpen ? "gap-3 justify-start" : "justify-center"}
                  ${isActive 
                    ? "bg-gray-100 text-gray-900 border border-gray-300" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
                `}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-700"
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
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 group
              ${isOpen ? "gap-3 justify-start" : "justify-center"}
            `}
          >
            <FiHome className="w-5 h-5 flex-shrink-0 text-gray-600 group-hover:text-gray-700" />

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
