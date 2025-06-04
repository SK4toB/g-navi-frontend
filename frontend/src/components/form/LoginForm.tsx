// frontend/src/components/form/LoginForm.tsx
import React from 'react';
import CommonInputField from '../common/CommonInputField';
import CommonButton from '../common/CommonButton';
import { authApi } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  employeeId: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = React.useState<LoginFormData>({
    employeeId: '',
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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await authApi.login(formData);
      console.log("로그인 성공:", response);
      navigate('/');
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패");
    }
  };

  const formFields = [
    { id: 'employeeId', label: '사번', type: 'text', value: formData.employeeId },
    { id: 'password', label: '비밀번호', type: 'password', value: formData.password },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleLogin} className="flex flex-col items-center">
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
          로그인
        </CommonButton>
      </form>
    </div>
  );
}