import styles from './RightBar.module.css'; // CSS Modules 예정

interface RightBarProps {
  className?: string; // className prop 추가
}

export default function RightBar({ className }: RightBarProps) {
  return (
    <div className={`${styles.rightBar} ${className || ''}`}> {/* className prop 적용 */}
      {/* 본인 정보 섹션 */}
      <div className={styles.userInfo}>
        <div className={styles.userHeader}>
          <div className={styles.backButton}></div> {/* 뒤로가기 아이콘 자리 */}
          <div className={styles.avatarLabel}>
            <div className={styles.avatar}></div> {/* 아바타 이미지 자리 */}
            <div className={styles.userName}>하니</div>
          </div>
        </div>
        <div className={styles.userDetails}>
          <div className={styles.detailItem}>
            {/* 아이콘 자리 */}
            <div className={styles.detailText}>Team Acquistion</div>
          </div>
          <div className={styles.detailItem}>
            {/* 아이콘 자리 */}
            <div className={styles.detailText}>Career Level 3</div>
          </div>
        </div>
      </div>

      {/* 기술 스택 섹션 */}
      <div className={styles.techStack}>
        <div className={styles.sectionTitle}>
          <div className={styles.titleText}>기술스택</div>
          <div className={styles.dropdownIcon}></div> {/* 드롭다운 아이콘 자리 */}
        </div>
        <div className={styles.techItems}>
          <div className={`${styles.techButton} ${styles.techButtonSpring}`}>Spring</div>
          <div className={`${styles.techButton} ${styles.techButtonDocker}`}>Docker</div>
          <div className={`${styles.techButton} ${styles.techButtonK8S}`}>K8S</div>
        </div>
      </div>

      {/* 참여 프로젝트 섹션 */}
      <div className={styles.projects}>
          <div className={styles.sectionTitle}>
              <div className={styles.titleText}>참여 프로젝트</div>
              <div className={styles.dropdownIcon}></div> {/* 드롭다운 아이콘 자리 */}
          </div>
          <div className={styles.projectItems}>
              <div className={styles.projectItem}>
                  <div className={styles.projectName}>우리은행 차세대 프로젝트</div>
              </div>
          </div>
      </div>

      {/* 최근 대화 섹션 */}
      <div className={styles.recentChats}>
          <div className={styles.sectionTitle}>
              <div className={styles.titleText}>최근 대화</div>
              <div className={styles.dropdownIcon}></div> {/* 드롭다운 아이콘 자리 */}
          </div>
          <div className={styles.chatItems}>
              <div className={styles.chatItem}>
                  <div className={styles.chatName}>커리어에 대한 고민</div>
              </div>
               <div className={styles.chatItem}>
                  <div className={styles.chatName}>어떤 스킬을 쌓으면 좋을지?</div>
              </div>
               <div className={styles.chatItem}>
                  <div className={styles.chatName}>롤모델 커리어 확인하기</div>
              </div>
          </div>
      </div>
    </div>
  );
} 