// frontend/src/pages/Signup.tsx
import React from 'react';
import CommonTitle from '../components/common/CommonTitle';
import CommonInputField from '../components/common/CommonInputField';
import CommonButton from '../components/common/CommonButton';
import { authApi } from '../api/auth';

interface SignupFormData {
  name: string;
  email: string;
  employeeId: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const [formData, setFormData] = React.useState<SignupFormData>({
    name: '',
    email: '',
    employeeId: '',
    password: '',
    confirmPassword: '',
  });

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
      console.error(error);
    }
  };

  const formFields = [
    { id: 'name', label: '이름', type: 'text', value: formData.name },
    { id: 'email', label: '이메일', type: 'email', value: formData.email },
    { id: 'employeeId', label: '사번', type: 'text', value: formData.employeeId },
    { id: 'password', label: '비밀번호', type: 'password', value: formData.password },
    { id: 'confirmPassword', label: '비밀번호 확인', type: 'password', value: formData.confirmPassword },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
      <CommonTitle>Sign Up</CommonTitle>
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

      <CommonButton type="submit" onClick={handleSignup}>
        회원가입
      </CommonButton>
    </div>
  );
}