import React from 'react';
import styles from './ChatMainContent.module.css'; // CSS Modules import

export default function ChatMainContent() {
  return (
    <div className={styles.container}> {/* CSS 클래스 적용 */}
      {/* 헤더 영역 (예: 대화 상대 이름, 검색 등) */}
      <div className={styles.header}> {/* CSS 클래스 적용 */}
        <h2 className={styles.chatTitle}> {/* CSS 클래스 적용 */}
          채팅 상대방 이름
        </h2>
        {/* 검색 아이콘 등 추가 */}
        <div>
          {/* 아이콘 자리 */}
        </div>
      </div>

      {/* 메시지 목록 영역 */}
      <div className={styles.messageList}> {/* CSS 클래스 적용 */}
        {/* 예시 메시지 아이템 (본인) */}
        <div className={`${styles.messageItem} ${styles.sent}`}> {/* CSS 클래스 적용 */}
          <p className={styles.messageText}>예시 보낸 메시지 내용</p> {/* CSS 클래스 적용 */}
        </div>
         {/* 예시 메시지 아이템 (상대방) */}
        <div className={`${styles.messageItem} ${styles.received}`}> {/* CSS 클래스 적용 */}
          <p className={styles.messageText}>예시 받은 메시지 내용</p> {/* CSS 클래스 적용 */}
        </div>
      </div>

      {/* 입력 필드 영역 */}
      <div className={styles.inputArea}> {/* CSS 클래스 적용 */}
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className={styles.messageInput} // CSS 클래스 적용
        />
        <button className={styles.sendButton}> {/* CSS 클래스 적용 */}
          전송
        </button>
      </div>
    </div>
  );
} 