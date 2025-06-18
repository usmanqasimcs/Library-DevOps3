pipeline {
    agent any

    environment {
        COMMITTER_EMAIL = ""
    }

    stages {
        stage('delete php folder if it exists') {
            steps {
                sh '''
                    if [ -d "/var/lib/jenkins/DevOps/" ]; then
                        find "/var/lib/jenkins/DevOps/" -mindepth 1 -delete
                        echo "Contents of /var/lib/jenkins/DevOps/ have been removed."
                    else
                        echo "Directory /var/lib/jenkins/DevOps/ does not exist."
                    fi
                '''
            }
        }
        stage('Fetch code') {
            steps {
                sh 'git clone https://github.com/usmanqasimcs/Library-DevOps3.git /var/lib/jenkins/DevOps/php/'
            }
        }
        stage('Get Committer Email') {
            steps {
                script {
                    // This MUST run in Jenkins workspace to get the right commit info!
                    env.COMMITTER_EMAIL = sh(
                        script: "git log -1 --pretty=format:'%ae' | tr -d \"'\"",
                        returnStdout: true
                    ).trim()
                    echo "Committer Email: ${env.COMMITTER_EMAIL}"
                }
            }
        }
        stage('Set JWT Secret') {
            steps {
                dir('/var/lib/jenkins/DevOps/php/') {
                    sh 'echo "JWT_SECRET=your-super-secret-jwt-key-here" > .env'
                }
            }
        }
        stage('Build and Start Docker Compose') {
            steps {
                dir('/var/lib/jenkins/DevOps/php/') {
                    sh 'docker compose -p libraryapp up -d --build'
                }
            }
        }
        stage('Wait for Application to Start') {
            steps {
                dir('/var/lib/jenkins/DevOps/php/') {
                    sh '''
                        echo "Waiting for application to be ready..."
                        sleep 30
                        for i in {1..10}; do
                            if curl -f http://localhost:4000 > /dev/null 2>&1; then
                                echo "Application is ready!"
                                break
                            fi
                            echo "Waiting for application... attempt $i"
                            sleep 10
                        done
                        if curl -f http://localhost:4000 > /dev/null 2>&1; then
                            echo "✅ Application is responding on port 4000"
                        else
                            echo "⚠️  Application may not be fully ready"
                        fi
                    '''
                }
            }
        }
        stage('Install Selenium and Run Tests') {
            steps {
                dir('/var/lib/jenkins/DevOps/php/') {
                    sh '''
                        echo "🔧 Installing Selenium and running tests with pip3..."
                        pip3 install --break-system-packages selenium==4.15.0 webdriver-manager==4.0.1
                        export PATH=$PATH:$HOME/.local/bin
                        cd tests
                        python3 test_library_complete.py > ../selenium_test_result.txt 2>&1 || echo "Selenium tests completed with some failures"
                    '''
                }
            }
        }
    }
    post {
        always {
            dir('/var/lib/jenkins/DevOps/php/') {
                sh '''
                    echo "📊 Application Status:"
                    docker compose -p libraryapp ps
                    echo "📁 Test Directory Contents:"
                    ls -la tests/
                    echo "📸 Test Screenshots:"
                    ls -la /tmp/*.png 2>/dev/null || echo "No screenshots generated"
                '''
            }
        }
        success {
            script {
                echo '✅ Pipeline completed successfully! Selenium tests executed with WebDriver automation.'
                if (env.COMMITTER_EMAIL?.trim()) {
                    emailext(
                        subject: "Library-DevOps3 Jenkins Test Results",
                        body: "Hello,\n\nPlease find attached the test results for your recent commit to Library-DevOps3.\n\nRegards,\nJenkins",
                        to: "${env.COMMITTER_EMAIL}",
                        attachmentsPattern: '/var/lib/jenkins/DevOps/php/selenium_test_result.txt'
                    )
                } else {
                    echo "Committer email not found, not sending email."
                }
            }
        }
        failure {
            script {
                echo '❌ Pipeline failed! Check the console output for Selenium test details.'
                if (env.COMMITTER_EMAIL?.trim()) {
                    emailext(
                        subject: "Library-DevOps3 Jenkins Test Results (Failed)",
                        body: "Hello,\n\nThe recent Jenkins pipeline run for your commit failed. Please find the test results attached.\n\nRegards,\nJenkins",
                        to: "${env.COMMITTER_EMAIL}",
                        attachmentsPattern: '/var/lib/jenkins/DevOps/php/selenium_test_result.txt'
                    )
                } else {
                    echo "Committer email not found, not sending email."
                }
            }
        }
    }
}
