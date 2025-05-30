// frontend/src/pages/Login.tsx
import React from 'react';
// import styles from './Login.module.css'; // 더 이상 Login.module.css는 필요 없습니다.
import AuthInputField from '../components/common/AuthInputField';
import AuthButton from '../components/common/AuthButton';
import PageTitle from '../components/common/PageTitle';

export default function Login() {
  const [employeeId, setEmployeeId] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    console.log("로그인 버튼 클릭됨");
    console.log("사번:", employeeId);
    console.log("비밀번호:", password);
    // 로그인 로직 처리 (API 호출 등)
  };

  return (
    // 전체 컨테이너는 Tailwind 클래스로 직접 스타일링
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
      <PageTitle>Login</PageTitle> {/* PageTitle 컴포넌트 사용 */}

      <form onSubmit={handleLogin} className="w-full max-w-[398px] flex flex-col items-center">
        {/* 사번 입력 필드 */}
        <AuthInputField
          id="employeeId"
          label="사번"
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          containerClassName="mb-[24px]" // AuthInputField 컨테이너에 마진 적용
        />
        {/* 비밀번호 입력 필드 */}
        <AuthInputField
          id="password"
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          containerClassName="mb-[32px]" // AuthInputField 컨테이너에 마진 적용
        />
        {/* 로그인 버튼 */}
        <AuthButton type="submit">
          로그인
        </AuthButton>
      </form>
    </div>
  );
}