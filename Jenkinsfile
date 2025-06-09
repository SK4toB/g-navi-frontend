pipeline {
    agent any

environment {
        // --- GitHub Repository 설정 ---
        GIT_URL = 'https://github.com/SK4toB/g-navi-frontend.git'
        GIT_BRANCH = 'main'

        GIT_ID = 'github-pat-for-g-navi'

        GIT_USER_NAME = 'gywns2zang9'
        GIT_USER_EMAIL = 'gywns2zang9@gmail.com'

        // --- Docker Image Registry 설정 (SKALA Harbor) ---
        IMAGE_REGISTRY_BASE = 'amdp-registry.skala-ai.com'

        IMAGE_HARBOR_PROJECT = 'skala25a'

        IMAGE_NAME = 'sk-gnavi4-fe'

        IMAGE_TAG_BASE = '1.0'

        DOCKER_CREDENTIAL_ID = 'skala-harbor-credential'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                // 'Pipeline Utility Steps' 플러그인이 설치되어 있지 않으므로 'cleanWs()' 대신 echo 사용.
                // 이 스테이지는 워크스페이스 정리의 의미를 남기기 위해 유지합니다.
                echo "Workspace cleanup step (cleanWs) is intentionally skipped or will be handled by plugin if available."
            }
        }

        // --- 'Clone Repository' 스테이지를 삭제합니다. ---
        // Jenkins Pipeline은 시작 시 자동으로 SCM (Git)에서 코드를 체크아웃합니다.
        // 따라서 수동으로 git clone을 시도하는 이 스테이지는 중복이며 오류의 원인이 됩니다.
        // 이 스테이지는 Jenkinsfile에서 완전히 삭제되었습니다.


        stage('Install Node.js Dependencies & Build Frontend') {
            steps {
                script {
                    // 이 스테이지는 현재 Dockerfile 내에서 Node.js 의존성 설치 및 프론트엔드 빌드를 처리하므로,
                    // 여기서는 설명 메시지만 출력합니다.
                    echo "Node.js dependencies and frontend build will be handled inside Dockerfile."
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // 고유한 이미지 태그를 위해 해시코드 12자리 생성
                    def hashcode = sh(
                        script: "date +%s%N | sha256sum | cut -c1-12",
                        returnStdout: true
                    ).trim()

                    // 최종 이미지 태그 조합: 기본 태그 + Jenkins 빌드 번호 + 해시 코드
                    def FINAL_IMAGE_TAG = "${env.IMAGE_TAG_BASE}-${BUILD_NUMBER}-${hashcode}"
                    echo "Final Image Tag: ${FINAL_IMAGE_TAG}"

                    // Docker Build 및 Harbor로 푸시
                    // Dockerfile은 Git 리포지토리 루트에 위치하므로 컨텍스트는 '.' 입니다.
                    docker.withRegistry("https://${env.IMAGE_REGISTRY_BASE}", "${env.DOCKER_CREDENTIAL_ID}") {
                        // 빌드된 이미지는 ${IMAGE_HARBOR_PROJECT} 프로젝트에 푸시됩니다.
                        def appImage = docker.build("${env.IMAGE_REGISTRY_BASE}/${env.IMAGE_HARBOR_PROJECT}/${env.IMAGE_NAME}:${FINAL_IMAGE_TAG}", "--platform linux/amd64 .")
                        appImage.push() // 최종 태그로 푸시
                        appImage.push("latest") // 'latest' 태그로도 푸시 (선택 사항, 편리함)
                    }

                    // (선택 사항) 최종 이미지 태그를 env에 등록.
                    // CD 단계가 없으므로 현재 직접적으로 사용되지는 않지만,
                    // 나중에 CD 단계를 추가할 경우를 대비하여 유지할 수 있습니다.
                    env.FINAL_IMAGE_TAG = FINAL_IMAGE_TAG
                }
            }
        }

        // --- 'Update Kubernetes Manifest and Git Push' 스테이지를 삭제합니다. ---
        // CI (빌드 및 푸시)에만 집중하므로 CD (배포 YAML 업데이트 및 Git 푸시) 단계는 제외합니다.
        // stage('Update Kubernetes Manifest and Git Push') { ... } // 이 스테이지 전체가 삭제되었습니다.
    }

    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Pipeline succeeded! Image pushed to Harbor." // 성공 메시지 변경
        }
        failure {
            echo "Pipeline failed! Check the logs for errors."
        }
    }
}