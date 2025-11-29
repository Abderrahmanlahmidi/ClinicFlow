// components/others/ProfessionalMapModal.tsx
import React, { useState, useEffect } from "react";
import { FiX, FiMapPin, FiNavigation, FiCopy, FiCheck, FiZoomIn, FiZoomOut, FiCompass } from "react-icons/fi";

interface ProfessionalMapModalProps {
  latitude: number;
  longitude: number;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  showCoordinates?: boolean;
  showActions?: boolean;
}

const ProfessionalMapModal: React.FC<ProfessionalMapModalProps> = ({ 
  latitude, 
  longitude, 
  onClose,
  title = "Location Map",
  subtitle,
  showCoordinates = true,
  showActions = true
}) => {
  const [zoom, setZoom] = useState<number>(15);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}`;
  const embedUrl = `https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${latitude},${longitude}&zoom=${zoom}&maptype=${mapType}`;

  // Fallback URL without API key
  const fallbackUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed&t=${mapType}`;

  const copyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(coordinates);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy coordinates:', err);
    }
  };

  const openInGoogleMaps = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 20));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1));
  const toggleMapType = () => setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [zoom, mapType]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <FiMapPin className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Map Controls */}
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
                title="Zoom Out"
              >
                <FiZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-300 px-2 min-w-[2rem] text-center border-x border-gray-700">
                {zoom}x
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 20}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
                title="Zoom In"
              >
                <FiZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={toggleMapType}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors bg-gray-800 border border-gray-700 rounded-lg"
              title={`Switch to ${mapType === 'roadmap' ? 'Satellite' : 'Map'} view`}
            >
              <FiCompass className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors bg-gray-800 border border-gray-700 rounded-lg"
              title="Close map"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex flex-col lg:flex-row h-[calc(95vh-120px)]">
          {/* Main Map */}
          <div className="flex-1 relative bg-gray-900">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading map...</p>
                </div>
              </div>
            )}
            
            <iframe
              src={fallbackUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Professional Location Map"
              className="transition-opacity duration-300"
              onLoad={() => setIsLoading(false)}
            />
            
            {/* Map Overlay Controls */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                <p className="text-white text-sm font-medium mb-2">Map Type</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setMapType('roadmap')}
                    className={`px-3 py-2 text-xs rounded transition-colors border ${
                      mapType === 'roadmap' 
                        ? 'bg-gray-800 text-white border-gray-600' 
                        : 'bg-gray-900 text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                  >
                    Map
                  </button>
                  <button
                    onClick={() => setMapType('satellite')}
                    className={`px-3 py-2 text-xs rounded transition-colors border ${
                      mapType === 'satellite' 
                        ? 'bg-gray-800 text-white border-gray-600' 
                        : 'bg-gray-900 text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                  >
                    Satellite
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          {showCoordinates || showActions ? (
            <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-700 bg-gray-900">
              <div className="p-6 space-y-6 h-full flex flex-col">
                
                {/* Coordinates Section */}
                {showCoordinates && (
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      Coordinates
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-gray-900 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">Latitude</span>
                        <span className="text-white font-mono text-sm">{latitude.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-900 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">Longitude</span>
                        <span className="text-white font-mono text-sm">{longitude.toFixed(6)}</span>
                      </div>
                      <button
                        onClick={copyCoordinates}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 rounded border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors text-sm"
                      >
                        {copied ? (
                          <>
                            <FiCheck className="w-4 h-4 text-gray-300" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FiCopy className="w-4 h-4" />
                            Copy Coordinates
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Section */}
                {showActions && (
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-3">Actions</h3>
                    <div className="space-y-2">
                      <button
                        onClick={openInGoogleMaps}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 hover:bg-gray-600 transition-colors font-medium"
                      >
                        <FiNavigation className="w-4 h-4" />
                        Open in Google Maps
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full px-4 py-3 text-gray-300 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Close Map
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-auto pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleZoomIn}
                      disabled={zoom >= 20}
                      className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center"
                      title="Zoom In"
                    >
                      <FiZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      disabled={zoom <= 1}
                      className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center"
                      title="Zoom Out"
                    >
                      <FiZoomOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMapModal;