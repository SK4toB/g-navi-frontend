// frontend/src/api/chat.ts
import { api } from './client';

// 메시지 타입 정의
export interface ChatMessage {
  senderType: 'USER' | 'ASSISTANT';
  messageText: string;
  timestamp: string;
  summary: string;
}

// 채팅방 상세 정보 타입
export interface ChatRoom {
  id: string;
  memberId: number;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  empty: boolean;
  messageCount: number;
  latestMessage: ChatMessage;
  lastUserMessage: ChatMessage;
  summary: string;
}

// 채팅방 목록 조회 응답
export interface ChatRoomListResponse {
  code: string;
  message: string;
  result: ChatRoom[];
  isSuccess: boolean;
}

// 새 채팅방 생성 응답
export interface CreateChatRoomResponse {
  code: string;
  message: string;
  result: {
    conversationId: string;
    botMessage: string;
    timestamp: string;
  };
  isSuccess: boolean;
}

// 채팅방 메시지 조회 응답
export interface ChatRoomMessagesResponse {
  code: string;
  message: string;
  result: ChatRoom;
  isSuccess: boolean;
}

// 메시지 전송 요청 타입
export interface SendMessageRequest {
  conversationId: string;
  messageText: string;
  memberId: number;
}

// 메시지 전송 응답
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

// 채팅방 삭제 응답
export interface DeleteChatRoomResponse {
  code: string;
  message: string;
  result: string;
  isSuccess: boolean;
}

export const chatApi = {
  // 채팅방 목록 조회 (GET /api/chatrooms)
  getChatRoomList: async (): Promise<ChatRoomListResponse> => {
    const data = await api.get<ChatRoomListResponse>('/chatrooms');
    return data;
  },

  // 새 채팅방 생성 (POST /api/chatrooms)
  createChatRoom: async (): Promise<CreateChatRoomResponse> => {
    const data = await api.post<CreateChatRoomResponse>('/chatrooms', {
      memberId: 0, // 실제로는 현재 로그인된 사용자 ID 사용
      conversationId: "string"
    });
    return data;
  },

  // 채팅방 메시지 조회 (GET /api/chatrooms/{chatroomId}/messages)
  getChatRoomMessages: async (chatroomId: string, page: number = 0, size: number = 20): Promise<ChatRoomMessagesResponse> => {
    const data = await api.get<ChatRoomMessagesResponse>(`/chatrooms/${chatroomId}/messages`, {
      params: { page, size }
    });
    return data;
  },

  // 메시지 전송 (POST /api/chatrooms/{chatroomId}/messages)
  sendMessage: async (chatroomId: string, messageText: string): Promise<SendMessageResponse> => {
    const data = await api.post<SendMessageResponse>(`/chatrooms/${chatroomId}/messages`, {
      conversationId: chatroomId,
      messageText,
      memberId: 0 // 실제로는 현재 로그인된 사용자 ID 사용
    });
    return data;
  },

  // 채팅방 정보 조회 (GET /api/chatrooms/{chatroomId})
  getChatRoom: async (chatroomId: string): Promise<ChatRoomMessagesResponse> => {
    const data = await api.get<ChatRoomMessagesResponse>(`/chatrooms/${chatroomId}`);
    return data;
  },

  // 채팅방 삭제 (DELETE /api/chatrooms/{chatroomId})
  deleteChatRoom: async (chatroomId: string): Promise<DeleteChatRoomResponse> => {
    const data = await api.delete<DeleteChatRoomResponse>(`/chatrooms/${chatroomId}`);
    return data;
  },
};