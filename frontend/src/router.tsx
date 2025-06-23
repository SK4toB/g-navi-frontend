import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import MyPage from './pages/Mypage';
import ConversationPage from './pages/ConversationPage';
import AdminPage from './pages/AdminPage';
import ExpertPage from './pages/ExpertPage';
import useAuthStore from './store/authStore';
import DashBoardPage from './pages/DashBoardPage';

// ADMIN 전용 라우트 보호 컴포넌트
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/join" replace />;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// EXPERT + ADMIN 접근 가능한 라우트 (USER 접근 차단)
function ExpertRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/join" replace />;
  }
  
  if (user?.role === 'USER') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// USER + EXPERT 접근 가능한 라우트 (ADMIN 접근 차단)
function UserExpertRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/join" replace />;
  }
  
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
}

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: 'join',
                element: <JoinPage />,
            },
            {
                path: 'mypage',
                element: (
                    <UserExpertRoute>
                        <MyPage />
                    </UserExpertRoute>
                ),
            },
            {
                path: 'conversation/:conversationId?',
                element: (
                    <UserExpertRoute>
                        <ConversationPage />
                    </UserExpertRoute>
                ),
            },
            {
                path: 'admin',
                element: (
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                ),
            },
            {
                path: 'expert',
                element: (
                    <ExpertRoute>
                        <ExpertPage />
                    </ExpertRoute>
                ),
            },
            {
              path: 'dashboard',
              element: (
                  <AdminRoute>
                      <DashBoardPage />
                  </AdminRoute>
              ),
          },
        ]
    }
]);

export default router;