
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
    }
}
