import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">G-Navi</h1>
      <nav className="space-x-4">
        <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>
        <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
        <Link to="/mypage" className="text-gray-600 hover:text-blue-500">My Page</Link>
      </nav>
    </header>
  );
}
