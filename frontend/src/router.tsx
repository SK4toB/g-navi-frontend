import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import MyPage from './pages/Mypage';
import ChatPage from './pages/ChatPage';


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
                path: 'chat/:chatId?',
                element: <ChatPage />,
            }
        ]
    }
]);

export default router; 