pipeline {
    agent any

    stages {
        stage('Cleanup DevOps Folder') {
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
        stage('Fetch Code') {
            steps {
                sh 'git clone https://github.com/usmanqasimcs/Library-DevOps3.git /var/lib/jenkins/DevOps/php/'
            }
        }
        stage('Get Committer Email') {
            steps {
                dir('/var/lib/jenkins/DevOps/php') {
                    sh '''
                        git log -1 --pretty=format:%ae | tr -d '\\n' > $WORKSPACE/committer_email.txt
                        echo "Saved committer email:"
                        cat $WORKSPACE/committer_email.txt
                    '''
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
                        python3 test_cases.py > ../selenium_test_result.txt 2>&1 || echo "Selenium tests completed with some failures"
                    '''
                }
            }
        }
        stage('Show Selenium Test Results') {
            steps {
                dir('/var/lib/jenkins/DevOps/php/') {
                    sh 'cat selenium_test_result.txt || echo "No test results found."'
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
                archiveArtifacts artifacts: 'selenium_test_result.txt', onlyIfSuccessful: false
            }
        }
        success {
            script {
                def emailFile = "${env.WORKSPACE}/committer_email.txt"
                def committerEmail = ""
                if (fileExists(emailFile)) {
                    committerEmail = readFile(emailFile).trim()
                    echo "POST: Read committer email: [${committerEmail}]"
                } else {
                    echo "POST: committer_email.txt not found!"
                }

                if (committerEmail) {
                    emailext(
                        subject: "Library-DevOps3 Jenkins Test Results",
                        body: """M. Usman Qasim
SP22-BCS-073

Dear Contributor,

Your recent commit to the Library-DevOps3 project has been tested automatically by my Jenkins CI pipeline.  
Please find the attached file containing the complete Selenium test results.

Thank you for your guidance Sir!

Best regards,
M. Usman Qasim
SP22-BCS-073
""",
                        to: committerEmail,
                        attachmentsPattern: '/var/lib/jenkins/DevOps/php/selenium_test_result.txt'
                    )
                } else {
                    echo "Committer email not found, not sending email."
                }
            }
        }
        failure {
            script {
                def emailFile = "${env.WORKSPACE}/committer_email.txt"
                def committerEmail = ""
                if (fileExists(emailFile)) {
                    committerEmail = readFile(emailFile).trim()
                    echo "POST: Read committer email: [${committerEmail}]"
                } else {
                    echo "POST: committer_email.txt not found!"
                }

                if (committerEmail) {
                    emailext(
                        subject: "Library-DevOps3 Jenkins Test Results (Failed)",
                        body: """M. Usman Qasim
SP22-BCS-073

Dear Contributor,

Your recent commit to the Library-DevOps3 project has been tested automatically by my Jenkins CI pipeline.  
Please find the attached file containing the complete Selenium test results.

Thank you for your guidance Sir!

Best regards,
M. Usman Qasim
SP22-BCS-073
usmanqasimcsa@gmail.com
""",
                        to: committerEmail,
                        attachmentsPattern: '/var/lib/jenkins/DevOps/php/selenium_test_result.txt'
                    )
                } else {
                    echo "Committer email not found, not sending email."
                }
            }
        }
    }
}
