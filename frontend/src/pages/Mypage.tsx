import React, { useState } from "react";
import Memory from "../components/modals/Memory";

export default function MyPage() {
    const [openMemory, setOpenMemory] = useState(false);

    return (
        <div className="min-h-screen w-full bg-[#FFFFFF] flex flex-col items-center py-10">
            {/* 내 정보 타이틀 */}
            <div className="text-[40px] font-semibold text-[#122250] text-center mb-10 font-pretendard tracking-tight">내 정보</div>

            {/* 스킬/역할/PM 등 카드 그룹 */}
            <div className="flex flex-row gap-4 mb-10">
                {/* SW Development */}
                <div className="bg-[#162550] rounded-[10px] flex flex-col items-center justify-center w-[253px] h-[60px] shadow border border-[#E5E7EB]">
                    <span className="text-[16px] font-medium text-[#FFFFFF] font-plusjakartasans">SW Development</span>
                </div>
                {/* BackEnd Development */}
                <div className="bg-white rounded-[10px] flex flex-col items-center justify-center w-[253px] h-[60px] shadow border border-[#E5E7EB]">
                    <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">BackEnd Development</span>
                </div>
                {/* Project Management */}
                <div className="bg-[#162550] rounded-[10px] flex flex-col items-center justify-center w-[253px] h-[60px] shadow border border-[#E5E7EB]">
                    <span className="text-[16px] font-medium text-[#FFFFFF] font-plusjakartasans">Project Management</span>
                </div>
                {/* Application PM */}
                <div className="bg-white rounded-[10px] flex flex-col items-center justify-center w-[253px] h-[60px] shadow border border-[#E5E7EB]">
                    <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">Application PM</span>
                </div>
                {/* Solution PM */}
                <div className="bg-white rounded-[10px] flex flex-col items-center justify-center w-[253px] h-[60px] shadow border border-[#E5E7EB]">
                    <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">Solution PM</span>
                </div>
            </div>

            {/* 참여 프로젝트 타이틀 */}
            <div className="w-[945px] flex flex-col items-center mb-6">
                <div className="w-full flex flex-row items-center border-b border-[#E2E8F0] py-4 px-4">
                    <span className="text-[18px] font-bold text-[#1E293B] font-plusjakartasans">참여 프로젝트</span>
                </div>
            </div>

            {/* 참여 프로젝트 카드 예시 */}
            <div className="w-[910px] flex flex-col gap-6 mb-10">
                <div className="flex flex-row gap-6">
                    {/* 프로젝트명, 기간, 규모, 역할 */}
                    <div className="bg-white rounded-[10px] shadow p-6 flex-1 min-w-[336px]">
                        <div className="flex flex-row items-center gap-20 mb-4">
                            <div className="flex flex-col gap-2 min-w-[77px]">
                                <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">프로젝트명</span>
                                <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">우리은행 차세대 프로젝트</span>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[77px]">
                                <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">기간</span>
                                <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">2024.01 ~ 2024.12</span>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-16">
                            <div className="flex flex-col gap-2 min-w-[77px]">
                                <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">규모 구분</span>
                                <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">대규모(000원)</span>
                            </div>
                            <div className="flex flex-col gap-2 min-w-[77px]">
                                <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">나의 역할</span>
                                <span className="text-[16px] font-medium text-[#1E293B] font-plusjakartasans">PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 메모리 관리하기 버튼 */}
            <button
                className="bg-[#1E293B] text-white rounded-[12px] px-8 py-3 text-[18px] font-semibold hover:bg-[#334155] transition mb-2"
                onClick={() => setOpenMemory(true)}
            >
                메모리 관리하기
            </button>

            {/* 적용/취소 버튼 */}
            <div className="flex flex-row gap-6 mt-8">
                <button className="w-[76px] h-[47px] bg-[#162550] rounded-[10px] flex items-center justify-center text-white text-[18px] font-semibold font-pretendard">적용</button>
                <button className="w-[76px] h-[47px] bg-[#A6A6A6] rounded-[10px] flex items-center justify-center text-white text-[18px] font-semibold font-pretendard">취소</button>
            </div>

            {/* Memory 모달 */}
            {openMemory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <Memory onClose={() => setOpenMemory(false)} />
                </div>
            )}
        </div>
    )
}