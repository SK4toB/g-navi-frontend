import React from 'react';
import AuthInputField from '../components/common/AuthInputField';
import AuthButton from '../components/common/AuthButton';
import PageTitle from '../components/common/PageTitle';

// 폼 데이터의 타입을 정의하는 인터페이스
interface SignupFormData {
  name: string;
  email: string;
  employeeId: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  // 1. 폼 데이터 상태를 하나의 객체로 관리
  const [formData, setFormData] = React.useState<SignupFormData>({
    name: '',
    email: '',
    employeeId: '',
    password: '',
    confirmPassword: '',
  });

  // 입력 필드 변경 핸들러: 동적으로 상태 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSignup = (event: React.FormEvent) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    console.log("회원가입 버튼 클릭됨");
    console.log("회원가입 데이터:", formData);
    // 회원가입 로직 처리 (API 호출 등)
    // 예: if (formData.password !== formData.confirmPassword) { alert('비밀번호가 일치하지 않습니다.'); return; }
  };

  // 2. 폼 필드 정의를 배열로 만들어서 JSX 반복을 줄임
  // 각 필드의 label, id, type, containerClassName 등을 정의
  const formFields = [
    { id: 'name', label: '이름', type: 'text', value: formData.name, containerClassName: 'mb-[24px]' },
    { id: 'email', label: '이메일', type: 'email', value: formData.email, containerClassName: 'mb-[24px]' },
    { id: 'employeeId', label: '사번', type: 'text', value: formData.employeeId, containerClassName: 'mb-[24px]' },
    { id: 'password', label: '비밀번호', type: 'password', value: formData.password, containerClassName: 'mb-[24px]' },
    // 비밀번호 확인 필드만 마진이 다르므로 따로 정의하거나, 조건부 클래스를 사용할 수 있음
    { id: 'confirmPassword', label: '비밀번호 확인', type: 'password', value: formData.confirmPassword, containerClassName: 'mb-[32px]' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
      <PageTitle>Sign Up</PageTitle>

      <form onSubmit={handleSignup} className="w-full max-w-[398px] flex flex-col items-center">
        {/* 폼 필드들을 배열을 순회하며 렌더링 */}
        {formFields.map(field => (
          <AuthInputField
            key={field.id} // 리스트 렌더링 시 key prop은 필수
            id={field.id}
            label={field.label}
            type={field.type}
            value={field.value}
            onChange={handleChange} // 공통 변경 핸들러 사용
            containerClassName={field.containerClassName}
          />
        ))}

        <AuthButton type="submit">
          회원가입
        </AuthButton>
      </form>
    </div>
  );
}