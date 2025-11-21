import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function LogoutConfirm({setIsOpenPopUp, onConfirm }) {
  return (
    <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-sm relative border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setIsOpenPopUp(false)}
              className="absolute top-3 right-3 text-gray-400"
            >
              <FiX size={18} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <FiAlertTriangle className="text-red-400 text-4xl" />
              <h2 className="text-lg font-semibold text-white">
                Are you sure you want to log out?
              </h2>
              <p className="text-sm text-gray-300">
                You'll need to log in again to access your account.
              </p>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={onConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setIsOpenPopUp(false)}
                  className="border border-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  );
}