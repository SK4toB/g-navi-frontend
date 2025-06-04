// frontend/src/store/chatStore.ts
import { create } from 'zustand';

// 지난 대화 목록의 각 항목에 대한 타입 정의
interface PastChatSummary {
  id: string;    // 채팅방 고유 ID
  title: string; // 채팅방 제목
}

// 채팅 메시지 타입 정의
export type ChatMessage = {
  id: number;                          // 메시지 고유 ID
  sender: 'user' | 'bot';              // 메시지 발신자 (사용자 또는 챗봇)
  text: string;                        // 메시지 내용 (JSX 대신 문자열 사용 권장)
  timestamp: number;                   // 메시지 전송 시각 (UNIX 타임스탬프)
};

// 스토어 상태 인터페이스 정의
interface ChatStoreState {
  pastChatSummaries: PastChatSummary[];   // 사용자의 지난 대화 목록 요약
  currentChatId: string | null;            // 현재 활성화된 채팅방의 고유 ID
  currentChatMessages: ChatMessage[];      // 현재 채팅 세션의 메시지 목록
  messageIdCounter: number;                // 현재 채팅 세션 내에서 메시지 ID를 생성하기 위한 카운터

  // 액션 정의
  /**
   * 지난 대화 목록에 새로운 채팅 요약을 추가합니다.
   * @param chatSummary 추가할 채팅 요약 객체
   */
  addPastChatSummary: (chatSummary: PastChatSummary) => void;

  /**
   * 지난 대화 목록을 새로 설정합니다. (예: 서버에서 목록을 불러올 때 사용)
   * @param chatSummaries 설정할 채팅 요약 배열
   */
  setPastChatSummaries: (chatSummaries: PastChatSummary[]) => void;

  /**
   * 현재 채팅 세션에 새로운 메시지를 추가합니다.
   * @param message 추가할 채팅 메시지 객체
   */
  addMessage: (message: ChatMessage) => void;

  /**
   * 현재 채팅방을 설정하고 초기 메시지 목록을 로드합니다.
   * 새 채팅을 시작하거나 기존 채팅을 선택할 때 사용합니다.
   * @param chatId 설정할 채팅방 ID (새 채팅일 경우 null이거나 새로 생성될 수 있음)
   * @param initialMessages 해당 채팅방에 초기화할 메시지 목록 (선택 사항)
   */
  setCurrentChat: (chatId: string | null, initialMessages?: ChatMessage[]) => void;

  /**
   * 특정 채팅방의 메시지들을 비동기적으로 로드합니다.
   * @param chatId 로드할 채팅방의 ID
   */
  loadChatMessages: (chatId: string) => void;

  /**
   * 새로운 채팅 세션을 시작합니다.
   * 새로운 채팅방 ID를 생성하고 초기 환영 메시지를 설정합니다.
   */
  startNewChat: () => void;
}

// Zustand 스토어 생성
const useChatStore = create<ChatStoreState>((set, get) => ({
  // 초기 상태 정의
  pastChatSummaries: [], // 지난 대화 목록 초기값: 빈 배열
  currentChatId: null,   // 현재 채팅방 ID 초기값: 없음
  currentChatMessages: [], // 현재 채팅 메시지 목록 초기값: 빈 배열
  messageIdCounter: 0,   // 메시지 ID 카운터 초기값

  // 액션 구현: 지난 대화 목록에 추가
  addPastChatSummary: (chatSummary) => set((state) => ({
    pastChatSummaries: [...state.pastChatSummaries, chatSummary]
  })),

  // 액션 구현: 지난 대화 목록 설정
  setPastChatSummaries: (chatSummaries) => set({
    pastChatSummaries: chatSummaries
  }),

  // 액션 구현: 현재 채팅 세션에 메시지 추가
  addMessage: (message) => set((state) => ({
    currentChatMessages: [...state.currentChatMessages, message],
    messageIdCounter: state.messageIdCounter + 1, // 메시지 추가 시 카운터 증가
  })),

  // 액션 구현: 현재 채팅방 설정
  setCurrentChat: (chatId, initialMessages = []) => set({
    currentChatId: chatId,
    currentChatMessages: initialMessages,
    // 기존 메시지가 있다면 가장 큰 ID로 카운터 초기화, Math.max(0, ...)로 안전하게 처리
    messageIdCounter: initialMessages.length > 0 ? Math.max(0, ...initialMessages.map(msg => msg.id)) : 0,
  }),

  // 액션 구현: 특정 채팅방 메시지 로드 (비동기)
  loadChatMessages: async (chatId) => {
    // TODO: 실제 백엔드 API 호출하여 chatId에 해당하는 메시지들을 가져오는 로직 구현 필요
    console.log(`Loading messages for chat ID: ${chatId}`);
    // 임시 더미 데이터 (백엔드 연결 시 실제 데이터로 교체)
    const dummyMessages: ChatMessage[] = [
      { id: 1, sender: 'bot', text: `기존 채팅방 "${chatId}"에 오신 것을 환영합니다!`, timestamp: Date.now() - 10000 },
      { id: 2, sender: 'user', text: "이전에 무슨 이야기를 했었죠?", timestamp: Date.now() - 5000 },
    ];
    set({
      currentChatId: chatId,
      currentChatMessages: dummyMessages,
      messageIdCounter: dummyMessages.length > 0 ? Math.max(0, ...dummyMessages.map(msg => msg.id)) : 0,
    });
  },

  // 액션 구현: 새 채팅 시작
  startNewChat: () => {
    // TODO: 실제로는 백엔드에서 고유한 채팅방 ID를 생성하여 받아와야 함 (UUID 등 사용 권장)
    const newChatId = `new-chat-${Date.now()}`;
    const initialId = 1; // 새 채팅 시작 시 메시지 카운터 초기화
    const initialIntroMessage: ChatMessage = {
      id: initialId,
      sender: 'bot',
      // 백틱을 사용하여 여러 줄 문자열 정의
      text: `안녕하세요, 하니 매니저님! 반갑습니다.\n현재 경력은 10년차로 우리은행 차세대 시스템 구축에서 Back-end 개발 업무를 수행하고 계시네요.\n오늘은 무엇이 궁금하세요?`,
      timestamp: Date.now(),
    };
    set({
      currentChatId: newChatId,
      currentChatMessages: [initialIntroMessage],
      messageIdCounter: initialId,
    });
    // 새 채팅을 지난 대화 목록에 추가 (예시, 실제로는 백엔드에서 관리)
    get().addPastChatSummary({ id: newChatId, title: '새로운 대화' });
  }
}));

export default useChatStore;