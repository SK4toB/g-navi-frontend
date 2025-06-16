// frontend/src/api/conversation.ts
import { api } from './client';

// 새 대화 시작 요청 타입
export interface StartConversationRequest {
  memberId: number;
  conversationId: string | null; // null이면 새 대화, 값이 있으면 기존 대화 이어서
}

// 대화 시작 응답 타입
export interface StartConversationResponse {
  code: string;
  message: string;
  result: {
    conversationId: string;
    botMessage: string;
    timestamp: string;
  };
  isSuccess: boolean;
}

// 메시지 전송 요청 타입
export interface SendMessageRequest {
  conversationId: string;
  messageText: string;
  memberId: number;
}

// 메시지 전송 응답 타입
export interface SendMessageResponse {
  code: string;
  message: string;
  result: {
    conversationId: string;
    botMessage: string;
    timestamp: string;
  };
  isSuccess: boolean;
}

// 메시지 타입
export interface ConversationMessage {
  senderType: 'USER' | 'ASSISTANT';
  messageText: string;
  timestamp: string;
  summary: string;
}

// 대화 내역 조회 응답 타입
export interface ConversationHistoryResponse {
  code: string;
  message: string;
  result: {
    id: string;
    memberId: number;
    messages: ConversationMessage[];
    createdAt: string;
    updatedAt: string;
    empty: boolean;
    messageCount: number;
    latestMessage: ConversationMessage;
    lastUserMessage: ConversationMessage;
    summary: string;
  };
  isSuccess: boolean;
}

export const conversationApi = {
  // 새 대화 시작 (POST /api/conversations)
  startConversation: async (memberId: number): Promise<StartConversationResponse> => {
    const payload: StartConversationRequest = {
      memberId,
      conversationId: null // 새 대화이므로 null
    };
    
    const data = await api.post<StartConversationResponse>('/api/conversations', payload);
    return data;
  },

  // 기존 대화 내역 조회 (GET /api/conversations/{conversationId})
  getConversationHistory: async (conversationId: string): Promise<ConversationHistoryResponse> => {
    const data = await api.get<ConversationHistoryResponse>(`/api/conversations/${conversationId}`, {
      params: { conversationId } // Parameters에 conversationId 추가
    });
    return data;
  },

  // 메시지 전송 (POST /api/conversations/{conversationId}/messages)
  sendMessage: async (conversationId: string, messageText: string, memberId: number): Promise<SendMessageResponse> => {
    const payload: SendMessageRequest = {
      conversationId,
      messageText,
      memberId
    };
    
    const data = await api.post<SendMessageResponse>(`/api/conversations/${conversationId}/messages`, payload);
    return data;
  },
};