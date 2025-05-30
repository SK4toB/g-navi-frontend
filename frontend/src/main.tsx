// frontend/src/main.tsx
import ReactDOM from 'react-dom/client';
import App from './App'; // App 컴포넌트를 임포트합니다.
import './index.css'; // 전역 스타일은 여기서 임포트하는 것이 적절합니다.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App /> // App 컴포넌트를 렌더링합니다.
);