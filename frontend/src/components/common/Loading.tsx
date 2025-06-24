// frontend/src/components/common/Loading.tsx
import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function Loading({ 
  message = "데이터를 불러오는 중...", 
  size = 'md',
  fullScreen = true 
}: LoadingProps) {
  
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-3'
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div 
          className={`animate-spin rounded-full ${sizeClasses[size]} border-gray-200 border-t-blue-500 mx-auto`}
        ></div>
        {message && (
          <p className="mt-4 text-gray-600 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}