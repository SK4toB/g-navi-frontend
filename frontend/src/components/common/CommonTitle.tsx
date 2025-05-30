// frontend/src/components/common/CommonTitle.tsx
import React from 'react';

interface CommonTitleProps {
 children: React.ReactNode; 
}

export default function CommonTitle({ children }: CommonTitleProps) {
  const titleClasses = `
    font-dmsans                 /* 글꼴 */
    font-bold                   /* 글꼴 굵기 */
    text-[50px]                 /* 글꼴 크기 */
    text-[#122250]              /* 글꼴 색 */
    leading-[0.48em]            /* 줄 간격 */
    tracking-[-0.8%]            /* 글자 간격 */
    text-center                 /* 텍스트 정렬 */
    mb-[160px]                  /* margin-bottom (아래쪽 여백) */
`.replace(/\s+/g, ' ');  

  return (
    <h1 className={titleClasses}>
      {children}
    </h1>
  );
}