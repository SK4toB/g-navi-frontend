import React from 'react';
import CommonTitle from '../components/common/CommonTitle';
import CommonInputField from '../components/common/CommonInputField';
import CommonButton from '../components/common/CommonButton';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  employeeId: string;
  password: string;
}

export default function Login() {
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
    console.log("로그인 버튼 클릭됨");

    try {
      const response = await authApi.login(formData);
      console.log("로그인 성공:", response);
    } catch (error) {
      console.error(error);
    }
  };

  const formFields = [
    { id: 'employeeId', label: '사번', type: 'text', value: formData.employeeId },
    { id: 'password', label: '비밀번호', type: 'password', value: formData.password },
  ];

  return (
    <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
      <CommonTitle>Login</CommonTitle>
      <div className="flex flex-col items-center justify-center">
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

        <CommonButton type="submit" onClick={handleLogin}>
          로그인
        </CommonButton>

        <div className="text-center">
          <p onClick={() => navigate('/signup')}>회원가입하기</p>
        </div>

      </div>
    </div>
  );
}