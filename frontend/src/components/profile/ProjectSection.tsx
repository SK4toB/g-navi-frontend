// frontend/src/components/profile/ProjectSection.tsx
import React from 'react';
import ProjectFormModal from './ProjectFormModal';
import { projectApi, type Project } from '../../api/project';

interface ProjectSectionProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectAdded: (project: Project) => void;
}

export default function ProjectSection({ projects, isLoading = false, onProjectAdded }: ProjectSectionProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [expandedProjects, setExpandedProjects] = React.useState<Set<number>>(new Set());

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
                
                return (
                  <div
                    key={project.projectId}
                    className="border border-gray-200 rounded-lg bg-white shadow-sm"
                  >
                    {/* 프로젝트 헤더 (항상 표시) */}
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleProject(project.projectId)}
                    >
                      <div className="flex items-center space-x-4">
                        <h3 className="font-semibold text-[18px] text-[#1E293B]">
                          {project.projectName}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                          {project.userRole}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 프로젝트 상세 정보 (토글로 표시/숨김) */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="pt-4 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-medium text-gray-700">도메인:</span>
                              <span className="ml-2 text-gray-600">{project.domain}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">규모:</span>
                              <span className="ml-2 text-gray-600">{project.projectScale}</span>
                            </div>
                          </div>
                          
                          {project.skills && project.skills.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">기술 스택:</span>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {project.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
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