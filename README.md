# G-Navi 프론트엔드 프로젝트

G-Navi 커리어 내비게이션 서비스의 프론트엔드 프로젝트입니다. React, TypeScript, Vite 기반이며, 재사용 가능한 컴포넌트 구조와 Tailwind CSS, CSS Modules를 사용하여 구축되었습니다.

## 시작하기

### 필수 조건

* Node.js (>= 18.0.0)
* npm

### 설치 및 실행

1.  저장소 복제:
    ```bash
    git clone <your-repository-url>
    cd g-navi-frontend/frontend
    ```
2.  의존성 설치:
    ```bash
    npm install
    ```
3.  개발 서버 실행:
    ```bash
    npm run dev
    ```
    (일반적으로 `http://localhost:5173`에서 실행됩니다.)
4.  프로덕션 빌드:
    ```bash
    npm run build
    ```
5.  코드 린팅:
    ```bash
    npm run lint
    ```

## 주요 기술 스택

* **React 19 + TypeScript**: 동적이고 타입 안전한 UI.
* **Vite**: 빠른 개발 환경 제공.
* **React Router DOM**: 클라이언트 측 라우팅.
* **Tailwind CSS + CSS Modules**: 유틸리티 우선 스타일링 및 컴포넌트별 스타일.
* **ESLint + Prettier**: 코드 품질 및 포맷팅.
* **Zustand**: 간결하고 유연한 상태 관리.

## 프로젝트 구조

주요 디렉토리 구조는 다음과 같습니다:

src/
├── pages/            # 라우터 경로별 전체 화면 컴포넌트 (Home, Login, Mypage 등)
├── layouts/          # 공통 레이아웃 (MainLayout)
├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── common/       # 공통 버튼, 입력창 등
│   ├── chat/         # 채팅 관련 UI
│   ├── home/         # Home 페이지 전용 UI
│   ├── myPage/       # 마이페이지 전용 UI
│   ├── newChat/      # 새 채팅 시작 UI
│   └── modals/       # 전역 모달
├── api/              # 백엔드 API 통신 관련 코드 (auth.ts, client.ts)
├── store/            # Zustand를 이용한 상태 관리 (authStore.ts, chatStore.ts)
├── router.tsx        # React Router 경로 설정
├── main.tsx          # 애플리케이션 진입점
└── index.css         # 전역 스타일 및 Tailwind CSS


## 코딩 컨벤션 및 모범 사례

* **컴포넌트 기반 아키텍처**: 모듈화된 재사용 가능한 컴포넌트 사용을 지향합니다.
* **TypeScript**: 모든 코드에 타입스크립트를 사용하여 타입 안정성을 확보합니다.
* **스타일링**:
    * **Tailwind CSS**: 인라인 유틸리티 클래스를 사용하여 빠르게 스타일을 적용합니다.
    * **CSS Modules**: 컴포넌트별 고유한 스타일이 필요할 때 사용합니다 (예: `ChatMainContent.module.css`).
* **상태 관리**: Zustand를 활용하여 애플리케이션 상태를 관리하며, 상태는 불변성을 유지하며 업데이트됩니다.
* **API 통신**: `src/api/client.ts`를 통해 중앙 집중식으로 관리하며, 토큰 관리 및 오류 처리를 포함합니다.
* **라우팅**: React Router DOM (v7.6.1)을 사용하여 SPA (Single Page Application) 라우팅을 구현합니다.
* **코드 포맷팅**: ESLint와 Prettier를 통해 코드 스타일 일관성을 유지하고 잠재적 문제를 사전에 식별합니다.
* **명명 규칙**:
    * **컴포넌트**: `PascalCase` (예: `CommonButton.tsx`).
    * **파일**: 컴포넌트는 `PascalCase`, 유틸리티 파일은 `camelCase` (예: `auth.ts`, `chatStore.ts`).
    * **CSS Modules**: 클래스 이름은 `camelCase` (예: `chatTitle`).