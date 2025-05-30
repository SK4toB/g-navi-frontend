import { Link } from "react-router-dom";
import styles from './Header.module.css'; // CSS Modules import

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>G-Navi</h1>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/login" className={styles.navLink}>Login</Link>
        <Link to="/mypage" className={styles.navLink}>My Page</Link>
      </nav>
    </header>
  );
}