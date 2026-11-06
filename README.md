# Bloom in Braille

A welcoming, accessibility-first React prototype that guides beginners through discovering Braille, exploring stories, preparing source text, estimating materials, learning production methods and arranging their own donations.

## Requirements
- Node.js 18.18+ (20 LTS recommended)
- npm 9+

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Current capabilities
- React Router routes with browser Back/Forward and deep links.
- Presaved original stories with a dedicated reading page, bookmark and explicit “Prepare this story” handoff.
- Local browser bookmarks (not synced; clearing browser data can remove them).
- TXT, DOCX and PDF text extraction in the browser; scanned PDFs are detected when no extractable text is found.
- Extraction preview and editable text before any next step.
- Indicative material estimator for manual slate/stylus and embosser workflows.
- Responsive design, semantic landmarks, keyboard focus treatment and reduced-motion support.

## Important limitations
- The current Braille preview is explicitly a **learning/demo mapping**, not complete English Braille transcription. It does not implement Grade 1/Grade 2 rules, contractions, all punctuation, numerals or formatting.
- Hindi/Bharati Braille transcription is not implemented. Hindi content is retained for review but conversion is disabled until a verified Bharati Braille workflow is integrated.
- BRF generation and a production-ready embossed-layout PDF are not implemented. A Unicode preview is not a substitute for a correctly formatted BRF file.
- Scanned PDF OCR is not bundled. The app detects likely image-only PDFs and tells the user OCR is required.
- Contact form is a local demo and does not send email.
- Material prices and page estimates are indicative assumptions, not supplier quotes or guaranteed pagination.
- No files are uploaded to a server by this frontend. Extracted text exists in browser memory while the page is open; refreshing/closing clears the working session.

## Braille engine integration gate
Integrate Liblouis for English only after validating the selected table, grade, formatting and output against a test corpus and qualified reviewers. Treat Hindi/Bharati Braille as a separate workstream: verify available tables/rules with domain experts and Braille readers rather than assuming Liblouis support. Never label output verified or donation-ready without a documented review process.

## Project structure
```
src/
  components/   Navigation, footer, layout and reusable UI
  data/         Original sample stories and guide metadata
  lib/          Browser document extraction and estimate logic
  pages/        Home, About, Stories, Story detail, Content, Bookmarks, Contact
  App.jsx       Route definitions and shared state
  main.jsx      Application entry
  styles.css    Design tokens and responsive styling
```

## Privacy and content
Only upload documents you have permission to process and reproduce. This prototype processes files locally in the browser and does not transmit them. Do not use generated demo Braille output to produce or donate physical books. Contact a receiving school first and ask what language, level and format it actually needs.
