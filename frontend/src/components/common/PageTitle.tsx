// frontend/src/components/common/PageTitle.tsx
import React from 'react';

interface PageTitleProps {
  children: React.ReactNode; // 타이틀 텍스트
  // 추가적인 Tailwind 클래스를 외부에서 받을 경우를 대비
  className?: string;
}

export default function PageTitle({ children, className }: PageTitleProps) {
  // 공통 h1 타이틀 스타일
  const baseTitleClasses = "font-dmsans font-bold text-[50px] leading-[0.48em] tracking-[-0.8%] text-center text-[#122250] mb-[60px]";

  return (
    <h1 className={`${baseTitleClasses} ${className || ''}`}>
      {children}
    </h1>
  );
}