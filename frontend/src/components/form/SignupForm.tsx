// frontend/src/components/form/SignupForm.tsx
import React from 'react';
import CommonInputField from '../common/CommonInputField';
import CommonButton from '../common/CommonButton';
import { authApi, type SignupData } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

// SignupData를 확장해서 confirmPassword 추가
interface SignupFormData extends SignupData {
  confirmPassword: string;
}

export default function SignupForm() {
  const [formData, setFormData] = React.useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const { confirmPassword, ...signupPayload } = formData;
      const response = await authApi.signup(signupPayload);
      
      if (response.isSuccess) {
        console.log("회원가입 성공:", response);
        alert(`회원가입이 완료되었습니다. ${response.result.message}`);
        navigate('/join');
      } else {
        alert(`회원가입 실패: ${response.message}`);
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  const formFields = [
    { id: 'name', label: '이름', type: 'text', value: formData.name },
    { id: 'email', label: '이메일', type: 'email', value: formData.email },
    { id: 'password', label: '비밀번호', type: 'password', value: formData.password },
    { id: 'confirmPassword', label: '비밀번호 확인', type: 'password', value: formData.confirmPassword },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSignup} className="flex flex-col items-center">
        {formFields.map(field => (
          <CommonInputField
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            value={field.value}
            onChange={handleChange}
          />
        ))}
        <div className='mt-[50px]'></div>
        <CommonButton type="submit">
          회원가입
        </CommonButton>
      </form>
    </div>
  );
}