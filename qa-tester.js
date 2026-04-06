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
        this.checkLayoutIssues();
        this.checkResponsiveDesign();
        this.generateReport();
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

    checkLayoutIssues() {
        console.log('--- Checking Layout Issues ---\n');
        
        const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
        
        if (!cssMatch) return;
        
        const css = cssMatch[1];
        
        const gridContainers = css.match(/display:\s*grid/gi) || [];
        const flexContainers = css.match(/display:\s*flex/gi) || [];
        
        this.passedChecks.push(`Grid layouts found: ${gridContainers.length}`);
        this.passedChecks.push(`Flex layouts found: ${flexContainers.length}`);
        
        const specialCardsGrid = css.match(/special-cards[\s\S]*?\{[^}]*display:\s*grid/i);
        if (specialCardsGrid) {
            const hasMobileBreakpoint = css.includes('.special-cards') && css.includes('grid-template-columns: 1fr');
            if (hasMobileBreakpoint) {
                this.passedChecks.push('Special-cards has mobile responsive grid');
            } else {
                this.issues.push({
                    type: 'layout',
                    severity: 'high',
                    message: 'Special-cards grid missing mobile breakpoint',
                    suggestion: 'Add @media query to make special-cards single-column on mobile'
                });
            }
        }
        
        const gridWithoutGap = css.match(/display:\s*grid[^}]*?(?:gap|margin)[^}]*?;/gi);
        if (gridContainers.length > 0 && !css.includes('gap:') && !css.includes('grid-gap')) {
            this.issues.push({
                type: 'layout',
                severity: 'medium',
                message: 'Grid containers may lack gap spacing',
                suggestion: 'Add gap property to grid containers to prevent overlapping elements'
            });
        }
        
        const weatherGridMobile = css.match(/weather-grid[\s\S]*?@media.*max-width.*640px.*grid-template-columns:\s*1fr/i);
        if (weatherGridMobile) {
            this.passedChecks.push('Weather-grid has mobile breakpoint to single column');
        } else {
            this.issues.push({
                type: 'layout',
                severity: 'medium',
                message: 'Weather-grid may not handle mobile properly',
                suggestion: 'Verify weather-grid @media query switches to 1fr at 640px'
            });
        }
        
        const containerOverflow = css.match(/overflow-x:\s*hidden/i);
        if (containerOverflow) {
            this.passedChecks.push('Container has overflow-x: hidden to prevent horizontal scroll');
        } else {
            this.issues.push({
                type: 'layout',
                severity: 'medium',
                message: 'No overflow-x handling found',
                suggestion: 'Add overflow-x: hidden to container to prevent horizontal scroll issues'
            });
        }
        
        const specialCardsClasses = ['cloud-base-card', 'dewpoint-card'];
        specialCardsClasses.forEach(cardClass => {
            const hasCardStyles = css.includes(`.${cardClass}`);
            if (!hasCardStyles) {
                this.issues.push({
                    type: 'layout',
                    severity: 'high',
                    message: `Missing styles for ${cardClass}`,
                    suggestion: `Add styles for ${cardClass} in CSS`
                });
            }
        });
        
        const cloudBaseCard = css.match(/cloud-base-card[\s\S]*?\{[^}]*\}/i);
        const dewpointCard = css.match(/dewpoint-card[\s\S]*?\{[^}]*\}/i);
        
        if (cloudBaseCard && dewpointCard) {
            const cloudBaseHasFlex = /display:\s*flex/i.test(cloudBaseCard[0]);
            const dewpointHasFlex = /display:\s*flex/i.test(dewpointCard[0]);
            
            if (cloudBaseHasFlex && dewpointHasFlex) {
                this.passedChecks.push('Cards use flexbox for internal layout');
            }
        }
        
        const hasNegativeMargins = css.match(/margin:\s*-\d+/gi);
        if (hasNegativeMargins && hasNegativeMargins.length > 3) {
            this.issues.push({
                type: 'layout',
                severity: 'medium',
                message: 'Excessive negative margins may cause overlap',
                suggestion: 'Review negative margin usage in CSS'
            });
        }
    }

    checkResponsiveDesign() {
        console.log('--- Checking Responsive Design ---\n');
        
        const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
        
        if (!cssMatch) return;
        
        const css = cssMatch[1];
        
        const mediaQueries = css.match(/@media[^{]+\{[\s\S]*?\}/gi) || [];
        this.passedChecks.push(`Media queries found: ${mediaQueries.length}`);
        
        const breakpoints = {
            mobile: css.includes('max-width: 640px') || css.includes('max-width: 480px'),
            tablet: css.includes('max-width: 768px'),
            desktop: css.includes('max-width: 1024px')
        };
        
        if (breakpoints.mobile) {
            this.passedChecks.push('Mobile breakpoint (640px or 480px) defined');
        } else {
            this.issues.push({
                type: 'responsive',
                severity: 'high',
                message: 'No mobile breakpoint found',
                suggestion: 'Add @media (max-width: 640px) for mobile layout'
            });
        }
        
        if (breakpoints.tablet) {
            this.passedChecks.push('Tablet breakpoint (768px) defined');
        }
        
        if (breakpoints.desktop) {
            this.passedChecks.push('Desktop breakpoint (1024px) defined');
        }
        
        const bodyOverflow = css.match(/body[\s\S]*?\{[^}]*overflow-x:\s*hidden/i);
        if (bodyOverflow) {
            this.passedChecks.push('Body has overflow-x handling');
        } else {
            this.issues.push({
                type: 'responsive',
                severity: 'medium',
                message: 'Body may not handle overflow at small widths',
                suggestion: 'Add overflow-x: hidden to body to prevent horizontal scroll'
            });
        }
        
        const flexWrap = css.match(/flex-wrap:\s*wrap/i);
        const gridAutoFlow = css.match(/grid-template-columns:\s*repeat\(\d+/i);
        
        if (flexWrap || gridAutoFlow) {
            this.passedChecks.push('Layout uses wrap/auto-flow for responsive behavior');
        }
        
        const hasContainerMaxWidth = css.match(/(?:container|wrapper)[\s\S]*?max-width/i);
        if (hasContainerMaxWidth) {
            this.passedChecks.push('Container has max-width for responsive layout');
        }
        
        const viewportMeta = html.match(/<meta[^>]*name="viewport"/i);
        if (viewportMeta) {
            this.passedChecks.push('Viewport meta tag present');
        } else {
            this.issues.push({
                type: 'responsive',
                severity: 'critical',
                message: 'Viewport meta tag missing',
                suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">'
            });
        }
        
        const gridColumns = css.match(/grid-template-columns:\s*repeat\((\d+)/i);
        if (gridColumns && parseInt(gridColumns[1]) > 1) {
            const hasMobileGridFix = css.match(/@media[^{]*max-width[^{]*\{[^}]*grid-template-columns:\s*1fr/i);
            if (hasMobileGridFix) {
                this.passedChecks.push('Multi-column grid has mobile single-column fallback');
            } else {
                this.issues.push({
                    type: 'responsive',
                    severity: 'high',
                    message: 'Multi-column grid may not collapse on mobile',
                    suggestion: 'Add @media query to change grid to single column on mobile'
                });
            }
        }
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