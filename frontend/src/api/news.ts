// frontend/src/api/news.ts
import { api } from './client';

// 관리자용 모든 뉴스 조회 (admin전용)
export interface GetAllNewsRequest {
  adminId: number;
}

// 모든 뉴스 조회 - 응답
export interface NewsItem {
    newsId: number;
    title: string;
    expert: string;
    status: string;
    url: string;
    date: string;
    canApprove: boolean;
    canUnapprove: boolean;
    canReject: boolean;
}
  
export interface GetAllNewsResponse {
    code: string;
    message: string;
    result: NewsItem[];
    isSuccess: boolean;
}

// 뉴스 관리 요청 인터페이스
export interface ManageNewsRequest {
    newsId: number;
    adminId: number;
    action: 'APPROVE' | 'REJECT' | 'UNAPPROVE';
}
  
export interface ManageNewsResponse {
    code: string;
    message: string;
    result: string;
    isSuccess: boolean;
}

// 뉴스 기사 등록 요청 인터페이스
export interface RegisterNewsRequest {
  expertId: number;
  title: string;
  url: string;
}

// 뉴스 기사 등록 응답 인터페이스
export interface RegisterNewsResponse {
    code: string;
    message: string;
    result: NewsItem;
    isSuccess: boolean;
}

export const newsApi = {
  // 관리자용 모든 뉴스 조회 (GET /api/news/admin/all)
  getAllNewsList: async (adminId: number): Promise<GetAllNewsResponse> => {
    const data = await api.get<GetAllNewsResponse>('/api/news/admin/all', {
      params: { adminId }
    });
    return data;
  },

  // admin의 뉴스 관리 (승인/거절/승인해제) (PUT /api/news/admin/manage)
  manageNews: async (newsId: number, adminId: number, action: 'APPROVE' | 'REJECT' | 'UNAPPROVE'): Promise<ManageNewsResponse> => {
    const payload: ManageNewsRequest = {
      newsId,
      adminId,
      action
    };
    const data = await api.put<ManageNewsResponse>('/api/news/admin/manage', payload);
    return data;
    },

  // 뉴스 기사 등록 (POST /api/news)
  registerNews: async (expertId: number, title: string, url: string): Promise<RegisterNewsResponse> => {
    const payload: RegisterNewsRequest = {
      expertId,
      title,
      url
    };
    const data = await api.post<RegisterNewsResponse>('/api/news', payload);
    return data;
  },
};