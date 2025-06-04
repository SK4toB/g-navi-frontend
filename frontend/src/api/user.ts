// frontend/src/api/user.ts
import { api } from './client';

interface UserInfoResponse {
  id: string;
  name: string;
  skills?: string[];
  projects?: Project[];
}

interface Project {
  projectId: string;
  projectName: string;
  description: string;
}

interface ProjectPayload {
  projectName: string;
  description: string;
}

interface UserInfoUpdatePayload {
  name?: string;
  skills?: string[];
}

export const userApi = {
  getUserInfo: async (id: string): Promise<UserInfoResponse> => {
    const data = await api.get<UserInfoResponse>(`/info/${id}`);
    return data;
  },

  addProject: async (id: string, payload: ProjectPayload): Promise<any> => {
    const data = await api.post<any>(`/info/${id}`, payload);
    return data;
  },

  updateUserInfo: async (id: string, payload: UserInfoUpdatePayload): Promise<any> => {
    const data = await api.put<any>(`/info/${id}`, payload);
    return data;
  },
};