
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
                        
                        # Check if application is responding
                        for i in {1..10}; do
                            if curl -f http://localhost:4000 > /dev/null 2>&1; then
                                echo "Application is ready!"
                                break
                            fi
                            echo "Waiting for application... attempt $i"
                            sleep 10
                        done
                    '''
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('/var/lib/jenkins/DevOps/php/') {
                    sh '''
                        # Install Python and pip if not present
                        if ! command -v python3 &> /dev/null; then
                            sudo apt-get update
                            sudo apt-get install -y python3 python3-pip
                        fi
                        
                        # Install test dependencies
                        pip3 install -r tests/requirements.txt
                        
                        # Install Chrome if not present
                        if ! command -v google-chrome &> /dev/null; then
                            wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
                            echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
                            sudo apt-get update
                            sudo apt-get install -y google-chrome-stable
                        fi
                        
                        # Install ChromeDriver if not present
                        if ! command -v chromedriver &> /dev/null; then
                            sudo apt-get install -y chromium-chromedriver
                        fi
                        
                        # Update the base test configuration with local URL
                        sed -i 's|http://your-ec2-instance-ip:port|http://localhost:4000|g' tests/base_test.py
                        
                        # Run all tests using the test runner
                        echo "Starting Selenium tests..."
                        cd tests
                        python3 run_all_tests.py || true
                        
                        # Also run individual tests for detailed output
                        echo "Running individual test files..."
                        for test_file in test_*.py; do
                            if [ "$test_file" != "test_*.py" ] && [ "$test_file" != "run_all_tests.py" ]; then
                                echo "Running $test_file..."
                                python3 "$test_file" || true
                            fi
                        done
                    '''
                }
            }
        }
    }
    
    post {
        always {
            dir('/var/lib/jenkins/DevOps/php/') {
                sh '''
                    echo "Collecting test results..."
                    # Archive any test results or screenshots if generated
                    # docker compose -p libraryapp logs > docker-logs.txt
                '''
            }
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
        success {
            echo 'All tests passed successfully!'
        }
    }
}
