// frontend/src/components/common/Header.tsx
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Header() {
  return (
    <header className='cursor-pointer w-[100px] h-[100px] p-2 flex justify-center items-center'>
      <Link to="/">
        <img src={logo} alt="G-Navi Logo" />
      </Link>
    </header>
  );
}