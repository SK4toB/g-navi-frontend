// frontend/src/api/admin.ts
import { api } from './client';

// 회원 정보 타입 정의
export interface Member {
  memberId: number;
  name: string;
  email: string;
  role: 'USER' | 'EXPERT' | 'ADMIN';
  isExpert: boolean;
  joinDate: string;
}

// 모든 회원 조회 응답 타입
export interface GetAllMembersResponse {
  code: string;
  message: string;
  result: Member[];
  isSuccess: boolean;
}

// 회원 역할 변경 요청 타입 (ADMIN으로는 변경 불가)
export interface UpdateMemberRoleRequest {
  memberId: number;
  newRole: 'USER' | 'EXPERT';
}

// 회원 역할 변경 응답 타입
export interface UpdateMemberRoleResponse {
  code: string;
  message: string;
  result: Member | null;
  isSuccess: boolean;
}

// DashBoard Interface
// 레벨별 사용자 통계 타입
export interface UsersByLevel {
  CL1: number;
  CL2: number;
  CL3: number;
  CL4: number;
  CL5: number;
}

// 사용자 통계 타입
export interface UserStatistics {
  totalUsers: number;
  usersByLevel: UsersByLevel;
}

// 카테고리 통계 타입
export interface CategoryStatistics {
  careerQuestions: number;
  skillQuestions: number;
  projectQuestions: number;
  otherQuestions: number;
  totalQuestions: number;
  careerPercentage: number;
  skillPercentage: number;
  projectPercentage: number;
  otherPercentage: number;
}

// 레벨별 카테고리 통계 타입
export interface LevelCategoryStatistics {
  CL1: CategoryStatistics;
  CL2: CategoryStatistics;
  CL3: CategoryStatistics;
  CL4: CategoryStatistics;
  CL5: CategoryStatistics;
}

// 대시보드 데이터 타입
export interface DashboardData {
  userStatistics: UserStatistics;
  todayChatUsers: number;
  categoryStatistics: CategoryStatistics;
  levelCategoryStatistics: LevelCategoryStatistics;
}

// 대시보드 응답 타입
export interface GetDashboardResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: DashboardData;
}

export const adminApi = {
  // 모든 회원 조회 (GET /api/admin/members?adminId={adminId})
  getAllMembers: async (adminId: number): Promise<GetAllMembersResponse> => {
    const data = await api.get<GetAllMembersResponse>('/api/admin/members', {
      params: { adminId }
    });
    return data;
  },

  // 회원 역할 변경 (PUT /api/admin/members/role?adminId={adminId})
  updateMemberRole: async (
    adminId: number,
    requestBody: UpdateMemberRoleRequest
  ): Promise<UpdateMemberRoleResponse> => {
    const data = await api.put<UpdateMemberRoleResponse>(
      '/api/admin/members/role',
      requestBody,
      {
        params: { adminId }
      }
    );
    return data;
  },

  //dashboard
  getDashboardData: async (adminId: number): Promise<GetDashboardResponse> => {
    const data = await api.get<GetDashboardResponse>(
      '/api/admin/dashboard',
      {
        params: { adminId }
      }
    );
    return data;
  },
};