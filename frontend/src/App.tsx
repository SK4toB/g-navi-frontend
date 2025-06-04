// frontend/src/App.tsx (새로 생성하거나 내용 교체)
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

export default function App() {
  return (
    <React.StrictMode>
      <div className="w-full h-full flex flex-col">
        <RouterProvider router={router} />
      </div>
    </React.StrictMode>
  );
}