import Sidebar from "../pages/sections/sidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsOpenClose } from "../../../app/selectors/selectors";
const DashboardLayout = () => {
  
  const isOpen = useSelector(selectIsOpenClose);
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar/>

      <div
        className={`flex-1 bg-gray-900 p-6 transition-all duration-300 ${
          isOpen ? "ml-70" : "ml-20"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
