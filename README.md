# Muhammad Faizan Portfolio

A futuristic, dark-mode-first portfolio built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Run locally

From the project folder:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Maintain content

Update the centralized portfolio content in:

- `content/portfolioData.ts`

That file contains the editable content for:

- profile and contact details
- skills
- project cards and filters
- resume metadata and experience
- telemetry and architecture data

## Key structure

- `app/page.tsx` — main portfolio page
- `components/command-palette.tsx` — global command palette
- `components/architecture-visualizer.tsx` — architecture selector UI
- `content/portfolioData.ts` — all maintainable data
- `app/globals.css` — Tailwind and cyberpunk visual system
