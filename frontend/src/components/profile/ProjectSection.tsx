// frontend/src/components/profile/ProjectSection.tsx
import React from 'react';
import { projectApi, type Project } from '../../api/project';

interface ProjectSectionProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectDeleted: (projectId: number) => void;
  onAddProjectClick: () => void; // 모달 열기 이벤트만 전달
}

// 스킬 태그 색상 배열
const skillColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800', 
  'bg-purple-100 text-purple-800',
  'bg-yellow-100 text-yellow-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-red-100 text-red-800',
  'bg-teal-100 text-teal-800',
  'bg-orange-100 text-orange-800',
  'bg-cyan-100 text-cyan-800'
];

// 역할별 색상 매핑
const roleColors = {
  'Software Development': 'bg-blue-100 text-blue-700',
  'Manufacturing Engineering': 'bg-orange-100 text-orange-700',
  'Solution Development': 'bg-green-100 text-green-700',
  'Cloud/Infra Engineering': 'bg-sky-100 text-sky-700',
  'Architect': 'bg-purple-100 text-purple-700',
  'Project Management': 'bg-indigo-100 text-indigo-700',
  'Quality Management': 'bg-amber-100 text-amber-700',
  'AIX': 'bg-violet-100 text-violet-700',
  'Sales': 'bg-pink-100 text-pink-700',
  'Domain Expert': 'bg-emerald-100 text-emerald-700',
  'Biz. Consulting': 'bg-teal-100 text-teal-700',
  'Biz. Supporting': 'bg-slate-100 text-slate-700',
  'default': 'bg-gray-100 text-gray-700'
};

// 역할별 색상 가져오기 함수
const getRoleColor = (role: string) => {
  return roleColors[role] || roleColors.default;
};

// 스킬별 색상 매핑을 위한 함수
const getSkillColor = (skill: string, index: number) => {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % skillColors.length;
  return skillColors[colorIndex];
};

export default function ProjectSection({ projects, isLoading = false, onProjectDeleted, onAddProjectClick }: ProjectSectionProps) {
  const [expandedProjects, setExpandedProjects] = React.useState<Set<number>>(new Set());
  const [deletingProjectId, setDeletingProjectId] = React.useState<number | null>(null);

  const toggleProject = (projectId: number) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (!confirm(`"${projectName}" 프로젝트를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setDeletingProjectId(projectId);
      const response = await projectApi.deleteProject(projectId);
      
      if (response.isSuccess) {
        alert('프로젝트가 성공적으로 삭제되었습니다.');
        onProjectDeleted(projectId);
      } else {
        alert(`프로젝트 삭제 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('프로젝트 삭제 중 오류:', error);
      alert('프로젝트 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="w-[945px] bg-white bg-opacity-80 rounded-lg shadow-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">프로젝트 경험</h2>
          {projects.length > 0 && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {projects.length}개
            </span>
          )}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-500">불러오는 중...</span>
            </div>
          )}
        </div>
        
        <button
          onClick={onAddProjectClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + 프로젝트 추가
        </button>
      </div>
      
      {/* 프로젝트 목록 */}
      <div className="p-4 max-h-[325px] overflow-y-auto scrollbar-hide">
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.projectId);
              const isDeleting = deletingProjectId === project.projectId;
              
              return (
                <div
                  key={project.projectId}
                  className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* 프로젝트 헤더 (항상 표시) */}
                  <div className="p-4 flex items-center justify-between">
                    <div 
                      className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-gray-50 transition-colors rounded p-2 -m-2"
                      onClick={() => toggleProject(project.projectId)}
                    >
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${getRoleColor(project.userRole)}`}>
                        {project.userRole}
                      </span>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {project.projectName}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                      </span>
                      
                      {/* 삭제 버튼 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.projectId, project.projectName);
                        }}
                        disabled={isDeleting}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="프로젝트 삭제"
                      >
                        {isDeleting ? (
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                      
                      {/* 토글 화살표 */}
                      <button
                        onClick={() => toggleProject(project.projectId)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* 프로젝트 상세 정보 (토글로 표시/숨김) */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">도메인:</span>
                            <span className="text-sm text-gray-800 font-medium">{project.domain}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">규모:</span>
                            <span className="text-sm text-gray-800 font-medium">{project.projectScale}</span>
                          </div>
                        </div>
                        
                        {project.skills && project.skills.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-2">사용 기술:</span>
                            <div className="flex flex-wrap gap-2">
                              {project.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className={`px-3 py-1 text-sm rounded-full font-medium ${getSkillColor(skill, index)}`}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-9">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                <span className="text-gray-500">프로젝트를 불러오는 중...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="size-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">등록된 프로젝트가 없습니다</p>
                  <p className="text-sm text-gray-400">첫 번째 프로젝트를 추가해보세요</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}