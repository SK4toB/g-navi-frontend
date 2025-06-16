import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import MyPage from './pages/Mypage';
import ConversationPage from './pages/ConversationPage';
import AdminPage from './pages/AdminPage';
import ExpertPage from './pages/ExpertPage';


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
                element: <MyPage />,
            },
            {
                path: 'conversation/:conversationId?',
                element: <ConversationPage />,
            },
            {
                path: 'admin',
                element: <AdminPage/>,
            },
            {
                path: 'expert',
                element: <ExpertPage/>,
            }
        ]
    }
]);

export default router; 