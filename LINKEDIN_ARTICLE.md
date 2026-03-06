# How I Used Claude Code to Revamp My Very First Web Project

A few days ago, I decided to revisit Road to Rock — a classic rock music trivia game I built back in 2016. It was my very first web development project. jQuery, four separate HTML pages, copy-pasted JavaScript files, 110MB of video backgrounds. You know the type.

I wanted to bring it up to modern standards, but I didn't want to spend a weekend on it. So I paired with Claude Code to see how far we could get in a single session. Here's what happened and what I learned about using AI tooling effectively as an engineer.

## The Starting Point

The original codebase had some real gems:

- **3x duplicated game logic** — `easy.js`, `medium.js`, and `hard.js` were nearly identical 190-line files. The only difference was the song data array at the top.
- **jQuery 3.1.0** for `$('.answer')[0].value` and `$(document).click()` — things that vanilla JS handles natively in every modern browser.
- **110MB of video files** used as blurred backgrounds. The visual contribution was essentially a dark gradient.
- **Custom query string parsing** to pass the player's name between pages. `window.location.search` spaghetti instead of just... keeping state in memory.

It worked. It was also my first project ever, and I'm not embarrassed by it — everyone starts somewhere. But as a portfolio piece in 2026, it needed work.

## How I Approached It With Claude Code

The key thing I've learned about working with AI coding tools: **you get better output when you operate like a tech lead, not a typist.** I didn't just say "make it better." I came in with a clear scope, reviewed everything before approving changes, and made architectural calls myself.

Here's roughly how the session went:

### 1. Full Codebase Audit First

Before writing a single line, I had Claude read every file — all four HTML pages, all the JS, all the CSS. This is something I see people skip when using AI tools. If the model doesn't understand the existing system, it'll generate code that doesn't fit.

The audit surfaced the duplication problem immediately. Three game files with ~95% identical code. Three CSS files that were literally the same. That's the kind of thing that's easy to miss when you wrote it yourself years ago.

### 2. Architecture Decisions Were Mine

Claude proposed consolidating into a single-page app with vanilla JS. I agreed — but the reasoning was mine to validate:

- **No framework needed.** This is a trivia game with three screens. React would be like driving a semi truck to the grocery store.
- **Drop jQuery.** `document.querySelector`, `classList.toggle`, and `addEventListener` cover 100% of what we were using jQuery for. That's an 87KB dependency gone.
- **CSS backgrounds instead of video.** A canvas noise texture + SVG grain overlay + radial vignette creates a better atmosphere than a blurred video, at 0KB instead of 110MB.
- **Single data config.** All 30 songs defined once, selected by difficulty key. Eliminates the duplication entirely.

These aren't decisions I'd blindly delegate. The model can write the code, but the tradeoff analysis — "is a framework worth it here?", "will this scale?", "what's the maintenance cost?" — that's engineering judgment.

### 3. Design With Intent

I used Claude Code's frontend design capability to generate the new UI. But I gave it a specific creative direction: dark venue aesthetic, vintage concert poster meets modern web, warm golds and ambers, Monoton display font (kept from the original).

The result was a cohesive design system with CSS custom properties, proper typography hierarchy (Monoton + Outfit + Space Mono), and atmospheric effects — all without a single image asset for the background.

### 4. Iterative Refinement

The first pass wasn't perfect. I reviewed the deployed site and came back with specific feedback:

- Footer text was overlapping the difficulty buttons
- The video background from the original was actually nice — bring it back for the landing page
- The one-listen-only mechanic was too restrictive. Players should be able to pause and replay.
- Name input should be required, not optional
- Game screen elements were too small
- Answer matching needed to be more forgiving (Lynard Skynard, AC/DC vs ACDC, CCR)

Each of these is a product decision backed by UX reasoning. Claude implemented them, but I was the one playtesting and identifying the gaps. That feedback loop — build, review, refine — is exactly how I'd work with a junior engineer, and it's how I get the best results from AI tooling.

### 5. Infrastructure in the Same Session

Beyond the code, we handled the full deployment pipeline:

- **GitHub security** — Enabled secret scanning and push protection via the GitHub API
- **Vercel deployment** — Linked the repo, deployed to production, confirmed auto-deploy on push to master
- **Asset audit** — Identified that the 30 audio clips (~11MB total) were fine to keep in-repo, while the video files (~110MB) needed to go

One session. Code, design, deployment, security.

## The Result

**Before:** 4 HTML files, 3 duplicated JS files, 3 duplicated CSS files, jQuery dependency, 439MB repo, no deployment pipeline.

**After:** 1 HTML file, 1 JS file, 1 CSS file, zero dependencies, ~30MB repo, auto-deploying on Vercel, security scanning enabled.

The game itself is better too — responsive design, play/pause/replay controls, fuzzy answer matching for common misspellings, visual progress tracking, animated score feedback.

Live at: https://road-to-rock.vercel.app

## What I Actually Learned

AI coding tools are powerful, but they're force multipliers — not replacements. The session was productive because I brought:

1. **Clear scope.** I knew what I wanted before starting. "Consolidate, modernize, deploy" is a better prompt than "make it better."
2. **Architectural judgment.** Knowing when a framework is overkill, when duplication is the real problem, when an asset strategy matters. The model can propose, but you need to evaluate.
3. **Product taste.** Catching that the footer overlaps on certain viewports, that one-listen-only is bad UX, that "Lynard Skynard" should be accepted — these come from actually using the thing.
4. **Review discipline.** I read every change before committing. AI-generated code still needs the same scrutiny you'd give a PR from any contributor.

The best engineers I've worked with have always been great at leveraging their tools. Claude Code is just the latest in that lineage — but like any tool, the output quality depends on the operator.

---

*Road to Rock is open source at [github.com/alextongme/RoadToRock](https://github.com/alextongme/RoadToRock). The full architecture documentation is in REVAMP.md.*
