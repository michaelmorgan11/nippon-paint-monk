# Monk × Nippon Paint Automotive Americas

Executive partnership page prepared for Ron Neal, Corporate Controller.
Static site — no build step, no dependencies.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page |
| `styles.css` | Styles |
| `app.js` | Business case calculator + DSO chart |
| `vercel.json` | Clean URLs and a `noindex` header so the page stays out of search results |

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
```

You can also just open `index.html` directly in a browser — no server needed.

`npm run build` emits static files to `dist/`. There is no framework and no JSX —
`index.html`, `styles.css` and `app.js` are the whole site. Vite is here only to give
v0 and Vercel a dev server and a build step to run.

**Keep `app.js` a classic script.** Marking it `type="module"` makes the browser refuse
to load it over `file://`, which silently kills the calculator, the scenario buttons and
the DSO chart when the page is opened straight off disk. Vite won't bundle a non-module
script, so `vite.config.js` copies it through to `dist/` verbatim instead.

## Deploy to Vercel

1. Push to GitHub (see below).
2. Vercel → **Add New → Project** → import the repo.
3. Vercel auto-detects **Vite**. Leave the build settings alone.
4. Deploy. Every push to `main` redeploys.

## Pull into v0

> **Sandbox hosts.** Vite blocks unrecognised `Host` headers, and v0 serves the dev
> server on a generated `*.vercel.run` hostname, so `vite.config.js` allows the
> `.vercel.run` and `.vercel.app` domains. Without that you get
> *"Blocked request. This host is not allowed."* Allowing the domain rather than one
> host matters — the sandbox hostname changes every session.


v0 imports a GitHub repo into a Vercel Sandbox, installs with the repo's lockfile and
runs its dev server — which is why this repo carries a `package.json` and
`package-lock.json` rather than being bare HTML.

1. Make sure the [Vercel GitHub App](https://github.com/apps/vercel) can access the repo.
   For a private repo you may need to grant it from
   [GitHub App settings](https://github.com/settings/installations).
2. In v0, start a new chat → **+** menu → **Import from…** → **Import from GitHub**.
3. Paste the repo URL.
4. Set **Base Branch** to `main` and **Root Directory** to `./`.
5. Import.

v0 does not write to `main`. The first code change creates an isolated working branch
plus a preview deployment, and you publish through a pull request.

## Brand

Tokens, type scale and component treatments are lifted from Monk's executive partnership
system, not approximated:

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `oklch(98.2% .006 77)` — warm cream | Page ground |
| `--foreground` | `oklch(22% .006 55)` | Body text |
| `--primary` | `oklch(68% .17 49)` — orange | Accent, emphasis, CTAs |
| `--secondary` | `oklch(94.8% .008 78)` | Alternating section bands |
| `--dark` | `oklch(30% .013 55)` | Hero, statement, trajectory, handoff |
| `--highlight` | `oklch(95% .08 96)` | Marker underline on pull quotes |
| `--success` | `oklch(49% .12 154)` | Completed milestones |

Type is **Instrument Serif** at weight 400 for every heading and display number, **Inter**
for body. Radii are 6–8px, cards sit on `--shadow-card`, and dark sections carry the orange
radial glow. `<em>` renders orange inside headings; `<mark>` draws the yellow marker underline.

## Where the numbers come from

The calculator mirrors the Proof of Value workbook. All six inputs are editable in the browser
and every output recalculates from them.

- One day of DSO = revenue ÷ 365 = **$821,918** at $300M
- AR balance = revenue ÷ 365 × DSO (derived — replace with the real aging report when it arrives)
- Working capital released = revenue ÷ 365 × days removed
- Carrying benefit = released capital × cost of capital
- Year-one recurring value = carrying benefit + AR hire avoided
- Three-year benefit = three years of recurring value + the final-year release
  (the release comes out once and stays out, so it is not summed)

Year-one return and payback are still calculated against $84,000/yr (`ANNUAL_FEE` at the
top of `app.js`), but pricing is no longer shown on the page, so the tiles are labelled
"Year-one return" and "Payback period" without naming a package. Change `ANNUAL_FEE` if the
commercials move.

## Images

Headshots and logos are extracted from `Nippon Paint & Monk Partnership Overview.pptx`
(`assets/team/`, `assets/logos/`). Headshots are mapped to names by the slide's own shape
geometry and z-order rather than by eye — slide 17 carries two overlapping images in the
Michael Morgan column, and `image103` is the one on top.

`assets/logos/nippon-paint.png` is NPAC's own mark, used in the hero lockup on a white chip
because its blue wordmark has too little contrast directly on the dark ground.

**Monk's logo ships in two variants.** `monk.png` is the supplied artwork, for light
grounds (nav, footer). `monk-light.png` is derived from it by recolouring only the
low-saturation wordmark pixels to `--dark-foreground`, for dark grounds (hero lockup,
statement band). The orange marks are byte-identical between the two, so the variants
cannot drift apart — regenerate `monk-light.png` from `monk.png` rather than sourcing a
second file, since the deck's light version uses a different orange (`#EE5F00` against
`#FE510E`).

### Source material

- Discovery call, 2026-09-04 (HubSpot note 397175090877)
- Platform review, 2026-09-11 (HubSpot note 399283537641)
- `Nippon_Paint_Monk_Business_Case (1).xlsx`
- `Nippon Paint & Monk Partnership Overview.pptx`
- HubSpot deal 344378152650

Confidential.
