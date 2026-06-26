import React from "react";

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/80  z-50 flex items-center justify-center">
      <div className="rounded-lg p-8 flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white font-medium">Yükleniyor...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
