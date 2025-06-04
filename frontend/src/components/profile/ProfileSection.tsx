// frontend/src/components/myPage/UserProfileSection.tsx
interface UserInfo {
  name: string;
  avatar?: string;
}

export default function ProfileSection(userInfo: UserInfo) {
  return (
    <div className="w-[945px] h-[75px] flex">
      <div className="flex items-center ml-[24px]">
        <img src={userInfo.avatar} alt="User Profile Image" className="w-[48px] h-[48px] rounded-full" />
        <span className="ml-[16px] font-bold text-[24px] text-[#1E293B]">{userInfo.name}</span>
      </div>
    </div>
  );
}