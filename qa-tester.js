const fs = require('fs');
const path = require('path');

class WeatherAppQA {
    constructor() {
        this.issues = [];
        this.passedChecks = [];
    }

    log(message, type = 'info') {
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} ${message}`);
    }

    async run() {
        console.log('\n=== SkyPulse Weather App QA Tester ===\n');

        await this.checkCodeChanges();
        this.analyzeHTML();
        this.analyzeCSS();
        this.analyzeJavaScript();
        this.verifyStructure();
        await this.verifyDeployment();
        this.generateReport();
    }

    async verifyDeployment() {
        console.log('--- Verifying Deployment ---\n');
        
        const deploymentUrl = 'https://skypulse-weather.vercel.app';
        
        try {
            const https = require('https');
            const http = require('http');
            
            const makeRequest = (url) => {
                return new Promise((resolve, reject) => {
                    const protocol = url.startsWith('https') ? https : http;
                    const req = protocol.get(url, { timeout: 15000 }, (res) => {
                        let data = '';
                        res.on('data', chunk => data += chunk);
                        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
                    });
                    req.on('error', reject);
                    req.on('timeout', () => reject(new Error('Request timeout')));
                });
            };
            
            const response = await makeRequest(deploymentUrl);
            
            if (response.status === 200) {
                this.passedChecks.push(`Deployment: ${deploymentUrl} accessible`);
                this.passedChecks.push(`Deployment: HTTP ${response.status} OK`);
                
                const body = response.body;
                
                const contentChecks = [
                    { pattern: /<!DOCTYPE html>/i, name: 'Valid HTML document' },
                    { pattern: /SkyPulse/i, name: 'SkyPulse branding present' },
                    { pattern: /<script/i, name: 'JavaScript present' },
                    { pattern: /weather/i, name: 'Weather content present' }
                ];
                
                contentChecks.forEach(check => {
                    if (check.pattern.test(body)) {
                        this.passedChecks.push(`Deployment: ${check.name}`);
                    } else {
                        this.issues.push({
                            type: 'deployment',
                            severity: 'high',
                            message: `Deployment content check failed: ${check.name}`,
                            suggestion: `Verify ${deploymentUrl} has correct content`
                        });
                    }
                });
                
                const htmlSize = Buffer.byteLength(body, 'utf8');
                this.passedChecks.push(`Deployment: Page size ${(htmlSize / 1024).toFixed(1)}KB`);
                
                const responsiveChecks = [
                    { pattern: /@media\s*\(\s*max-width:\s*640px/i, name: 'Mobile breakpoint' },
                    { pattern: /@media\s*\(\s*max-width:\s*768px/i, name: 'Tablet breakpoint' },
                    { pattern: /@media\s*\(\s*(max-width|min-width)\s*:\s*1024px/i, name: 'Desktop breakpoint' }
                ];
                
                let cssMatch = body.match(/<style[^>]*>([\s\S]*?)<\/style>/);
                if (cssMatch) {
                    const css = cssMatch[1];
                    responsiveChecks.forEach(check => {
                        if (check.pattern.test(css)) {
                            this.passedChecks.push(`Responsive: ${check.name}`);
                        } else {
                            this.issues.push({
                                type: 'responsive',
                                severity: 'medium',
                                message: `Missing ${check.name} in CSS`,
                                suggestion: 'Add responsive breakpoint for mobile/tablet/desktop'
                            });
                        }
                    });
                }
                
            } else {
                this.issues.push({
                    type: 'deployment',
                    severity: 'critical',
                    message: `Deployment returned HTTP ${response.status}`,
                    suggestion: `Check ${deploymentUrl} for errors`
                });
            }
            
        } catch (error) {
            this.issues.push({
                type: 'deployment',
                severity: 'critical',
                message: `Deployment verification failed: ${error.message}`,
                suggestion: `Verify ${deploymentUrl} is accessible and deployed correctly`
            });
        }
    }

    async checkCodeChanges() {
        console.log('--- Checking Code Changes ---\n');
        
        try {
            const { execSync } = require('child_process');
            const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
            const diff = execSync('git diff HEAD~1 --stat', { encoding: 'utf8' });
            
            this.passedChecks.push(`Git branch: ${branch}`);
            this.passedChecks.push('Code changes detected');
            
            console.log(diff);
            console.log('');
        } catch (error) {
            this.issues.push({
                type: 'code',
                severity: 'low',
                message: 'Unable to detect code changes',
                suggestion: 'Run in a git repository to track changes'
            });
        }
    }

    analyzeHTML() {
        console.log('--- Analyzing HTML Structure ---\n');
        
        const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        
        const requiredElements = [
            { pattern: /<!DOCTYPE html>/i, name: 'DOCTYPE declaration' },
            { pattern: /<html[^>]*lang=["\']pl["\']/i, name: 'Language attribute' },
            { pattern: /<meta charset=["\']UTF-8["\']/i, name: 'Character encoding' },
            { pattern: /<meta name="viewport"/i, name: 'Viewport meta' },
            { pattern: /<title>.*SkyPulse.*<\/title>/i, name: 'Page title with SkyPulse' },
            { pattern: /<header>/i, name: 'Header element' },
            { pattern: /<footer>/i, name: 'Footer element' },
            { pattern: /id="locationSearch"/i, name: 'Search input' },
            { pattern: /id="takeoffSelect"/i, name: 'Takeoff select dropdown' },
            { pattern: /id="temperature"/i, name: 'Temperature display' },
            { pattern: /id="windSpeed"/i, name: 'Wind speed display' },
            { pattern: /id="humidity"/i, name: 'Humidity display' },
            { pattern: /id="pressure"/i, name: 'Pressure display' },
            { pattern: /id="visibility"/i, name: 'Visibility display' },
            { pattern: /id="cloudBase"/i, name: 'Cloud base display' },
            { pattern: /id="conditionBadge"/i, name: 'Condition badge' },
            { pattern: /id="compassArrow"/i, name: 'Compass arrow' },
            { pattern: /id="flightConditionRating"/i, name: 'Flight condition rating' },
            { pattern: /id="refreshBtn"/i, name: 'Refresh button' }
        ];

        requiredElements.forEach(check => {
            if (check.pattern.test(html)) {
                this.passedChecks.push(`HTML: ${check.name} found`);
            } else {
                this.issues.push({
                    type: 'html',
                    severity: 'high',
                    message: `Missing HTML element: ${check.name}`,
                    suggestion: `Add required element to index.html`
                });
            }
        });

        const duplicateIds = html.match(/id="[^"]+"/g) || [];
        const idCounts = {};
        duplicateIds.forEach(id => {
            const idName = id.replace('id="', '').replace('"', '');
            idCounts[idName] = (idCounts[idName] || 0) + 1;
        });
        
        Object.entries(idCounts).forEach(([id, count]) => {
            if (count > 1) {
                this.issues.push({
                    type: 'html',
                    severity: 'critical',
                    message: `Duplicate ID: "${id}" appears ${count} times`,
                    suggestion: 'IDs must be unique in HTML. Use classes for multiple elements.'
                });
            }
        });
    }

    analyzeCSS() {
        console.log('--- Analyzing CSS ---\n');
        
        const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
        
        if (!cssMatch) {
            this.issues.push({
                type: 'css',
                severity: 'high',
                message: 'No CSS styles found',
                suggestion: 'Add CSS to the HTML file'
            });
            return;
        }

        const css = cssMatch[1];
        
        const cssChecks = [
            { pattern: /:root\s*\{/, name: 'CSS custom properties' },
            { pattern: /@media\s*\(/, name: 'Responsive media queries' },
            { pattern: /display:\s*grid/, name: 'Grid layout' },
            { pattern: /display:\s*flex/, name: 'Flexbox layout' },
            { pattern: /@keyframes/, name: 'Animations defined' },
            { pattern: /var\(--bg-primary\)/, name: 'Color variables used' },
            { pattern: /@media\s*\(\s*max-width:\s*640px/i, name: 'Mobile breakpoint' },
            { pattern: /@media\s*\(\s*max-width:\s*768px/i, name: 'Tablet breakpoint' }
        ];

        cssChecks.forEach(check => {
            if (check.pattern.test(css)) {
                this.passedChecks.push(`CSS: ${check.name}`);
            } else {
                this.issues.push({
                    type: 'css',
                    severity: 'medium',
                    message: `CSS check failed: ${check.name}`,
                    suggestion: `Add ${check.name} to styles`
                });
            }
        });

        const unclosedBraces = (css.match(/{/g) || []).length - (css.match(/}/g) || []).length;
        if (unclosedBraces !== 0) {
            this.issues.push({
                type: 'css',
                severity: 'critical',
                message: `CSS has ${Math.abs(unclosedBraces)} unclosed brace(s)`,
                suggestion: 'Check CSS syntax for missing closing braces'
            });
        }
    }

    analyzeJavaScript() {
        console.log('--- Analyzing JavaScript ---\n');
        
        const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
        
        if (!scriptMatch) {
            this.issues.push({
                type: 'javascript',
                severity: 'high',
                message: 'No JavaScript found',
                suggestion: 'Add JavaScript to the HTML file'
            });
            return;
        }

        const js = scriptMatch.join('\n');
        
        const jsChecks = [
            { pattern: /class\s+WeatherData/, name: 'WeatherData class defined' },
            { pattern: /OpenMeteoClient/, name: 'OpenMeteoClient API client' },
            { pattern: /GeocodingClient/, name: 'GeocodingClient for location search' },
            { pattern: /fetchWeather/, name: 'fetchWeather function' },
            { pattern: /addEventListener/, name: 'Event listeners attached' },
            { pattern: /locations\s*=/, name: 'Location data defined' },
            { pattern: /loadWeather/, name: 'loadWeather function' },
            { pattern: /updateDisplay/, name: 'updateDisplay function' },
            { pattern: /getElementById/, name: 'DOM manipulation used' },
            { pattern: /async\s+function|await\s+/, name: 'Async/await used for API' }
        ];

        jsChecks.forEach(check => {
            if (check.pattern.test(js)) {
                this.passedChecks.push(`JS: ${check.name}`);
            } else {
                this.issues.push({
                    type: 'javascript',
                    severity: 'medium',
                    message: `JavaScript check failed: ${check.name}`,
                    suggestion: `Add ${check.name} to JavaScript`
                });
            }
        });

        const dangerousPatterns = [
            { pattern: /eval\s*\(/, name: 'eval() usage', severity: 'high' },
            { pattern: /innerHTML\s*=\s*[^=]/, name: 'Direct innerHTML assignment', severity: 'medium' },
            { pattern: /document\.write\s*\(/, name: 'document.write() usage', severity: 'high' }
        ];

        dangerousPatterns.forEach(check => {
            if (check.pattern.test(js)) {
                this.issues.push({
                    type: 'javascript',
                    severity: check.severity,
                    message: `Security concern: ${check.name}`,
                    suggestion: 'Review and sanitize input if user data is involved'
                });
            }
        });
    }

    verifyStructure() {
        console.log('--- Verifying App Structure ---\n');
        
        const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        
        const structuralChecks = [
            { 
                pattern: /<section class="hero"[^>]*>[\s\S]*?hero-content[\s\S]*?compass-container[\s\S]*?<\/section>/,
                name: 'Hero section with content and compass'
            },
            { 
                pattern: /<section class="weather-grid"[^>]*>[\s\S]*?<\/section>/,
                name: 'Weather grid section'
            },
            { 
                pattern: /<section class="thermal-section"[^>]*>[\s\S]*?<\/section>/,
                name: 'Thermal section'
            },
            { 
                pattern: /<section class="special-cards"[^>]*>[\s\S]*?<\/section>/,
                name: 'Special cards section'
            },
            { 
                pattern: /<svg[^>]*viewBox="0 0 24 24"/,
                name: 'SVG icons present'
            }
        ];

        structuralChecks.forEach(check => {
            if (check.pattern.test(html)) {
                this.passedChecks.push(`Structure: ${check.name}`);
            } else {
                this.issues.push({
                    type: 'structure',
                    severity: 'medium',
                    message: `Structure check failed: ${check.name}`,
                    suggestion: `Verify HTML structure includes ${check.name}`
                });
            }
        });
    }

    generateReport() {
        console.log('\n=== QA Report Summary ===\n');
        
        console.log(`✅ Passed Checks (${this.passedChecks.length}):`);
        this.passedChecks.forEach(check => console.log(`   - ${check}`));
        
        console.log(`\n❌ Issues Found (${this.issues.length}):`);
        
        if (this.issues.length === 0) {
            console.log('   No issues detected!');
        } else {
            const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
            
            this.issues.forEach((issue, index) => {
                severityCounts[issue.severity]++;
                const severityIcon = issue.severity === 'critical' ? '🔴' : 
                                   issue.severity === 'high' ? '🟠' : 
                                   issue.severity === 'medium' ? '🟡' : '🟢';
                console.log(`\n   ${index + 1}. ${severityIcon} [${issue.severity.toUpperCase()}] ${issue.message}`);
                console.log(`      Type: ${issue.type}`);
                console.log(`      Suggestion: ${issue.suggestion}`);
            });
            
            console.log('\n--- Severity Summary ---');
            console.log(`   Critical: ${severityCounts.critical}`);
            console.log(`   High: ${severityCounts.high}`);
            console.log(`   Medium: ${severityCounts.medium}`);
            console.log(`   Low: ${severityCounts.low}`);
        }
        
        console.log('\n============================\n');
        
        const exitCode = this.issues.some(i => i.severity === 'critical' || i.severity === 'high') ? 1 : 0;
        process.exit(exitCode);
    }
}

const qa = new WeatherAppQA();
qa.run().catch(error => {
    console.error('QA Test failed:', error);
    process.exit(1);
});