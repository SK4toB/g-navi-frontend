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
                // cleanWs() // Jenkins 워크스페이스를 깨끗하게 정리합니다.
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    // Git 저장소에서 코드를 클론합니다.
                    // Jenkins Credential Plugin의 "Username with password" (PAT)를 사용합니다.
                    withCredentials([usernamePassword(credentialsId: env.GIT_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PAT')]) {
                        // Git 자격 증명 헬퍼를 설정하여 PAT를 사용하여 인증합니다.
                        sh "git config --global credential.helper store"
                        sh "echo \"https://${GIT_USER}:${GIT_PAT}@github.com\" > ~/.git-credentials"
                        // Git URL에서 리포지토리 이름만 추출하여 클론합니다.
                        def repoName = env.GIT_URL.split('/')[-1].replace('.git', '')
                        sh "git clone https://github.com/${env.GIT_USER_NAME}/${repoName} ."
                        sh "git checkout ${env.GIT_BRANCH}" // 올바른 브랜치로 체크아웃합니다.
                    }
                }
            }
        }

        stage('Install Node.js Dependencies & Build Frontend') {
            steps {
                script {
                    // frontend 디렉토리로 이동하여 npm install 및 npm run build 실행.
                    // Dockerfile에 이미 이 단계가 포함되어 있다면, 여기서는 생략 가능하지만,
                    // Dockerfile 변경 없이 Jenkins에서 직접 빌드 과정을 통제하려면 여기에 두는 것이 명확합니다.
                    // Dockerfile에서 이 부분을 이미 처리하므로, 여기서는 제외하거나 `docker build` 커맨드에서 `frontend` 디렉토리를 복사하는 부분과 충돌하지 않도록 조정해야 합니다.
                    // 현재 Dockerfile은 모든 npm 작업을 컨테이너 내부에서 처리하므로, 이 스테이지는 제거합니다.

                    // Dockerfile이 이미 npm install 및 npm run build를 처리하므로, 여기서는 별도의 빌드 단계를 추가하지 않습니다.
                    // 다만, 이전에 Dockerfile에 npm install 앞에 `rm -rf node_modules package-lock.json`을 추가했으니,
                    // Jenkinsfile의 Docker Build 단계에서 이 변경 사항이 적용될 것입니다.
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
                    // Dockerfile은 Git 리포지토리 루트에 위치합니다.
                    docker.withRegistry("https://${env.IMAGE_REGISTRY_BASE}", "${env.DOCKER_CREDENTIAL_ID}") {
                        // Dockerfile의 컨텍스트는 Git 리포지토리 루트이므로 '.'를 사용합니다.
                        // 빌드된 이미지는 ${IMAGE_HARBOR_PROJECT} 프로젝트에 푸시됩니다.
                        def appImage = docker.build("${env.IMAGE_REGISTRY_BASE}/${env.IMAGE_HARBOR_PROJECT}/${env.IMAGE_NAME}:${FINAL_IMAGE_TAG}", "--platform linux/amd64 .")
                        appImage.push() // 최종 태그로 푸시
                        appImage.push("latest") // 'latest' 태그로도 푸시 (선택 사항, 편리함)
                    }

                    // 쿠버네티스 deploy.yaml 업데이트에 사용될 최종 이미지 태그를 환경 변수에 등록
                    env.FINAL_IMAGE_TAG = FINAL_IMAGE_TAG
                }
            }
        }

        stage('Update Kubernetes Manifest and Git Push') {
            steps {
                script {
                    // deploy.yaml 파일 경로 (여러분의 쿠버네티스 YAML 파일 경로로 정확히 수정하세요.)
                    // 이 파일은 Git 저장소 내에 있어야 합니다.
                    def deployYamlPath = './k8s/deployment.yaml' // <--- 이 경로를 여러분의 실제 파일 경로로 변경하세요.
                                                              // 예시: './deployment.yaml' 또는 './manifests/frontend-deployment.yaml'

                    // deploy.yaml 내의 'image:' 라인 업데이트
                    def fullImageName = "${env.IMAGE_REGISTRY_BASE}/${env.IMAGE_HARBOR_PROJECT}/${env.IMAGE_NAME}:${env.FINAL_IMAGE_TAG}"
                    def newImageLine = "        image: ${fullImageName}" // Kubernetes YAML 들여쓰기에 맞게 공백 8칸 추가

                    // sed 명령을 사용하여 deploy.yaml 파일 내 'image:'로 시작하는 줄을 업데이트합니다.
                    sh """
                        sed -i 's|^[[:space:]]*image:.*\$|${newImageLine}|g' ${deployYamlPath}
                        echo "--- Updated ${deployYamlPath} content ---"
                        cat ${deployYamlPath}
                        echo "---------------------------------------"
                    """

                    // Git 설정 및 변경사항 커밋
                    sh """
                        git config user.name "$GIT_USER_NAME"
                        git config user.email "$GIT_USER_EMAIL"
                        git add ${deployYamlPath} || true // 변경된 deploy.yaml 파일을 Git에 추가 (변경 없어도 실패X)
                    """

                    // Git Push (PAT를 사용하여 인증)
                    withCredentials([usernamePassword(credentialsId: env.GIT_ID, usernameVariable: 'GIT_PUSH_USER', passwordVariable: 'GIT_PUSH_PASSWORD')]) {
                        sh """
                            // 커밋할 변경 사항이 있는지 확인
                            if ! git diff --cached --quiet; then
                                git commit -m "[AUTO] Update ${deployYamlPath} image to ${env.FINAL_IMAGE_TAG}"
                                // Git 원격 URL에 사용자 이름과 PAT를 포함하여 인증
                                def repoHostPath = env.GIT_URL.replaceFirst('https://', '').replaceFirst('http://', '')
                                git remote set-url origin https://${GIT_PUSH_USER}:${GIT_PUSH_PASSWORD}@${repoHostPath}
                                git push origin ${env.GIT_BRANCH}
                            else
                                echo "No changes to commit in ${deployYamlPath}."
                            fi
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Pipeline succeeded! Image pushed to Harbor and deploy.yaml updated in Git."
        }
        failure {
            echo "Pipeline failed! Check the logs for errors."
        }
    }
}