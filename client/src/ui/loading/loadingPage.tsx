import { FiLoader } from "react-icons/fi";

export default function LoadingPage() {
  return (
   <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="w-8 h-8 text-lime-400 animate-spin" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
  );
}
