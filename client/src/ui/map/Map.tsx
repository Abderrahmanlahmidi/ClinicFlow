import React from "react";
import { FiX } from "react-icons/fi";

interface SimpleMapModalProps {
  latitude: number;
  longitude: number;
  onClose: () => void;
}

const SimpleMapModal: React.FC<SimpleMapModalProps> = ({ 
  latitude, 
  longitude, 
  onClose 
}) => {
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-white font-medium">
            Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="h-96">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Location Map"
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleMapModal;