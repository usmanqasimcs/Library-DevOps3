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
        stage('Clone Repo') {
            steps {
                sh 'git clone https://github.com/usmanqasimcs/Library-DevOps3.git /var/lib/jenkins/DevOps/php/'
            }
        }
        stage('Show Latest Committer Email') {
            steps {
                dir('/var/lib/jenkins/DevOps/php') {
                    sh '''
                        echo "Latest committer email is:"
                        git log -1 --pretty=format:%ae
                    '''
                }
            }
        }
    }
}
