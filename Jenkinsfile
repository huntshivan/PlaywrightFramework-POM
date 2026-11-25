// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Playwright Automation (TEST and UAT only)
// Triggered by the Spring Boot pipeline or manually (Build with Parameters)
// Reports per run: PW HTML + Allure
// ═══════════════════════════════════════════════════════════════

def ALLOWED_ENVS = ['qa', 'stage']

// Copies the env file from Jenkins (Secret file credential) into config/, runs the tests, then removes it
def runPlaywright(String envName, String tag) {
    sh 'rm -rf allure-results reports'
    def grep = tag ? "--grep ${tag}" : ''

    withCredentials([file(credentialsId: "${envName}-env-file", variable: 'ENV_FILE')]) {
        try {
            sh 'mkdir -p config'
            sh "cp \"\$ENV_FILE\" config/.env.${envName}"
            sh "ENV=${envName} npx playwright test --project=${params.BROWSER} ${grep}"
        } finally {
            sh "rm -f config/.env.${envName}"
        }
    }
}

def publishReports(String label, String envName) {
    sh "mkdir -p reports-${envName}/html reports-${envName}/allure"
    sh "cp -r reports/html-report/* reports-${envName}/html/ || true"
    sh "allure generate allure-results --clean -o reports-${envName}/allure || true"
    [html: 'PW HTML', allure: 'Allure'].each { folder, name ->
        publishHTML(target: [
            reportName: "${label} - ${name} Report",
            reportDir: "reports-${envName}/${folder}",
            reportFiles: 'index.html',
            keepAll: true,
            alwaysLinkToLastBuild: true
        ])
    }
}

pipeline {
    agent any

    tools {
        nodejs 'Node'
        jdk 'JDK-27'           // Allure commandline needs Java
        allure 'Allure'
    }

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['qa', 'uat'],
               description: 'Target environment (qa or uat only)')
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'],
               description: 'Browser project')
        choice(name: 'TEST_SUITE', choices: ['smoke', 'regression', 'api-smoke', 'all'],
               description: 'Tag to run (all = no tag filter)')
    }


    options {
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {

        stage('Validate Environment') {
            steps {
                script {
                    if (!(params.ENVIRONMENT in ALLOWED_ENVS)) {
                        error "Environment '${params.ENVIRONMENT}' is not allowed. Use: ${ALLOWED_ENVS.join(', ')}"
                    }
                }
            }
        }

        stage('Checkout & Install Dependencies') {
            steps {
                checkout scm
                sh 'npm ci'
                sh "npx playwright install --with-deps ${params.BROWSER}"
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running '${params.TEST_SUITE}' on ${params.ENVIRONMENT.toUpperCase()} (${params.BROWSER})"
                script {
                    def tag = (params.TEST_SUITE == 'all') ? '' : "@${params.TEST_SUITE}"
                    runPlaywright(params.ENVIRONMENT, tag)
                }
            }
            post {
                always {
                    script {
                        publishReports("${params.ENVIRONMENT.toUpperCase()} ${params.TEST_SUITE}",
                                       params.ENVIRONMENT)
                    }
                }
            }
        }
    }

    // ═════════════════════════════════════════════════════
    // POST — SLACK + EMAIL NOTIFICATIONS
    // ═════════════════════════════════════════════════════
    post {
        always {
            script {
                def buildStatus = currentBuild.currentResult
                def statusEmoji = buildStatus == 'SUCCESS' ? '✅' : '❌'
                def statusColor = buildStatus == 'SUCCESS' ? 'good' : 'danger'
                def htmlColor   = buildStatus == 'SUCCESS' ? '#28a745' : '#dc3545'
                def duration    = currentBuild.durationString.replace(' and counting', '')
                def triggeredBy = currentBuild.getBuildCauses()[0]?.shortDescription ?: 'Manual'

                // Email
                
            }
        }
        success { echo "✅ ${params.ENVIRONMENT} ${params.TEST_SUITE}: SUCCESS" }
        failure { echo "❌ ${params.ENVIRONMENT} ${params.TEST_SUITE}: FAILED" }
    }
}