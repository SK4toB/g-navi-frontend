// frontend/src/components/conversation/RecommendationCards.tsx
import React from 'react';

interface CardItemProps {
  label: string;
  description: React.ReactNode;
  onClick: () => void;
}

interface RecommendationCardsProps {
  onCardClick: (message: string) => void;
}

export default function RecommendationCards({ onCardClick }: RecommendationCardsProps) {
  const CardItem: React.FC<CardItemProps> = ({ label, description, onClick }) => {
    const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 40 // 커서 위쪽 40px에 표시
      });
    };

    const handleMouseEnter = () => {
      setShowTooltip(true);
    };

    const handleMouseLeave = () => {
      setShowTooltip(false);
    };

    return (
      <div
        className="
          w-[256px] h-[86px] bg-[#FBFBFF] rounded-[10px]
          flex flex-col box-border p-[12px] cursor-pointer
          hover:bg-[#F0F0FF] transition-colors relative
        "
        style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.08)' }}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={`
          text-[#122250] text-[14px] font-bold
        `}>
          {label}
        </span>
        <p className="
          mt-[8px] text-center text-[#090909] text-[12px]
        ">
          {description}
        </p>
        
        {/* 마우스 커서 위치에 따른 툴팁 */}
        {showTooltip && (
          <div 
            className="absolute bg-gray-800 text-white text-sm px-3 py-1 rounded pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translateX(-50%)'
            }}
          >
            물어보기
          </div>
        )}
      </div>
    );
  };

  const handleCardClick = (message: string) => {
    onCardClick(message);
  };

  return (
    <div className="flex flex-row gap-[23px] mt-[27px] break-keep">
      <CardItem
        label="Career path"
        description={<>나와 유사한 경력을 가진 선배 구성원들은 어떤 경로로 성장 했어?</>}
        onClick={() => handleCardClick("나와 유사한 경력을 가진 선배 구성원들은 어떤 경로로 성장 했어?")}
      />
      <CardItem
        label="Skills"
        description={<>지금 가진 기술 스택으로 어떤 직무로 나아갈 수 있는지 알려줘</>}
        onClick={() => handleCardClick("지금 가진 기술 스택으로 어떤 직무로 나아갈 수 있는지 알려줘")}
      />
      <CardItem
        label="Project"
        description={<>내 프로젝트 경험을 기반으로 앞으로 쌓아야 할 프로젝트를 추천해줘</>}
        onClick={() => handleCardClick("내 프로젝트 경험을 기반으로 앞으로 쌓아야 할 프로젝트를 추천해줘")}
      />
    </div>
  );
}