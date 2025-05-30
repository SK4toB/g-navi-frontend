// frontend/src/components/common/AuthButton.tsx
import React from 'react';

interface AuthButtonProps {
  children: React.ReactNode; // 버튼 내부 텍스트나 다른 요소
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset'; // 버튼 타입
  // 필요하다면, 외부에서 추가적인 Tailwind 클래스를 받을 수 있도록 className prop 유지
  className?: string;
}

export default function AuthButton({ children, onClick, type = 'button', className }: AuthButtonProps) {
  // 로그인 및 회원가입 버튼에 공통적으로 적용될 Tailwind 클래스 정의
  const baseClasses = "rounded-[1234px] bg-[#122250] text-white px-10 h-[69px] w-[257px] flex items-center justify-center border-none cursor-pointer font-sourcecodepro font-bold text-[18px] leading-[1.11em] tracking-[-0.6%] text-center";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className || ''}`} // 기본 클래스와 외부에서 전달받은 클래스 병합
    >
      {children}
    </button>
  );
}