// frontend/src/components/form/SignupForm.tsx
import React from 'react';
import CommonInputField from '../common/CommonInputField';
import CommonButton from '../common/CommonButton';
import { authApi, type SignupData } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [formData, setFormData] = React.useState<SignupData>({
    name: '',
    email: '',
    password: '',
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

    try {
      const response = await authApi.signup(formData);
      
      if (response.isSuccess) {
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
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSignup} className="h-[300px] flex flex-col items-center">
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
        <div className='flex flex-col flex-grow items-center justify-end'>
          <CommonButton type="submit">
            회원가입
          </CommonButton>
        </div>
      </form>
    </div>
  );
}