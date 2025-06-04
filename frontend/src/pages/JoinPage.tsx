// frontend/src/pages/JoinPage.tsx
import { useState } from 'react';
import CommonTitle from '../components/common/CommonTitle';
import LoginForm from '../components/form/LoginForm';
import SignupForm from '../components/form/SignupForm';

export default function JoinPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const toggleMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* 타이틀 */}
      <CommonTitle>{mode === 'login' ? '로그인' : '회원가입'}</CommonTitle>

      {/* 로그인 / 회원가입 폼 */} 
      {mode === 'login' ? (
        <LoginForm />
      ) : (
        <SignupForm />
      )}

      {/* 토글 텍스트 */}
      {mode === 'login' ? (
        <p
          className="cursor-pointer text-main-color underline"
          onClick={() => toggleMode('signup')}
        >
          회원가입하기
        </p>
      ) : (
        <p
          className="cursor-pointer text-main-color underline"
          onClick={() => toggleMode('login')}
        >
          로그인하기
        </p>
      )}
    </div>
  );
}