// frontend/src/api/wordcloud.ts
import { api } from './client';

// 워드클라우드 단어 타입 정의
export interface WordCloudWord {
  text: string;
  value: number;
}

// 워드클라우드 응답 타입
export interface WordCloudResponse {
  code: string;
  message: string;
  result: WordCloudWord[];
  isSuccess: boolean;
}

// 카테고리 타입 정의
export type CategoryType = 'skill' | 'career' | 'project';

// 레벨 타입 정의
export type LevelType = 'CL1' | 'CL2' | 'CL3' | 'CL4' | 'CL5';

export const wordcloudApi = {
  // 전체 사용자 질문 워드클라우드 (GET /api/wordcloud/admin/all)
  getAllWordCloud: async (adminId: number, maxWords: number = 100): Promise<WordCloudResponse> => {
    const data = await api.get<WordCloudResponse>('/api/wordcloud/admin/all', {
      params: { 
        adminId,
        maxWords
      }
    });
    return data;
  },

  // 카테고리별 질문 워드클라우드 (GET /api/wordcloud/admin/category/{category})
  getCategoryWordCloud: async (
    adminId: number, 
    category: CategoryType, 
    maxWords: number = 100
  ): Promise<WordCloudResponse> => {
    const data = await api.get<WordCloudResponse>(`/api/wordcloud/admin/category/${category}`, {
      params: { 
        adminId,
        maxWords
      }
    });
    return data;
  },

  // 등급별 사용자 질문 워드클라우드 (GET /api/wordcloud/admin/level/{level})
  getLevelWordCloud: async (
    adminId: number, 
    level: LevelType, 
    maxWords: number = 100
  ): Promise<WordCloudResponse> => {
    const data = await api.get<WordCloudResponse>(`/api/wordcloud/admin/level/${level}`, {
      params: { 
        adminId,
        maxWords
      }
    });
    return data;
  },
};