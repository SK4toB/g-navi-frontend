import CommonTitle from '../components/common/CommonTitle';
import ProfileSection from '../components/profile/ProfileSection';
import SkillSetSection from '../components/profile/SkillSetSection';
import ProjectSection from '../components/profile/ProjectSection';
import ProjectForm from '../components/form/ProjectForm';
import useAuthStore from '../store/authStore';

export default function Mypage() {
    const { user } = useAuthStore();
    const skills = [
        { name: 'SW Development' },
        { name: 'Project Management' },
        { name: 'Application PM' },
        { name: 'System Solution PM' }
    ]
    return (
        <div className="flex flex-col items-center">
            <CommonTitle>내 정보</CommonTitle>
            <ProfileSection name={user?.name} />
            <SkillSetSection skills={skills} />
            <ProjectSection />
            <ProjectForm />
        </div>
    );
}