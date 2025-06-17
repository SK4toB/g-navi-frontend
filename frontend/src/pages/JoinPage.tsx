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
      <div className="flex flex-col items-center">
        {mode === 'login' ? <LoginForm /> : <SignupForm />}
        
        <div className="mt-4 w-full max-w-sm text-center">
          <p className="text-gray-600">
            {mode === 'login' ? '아직 회원이 아니신가요?' : '이미 회원이신가요?'}
            <span
              className="cursor-pointer text-main-color underline hover:text-opacity-80 transition-colors ml-2"
              onClick={() => toggleMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? '회원가입하기' : '로그인하기'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}