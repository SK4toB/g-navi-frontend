// frontend/src/components/common/InputField.tsx
import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string; // "text", "password", "email" 등
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  // 추가적인 Tailwind 클래스를 외부에서 받을 경우를 대비
  className?: string; // input 필드 자체에 추가 클래스
  labelClassName?: string; // label에 추가 클래스
  containerClassName?: string; // 전체 input 그룹 컨테이너에 추가 클래스 (예: margin-bottom)
}

export default function AuthInputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
  labelClassName,
  containerClassName
}: InputFieldProps) {
  // 공통 label 스타일
  const baseLabelClasses = "font-plusjakartasans font-bold text-[18px] leading-[1.33em] tracking-[-0.8%] text-[#1E293B] block mb-[8px] text-right";

  // 공통 input 필드 스타일
  const baseInputClasses = "rounded-full px-6 py-4 border border-[#CDCDCD] bg-white/55 w-full text-[18px] h-[70px] focus:outline-none";

  return (
    <div className={`w-full max-w-[398px] ${containerClassName || ''}`}> {/* 공통 컨테이너 너비와 외부 클래스 병합 */}
      <label htmlFor={id} className={`${baseLabelClasses} ${labelClassName || ''}`}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseInputClasses} ${className || ''}`}
      />
    </div>
  );
}