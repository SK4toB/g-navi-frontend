// frontend/src/api/client.ts
const API_BASE_URL = 'http://localhost:8080/api'; // 백엔드 API 기본 URL

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const token = localStorage.getItem('accessToken');
  
  // Headers 객체를 사용하여 헤더를 안전하게 구성
  const headers = new Headers(options?.headers); // 기존 헤더를 Headers 객체로 변환

  if (token) {
    headers.set('Authorization', `Bearer ${token}`); // set 메서드를 사용하여 Authorization 헤더 추가
  }
  
  // Content-Type이 JSON이 아니라면 명시적으로 설정
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers, // Headers 객체를 그대로 전달
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('인증 실패: 토큰 만료 또는 유효하지 않음');
      // 여기에 주스탠드 logout 액션 호출 및 로그인 페이지 리디렉션 로직 추가
      // 예시:
      // import useAuthStore from '../store/authStore';
      // useAuthStore.getState().logout();
      // window.location.href = '/login'; 
    }
    const errorData = await response.json().catch(() => ({ message: '서버 오류' }));
    throw new Error(errorData.message || 'API 요청 실패');
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => apiFetch<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, data?: any, options?: RequestOptions) => apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
  put: <T>(endpoint: string, data?: any, options?: RequestOptions) => apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }),
  delete: <T>(endpoint: string, options?: RequestOptions) => apiFetch<T>(endpoint, { method: 'DELETE', ...options }),
};