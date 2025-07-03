// frontend/src/components/form/LoginForm.tsx
import React from 'react';
import CommonInputField from '../common/CommonInputField';
import CommonButton from '../common/CommonButton';
import { authApi, type LoginData } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [formData, setFormData] = React.useState<LoginData>({
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

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await authApi.login(formData);
      
      if (response.isSuccess) {
        
        // 역할에 따른 리다이렉트
        if (response.result.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert(`로그인 실패: ${response.message}`);
      }
    } catch (error) {
      alert(error.message)
    }
  };

  const formFields = [
    { id: 'email', label: '이메일', type: 'email', value: formData.email, placeholder: 'example@email.com'},
    { id: 'password', label: '비밀번호', type: 'password', value: formData.password, placeholder: '비밀번호를 입력하세요' },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleLogin} className="h-[300px] flex flex-col items-center">
        {formFields.map(field => (
          <CommonInputField
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            value={field.value}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
        ))}
        <div className='flex flex-col flex-grow items-center justify-end'>
          <CommonButton type="submit">
            로그인
          </CommonButton>
        </div>
      </form>
    </div>
  );
}