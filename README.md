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
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. In Vercel, **Add New → Project**, import the repo.
3. Framework preset: **Other**. Leave build command and output directory empty.
4. Deploy.

Vercel serves `index.html` at the root. Every push to `main` redeploys.

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

Year-one return is calculated against the Full package at $84,000/yr. To change it,
edit `ANNUAL_FEE` at the top of `app.js` and the `#o-plan` / `#o-fee` spans in `index.html`.

### Source material

- Discovery call, 2026-09-04 (HubSpot note 397175090877)
- Platform review, 2026-09-11 (HubSpot note 399283537641)
- `Nippon_Paint_Monk_Business_Case (1).xlsx`
- `Nippon Paint & Monk Partnership Overview.pptx`
- HubSpot deal 344378152650

Confidential.
