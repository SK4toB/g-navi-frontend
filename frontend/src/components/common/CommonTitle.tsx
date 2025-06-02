// frontend/src/components/common/CommonTitle.tsx
import React from 'react';

interface CommonTitleProps {
 children: React.ReactNode; 
}

export default function CommonTitle({ children }: CommonTitleProps) {
  const titleClasses = `
    font-dmsans                 /* 글꼴 */
    font-bold                   /* 글꼴 굵기 */
    text-[40px]                 /* 글꼴 크기 */
    text-[#122250]              /* 글꼴 색 */
    text-center                 /* 텍스트 정렬 */
`.replace(/\s+/g, ' ');  

  return (
    <h1 className={titleClasses}>
      {children}
    </h1>
  );
}