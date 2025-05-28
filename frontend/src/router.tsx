import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import MyPage from './pages/Mypage';
import Chatpage from './pages/Chat';


const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'mypage',
                element: <MyPage />,
            },
            {
                path: 'chat',
                element: <Chatpage />,
            }
        ]
    }
])

export default router;