import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";

const SuperAdminLayout = () => {
  return (
    <div className="flex">
      <SuperAdminSidebar />
      <main className="flex-grow p-4">
      {}
        <Outlet /> 
      </main>
    </div>
  );
};

export default SuperAdminLayout;

