// components/PageHeader.jsx
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonIcon?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  buttonText,
  onButtonClick,
  buttonIcon
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-light text-white mb-2 flex items-center gap-3">
            {icon}
            {title}
          </h1>
          <p className="text-gray-400">{subtitle}</p>
        </div>

        {buttonText && onButtonClick && (
          <button
            onClick={onButtonClick}
            className="px-4 py-2.5 bg-gray-900 border border-lime-400 text-lime-400 rounded-lg hover:bg-lime-400/10 transition-colors flex items-center gap-2"
          >
            {buttonIcon && <span>{buttonIcon}</span>}
            {buttonText}
          </button>
        )}
      </div>
    </motion.div>
  );
}