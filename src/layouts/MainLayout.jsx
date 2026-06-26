import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-primary text-white shadow-sm"
      : "text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-xl border-r border-gray-100">
        <div className="px-6 py-3 border-b border-gray-500 ">
          <h1 className="text-xl font-bold text-black">Kiosk Yönetim Paneli</h1>
        </div>
        <nav className="mt-4">
          <Link
            to="/tanimli-kiosklar"
            className={`flex items-center px-6 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive(
              "/tanimli-kiosklar"
            )}`}
          >
            <span className="font-medium">Tanımlı Kiosklar</span>
          </Link>
          <Link
            to="/kiosk-parametreleri"
            className={`flex items-center px-6 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive(
              "/kiosk-parametreleri"
            )}`}
          >
            <span className="font-medium">Kiosk Parametreleri</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
