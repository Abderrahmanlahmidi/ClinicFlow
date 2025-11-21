import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        className="flex flex-col items-center justify-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        <motion.div
          className="text-gray-300 text-4xl"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FiLoader />
        </motion.div>
      </motion.div>
    </div>
  );
}