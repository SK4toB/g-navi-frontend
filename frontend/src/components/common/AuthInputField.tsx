// frontend/src/components/common/AuthInputField.tsx
import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string; 
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string; 
  labelClassName?: string; 
  containerClassName?: string; 
}

export default function AuthInputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  className,
  labelClassName,
  containerClassName
}: InputFieldProps) {
  const baseLabelClasses = `
    font-dmsans                 /* 글꼴 */
    font-bold                   /* 글꼴 굵기 */
    text-[18px]                 /* 글꼴 크기 */
    leading-[1.33em]            /* 줄 간격 */
    tracking-[-0.8%]            /* 글자 간격 */
    text-[#1E293B]              /* 글꼴 색상 */
    flex-shrink-0               /* flex 컨테이너 안에서 내용이 길어져도 줄어들지 않게 함 */
  `.replace(/\s+/g, ' ');

  const baseInputClasses = `
    rounded-full                /* 모서리 둥글게 */
    px-6                        /* padding-left/right (좌우 패딩): 24픽셀 */
    py-4                        /* padding-top/bottom (상하 패딩): 16픽셀 */
    border                      /* 테두리 */
    border-[#CDCDCD]            /* 테두리 색상 */
    text-[18px]                 /* 글꼴 크기 */
    w-[398px]                   /* 너비 */
    h-[70px]                    /* 높이 */
    bg-white/55                 /* 배경색(투명도) */
    ml-[16px]                   /* 인풋 필드의 왼쪽 마진: 라벨과의 간격 */

  `.replace(/\s+/g, ' ');

  return (
    <div className={`flex items-center w-[534px] ${containerClassName || ''}`}>
      <label htmlFor={id} className={`${baseLabelClasses} ${labelClassName || ''} w-[120px]`}>
      {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseInputClasses} ${className || ''} flex-1`}
      />
    </div>
  );
}