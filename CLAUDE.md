# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev        # Start Vite dev server with hot reload
npm run build      # TypeScript check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build locally
npx tsc --noEmit   # Type-check only (no output)
```

No test framework is configured. No project-specific README exists (just the Vite template default).

## What This Is

A "2016 Internet Time Machine" hackathon project. Users browse fake-but-convincing 2016 versions of Google, YouTube, and Twitter inside a fake Chrome browser frame. Humor comes from searching modern topics (ChatGPT, TikTok, NFT) and getting period-accurate 2016 results.

## Architecture

**Stack:** React 19 + TypeScript + Tailwind CSS 4 + Vite 8. Client-side only, no backend.

### Navigation (custom state machine, NOT react-router)

`src/hooks/useNavigation.ts` owns all routing via a state machine tracking `{site, page, query, videoId}`. The `BrowserShell` component renders the appropriate site component based on this state. The address bar is functional — typing URLs parses them into navigation state, and navigation state derives display URLs.

```
useNavigation(onNavigate) → [NavigationState, NavigationActions]
  - navigate(site, page?, {query?, videoId?})
  - navigateFromUrl(url)  // parses "youtube.com/watch?v=..." etc.
  - search(query)         // searches on current site
  - goBack() / goForward() // internal history stack
```

`App.tsx` is the router — it switches on `navState.site` and `navState.page` to render the correct component, and handles easter egg detection on search queries.

### Data strategy

All content is **pre-generated JSON** loaded synchronously via imports — no async data fetching for Google/Twitter results:

- `src/data/googleResults.json` — ~29 query-keyed search results
- `src/data/twitterResults.json` — ~20 query-keyed tweet feeds + `_trending` default feed
- `src/data/youtubeHomepage.json` — Real 2016 YouTube video IDs organized by category
- `src/data/fakeComments.ts` — Pool of fake 2016 YouTube comments

`src/lib/fuzzySearch.ts` wraps Fuse.js (threshold 0.4) to match user queries to the nearest pre-generated key. Fake 500-800ms delays simulate 2016 internet speed.

**YouTube live API** (`src/lib/youtube.ts`) is the only real API integration — searches YouTube Data API v3 filtered to 2016 date range. Requires `VITE_YOUTUBE_API_KEY` in `.env`. Falls back to homepage JSON data if the key is missing or quota is exhausted. Video embeds via `react-youtube` are free (no quota).

### Popups & Easter Eggs

- `PopupManager` — 30% chance of spawning a popup per navigation (ads, Flash Player, virus warnings). Clicking popup buttons spawns MORE popups.
- Harambe memorial — searching "harambe" on any site triggers a fullscreen memorial overlay
- Clippy assistant — 5% chance per navigation
- Google+ notification — 10% chance on Google pages
- Future year queries (2017+) return "this year does not exist yet"

### Shared types

`src/types.ts` defines all shared interfaces: `NavigationState`, `GoogleResult`, `Tweet`, `YouTubeVideoData`, `PopupType`. Site components import these directly.

## Key Patterns

- Components use Tailwind utility classes with hardcoded 2016-era color values (Google blue `#4285F4`, YouTube red `#cc181e`, Twitter blue `#1da1f2`)
- No react-router, no state management library — just `useState`/`useCallback`/`useRef` in hooks
- Audio via `howler` (imported but sound files in `public/sounds/` need to be sourced separately)
- The `BrowserShell` wraps all site content and provides the Chrome 2016 frame
