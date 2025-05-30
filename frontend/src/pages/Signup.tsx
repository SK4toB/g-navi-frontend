// frontend/src/pages/Signup.tsx
import React from 'react';
import AuthInputField from '../components/common/AuthInputField';
import AuthButton from '../components/common/AuthButton';
import PageTitle from '../components/common/PageTitle';

export default function Signup() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    console.log("회원가입 버튼 클릭됨");
    console.log("이름:", name);
    console.log("이메일:", email);
    console.log("사번:", employeeId);
    console.log("비밀번호:", password);
    console.log("비밀번호 확인:", confirmPassword);
    // 회원가입 로직 처리 (API 호출 등)
  };

  return (
    // 전체 컨테이너는 Tailwind 클래스로 직접 스타일링
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
      <PageTitle>Sign Up</PageTitle> {/* PageTitle 컴포넌트 사용 */}

      <form onSubmit={handleSignup} className="w-full max-w-[398px] flex flex-col items-center">
        {/* 이름 입력 필드 */}
        <AuthInputField
          id="name"
          label="이름"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          containerClassName="mb-[24px]"
        />
        {/* 이메일 입력 필드 */}
        <AuthInputField
          id="email"
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          containerClassName="mb-[24px]"
        />
        {/* 사번 입력 필드 */}
        <AuthInputField
          id="employeeId"
          label="사번"
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          containerClassName="mb-[24px]"
        />
        {/* 비밀번호 입력 필드 */}
        <AuthInputField
          id="password"
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          containerClassName="mb-[24px]"
        />
        {/* 비밀번호 확인 입력 필드 */}
        <AuthInputField
          id="confirmPassword"
          label="비밀번호 확인"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          containerClassName="mb-[32px]" // Login의 비밀번호 필드 마진과 동일하게 mb-[32px] 적용
        />
        {/* 회원가입 버튼 */}
        <AuthButton type="submit">
          회원가입
        </AuthButton>
      </form>
    </div>
  );
}