interface CardItemProps {
  label: string;
  description: React.ReactNode;
}

export default function RecommendationCards() {
  const CardItem: React.FC<CardItemProps> = ({ label, description }) => {
    return (
      <div
        className="
          w-[256px] h-[78px] bg-[#FBFBFF] rounded-[10px]
          flex flex-col box-border p-[12px] cursor-pointer
        "
        style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.08)' }}
      >
        <span className={`
          text-[#122250] text-[14px] font-bold leading-[1.4em] font-pretendard
        `}>
          {label}
        </span>
        <p className="
          mt-[8px] text-center text-[#090909] text-[12px] leading-[1.4em] font-pretendard
        ">
          {description}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-row gap-[23px] mt-[27px]">
      <CardItem
        label="Career path"
        description={<>나와 유사한 경력을 가진 선배 구성원들은<br />어떤 경로로 성장 했어?</>}
      />
      <CardItem
        label="Skills"
        description={<>지금 가진 기술 스택으로 어떤 직무로 나아갈 수 있는지 알려줘</>}
      />
      <CardItem
        label="Project"
        description={<>내 프로젝트 경험을 기반으로 앞으로 쌓아야 할 프로젝트를 추천해줘</>}
      />
    </div>
  );
}