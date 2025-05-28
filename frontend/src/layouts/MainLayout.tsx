import styles from './MainLayout.module.css'; // CSS Modules 예정
import { Outlet } from 'react-router-dom'; // Outlet import 추가
import RightBar from '../components/RightBar'; // RightBar 컴포넌트 import (경로는 프로젝트 구조에 맞게 조정 필요)

interface MainLayoutProps {
  showRightBar?: boolean; // RightBar 표시 여부를 결정하는 prop
}

export default function MainLayout({ showRightBar = true }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.mainContentArea}>
        <Outlet /> {/* children 대신 Outlet 사용 */}
      </div>
      {showRightBar && <RightBar className={styles.rightBar} />} {/* showRightBar가 true일 때만 RightBar 렌더링 및 클래스 적용 */}
    </div>
  );
}