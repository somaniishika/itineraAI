# AGENTS.md

## Project rules
- Build the frontend as a small React + TypeScript + Vite app that sits beside the NestJS backend.
- Keep code simple and beginner-friendly: small functional components, clear names, basic hooks, and modest styling.
- Prefer a small number of files with clear responsibilities instead of a large abstraction layer.
- Reuse the installed packages rather than adding heavy libraries.
- Verify backend contracts before coding the UI. Do not assume request shapes or token behavior.
- Do not create fake or unfinished features. If a backend capability is missing or unverified, mark it as blocked or untested.

## Design preferences
- Use a warm, travel-inspired palette with cream backgrounds, navy text, terracotta accents, and soft borders.
- Keep layouts readable and responsive across mobile, tablet, and desktop.
- Use clear form states for loading, validation, and API errors.
- Preserve the product identity as ItineraAI with a travel itinerary subtitle.
- Use CSS variables for color and spacing so it is easy to tweak later.

## Implementation constraints
- Do not add Redux, Zustand, or other state libraries unless there is a clear need.
- Do not rewrite, delete, or modify backend code.
- Do not add large, unrelated feature code in this first pass.
- Do not claim success without checking the app build and runtime status.
- If a logo asset is unavailable, keep the product name visible and place the original logo in the public folder when it is provided.
