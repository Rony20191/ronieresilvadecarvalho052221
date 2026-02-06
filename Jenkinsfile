pipeline {
    agent any

    environment {
        // Replace with your actual credentials ID from Jenkins
        DOCKER_REGISTRY_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_IMAGE_BACKEND = 'your-dockerhub-username/music-catalog-backend'
        DOCKER_IMAGE_FRONTEND = 'your-dockerhub-username/music-catalog-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    // Assuming Maven is installed or using wrapper
                    sh './mvnw clean test' 
                    // If on Windows Jenkins agent without sh, use bat './mvnw clean test'
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_REGISTRY_CREDENTIALS_ID}") {
                        def backendImage = docker.build("${DOCKER_IMAGE_BACKEND}:${env.BUILD_NUMBER}", "./backend")
                        backendImage.push()
                        backendImage.push("latest")
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    // Use 'vitest run' to ensure single execution (not watch mode) for CI
                    sh 'npx vitest run'
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_REGISTRY_CREDENTIALS_ID}") {
                        // Build using the 'runner' stage or default which includes prod build
                        // We target the default build context which uses the Dockerfile
                        def frontendImage = docker.build("${DOCKER_IMAGE_FRONTEND}:${env.BUILD_NUMBER}", "-f frontend/Dockerfile frontend")
                        frontendImage.push()
                        frontendImage.push("latest")
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
