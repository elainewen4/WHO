# UniCompare — Quebec × Ontario university comparison starter

A fully **static** website: no server, no database, no build step.
Search filters, map, comparison table and per-school pages all run
in the browser from one data file.

## How it works

```
index.html        → search page (filters, result cards, map, compare)
university.html   → detail page (renders any school from ?id=...)
css/style.css     → all styling (minimal Swiss look, one accent colour)
js/data.js        ← THE ONLY FILE YOU EDIT to add universities
js/i18n.js        → EN/FR interface labels
js/app.js         → search page logic
js/university.js  → detail page logic
```

## Add a university (2 minutes)

Open `js/data.js` and copy an existing object inside `UNIVERSITIES`.
Every field explained:

| Field | What it is |
|---|---|
| `id` | Unique slug used in the URL (`university.html?id=mcgill`) |
| `name`, `nameFr` | English + French names |
| `city`, `province` | `"QC"` or `"ON"` |
| `lat`, `lng` | Coordinates for the map (Google Maps → right-click → copy coords) |
| `languages` | Array: `"en"`, `"fr"`, or both |
| `students` | Total enrolment |
| `acceptanceRate` | % (label as estimate — many schools don't publish it) |
| `rScoreRange` | `[min, max]` CRC for Quebec schools, `null` for Ontario |
| `gradeRange` | Admission average range as a string |
| `tuition` | `{ qc, otherCanadian, international }` in $/year |
| `residence` | `{ guaranteed, monthly: [min, max] }` |
| `livingCost` | Estimated $/month |
| `admission` | Letter/interview requirements, deadline, notes |
| `programs` | One entry per program from `PROGRAM_TAXONOMY` with `rScoreMin` (null in Ontario), `gradeMin`, `coop` |
| `life` | Campus type, varsity, clubs count, school/social descriptions |
| `scholarships` | One-line summary |

Add a new program type by appending to `PROGRAM_TAXONOMY`
(give it an `id`, English and French names) — it automatically
appears in the search dropdown.

## ⚠️ Replace the sample data

All numbers in `js/data.js` are **placeholders**. Real figures:

- **Ontario** — [OUInfo](https://www.ouinfo.ca) (programs, admission requirements,
  scholarships, updated by the universities themselves) and
  [CUDO](https://cudo.ouac.on.ca) (entering averages, class sizes, tuition,
  graduation & employment rates in a standard format)
- **Quebec** — [MES statistics](https://www.quebec.ca/education/indicateurs-statistiques/enseignement-superieur)
  (enrolment, graduation, Relance surveys) + each university's site for
  R-score (CRC) cutoffs

## Deploy it free (pick one)

**GitHub Pages**
1. Create a GitHub repository and push these files
2. Settings → Pages → Source: `main` branch
3. Your site is live at `https://<username>.github.io/<repo>`

**Netlify (easiest)**
1. Go to app.netlify.com/drop
2. Drag the whole `uni-compare` folder onto the page
3. Done — you get a live URL immediately

**Cloudflare Pages** — connect the Git repo, build command: none,
output directory: `/`.

## Extending it

Ideas that fit the existing structure without new infrastructure:
- Comments from current students → add a `comments` array per school
  (for a real commenting system you'd need a free tier like
  giscus.org, which stores comments in GitHub Discussions)
- More filters → add a field in `data.js` + a `<select>` in
  `index.html` + one condition in `passes()` in `js/app.js`
- Sort results → add a sort in `render()` in `js/app.js`
