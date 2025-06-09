# Dockerfile (프로젝트 루트 디렉토리: g-navi-frontend/ 에 위치)

# --- Stage 1: 빌드 단계 ---
    FROM node:20-alpine AS build

    # 컨테이너 내 작업 디렉토리를 /app으로 설정합니다.
    WORKDIR /app
    
    # `g-navi-frontend` 프로젝트의 `frontend` 디렉토리 내용을 /app으로 복사합니다.
    # Dockerfile이 프로젝트 루트에 있으므로 `frontend/` 경로를 사용합니다.
    COPY frontend/package*.json ./
    COPY frontend/vite.config.ts ./
    
    # **수정된 부분:**
    # 이전 빌드에서 남은 node_modules와 package-lock.json을 삭제하여 클린 상태를 만듭니다.
    # 이는 Docker 빌드 캐시를 우회하고 의존성을 완전히 새로 설치하기 위함입니다.
    RUN rm -rf node_modules package-lock.json
    
    # Node.js 의존성 설치
    # npm ci 대신 npm install을 사용합니다.
    # npm install은 현재 Docker 컨테이너 환경에 맞춰 의존성을 정확하게 재평가하고 설치합니다.
    RUN npm install
    
    # 나머지 프론트엔드 소스 코드를 복사합니다.
    COPY frontend/. .
    
    # Vite를 사용하여 애플리케이션을 빌드합니다.
    RUN npm run build
    
    
    # --- Stage 2: 서빙 단계 (경량화를 위해 Nginx 사용) ---
    # 경량 웹 서버인 Nginx의 Alpine 버전을 사용합니다.
    FROM nginx:stable-alpine
    
    # Nginx 기본 설정 파일을 제거하고,
    # 빌드 단계에서 생성된 정적 파일들을 Nginx의 기본 웹 루트 디렉토리로 복사합니다.
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # 개발 서버(예: Vite dev server)와는 달리, 빌드된 정적 파일은 일반적으로 80 포트로 서비스됩니다.
    EXPOSE 80
    
    # Nginx 웹 서버를 시작합니다.
    CMD ["nginx", "-g", "daemon off;"]