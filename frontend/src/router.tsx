import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import MyPage from './pages/Mypage';
import NewChat from './pages/NewChat';
import Chatpage from './pages/Chat';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: 'signup',
        element: <Signup />,
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
        path: 'newchat',
        element: <NewChat />,
    },
    {
        path: 'chat/:chatId',
        element: <Chatpage />,
    }
]);

export default router; 