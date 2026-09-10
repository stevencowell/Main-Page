# Textbook library

Public route: https://stevencowell.github.io/Main-Page/textbook-library/

This is the central catalogue of completed TAS textbooks and workbooks. It includes Desk Tidy Editorial Edition 2.0, Footstool Edition 1.0, Programmable Light Edition 1.0, Breadboard Edition 1.0 and Small Box Edition 1.1 (optional lid). Existing course sites remain the teaching hubs.

## Add a finished book

1. Complete the source, content, image and print-layout checks. Retain the editable master, approved print PDF and teacher guide.
2. Add the final files under `books/<unit-id>/`. Include a lightweight cover render and an inside-pages preview under `assets/`.
3. Add one entry to `textbooks.json`, following the Desk Tidy fields. Record actual page and duplex-sheet counts, edition and correct course URL. Add completed books only.
4. Run `node scripts/build-textbook-library.mjs` from the repository root. It checks required metadata and files, and regenerates the static cards, subject options and count. Cards and downloads work without JavaScript; search and preview are enhancements.
5. Check the card, PDF/downloads, teacher resources, search/reset, keyboard preview controls and 390px layout. Verify final document bytes after deployment.

Do not silently replace an existing approved edition with an unfinished document. Source documents and production checks for each workbook are retained in its creating task; only final public artifacts are included here.
