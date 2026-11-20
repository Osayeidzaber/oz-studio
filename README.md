# OZ Studio

The site for [ozstudio.cc](https://ozstudio.cc), the independent design and development practice of Osayeed Zaber.

Next.js 16 (App Router, static), React 19, GSAP + ScrollTrigger, Lenis smooth scroll. Black only: the tokens live at the top of `src/app/globals.css`.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm typecheck
```

## Where things are

- `src/data/studio.ts` holds all the copy: live sites, the project index, services and steps. Facts only, no invented clients or numbers.
- `public/work/` holds the full-page captures of each live site (`<slug>-full-desktop.jpg`, `<slug>-full-mobile.jpg`) and a cover (`<slug>-live.jpg`). Most of these sites refuse to be framed, so the showcase scrolls a real capture and links to the live site. Re-capture after a site changes and update the heights in `studio.ts`.
- `src/components/` has one file per section, plus the motion layer (`smooth-scroll`, `preloader`, `cursor`, `magnetic`, `reveal`).

## Motion notes

- Lenis runs on GSAP's ticker, so ScrollTrigger and the scroll share one loop. Anything that should scroll natively inside the page (the showroom viewer) carries `data-lenis-prevent`.
- The showcase pins and runs sideways above 960px; below that, it's a vertical stack. Each capture scrolls with your scroll through `containerAnimation`.
- `prefers-reduced-motion` turns off smooth scroll, the intro and all scroll-linked motion.
- `reactStrictMode` is off: the double mount in dev breaks the showcase pin.
