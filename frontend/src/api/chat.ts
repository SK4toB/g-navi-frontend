// frontend/src/api/chat.ts
import { api } from './client';
import type { ChatMessage } from '../store/chatStore';

interface CreateChatroomResponse {
  id: string;
}

interface ChatroomListResponse {
  chatrooms: {
    id: string;
    title: string;
  }[];
}

interface ChatroomMessagesResponse {
  messages: ChatMessage[];
}

interface SendMessagePayload {
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

interface SendMessageResponse {
  messageId: number;
}

export const chatApi = {
  createChatroom: async (): Promise<CreateChatroomResponse> => {
    const data = await api.post<CreateChatroomResponse>('/chatroom');
    return data;
  },

  loadAllChatrooms: async (): Promise<ChatroomListResponse> => {
    const data = await api.get<ChatroomListResponse>('/chatroom');
    return data;
  },

  getChatroomMessages: async (chatroomId: string): Promise<ChatroomMessagesResponse> => {
    const data = await api.get<ChatroomMessagesResponse>(`/chatroom/${chatroomId}`);
    return data;
  },

  deleteChatroom: async (chatroomId: string): Promise<any> => {
    const data = await api.delete<any>(`/chatroom/${chatroomId}`);
    return data;
  },

  sendMessage: async (chatroomId: string, payload: SendMessagePayload): Promise<SendMessageResponse> => {
    const data = await api.post<SendMessageResponse>(`/chatroom/${chatroomId}/messages`, payload);
    return data;
  },

  receiveMessages: async (chatroomId: string): Promise<ChatroomMessagesResponse> => {
    const data = await api.get<ChatroomMessagesResponse>(`/chatroom/${chatroomId}/messages`);
    return data;
  },
};