// frontend/src/components/profile/ProjectSection.tsx
import React from 'react';
import ProjectFormModal from './ProjectFormModal';
import { projectApi, type Project } from '../../api/project';

interface ProjectSectionProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectAdded: (project: Project) => void;
  onProjectDeleted: (projectId: number) => void; // 삭제 콜백 추가
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

// 스킬별 색상 매핑을 위한 함수
const getSkillColor = (skill: string, index: number) => {
  // 스킬 이름의 해시값을 기반으로 색상 선택 (일관성 유지)
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % skillColors.length;
  return skillColors[colorIndex];
};

export default function ProjectSection({ projects, isLoading = false, onProjectAdded, onProjectDeleted }: ProjectSectionProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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
        onProjectDeleted(projectId); // 부모 컴포넌트에 삭제 알림
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
    <>
      <div className="w-[945px] min-h-[156px] flex flex-col">
        <div className="min-h-[74px] flex items-center justify-between border-b border-t border-[#E2E8F0] px-[24px]">
          <div className="flex items-center">
            <span className="font-bold text-[24px] text-[#1E293B]">Projects</span>
            {isLoading && (
              <div className="ml-4 flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
                <span className="ml-2 text-sm text-gray-500">불러오는 중...</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#122250] text-white rounded-lg hover:bg-[#1e3a5f] transition-colors"
          >
            프로젝트 추가
          </button>
        </div>
        
        <div className="p-[24px] max-h-[400px] overflow-y-auto">
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => {
                const isExpanded = expandedProjects.has(project.projectId);
                const isDeleting = deletingProjectId === project.projectId;
                
                return (
                  <div
                    key={project.projectId}
                    className="border border-gray-200 rounded-lg bg-white shadow-sm"
                  >
                    {/* 프로젝트 헤더 (항상 표시) */}
                    <div className="p-4 flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-4 flex-1 cursor-pointer hover:bg-gray-50 transition-colors rounded p-2 -m-2"
                        onClick={() => toggleProject(project.projectId)}
                      >
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {project.userRole}
                        </span>
                        <h3 className="font-semibold text-[18px] text-[#1E293B]">
                          {project.projectName}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                        </span>
                        
                        {/* 삭제 버튼 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 토글 이벤트 방지
                            handleDeleteProject(project.projectId, project.projectName);
                          }}
                          disabled={isDeleting}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
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
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                        <div className="pt-4 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-bold text-gray-800">도메인:</span>
                              <span className="font-bold ml-2 text-gray-600">{project.domain}</span>
                            </div>
                            <div>
                              <span className="font-bold text-gray-800">규모:</span>
                              <span className="font-bold ml-2 text-gray-600">{project.projectScale}</span>
                            </div>
                          </div>
                          
                          {project.skills && project.skills.length > 0 && (
                            <div>
                              <div className="mt-2 flex flex-wrap gap-2">
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
            <div className="text-center text-gray-500 py-8">
              {isLoading ? '프로젝트를 불러오는 중...' : '등록된 프로젝트가 없습니다.'}
            </div>
          )}
        </div>
      </div>

      {/* 프로젝트 추가 모달 */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectAdded={onProjectAdded}
      />
    </>
  );
}