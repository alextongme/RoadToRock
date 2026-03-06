# Road to Rock — Revamp Documentation

## Overview

Complete revamp of a classic rock music trivia game, originally built in 2016 as a first web development project. The original used jQuery, multi-page architecture, and video backgrounds. This revamp modernizes everything while preserving the core game concept and all audio assets.

## Architecture Decisions

### Single-Page App (no framework)
- **Before:** 4 separate HTML files (index, easy, medium, hard) with nearly identical JS/CSS duplicated 3x
- **After:** 1 `index.html`, 1 `style.css`, 1 `app.js` — ~35KB total vs ~50KB+ of duplicated code
- **Why no framework:** This is a simple trivia game with 3 screens. React/Vue/Svelte would be overkill. Vanilla JS with ES6+ is the right tool — fast, zero dependencies, demonstrates fundamental skills.

### jQuery Removal
- jQuery was used for DOM manipulation, event binding, and CSS changes — all trivially handled by modern vanilla JS
- Removed the 87KB jQuery 3.1.0 CDN dependency
- `document.querySelector` / `classList` / `addEventListener` cover 100% of use cases here

### Video → CSS Backgrounds
- **Before:** 3 video files (.mp4, .webm, .ogv) totaling ~110MB used as blurred backgrounds
- **After:** CSS noise texture canvas + grain overlay + vignette — ~0KB, more performant, more atmospheric
- The videos added little visual value (they were blurred to near-solid) but bloated the repo significantly

### Audio Assets Kept In-Repo
- 30 .m4a audio clips totaling ~11MB — small enough to stay in the repo
- Vercel serves them as static assets with proper caching
- No need for external CDN/storage for this size

## Design System

### Aesthetic: "Dark Venue"
Inspired by the atmosphere of a dimly lit concert venue — warm amber stage lighting, grain/noise texture, vignette edges. Vintage concert poster typography meets modern UI patterns.

### Typography
- **Display:** Monoton (kept from original — perfect for rock aesthetic)
- **Body:** Outfit — geometric sans with personality, replaces Raleway
- **Mono:** Space Mono — for labels, stats, and UI chrome

### Color Palette
- Gold (#d4a029) — primary accent, inherited from original's #D4AF37
- Deep black (#0a0908) — warm-tinted background, not pure black
- Red (#b8342e) — strikes/errors
- Green (#3cb860) — correct answers
- Text hierarchy: #e8e0d4 → #8a8070 → #5a5448 (warm-tinted grays)

### Visual Effects
- **Noise canvas:** Subtle animated noise texture via `<canvas>`
- **Grain overlay:** SVG feTurbulence filter as CSS background
- **Vignette:** Radial gradient darkening edges
- All three layer to create depth without video files

### Responsive Design
- Fluid typography with `clamp()`
- Difficulty buttons stack vertically on mobile
- Player tag hidden on small screens (info available in game state)
- All touch-friendly tap targets (44px+ minimum)

## Game Logic

### Core Mechanics (preserved)
- Fisher-Yates shuffle for random song order
- Case-insensitive answer matching
- "The" prefix tolerance (both directions)
- 3 strikes = game over
- 10 rounds per game

### Improvements
- Added AC/DC variant matching (AC/DC, AC DC, ACDC)
- Added CCR shorthand matching for Creedence Clearwater Revival
- Visual feedback: correct/wrong shown before auto-advancing
- Progress bar with per-round color coding
- Strike pip indicators (visual dots)
- One-listen mechanic made explicit (play button disables after use)
- Answer input only enables after listening (prevents submitting before hearing)

## Deployment

### Vercel
- Static site deployment — no build step needed
- Auto-deploys on push to master
- Zero configuration for static HTML/CSS/JS

### GitHub
- Repo: alextongme/RoadToRock
- Secret scanning + push protection enabled
- Old video files (.mp4, .ogv, large .webm) removed from working tree

## File Structure

```
RoadToRock/
├── index.html          # Single-page app
├── style.css           # All styles
├── app.js              # All game logic
├── favicon.ico         # Tab icon
├── easy/               # Easy difficulty audio clips (10 .m4a)
├── medium/             # Medium difficulty audio clips (10 .m4a)
├── hard/               # Hard difficulty audio clips (10 .m4a)
├── screenshots/        # Project screenshots
├── REVAMP.md           # This file
└── README.md           # Project readme
```

## Technical Tradeoffs

| Decision | Tradeoff | Reasoning |
|----------|----------|-----------|
| No framework | Manual DOM management | App is simple enough; shows vanilla JS competence |
| No build step | No minification/bundling | Total JS+CSS < 30KB; build tooling overhead not justified |
| CSS backgrounds vs video | Less "cinematic" | 100x lighter, faster load, better performance |
| Audio in repo | Larger git repo | Only ~11MB; simpler than external hosting |
| Single file per type | Longer files | Better than 3x duplication; easy to navigate |
