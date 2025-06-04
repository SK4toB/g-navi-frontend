// frontend/src/store/chatStore.ts
import { create } from 'zustand';

// 지난 대화 목록의 각 항목에 대한 타입 정의
interface PastChatSummary {
  id: string;
  title: string;
  // TODO: 필요시 lastMessagePreview, timestamp 등 추가 필드 정의
}

// 채팅 메시지 타입 정의
export type ChatMessage = {
  id: number;
  sender: 'user' | 'bot';
  text: string | React.ReactNode; // JSX를 포함할 수 있도록 React.ReactNode 타입도 허용, 하지만 스토어 내에서는 문자열 권장
  timestamp: number;
};

// 스토어 상태 인터페이스 정의
interface ChatStoreState {
  pastChatSummaries: PastChatSummary[];   // 지난 대화 목록
  currentChatId: string | null;            // 현재 활성화된 채팅방 ID
  currentChatMessages: ChatMessage[];      // 현재 채팅 세션의 메시지 목록
  messageIdCounter: number;                // 현재 채팅 세션 내 메시지 ID 생성을 위한 카운터

  // 액션 정의
  addPastChatSummary: (chatSummary: PastChatSummary) => void;
  setPastChatSummaries: (chatSummaries: PastChatSummary[]) => void;
  addMessage: (message: ChatMessage) => void;
  setCurrentChat: (chatId: string | null, initialMessages?: ChatMessage[]) => void;
  loadChatMessages: (chatId: string) => void;
  startNewChat: () => void;
}

// Zustand 스토어 생성
const useChatStore = create<ChatStoreState>((set, get) => ({
  // 초기 상태
  pastChatSummaries: [ // 개발용 더미 데이터
    { id: 'chat-1', title: '커리어에 대한 고민' },
    { id: 'chat-2', title: '스킬셋 강화' },
    { id: 'chat-3', title: '롤모델 커리어 탐색' },
  ],
  currentChatId: null,
  currentChatMessages: [],
  messageIdCounter: 0,

  // 액션 구현: 지난 대화 목록에 추가
  addPastChatSummary: (chatSummary: PastChatSummary) => set((state) => ({ // 타입 명시
    pastChatSummaries: [...state.pastChatSummaries, chatSummary]
  })),

  // 액션 구현: 지난 대화 목록 설정 (예: 서버에서 로드 시)
  setPastChatSummaries: (chatSummaries: PastChatSummary[]) => set({ // 타입 명시
    pastChatSummaries: chatSummaries
  }),

  // 액션 구현: 현재 채팅 세션에 메시지 추가
  addMessage: (message: ChatMessage) => set((state) => ({ // 타입 명시
    currentChatMessages: [...state.currentChatMessages, message],
    messageIdCounter: state.messageIdCounter + 1, // 메시지 추가 시 카운터 증가
  })),

  // 액션 구현: 현재 채팅방 설정 (새로운 채팅 또는 기존 채팅 선택 시)
  setCurrentChat: (chatId: string | null, initialMessages: ChatMessage[] = []) => set({ // 타입 명시 및 기본값 설정
    currentChatId: chatId,
    currentChatMessages: initialMessages,
    // 기존 메시지가 있다면 가장 큰 ID로 카운터 초기화, Math.max(0, ...)로 안전하게 처리
    messageIdCounter: initialMessages.length > 0 ? Math.max(0, ...initialMessages.map(msg => msg.id)) : 0,
  }),

  // 액션 구현: 특정 채팅방 메시지 로드 (비동기)
  loadChatMessages: async (chatId: string) => { // 타입 명시
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
      // JSX 대신 일반 문자열 (백틱 `) 사용
      text: `안녕하세요, 하니 매니저님! 반갑습니다.
현재 경력은 10년차로 우리은행 차세대 시스템 구축에서 Back-end 개발 업무를 수행하고 계시네요.
오늘은 무엇이 궁금하세요?`,
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