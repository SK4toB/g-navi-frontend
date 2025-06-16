// frontend/src/api/project.ts
import { api } from './client';
import useAuthStore from '../store/authStore';

// 프로젝트 정보 타입
export interface Project {
  projectId: number;
  projectName: string;
  userRole: string;
  domain: string;
  projectScale: string;
  startDate: string;
  endDate: string;
  skills: string[];
}

// 응답 타입
export interface ProjectResponse {
  code: string;
  message: string;
  result: Project[] | Project | null;  // 목록 조회시 배열, 생성시 단일 객체, 삭제 시
  isSuccess: boolean;
}

export const projectApi = {
  // 사용자의 프로젝트 목록 조회 (GET /api/projects?memberId={memberId})
  getProjectList: async (memberId: number): Promise<ProjectResponse> => {
    const data = await api.get<ProjectResponse>('/api/projects', {
      params: { memberId }
    });
    return data;
  },

  // 새 프로젝트 생성 (POST /api/projects)
  createProject: async (projectData: Omit<Project, 'projectId'>): Promise<ProjectResponse> => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    const requestData = {
      ...projectData,
      memberId: user.memberId
    };

    const data = await api.post<ProjectResponse>('/api/projects', requestData);
    return data;
  },

  // 프로젝트 삭제 (DELETE /api/projects)
  deleteProject: async (projectId: number): Promise<ProjectResponse> => {
    const data = await api.delete<ProjectResponse>('/api/projects', {
      params: { projectId }
    });
    return data;
  }
};