// frontend/src/App.tsx (새로 생성하거나 내용 교체)
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // 라우터 정의 임포트

// 이 App 컴포넌트가 이제 애플리케이션의 메인 뼈대 역할을 합니다.
export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}