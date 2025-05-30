import React from 'react';
import AuthInputField from '../components/common/AuthInputField';
import AuthButton from '../components/common/Button';
import PageTitle from '../components/common/PageTitle';

// 폼 데이터의 타입을 정의하는 인터페이스
interface LoginFormData {
  employeeId: string;
  password: string;
}

export default function Login() {
  // 폼 데이터 상태를 하나의 객체로 관리
  const [formData, setFormData] = React.useState<LoginFormData>({
    employeeId: '',
    password: '',
  });

  // 입력 필드 변경 핸들러: 동적으로 상태 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  // 백엔드 API 요청을 고려한 로그인 핸들러 샘플
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    console.log("로그인 버튼 클릭됨");
    console.log("로그인 시도 데이터:", formData);

    // 실제 API 요청 로직 (가상 코드)
    try {
      // API 엔드포인트 URL (예시)
      // const API_URL = '/api/login';
      // const response = await fetch(API_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   console.log('로그인 성공:', data);
      //   // 로그인 성공 시 리디렉션 또는 상태 업데이트 (예: navigate('/home'))
      // } else {
      //   console.error('로그인 실패:', data.message || '알 수 없는 오류');
      //   // 로그인 실패 시 오류 메시지 표시
      // }

      // 현재는 API가 없으므로 성공/실패 시나리오를 console.log로만 표현
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기 시뮬레이션

      if (formData.employeeId === 'test' && formData.password === 'password') {
        console.log('가상 로그인 성공!');
        // 성공 시 리디렉션 예시 (react-router-dom의 useNavigate 훅 사용)
        // const navigate = useNavigate();
        // navigate('/mypage');
      } else {
        console.log('가상 로그인 실패: 사번 또는 비밀번호가 올바르지 않습니다.');
      }

    } catch (error) {
      console.error('네트워크 오류 또는 기타 예외:', error);
      // 사용자에게 네트워크 오류 메시지 표시
    }
  };

  // 폼 필드 정의를 배열로 만들어서 JSX 반복을 줄임
  const formFields = [
    { id: 'employeeId', label: '사번', type: 'text', value: formData.employeeId, containerClassName: 'mb-[24px]' },
    { id: 'password', label: '비밀번호', type: 'password', value: formData.password, containerClassName: 'mb-[32px]' },
  ];

  return (
    // 전체 컨테이너를 flexbox로 설정하여 자식 요소들을 가운데 정렬
    // min-h-screen: 최소 화면 높이를 보장하여 수직 중앙 정렬이 의미 있도록 함
    // bg-white: 배경색 흰색
    // p-10: 패딩 (Figma 디자인과 유사하게)
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10">
      {/* 페이지 타이틀 컴포넌트 사용 */}
      <PageTitle>Login</PageTitle>

      {/* 폼 컨테이너: 너비 제한 및 내부 요소 중앙 정렬 */}
      {/* w-full: 부모 너비의 100% 차지, max-w-[398px]: 최대 너비 제한 */}
      {/* flex flex-col items-center: 내부 요소들을 세로로 정렬하고 가운데 맞춤 */}
      <form onSubmit={handleLogin} className="w-full max-w-[398px] flex flex-col items-center">
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
          로그인
        </AuthButton>
      </form>
    </div>
  );
}