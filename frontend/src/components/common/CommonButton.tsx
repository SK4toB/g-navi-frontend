// frontend/src/components/common/CommonButton.tsx
import React from 'react';

interface CommonButtonProps {
  children: React.ReactNode; 
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type: 'submit' | 'button' | 'reset';
}

export default function CommonButton({ children, onClick, type }: CommonButtonProps) {
  const buttonClasses = `
    flex                        /* flexbox 컨테이너 */
    items-center                /* 세로 중앙 정렬 */
    justify-center              /* 가로 중앙 정렬 */
    w-[240px]                   /* 너비 */
    h-[60px]                    /* 높이 */
    px-10                       /* 좌우 패딩 */
    font-bold                   /* 글꼴 굵기 */
    text-[18px]                 /* 글꼴 크기 */
    text-center                 /* 텍스트 정렬 */
    text-[#FFFFFF]              /* 글꼴 색상 */
    bg-[#122250]                /* 배경색 */
    rounded-[1234px]            /* 모서리 둥글게 */
    border-none                 /* 테두리 없음 */
    cursor-pointer              /* 마우스 커서 */
  `.replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}