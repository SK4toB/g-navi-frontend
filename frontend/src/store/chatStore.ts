
// frontend/src/store/chatStore.ts
import { create } from 'zustand';

// 지난 대화 목록의 각 항목에 대한 타입 정의
interface PastChatSummary {
  id: string;
  title: string
}

// 스토어 상태 인터페이스 정의
interface ChatStoreState {
  pastChatSummaries: PastChatSummary[]; // 지난 대화 목록
  
  // 액션 정의
  addPastChatSummary: (chatSummary: PastChatSummary) => void;
  // 기존 대화 목록 로드 (예: 서버에서 가져올 때)
  setPastChatSummaries: (chatSummaries: PastChatSummary[]) => void;
  // 필요시 특정 대화방 삭제 액션 등 추가
}

// Zustand 스토어 생성
const useChatStore = create<ChatStoreState>((set) => ({
  // 초기 상태 (임시 데이터)
  pastChatSummaries: [
    { id: 'chat-1', title: '커리어에 대한 고민', lastMessagePreview: '앞으로의 성장 경로 추천을 받고 싶어.', timestamp: Date.now() - 3600000 },
    { id: 'chat-2', title: '스킬셋 강화', lastMessagePreview: '어떤 스킬을 쌓으면 좋을지?', timestamp: Date.now() - 7200000 },
    { id: 'chat-3', title: '롤모델 커리어 탐색', lastMessagePreview: '롤모델 커리어 확인하기', timestamp: Date.now() - 10800000 },
  ],

  // 액션 구현
  addPastChatSummary: (chatSummary) => set((state) => ({ 
    pastChatSummaries: [...state.pastChatSummaries, chatSummary] 
  })),
  setPastChatSummaries: (chatSummaries) => set({ 
    pastChatSummaries: chatSummaries 
  }),
}));

export default useChatStore;