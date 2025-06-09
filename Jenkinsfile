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
                // cleanWs() // 플러그인이 설치되지 않은 경우 주석 해제된 상태로 오류를 발생시킬 수 있습니다.
                           // 따라서 이 스테이지는 아예 삭제하거나,
                           // 또는 Jenkins가 플러그인을 찾을 때까지는 임시로 echo 명령을 넣어 비어있지 않게 해야 합니다.
                echo "Workspace cleanup step (cleanWs) is intentionally skipped or will be handled by plugin if available." // <--- 이 라인을 추가하거나 주석 해제하여 `steps` 블록이 비어있지 않도록 합니다.
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: env.GIT_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PAT')]) {
                        sh "git config --global credential.helper store"
                        sh "echo \"https://${GIT_USER}:${GIT_PAT}@github.com\" > ~/.git-credentials"
                        def repoName = env.GIT_URL.split('/')[-1].replace('.git', '')
                        sh "git clone https://github.com/${env.GIT_USER_NAME}/${repoName} ."
                        sh "git checkout ${env.GIT_BRANCH}"
                    }
                }
            }
        }

        stage('Install Node.js Dependencies & Build Frontend') {
            steps {
                script {
                    echo "Node.js dependencies and frontend build will be handled inside Dockerfile."
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    def hashcode = sh(
                        script: "date +%s%N | sha256sum | cut -c1-12",
                        returnStdout: true
                    ).trim()

                    def FINAL_IMAGE_TAG = "${env.IMAGE_TAG_BASE}-${BUILD_NUMBER}-${hashcode}"
                    echo "Final Image Tag: ${FINAL_IMAGE_TAG}"

                    docker.withRegistry("https://${env.IMAGE_REGISTRY_BASE}", "${env.DOCKER_CREDENTIAL_ID}") {
                        def appImage = docker.build("${env.IMAGE_REGISTRY_BASE}/${env.IMAGE_HARBOR_PROJECT}/${env.IMAGE_NAME}:${FINAL_IMAGE_TAG}", "--platform linux/amd64 .")
                        appImage.push()
                        appImage.push("latest")
                    }

                    env.FINAL_IMAGE_TAG = FINAL_IMAGE_TAG
                }
            }
        }

        stage('Update Kubernetes Manifest and Git Push') {
            steps {
                script {
                    def deployYamlPath = './k8s/deployment.yaml' // <--- 이 경로가 정확한지 확인하고 수정하세요.

                    def fullImageName = "${env.IMAGE_REGISTRY_BASE}/${env.IMAGE_HARBOR_PROJECT}/${env.IMAGE_NAME}:${env.FINAL_IMAGE_TAG}"
                    def newImageLine = "        image: ${fullImageName}"

                    sh """
                        sed -i 's|^[[:space:]]*image:.*\$|${newImageLine}|g' ${deployYamlPath}
                        echo "--- Updated ${deployYamlPath} content ---"
                        cat ${deployYamlPath}
                        echo "---------------------------------------"
                    """

                    sh """
                        git config user.name "$GIT_USER_NAME"
                        git config user.email "$GIT_USER_EMAIL"
                        git add ${deployYamlPath} || true
                    """

                    withCredentials([usernamePassword(credentialsId: env.GIT_ID, usernameVariable: 'GIT_PUSH_USER', passwordVariable: 'GIT_PUSH_PASSWORD')]) {
                        sh """
                            if ! git diff --cached --quiet; then
                                git commit -m "[AUTO] Update ${deployYamlPath} image to ${env.FINAL_IMAGE_TAG}"
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