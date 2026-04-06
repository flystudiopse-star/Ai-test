# Paraglider Weather Application - SPEC.md

## 1. Project Overview

**Project Name:** SkyPulse - Paraglider Weather Dashboard  
**Type:** Single-page web application  
**Core Functionality:** Display detailed real-time weather data critical for paragliding decisions including wind profiles, thermal indicators, cloud conditions, and flight safety metrics.  
**Target Users:** Paragliders, hang gliders, and pilots planning aerial activities

## 2. UI/UX Specification

### Layout Structure

- **Header:** Logo, location search, current conditions summary
- **Hero Section:** Animated wind compass, flight condition badge
- **Grid Layout:** 6-card weather data grid (2x3 on desktop, 2x3 on tablet, 1 col mobile)
- **Footer:** Data source attribution, last updated timestamp

### Responsive Breakpoints
- Mobile: < 640px (1 column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

### Visual Design

**Color Palette:**
- Background: `#0a0e17` (deep navy)
- Card Background: `#131a2b` (dark slate)
- Card Border: `#1e2942` (muted blue-gray)
- Primary Accent: `#22d3ee` (cyan - for wind/sky elements)
- Secondary Accent: `#f59e0b` (amber - for sun/thermal)
- Warning: `#ef4444` (red - for dangerous conditions)
- Safe: `#10b981` (emerald - for good conditions)
- Text Primary: `#f1f5f9` (off-white)
- Text Secondary: `#94a3b8` (gray-blue)

**Typography:**
- Headings: "Outfit", sans-serif (700 weight)
- Body: "DM Sans", sans-serif (400, 500 weight)
- Data Values: "JetBrains Mono", monospace (for numbers)
- Heading sizes: H1 2.5rem, H2 1.5rem, H3 1.1rem
- Body: 1rem, Small: 0.875rem

**Spacing System:**
- Base unit: 8px
- Card padding: 24px
- Grid gap: 20px
- Section margin: 48px

**Visual Effects:**
- Cards: subtle glow on hover (`box-shadow: 0 0 30px rgba(34, 211, 238, 0.1)`)
- Wind compass: CSS animation rotating based on wind direction
- Weather icons: custom SVG with pulse animation for active conditions
- Background: subtle animated gradient mesh

### Components

1. **LocationSearch:** Input with geolocation button, dropdown suggestions
2. **WindCompass:** Circular compass with animated arrow, speed rings
3. **ConditionBadge:** Large status indicator (FLYABLE/CAUTION/DANGEROUS)
4. **WeatherCard:** Icon, label, value, trend indicator
5. **ThermalIndicator:** Vertical bar showing thermal strength
6. **CloudBaseMeter:** Visual height indicator with cloud icon

## 3. Functionality Specification

### Core Features

1. **Location Search**
   -文本输入框，支持城市名搜索
   -模拟数据：预设几个欧洲paragliding热门地点

2. **Current Conditions Display**
   - Temperature (°C)
   - Wind Speed (km/h) + Direction (degrees)
   - Wind Gusts (km/h)
   - Humidity (%)
   - Pressure (hPa)
   - Visibility (km)

3. **Flight Condition Assessment**
   - 综合评分：FLYABLE / CAUTION / DANGEROUS
   - Based on wind speed, gusts, precipitation

4. **Paragliding-Specific Data**
   - Cloud Base Height (m/ft)
   - Thermal Activity ( Weak / Moderate / Strong)
   - Thermal Velocity (m/s)
   - Dew Point Spread (°C) - for condensation risk

5. **Wind Compass**
   - Animated compass showing wind direction
   - Speed indicator rings

6. **Data Refresh**
   - Auto-refresh every 5 minutes
   - Manual refresh button
   - Last updated timestamp

### Simulated Weather Data
Since no real API, use realistic simulated data that changes slightly on refresh:
- Predefined locations with base conditions
- Random variation within realistic ranges for demo

### User Interactions
- Click location to change city
- Hover cards for detailed tooltip
- Click refresh to update data

## 4. Acceptance Criteria

- [ ] Page loads without errors
- [ ] All 6 weather cards display with data
- [ ] Wind compass animates
- [ ] Location search is functional (at least shows current location)
- [ ] Condition badge shows appropriate status
- [ ] Responsive on all breakpoints
- [ ] Animations are smooth
- [ ] No console errors

## 5. Technical Implementation

**Single HTML file with:**
- Embedded CSS (no Tailwind)
- Vanilla JavaScript (no frameworks)
- CSS custom properties for theming
- CSS Grid and Flexbox layout
- RequestAnimationFrame for compass
- LocalStorage for last location

---

## 6. Task Verification Policy

All tasks must be verified using the following checklist before closing:

### Pre-Close Requirements
1. **Code Review** - Code reviewed and approved
2. **Merge to Master** - Changes merged, no conflicts
3. **Deployment** - Deployed to `https://skypulse-weather.vercel.app`
4. **Live Site Testing** - Verified working on live site
5. **Console Check** - No JavaScript errors
6. **Layout Check** - Renders correctly on all breakpoints
7. **Feature Check** - All features functional

### QA Testing
Run the QA tester before closing any task:
```bash
node qa-tester.js
```

### Documentation
- See `VERIFICATION_CHECKLIST.md` for detailed checklist
- QA tester includes deployment verification (fetches live URL)
- All future tasks must follow this process