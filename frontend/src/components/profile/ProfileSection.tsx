// frontend/src/components/profile/ProfileSection.tsx
interface UserInfo {
  name: string;
}

export default function ProfileSection(userInfo: UserInfo) {
  return (
    <div className="w-[945px] min-h-[75px] flex flex-col">
      <div className="min-h-[74px] flex items-center border-[#E2E8F0] px-[24px]">
        <span className="font-bold text-[24px] text-[#1E293B]">{userInfo.name}</span>
      </div>
    </div>
  );
}