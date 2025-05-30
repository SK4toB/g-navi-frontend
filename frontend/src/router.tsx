import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import MyPage from './pages/Mypage';
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
        path: 'chat',
        element: <Chatpage />, 
    }
]);

export default router; 