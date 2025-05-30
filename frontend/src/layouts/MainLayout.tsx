import styles from './MainLayout.module.css';
import { Outlet } from 'react-router-dom';
import RightBar from '../components/rightBar/RightBar'; // 경로: src/components/rightBar/RightBar.tsx
import Header from '../components/common/Header'; // 경로: src/components/common/Header.tsx
import Footer from '../components/common/Footer'; // 경로: src/components/common/Footer.tsx

interface MainLayoutProps {
  showRightBar?: boolean;
}

export default function MainLayout({ showRightBar = true }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      <Header /> {/* Header 추가 */}
      <div className={styles.contentWrapper}> {/* 새로운 컨테이너 추가 */}
        <div className={styles.mainContentArea}>
          <Outlet />
        </div>
        {showRightBar && <RightBar className={styles.rightBar} />}
      </div>
      <Footer /> {/* Footer 추가 */}
    </div>
  );
}