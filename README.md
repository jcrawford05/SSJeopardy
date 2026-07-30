# Sarah’s Bachelorette Trivia

A presentation-ready, browser-based trivia game built from the supplied 57-slide source deck. It uses plain HTML, CSS, and JavaScript and is suitable for GitHub Pages.

## Run locally

No build process is required. For the most reliable font and storage behavior, serve the folder with a small local web server instead of opening `index.html` directly.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Copy all files in this folder into the repository root.
3. Commit and push the files.
4. In GitHub, open **Settings → Pages**.
5. Set the source to **Deploy from a branch**, choose the main branch, and select the repository root.
6. Open the published URL and test it from a second computer.

## Controls

| Key | Action |
| --- | --- |
| `F` | Toggle full screen |
| `Space` | Reveal the answer; advance title/rules screens |
| `B` | Return to the board and complete the current clue |
| `H` | Return to the title screen without completing the current clue |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `R` | Open reset confirmation |
| `1` / `2` | Select Team 1 or Team 2 |
| `+` / `-` | Add or subtract the current clue value from the selected team |

## Content and assets

- Trivia wording is stored in `game-data.js`.
- The wedding countdown uses October 10, 2026 in the `America/Denver` time zone.
- Title, rules, and visual clue images were exported from the supplied deck.
- The Nickainley font file is not included. The rules screen is an exported image, so its original appearance is preserved without web-font embedding.
- Category headings use the supplied Adobe Fonts Typekit stylesheet when an internet connection is available.
- Question, answer, and point-value text use Google Fonts' Chewy.

## Saved progress

The browser automatically stores game state in `localStorage`. On reload, the app offers to resume the saved game or start over. Reset preserves the current team names but clears scores, used clues, undo history, and saved progress.

## Files

```text
index.html       Page shell and dialogs
styles.css       Visual design and responsive layout
app.js           Navigation, scoring, undo, reset, saving, and keyboard controls
game-data.js     Categories, clues, answers, and image links
assets/images/   Exported slide and clue assets
assets/icons/    Interface icons
.nojekyll        Prevents GitHub Pages from processing the site with Jekyll
```