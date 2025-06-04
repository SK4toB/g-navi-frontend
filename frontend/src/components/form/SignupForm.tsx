// frontend/src/components/form/SignupForm.tsx
import React from 'react';
import CommonInputField from '../common/CommonInputField';
import CommonButton from '../common/CommonButton';
import { authApi } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

interface SignupFormData {
  name: string;
  employeeId: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const [formData, setFormData] = React.useState<SignupFormData>({
    name: '',
    employeeId: '',
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

    try {
      const response = await authApi.signup(formData);
      console.log("회원가입 성공:", response);
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 실패");
    }
  };

  const formFields = [
    { id: 'name', label: '이름', type: 'text', value: formData.name },
    { id: 'employeeId', label: '사번', type: 'text', value: formData.employeeId },
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