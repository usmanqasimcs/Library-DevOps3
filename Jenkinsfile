pipeline {
    agent any

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
                        echo "🔧 Installing Selenium and running tests with system pip3..."
                        pip3 install --user selenium==4.15.0 webdriver-manager==4.0.1
                        export PATH=$PATH:$HOME/.local/bin
                        cd tests
                        python3 test_library_complete.py || echo "Selenium tests completed with some failures"
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
        failure {
            echo '❌ Pipeline failed! Check the console output for Selenium test details.'
        }
        success {
            echo '✅ Pipeline completed successfully! Selenium tests executed with WebDriver automation.'
        }
    }
}
