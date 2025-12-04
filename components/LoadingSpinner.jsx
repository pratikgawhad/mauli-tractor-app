import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        <p className="mt-4 text-green-800 text-lg font-semibold">लोड होत आहे...</p>
        <p className="text-gray-600 text-sm mt-2">माऊली ट्रॅक्टर ॲप</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;