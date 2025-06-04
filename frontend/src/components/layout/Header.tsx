// frontend/src/components/common/Header.tsx
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Header() {
  return (
    <header className='cursor-pointer'>
      <Link to="/">
        <img src={logo} alt="G-Navi Logo" className='w-[100px] h-[100px]' />
      </Link>
    </header>
  );
}