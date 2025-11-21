import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

const Spinner = () => (
  <motion.div
    className="flex items-center justify-center w-4 h-4"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <FiLoader className="w-full h-full text-lime-400" />
  </motion.div>
);

export default Spinner;