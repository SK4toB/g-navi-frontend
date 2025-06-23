// frontend/src/pages/Mypage.tsx
import React from 'react';
import CommonTitle from '../components/common/CommonTitle';
import ProfileSection from '../components/profile/ProfileSection';
import SkillSetSection from '../components/profile/SkillSetSection';
import ProjectSection from '../components/profile/ProjectSection';
import useAuthStore from '../store/authStore';
import { authApi } from '../api/auth';
import { projectApi } from '../api/project';

export default function Mypage() {
    const { user, homeInfo } = useAuthStore();
    const [projects, setProjects] = React.useState([]);
    const [isLoadingHomeInfo, setIsLoadingHomeInfo] = React.useState(false);
    const [isLoadingProjects, setIsLoadingProjects] = React.useState(false);

    // 홈 정보를 새로고침하는 함수
    const refreshHomeInfo = async () => {
        if (!user) return;

        setIsLoadingHomeInfo(true);
        try {
            const homeResponse = await authApi.getHomeInfo();
            if (homeResponse.isSuccess) {
                useAuthStore.getState().setHomeInfo(homeResponse.result);
            }
        } catch (error) {
            console.error('홈 정보 새로고침 실패:', error);
        } finally {
            setIsLoadingHomeInfo(false);
        }
    };

    const handleLevelUpdate = async (newLevel: string) => {
        useAuthStore.getState().updateHomeInfo({ level: newLevel });
    };

    // 비동기로 추가 데이터 가져오기
    React.useEffect(() => {
        const fetchAdditionalData = async () => {
            if (!user) return;

            // 홈 정보 가져오기 (아직 없는 경우에만)
            if (!homeInfo) {
                await refreshHomeInfo();
            }

            // 프로젝트 목록 가져오기
            setIsLoadingProjects(true);
            try {
                const projectResponse = await projectApi.getProjectList(user.memberId);
                if (projectResponse.isSuccess && Array.isArray(projectResponse.result)) {
                    setProjects(projectResponse.result);
                }
            } catch (error) {
                console.error('프로젝트 목록 불러오기 실패:', error);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchAdditionalData();
    }, [user, homeInfo]);

    // 프로젝트 추가 후 콜백 함수 - 홈 정보도 함께 새로고침
    const handleProjectAdded = async (newProject) => {
        // 프로젝트 목록 업데이트
        setProjects(prev => [...prev, newProject]);

        // 홈 정보 새로고침 (스킬 정보 업데이트를 위해)
        await refreshHomeInfo();
    };

    // 프로젝트 삭제 후 콜백 함수 - 홈 정보도 함께 새로고침
    const handleProjectDeleted = async (deletedProjectId) => {
        // 프로젝트 목록 업데이트
        setProjects(prev => prev.filter(project => project.projectId !== deletedProjectId));

        // 홈 정보 새로고침 (스킬 정보 업데이트를 위해)
        await refreshHomeInfo();
    };

    // 전역 상태의 skills를 우선 표시
    const skills = homeInfo?.skills?.map(skill => ({ name: skill })) || [];

    return (
        <div className="flex flex-col items-center">
            {/* 제목 - 첫 번째 애니메이션 */}
            <div className="animate-slide-up" style={{ animationDelay: '0s' }}>
                <CommonTitle>내 정보</CommonTitle>
            </div>

            {/* ProfileSection - 두 번째 애니메이션 */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {user && (
                    <ProfileSection
                        name={user.name}
                        level={homeInfo?.level}
                        onLevelUpdate={handleLevelUpdate}
                    />
                )}
            </div>

            {/* SkillSetSection - 세 번째 애니메이션 */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <SkillSetSection
                    skills={skills}
                    isLoading={isLoadingHomeInfo}
                />
            </div>

            {/* ProjectSection - 네 번째 애니메이션 */}
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <ProjectSection
                    projects={projects}
                    isLoading={isLoadingProjects}
                    onProjectAdded={handleProjectAdded}
                    onProjectDeleted={handleProjectDeleted}
                />
            </div>
        </div>
    );
}