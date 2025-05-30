import styles from './HomeMainContent.module.css'; // CSS Modules 예정

export default function HomeMainContent() {
  return (
    <div className={styles.mainContent}>
      <div className={styles.logoSection}>
        {/* 로고 이미지 또는 SVG 자리 */}
        <div className={styles.logoImage}>
          {/* SK_logo 1 내의 SVG들 */}
        </div>
        <div className={styles.logoText}>G Navi</div>
      </div>
      <div className={styles.greetingText}>안녕하세요, 커리어 성장 여정을 함께할 지나비입니다.</div>
      <div className={styles.buttons}>
        <button className={styles.chatButton}>
          새로운 채팅 시작하기
          {/* 아이콘 자리 */}
        </button>
        <button className={styles.infoButton}>
          내 정보 수정하기
          {/* 아이콘 자리 */}
        </button>
      </div>
    </div>
  );
} 