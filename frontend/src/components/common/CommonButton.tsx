// frontend/src/components/common/CommonButton.tsx
import React from 'react';

interface CommonButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type: 'submit' | 'button' | 'reset';
  icon?: string;
  width?: number;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

export default function CommonButton({ children, onClick, type, icon,
  width = 240 }: CommonButtonProps) {
  const buttonClasses = `
    group                       /* 호버 효과를 위한 그룹 */
    relative                    /* 상대 위치 */
    flex                        /* flexbox 컨테이너 */
    items-center                /* 세로 중앙 정렬 */
    justify-center              /* 가로 중앙 정렬 */
    h-[60px]                    /* 높이 */
    px-6                        /* 좌우 패딩 증가 */
    font-semibold               /* 글꼴 굵기 */
    text-[16px]                 /* 글꼴 크기 */
    text-center                 /* 텍스트 정렬 */
    text-white                  /* 글꼴 색상 */
    bg-gradient-to-r            /* 그라데이션 배경 */
    from-indigo-600             /* 시작 색상 */
    to-purple-600               /* 끝 색상 */
    hover:from-indigo           /* 호버시 시작 색상 */
    hover:to-purple-500/90      /* 호버시 끝 색상 */
    backdrop-blur-sm            /* 배경 블러 */
    border                      /* 테두리 */
    border-white/20             /* 테두리 색상 */
    rounded-3xl                 /* 모서리 둥글게 */
    shadow-lg                   /* 기본 그림자 */
    hover:shadow-2xl            /* 호버시 그림자 */
    hover:shadow-indigo-500/40  /* 호버시 컬러 그림자 */
    cursor-pointer              /* 마우스 커서 */
    gap-3                       /* 아이템 간격 */
    transition-all              /* 모든 전환 효과 */
    duration-300                /* 전환 시간 */
    transform                   /* 변형 효과 */
    hover:scale-105             /* 호버시 확대 */
  `.replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      style={{ width: `${width}px` }}
    >
      {icon ? (
        <>
          <span className="relative z-10">{children}</span>
          <span 
            className="w-5 h-5 flex items-center justify-center relative z-10 transition-transform group-hover:translate-x-1"
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        </>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </button>
  );
}