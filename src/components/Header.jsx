import React, { useState } from "react";
import { useEffect } from "react";

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("tr-TR", options);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-gray-700 font-medium">Admin Kullanıcı</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 font-medium">
            {formatDateTime(currentDateTime)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
