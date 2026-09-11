import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../textbook-library');
const books = JSON.parse(fs.readFileSync(path.join(root, 'textbooks.json'), 'utf8'));
const ids = new Set();
const e = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const size = name => `${(fs.statSync(path.join(root, name)).size / 1e6).toFixed(1)} MB`;
const newTab = '<span class="sr-only"> (opens in a new tab)</span>';
const assetUrls = new Map();
const assetUrl = file => {
  if (!assetUrls.has(file)) {
    const version = createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex').slice(0, 12);
    assetUrls.set(file, e(`${file}?v=${version}`));
  }
  return assetUrls.get(file);
};
for (const b of books) {
  if (!/^[a-z0-9-]+$/.test(b.id) || ids.has(b.id)) throw new Error(`Invalid or duplicate book id: ${b.id}`);
  ids.add(b.id);
  for (const field of ['title','subject','stage','type','edition','description','includes']) if (!b[field]) throw new Error(`${b.id}: missing ${field}`);
  if (!Number.isInteger(b.pages) || b.pages < 1 || !Number.isInteger(b.sheets) || b.sheets < 1) throw new Error(`${b.id}: invalid print counts`);
  for (const field of ['cover','preview','pdf','word','teacherGuide']) {
    if (!b[field] || !path.resolve(root, b[field]).startsWith(root + path.sep) || !fs.existsSync(path.join(root, b[field]))) throw new Error(`${b.id}: missing or unsafe ${field}`);
  }
  if (!b.course?.startsWith('https://stevencowell.github.io/')) throw new Error(`${b.id}: verify the course URL`);
  if (fs.readFileSync(path.join(root, b.pdf)).subarray(0,5).toString() !== '%PDF-') throw new Error(`${b.id}: invalid student PDF`);
}
const card = b => `<article class="book-card" id="${e(b.id)}" data-subject="${e(b.subject)}" data-search="${e([b.title,b.subject,b.stage,b.type,b.description,b.includes].join(' ').toLocaleLowerCase('en-AU'))}" aria-labelledby="${e(b.id)}-title">
  <div class="cover-panel">
    <a class="cover-link" href="${assetUrl(b.pdf)}" target="_blank" rel="noopener" aria-label="Open ${e(b.title)} student workbook PDF (opens in a new tab)"><img src="${assetUrl(b.cover)}" width="701" height="991" alt="${e(b.title)} workbook cover" loading="lazy"></a>
    <a class="preview-link" href="${assetUrl(b.preview)}" data-preview data-title="${e(b.title)}" data-pdf="${assetUrl(b.pdf)}">Look inside <span aria-hidden="true">↗</span></a>
  </div>
  <div class="book-copy">
    <p class="book-meta">${e(b.stage)} · ${e(b.subject)} · ${e(b.type)}</p>
    <h3 id="${e(b.id)}-title"><a href="${assetUrl(b.pdf)}" target="_blank" rel="noopener">${e(b.title)}${newTab}</a></h3>
    <p class="book-description">${e(b.description)}</p>
    <p class="book-includes">${e(b.includes)}</p>
    <p class="book-facts"><span>${b.pages} pages</span><span>${b.sheets} double-sided sheets</span><span>A4</span><span>Edition ${e(b.edition)}</span></p>
    <div class="book-actions"><a class="button primary" href="${assetUrl(b.pdf)}" target="_blank" rel="noopener">Open workbook (PDF) <span aria-hidden="true">↗</span>${newTab}</a><a class="button" href="${assetUrl(b.pdf)}" download="${e(b.id)}-student-workbook.pdf">Download PDF <span aria-hidden="true">↓</span></a></div>
    <p class="download-note">PDF · ${size(b.pdf)}. Print double-sided on A4, flipping on the long edge.</p>
    <a class="course-link" href="${e(b.course)}" target="_blank" rel="noopener">Open the matching course <span aria-hidden="true">↗</span>${newTab}</a>
    <details class="teacher-resources"><summary>Teacher resources</summary><div class="teacher-resource-links"><a href="${assetUrl(b.word)}" download>Editable workbook (Word) · ${size(b.word)}</a><a href="${assetUrl(b.teacherGuide)}" target="_blank" rel="noopener">Teacher guide and answers (PDF)${newTab}</a><small>Use the student PDF for printing. Word pagination can vary between computers.</small></div></details>
  </div>
</article>`;
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function replace(name, value) {
  const re = new RegExp(`<!-- ${name}_START -->[\\s\\S]*?<!-- ${name}_END -->`);
  if (!re.test(html)) throw new Error(`Missing ${name} template markers`);
  html = html.replace(re, `<!-- ${name}_START -->\n${value}\n<!-- ${name}_END -->`);
}
replace('BOOKS', books.map(card).join('\n'));
replace('COUNT', `${books.length} ${books.length === 1 ? 'book' : 'books'} available`);
replace('SUBJECTS', [...new Set(books.map(b => b.subject))].sort().map(s => `<option value="${e(s)}">${e(s)}</option>`).join('\n'));
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(`Built ${books.length} complete textbook ${books.length === 1 ? 'card' : 'cards'} with verified local files.`);
