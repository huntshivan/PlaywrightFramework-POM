// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Playwright Automation (QA and STAGE only)
// Works on Windows and Linux/macOS agents
// Triggered by the Spring Boot pipeline or manually (Build with Parameters)
// Reports per run: PW HTML + Allure
// ═══════════════════════════════════════════════════════════════

def ALLOWED_ENVS = ['qa', 'stage']

// ── OS helpers ────────────────────────────────────────────────
def runCmd(String cmd) {
    if (isUnix()) { sh cmd } else { bat cmd }
}

// Windows commands need backslashes; Linux keeps forward slashes
def osPath(String p) {
    return isUnix() ? p : p.replace('/', '\\')
}

// Copies the env file from Jenkins (Secret file credential) into config/, runs the tests, then removes it
def runPlaywright(String envName, String tag) {
    def grep    = tag ? "--grep ${tag}" : ''
    def envFile = "config/.env.${envName}"

    // Clean old results
    if (isUnix()) {
        sh 'rm -rf allure-results reports'
    } else {
        bat 'if exist allure-results rmdir /s /q allure-results'
        bat 'if exist reports rmdir /s /q reports'
    }

    withCredentials([file(credentialsId: "${envName}-env-file", variable: 'ENV_FILE')]) {
        try {
            if (isUnix()) {
                sh 'mkdir -p config'
                sh "cp \"\$ENV_FILE\" \"${envFile}\""
            } else {
                bat 'if not exist config mkdir config'
                bat "copy /Y \"%ENV_FILE%\" \"${osPath(envFile)}\""
            }
            // withEnv sets ENV the same way on Windows and Linux
            withEnv(["ENV=${envName}"]) {
                runCmd "npx playwright test --project=${params.BROWSER} ${grep}"
            }
        } finally {
            if (isUnix()) {
                sh "rm -f \"${envFile}\""
            } else {
                bat(script: "del /F /Q \"${osPath(envFile)}\"", returnStatus: true)
            }
        }
    }
}

def publishReports(String label, String envName) {

    def htmlSource   = 'reports/html-report'
    def htmlTarget   = "reports-${envName}/html"
    def allureTarget = "reports-${envName}/allure"

    // Check Playwright HTML report
    echo 'Checking Playwright HTML report...'
    if (!fileExists("${htmlSource}/index.html")) {
        error 'ERROR: Playwright HTML report not generated!'
    }

    // Copy Playwright HTML report
    if (isUnix()) {
        sh "mkdir -p \"${htmlTarget}\" \"${allureTarget}\""
        sh "cp -R \"${htmlSource}/.\" \"${htmlTarget}/\""
    } else {
        bat "if not exist \"${osPath(htmlTarget)}\" mkdir \"${osPath(htmlTarget)}\""
        bat "if not exist \"${osPath(allureTarget)}\" mkdir \"${osPath(allureTarget)}\""
        bat "xcopy \"${osPath(htmlSource)}\" \"${osPath(htmlTarget)}\" /E /I /Y"
    }
    if (!fileExists("${htmlTarget}/index.html")) {
        error 'ERROR: HTML report copy failed!'
    }
    echo 'HTML report copied successfully.'

    // Generate Allure report only if there are result files
    def hasAllure = false
    if (fileExists('allure-results')) {
        if (isUnix()) {
            hasAllure = sh(returnStatus: true,
                           script: 'test -n "$(find allure-results -type f -print -quit)"') == 0
        } else {
            hasAllure = bat(returnStatus: true,
                            script: '@dir /a-d /s /b allure-results >nul 2>&1') == 0
        }
    }
    if (hasAllure) {
        runCmd "allure generate allure-results --clean -o \"${osPath(allureTarget)}\""
    } else {
        echo 'No Allure results found. Skipping Allure generation.'
    }

    // Publish Playwright HTML report
    publishHTML(target: [
        reportName: "${label} - PW HTML Report",
        reportDir: htmlTarget,
        reportFiles: 'index.html',
        keepAll: true,
        alwaysLinkToLastBuild: true
    ])

    // Publish Allure HTML report only if generated
    if (fileExists("${allureTarget}/index.html")) {
        publishHTML(target: [
            reportName: "${label} - Allure Report",
            reportDir: allureTarget,
            reportFiles: 'index.html',
            keepAll: true,
            alwaysLinkToLastBuild: true
        ])
    }
}

pipeline {
    agent any    // use agent { label 'windows' } to pin to a specific agent

    tools {
        nodejs 'Node'
        jdk 'JDK-27'           // Allure commandline needs Java
        allure 'Allure'
    }

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['qa', 'stage'],
               description: 'Target environment (qa or stage only)')
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
                script {
                    runCmd 'npm ci'
                    // --with-deps installs Linux system packages; not needed on Windows
                    runCmd(isUnix() ? "npx playwright install --with-deps ${params.BROWSER}"
                                    : "npx playwright install ${params.BROWSER}")
                }
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

    post {
        success { echo "✅ ${params.ENVIRONMENT} ${params.TEST_SUITE}: SUCCESS" }
        failure { echo "❌ ${params.ENVIRONMENT} ${params.TEST_SUITE}: FAILED" }
    }
}