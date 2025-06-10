// frontend/src/store/chatStore.ts
import { create } from 'zustand';
import { chatApi, type ChatMessage, type ChatRoom } from '../api/chat';

// 라이트바에 표시할 채팅 요약 정보
export interface ChatSummary {
  id: string;
  summary: string;
  messageCount: number;
  updatedAt: string;
}

// 채팅 스토어 상태 인터페이스
interface ChatStoreState {
  // 채팅방 목록 (라이트바용)
  chatSummaries: ChatSummary[];
  
  // 현재 활성 채팅방 정보
  currentChatId: string | null;
  currentChatMessages: ChatMessage[];
  
  // 로딩 상태
  isLoading: boolean;
  
  // 액션들
  /**
   * 채팅방 목록을 서버에서 불러와서 업데이트
   */
  loadChatSummaries: () => Promise<void>;
  
  /**
   * 새 채팅방 생성
   */
  createNewChat: () => Promise<string | null>;
  
  /**
   * 특정 채팅방의 메시지들을 로드
   */
  loadChatMessages: (chatId: string) => Promise<void>;
  
  /**
   * 메시지 전송
   */
  sendMessage: (chatId: string, messageText: string) => Promise<void>;
  
  /**
   * 채팅방 삭제
   */
  deleteChatRoom: (chatId: string) => Promise<void>;
  
  /**
   * 현재 채팅 초기화
   */
  clearCurrentChat: () => void;
  
  /**
   * 채팅 요약 정보 업데이트 (새 메시지 후)
   */
  updateChatSummary: (chatId: string, summary: string) => void;
}

const useChatStore = create<ChatStoreState>((set, get) => ({
  // 초기 상태
  chatSummaries: [],
  currentChatId: null,
  currentChatMessages: [],
  isLoading: false,

  // 채팅방 목록 로드
  loadChatSummaries: async () => {
    try {
      set({ isLoading: true });
      const response = await chatApi.getChatRoomList();
      
      if (response.isSuccess) {
        const summaries: ChatSummary[] = response.result.map((chatRoom) => ({
          id: chatRoom.id,
          summary: chatRoom.summary,
          messageCount: chatRoom.messageCount,
          updatedAt: chatRoom.updatedAt,
        }));
        
        set({ chatSummaries: summaries });
      } else {
        console.error('채팅방 목록 로드 실패:', response.message);
      }
    } catch (error) {
      console.error('채팅방 목록 로드 중 오류:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 새 채팅방 생성
  createNewChat: async () => {
    try {
      set({ isLoading: true });
      const response = await chatApi.createChatRoom();
      
      if (response.isSuccess) {
        const newChatId = response.result.conversationId;
        
        // 새 채팅방을 요약 목록에 추가
        const newSummary: ChatSummary = {
          id: newChatId,
          summary: '새로운 대화',
          messageCount: 1,
          updatedAt: response.result.timestamp,
        };
        
        set((state) => ({
          chatSummaries: [newSummary, ...state.chatSummaries],
          currentChatId: newChatId,
          currentChatMessages: [
            {
              senderType: 'ASSISTANT',
              messageText: response.result.botMessage,
              timestamp: response.result.timestamp,
              summary: '',
            }
          ],
        }));
        
        return newChatId;
      } else {
        console.error('새 채팅방 생성 실패:', response.message);
        return null;
      }
    } catch (error) {
      console.error('새 채팅방 생성 중 오류:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // 채팅방 메시지 로드
  loadChatMessages: async (chatId: string) => {
    try {
      set({ isLoading: true });
      const response = await chatApi.getChatRoomMessages(chatId);
      
      if (response.isSuccess) {
        set({
          currentChatId: chatId,
          currentChatMessages: response.result.messages,
        });
      } else {
        console.error('채팅 메시지 로드 실패:', response.message);
      }
    } catch (error) {
      console.error('채팅 메시지 로드 중 오류:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 메시지 전송
  sendMessage: async (chatId: string, messageText: string) => {
    try {
      // 사용자 메시지를 즉시 UI에 추가
      const userMessage: ChatMessage = {
        senderType: 'USER',
        messageText,
        timestamp: new Date().toISOString(),
        summary: '',
      };
      
      set((state) => ({
        currentChatMessages: [...state.currentChatMessages, userMessage],
      }));
      
      // 서버에 메시지 전송
      const response = await chatApi.sendMessage(chatId, messageText);
      
      if (response.isSuccess) {
        // 봇 응답을 UI에 추가
        const botMessage: ChatMessage = {
          senderType: 'ASSISTANT',
          messageText: response.result.botMessage,
          timestamp: response.result.timestamp,
          summary: '',
        };
        
        set((state) => ({
          currentChatMessages: [...state.currentChatMessages, botMessage],
        }));
        
        // 채팅 요약 업데이트 (메시지 수 증가)
        set((state) => ({
          chatSummaries: state.chatSummaries.map((summary) =>
            summary.id === chatId
              ? { ...summary, messageCount: summary.messageCount + 2, updatedAt: response.result.timestamp }
              : summary
          ),
        }));
      } else {
        console.error('메시지 전송 실패:', response.message);
        // 실패 시 사용자 메시지 제거
        set((state) => ({
          currentChatMessages: state.currentChatMessages.slice(0, -1),
        }));
      }
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      // 실패 시 사용자 메시지 제거
      set((state) => ({
        currentChatMessages: state.currentChatMessages.slice(0, -1),
      }));
    }
  },

  // 채팅방 삭제
  deleteChatRoom: async (chatId: string) => {
    try {
      const response = await chatApi.deleteChatRoom(chatId);
      
      if (response.isSuccess) {
        set((state) => ({
          chatSummaries: state.chatSummaries.filter((summary) => summary.id !== chatId),
          // 현재 보고 있던 채팅이 삭제된 경우 초기화
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
          currentChatMessages: state.currentChatId === chatId ? [] : state.currentChatMessages,
        }));
      } else {
        console.error('채팅방 삭제 실패:', response.message);
      }
    } catch (error) {
      console.error('채팅방 삭제 중 오류:', error);
    }
  },

  // 현재 채팅 초기화
  clearCurrentChat: () => {
    set({
      currentChatId: null,
      currentChatMessages: [],
    });
  },

  // 채팅 요약 업데이트
  updateChatSummary: (chatId: string, summary: string) => {
    set((state) => ({
      chatSummaries: state.chatSummaries.map((chatSummary) =>
        chatSummary.id === chatId
          ? { ...chatSummary, summary }
          : chatSummary
      ),
    }));
  },
}));

export default useChatStore;