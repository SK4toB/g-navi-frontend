# G-Navi 프론트엔드 프로젝트

이 프로젝트는 React + TypeScript + Vite 기반의 커리어 내비게이션 서비스 프론트엔드입니다.  
기본적으로 Tailwind CSS와 CSS Modules를 사용하며, 재사용 가능한 컴포넌트 구조를 지향합니다.

## 🗂 디렉토리 구조

src/
├── pages/ # 라우터 경로에 대응하는 전체 화면 단위 (ex. Home, Login, Mypage)
├── layouts/ # 공통 레이아웃 컴포넌트 (ex. MainLayout)
├── components/ # UI 컴포넌트들
│ ├── common/ # 공통 버튼, 입력창 등 재사용 가능한 요소
│ ├── home/ # Home 전용 UI 구성요소
│ ├── rightBar/ # 사이드바 내부 UI 컴포넌트
│ └── modals/ # 전역에서 사용 가능한 모달
├── router.tsx # React Router 경로 설정
├── main.tsx # 애플리케이션 진입점
└── index.css # Tailwind 및 전역 스타일

markdown
복사
편집

## 🧩 주요 기술 스택

- React 19 + TypeScript
- Vite
- React Router DOM
- Tailwind CSS + CSS Modules
- ESLint + Prettier

## 🚀 개발 명령어

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 실행