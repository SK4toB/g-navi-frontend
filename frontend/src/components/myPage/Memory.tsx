import React from "react";

const memories = [
  "사용자는 SW 회사에서 백엔드 개발자로 일한 지 1년 차다.\n주 언어는 Python이며, Django와 FastAPI 경험이 있다.",
  "사용자는 React 기반 프론트엔드 개발자로 3년차다.\n백엔드 기술에도 관심이 많아 Node.js와 Express로 사이드 프로젝트를 진행 중이다.",
  "데이터 기반의 의사결정 역량을 키우기 위해 SQL과 Amplitude 사용을 학습 중이다.\n장기적으로는 PO(Product Owner)나 PM(Product Manager)으로의 전환을 희망한다.",
  "Java 기반 서버 개발자로 7년차이며, 현재는 팀 리드 역할도 맡고 있다.\n기술 리더십과 멘토링에 관심이 많고, 코드 품질과 아키텍처 개선에 열정을 가지고 있다.",
  "사용자는 현재 SW QA 엔지니어로 일하고 있으나, 머신러닝과 자연어처리에 관심이 많아 관련 커리어 전환을 준비 중이다.",
  "사용자는 원래 UI/UX 디자이너였지만, 현재는 프로토타이핑과 인터랙션 구현에 더 흥미를 느끼고 있다."
];

export default function  Memory({ onClose }: { onClose?: () => void }) {
  return (
    <div className="bg-white rounded-[30px] w-[968px] h-[641px] flex flex-col p-0 shadow-lg">
      {/* 상단 바 */}
      <div className="flex flex-row justify-between items-center w-[846px] mx-auto mt-[44px] mb-0">
        <div className="flex flex-col justify-center items-center px-6 py-2.5 w-[138px]">
          <span className="font-plusjakartasans font-bold text-[22px] leading-[1.09] text-[#1E293B] text-center">저장된 메모리</span>
        </div>
        <button
          className="w-[35px] h-[35px] flex items-center justify-center hover:bg-gray-100 rounded-full"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5L15 15M15 5L5 15" stroke="#1D1B20" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* 메모리 리스트 */}
      <div className="flex flex-col items-center justify-center flex-1 mt-[40px]">
        <div className="flex flex-col gap-4 w-[825px]">
          {memories.map((text, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center w-full bg-white border-b border-[#E2E8F0] p-2.5 gap-2.5"
            >
              <span className="font-poppins text-[16px] text-[#111827] whitespace-pre-line">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 