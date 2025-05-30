// frontend/src/components/common/AuthButton.tsx
import React from 'react';

interface AuthButtonProps {
  children: React.ReactNode; 
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset'; 
  className?: string;
}

export default function AuthButton({ children, onClick, type = 'button', className }: AuthButtonProps) {
  const baseClasses = `
    rounded-[1234px]            /* 모서리 둥글게 */
    bg-[#122250]                /* 배경색 */
    text-white                  /* 글꼴 색상 */
    px-10                       /* 좌우 패딩 */
    h-[69px]                    /* 높이 */
    w-[257px]                   /* 너비 */
    flex                        /* flexbox 컨테이너 */
    items-center                /* 세로 중앙 정렬 */
    justify-center              /* 가로 중앙 정렬 */
    border-none                 /* 테두리 없음 */
    cursor-pointer              /* 마우스 커서 */
    font-sourcecodepro          /* 글꼴 */
    font-bold                   /* 글꼴 굵기 */
    text-[18px]                 /* 글꼴 크기 */
    leading-[1.11em]            /* 줄 간격 */
    tracking-[-0.6%]            /* 글자 간격 */
    text-center                 /* 텍스트 정렬 */
  `.replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className || ''}`}
    >
      {children}
    </button>
  );
}