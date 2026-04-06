# CI/CD Pipeline Documentation

## Overview
This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### main.yml - CI Pipeline
Runs on every push to master and every pull request targeting master.

**Jobs:**
1. **lint** - Validates HTML structure and checks CSS syntax using stylelint
2. **validate-js** - Extracts and validates JavaScript syntax, verifies required components exist
3. **test** - Runs qa-tester.js automated tests
4. **build** - Verifies project build files exist

### deploy.yml - Deployment Pipeline
Runs automatically on every push to master branch.

**Steps:**
1. Checkout code
2. Configure GitHub Pages
3. Upload artifact (entire repository)
4. Deploy to GitHub Pages

## Running Locally

```bash
# Run all CI checks locally
npm run ci

# Run tests only
npm run test

# Validate JavaScript
npm run validate

# Build verification
npm run build
```

## GitHub Pages Setup

1. Go to Repository Settings > Pages
2. Source: GitHub Actions
3. The deploy.yml workflow will automatically deploy on master push

## Notes
- The app is a single HTML file with embedded CSS and JavaScript
- No build step required - files are served directly
- GitHub Pages deployment uses the `actions/upload-pages-artifact` action