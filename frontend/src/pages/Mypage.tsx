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

    // 비동기로 추가 데이터 가져오기
    React.useEffect(() => {
        const fetchAdditionalData = async () => {
            if (!user) return;

            // 홈 정보 가져오기 (아직 없는 경우에만)
            if (!homeInfo) {
                setIsLoadingHomeInfo(true);
                try {
                    const homeResponse = await authApi.getHomeInfo();
                    if (homeResponse.isSuccess) {
                        useAuthStore.getState().setHomeInfo(homeResponse.result);
                    }
                } catch (error) {
                    console.error('홈 정보 불러오기 실패:', error);
                } finally {
                    setIsLoadingHomeInfo(false);
                }
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

    // 전역 상태의 skills를 우선 표시
    const skills = homeInfo?.skills?.map(skill => ({ name: skill })) || [];

    return (
        <div className="flex flex-col items-center">
            <CommonTitle>내 정보</CommonTitle>
            
            {/* user 정보 즉시 렌더링 */}
            {user && <ProfileSection name={user.name} />}
            
            {/* skills 정보 렌더링 (로딩 상태 표시) */}
            <SkillSetSection 
                skills={skills} 
                isLoading={isLoadingHomeInfo && !homeInfo} 
            />
            
            {/* 프로젝트 섹션 (모달 포함) */}
            <ProjectSection 
                projects={projects}
                isLoading={isLoadingProjects}
                onProjectAdded={(newProject) => {
                    setProjects(prev => [...prev, newProject]);
                }}
            />
        </div>
    );
}