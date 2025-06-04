// frontend/src/components/common/CommonInputField.tsx
import React from 'react';

interface CommonInputFieldProps {
  id: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function CommonInputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}: CommonInputFieldProps) {
  const labelClasses = `
    w-[120px]                   /* 너비 */
    font-dmsans                 /* 글꼴 */
    font-bold                   /* 글꼴 굵기 */
    text-[18px]                 /* 글꼴 크기 */
    leading-[1.33em]            /* 줄 간격 */
    tracking-[-0.8%]            /* 글자 간격 */
    text-[#1E293B]              /* 글꼴 색상 */
    flex-shrink-0               /* flex 컨테이너 안에서 내용이 길어져도 줄어들지 않게 함 */
  `.replace(/\s+/g, ' ');

  const inputClasses = `
    w-[398px]                   /* 너비 */
    h-[70px]                    /* 높이 */
    mt-[16px]                   /* 위쪽 마진 */
    px-6                        /* padding-left/right (좌우 패딩): 24픽셀 */
    py-4                        /* padding-top/bottom (상하 패딩): 16픽셀 */
    ml-[16px]                   /* 인풋 필드의 왼쪽 마진: 라벨과의 간격 */
    text-[18px]                 /* 글꼴 크기 */
    bg-white/55                 /* 배경색(투명도) */
    rounded-full                /* 모서리 둥글게 */
    border                      /* 테두리 */
    border-[#CDCDCD]            /* 테두리 색상 */
    focus:border-[#122250]      /* 포커스 시 테두리 색상 */
  `.replace(/\s+/g, ' ');

  const containerClasses = `
    flex
    items-center
    w-[534px]
  `.replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      <label htmlFor={id} className={`${labelClasses}`}>
      {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClasses}`}
      />
    </div>
  );
}