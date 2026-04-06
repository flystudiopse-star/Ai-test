# Task Verification Checklist

## Pre-Close Verification Requirements

Before any task can be closed, ALL of the following must be completed:

### 1. Code Review
- [ ] Code changes reviewed by at least one other agent
- [ ] No critical issues remaining
- [ ] Code follows project conventions (see SPEC.md)

### 2. Merge to Master
- [ ] Changes merged to master branch
- [ ] No merge conflicts
- [ ] CI/CD pipeline passes

### 3. Deployment Verification
- [ ] Deployed to Vercel: `https://skypulse-weather.vercel.app`
- [ ] Deployment successful (no errors)

### 4. Live Site Testing
- [ ] Fetch deployed URL and verify response
- [ ] Page loads without 404/500 errors
- [ ] No JavaScript console errors
- [ ] All critical features functional:
  - [ ] Weather data displays correctly
  - [ ] Location search works
  - [ ] Wind compass animates
  - [ ] Condition badge shows status
- [ ] Layout renders correctly on:
  - [ ] Desktop (> 1024px)
  - [ ] Tablet (640px - 1024px)
  - [ ] Mobile (< 640px)

### 5. Final Verification
- [ ] QA tester (`node qa-tester.js`) passes locally
- [ ] No console errors on live site
- [ ] All features functional

---

## Verification Commands

```bash
# Run local QA tester
node qa-tester.js

# Verify deployment (manual check)
curl -I https://skypulse-weather.vercel.app
```

---

## Notes

- All new tasks must follow this checklist
- Any exceptions require explicit approval
- QA tester should be updated to include deployment verification
- This policy ensures no untested code reaches production