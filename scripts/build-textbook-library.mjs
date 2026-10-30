import {groupBooks, renderSubjectNavigation, renderBookSections} from './textbook-subject-sections.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../textbook-library');
const siteRoot = path.resolve(root, '..');
const books = JSON.parse(fs.readFileSync(path.join(root, 'textbooks.json'), 'utf8'));
const ids = new Set();
// Update an existing card without reading unrelated local book assets.
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--book' || !/^[a-z0-9-]+$/.test(args[1]))) {
  throw new Error('Usage: node scripts/build-textbook-library.mjs [--book existing-book-id]');
}
const onlyId = args[1];
if (onlyId && !books.some(book => book.id === onlyId)) throw new Error(`Unknown book id: ${onlyId}`);
const e = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const assetPath = name => {
  if (typeof name !== 'string' || !name || /^[a-z][a-z0-9+.-]*:/i.test(name) || path.isAbsolute(name)) throw new Error(`Invalid asset path: ${name}`);
  const resolved = path.resolve(root, name);
  const relative = path.relative(siteRoot, resolved);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error(`Asset escapes site: ${name}`);
  return resolved;
};
// Only exact registered, fixed-tag student PDF URLs may be remote.
const releaseRegistry = JSON.parse(fs.readFileSync(path.join(root, 'pdf-release-assets.json'), 'utf8'));
if (releaseRegistry.manifestSha256 !== '673417de04be7390d3679361acdd30b66e6ceaf8d5f2bf22d330be871ab90727' || !Array.isArray(releaseRegistry.assets) || releaseRegistry.assets.length !== 50) throw new Error('Invalid accepted release manifest');
const releaseAssets = new Map();
const releaseBookIds = new Set();
// A registered immutable PDF may remain historical when a later accepted
// local revision is active. Validate that replacement before accepting it.
const validLocalRevision = book => {
  if (!book || typeof book.pdf !== 'string'
      || !book.pdf.startsWith(`books/${book.id}/revisions/`)
      || !/^books\/[a-z0-9-]+\/revisions\/[a-z0-9-]+\/[a-z0-9-]+\.pdf$/.test(book.pdf)) return false;
  const file = assetPath(book.pdf);
  return fs.existsSync(file) && fs.readFileSync(file).subarray(0, 5).toString() === '%PDF-';
};
for (const asset of releaseRegistry.assets) {
  if (!/^[a-z0-9-]+$/.test(asset.bookId) || releaseBookIds.has(asset.bookId)
      || !/^[a-f0-9]{64}$/.test(asset.sha256)
      || !Number.isSafeInteger(asset.bytes) || asset.bytes < 5
      || asset.manifestSha256 !== releaseRegistry.manifestSha256
      || asset.assetName !== `${asset.bookId}-student-workbook-year8-template-20261011.pdf`
      || asset.url !== `https://github.com/stevencowell/Main-Page/releases/download/workbook-pdf-covers-20261011-v1/${asset.assetName}`
      || !books.some(book => book.id === asset.bookId && (book.pdf === asset.url || validLocalRevision(book)))
      || releaseAssets.has(asset.url)) throw new Error('Invalid release PDF metadata');
  releaseAssets.set(asset.url, asset);
  releaseBookIds.add(asset.bookId);
}
const releasePdf = name => releaseAssets.get(name);
const size = name => `${((releasePdf(name)?.bytes ?? fs.statSync(assetPath(name)).size) / 1e6).toFixed(1)} MB`;
const newTab = '<span class="sr-only"> (opens in a new tab)</span>';
const assetUrls = new Map();
const assetUrl = file => {
  if (releasePdf(file)) return e(file);
  if (!assetUrls.has(file)) {
    const version = createHash('sha256').update(fs.readFileSync(assetPath(file))).digest('hex').slice(0, 12);
    assetUrls.set(file, e(`${file}?v=${version}`));
  }
  return assetUrls.get(file);
};

for (const b of books) {
  if (!/^[a-z0-9-]+$/.test(b.id) || ids.has(b.id)) throw new Error(`Invalid or duplicate book id: ${b.id}`);
  ids.add(b.id);
  for (const field of ['title','subject','stage','type','edition','description','includes']) if (!b[field]) throw new Error(`${b.id}: missing ${field}`);
  if (!Number.isInteger(b.pages) || b.pages < 1 || !Number.isInteger(b.sheets) || b.sheets < 1) throw new Error(`${b.id}: invalid print counts`);
  if (onlyId && b.id !== onlyId) continue;
  for (const field of ['cover','preview','pdf',...(b.word ? ['word'] : []),...(b.teacherGuide ? ['teacherGuide'] : [])]) {
    if (field === 'pdf' && releasePdf(b.pdf)?.bookId === b.id) continue;
    if (!b[field] || !fs.existsSync(assetPath(b[field]))) throw new Error(`${b.id}: missing or unsafe ${field}`);
  }
  if (b.previousEdition) {
    const old = b.previousEdition;
    if (!old.edition || !Number.isInteger(old.pages) || old.pages < 1 || !old.pdf) throw new Error(`${b.id}: invalid previous edition`);
    for (const field of ['pdf', ...(old.word ? ['word'] : []), ...(old.teacherGuide ? ['teacherGuide'] : [])]) {
      if (!/^books\/[a-z0-9-]+\/[a-z0-9-]+\.(pdf|docx)\?v=[a-f0-9]{12}$/.test(old[field])) throw new Error(`${b.id}: unsafe previous edition path`);
    }
  }
  for (const item of b.supplements || []) {
    if (!item.title || !Number.isInteger(item.pages) || item.pages < 1) throw new Error(`${b.id}: invalid supplement`);
    for (const field of ['pdf', ...(item.word ? ['word'] : [])]) {
      if (!item[field] || !fs.existsSync(assetPath(item[field]))) throw new Error(`${b.id}: missing supplement ${field}`);
    }
    if (fs.readFileSync(assetPath(item.pdf)).subarray(0,5).toString() !== '%PDF-') throw new Error(`${b.id}: invalid supplement PDF`);
  }
  if (!b.course?.startsWith('https://stevencowell.github.io/')) throw new Error(`${b.id}: verify the course URL`);
  if (b.classroom && !/^\.\.\/classroom-library\/#[-a-z0-9]+$/.test(b.classroom)) throw new Error(`${b.id}: verify the Classroom Library link`);
  if (!releasePdf(b.pdf) && fs.readFileSync(assetPath(b.pdf)).subarray(0,5).toString() !== '%PDF-') throw new Error(`${b.id}: invalid student PDF`);
}

const teacherResources = b => {
  if ((!b.word || b.showWordButton) && !b.teacherGuide) return '';
  const word = b.word && !b.showWordButton ? `<a href="${assetUrl(b.word)}" download>Editable workbook (Word) · ${size(b.word)}</a>` : '';
  const guide = b.teacherGuide ? `<a href="${assetUrl(b.teacherGuide)}" target="_blank" rel="noopener">Teacher guide and answers (PDF)${newTab}</a>` : '';
  const note = b.word && b.showWordPrintNote !== false ? '<small>Use the student PDF for printing. Word pagination can vary between computers.</small>' : '';
  return `<details class="teacher-resources"><summary>Teacher resources</summary><div class="teacher-resource-links">${word}${guide}${note}</div></details>`;
};
const wordDownloadButton = b => b.word && b.showWordButton ? `<a class="button" href="${assetUrl(b.word)}" download>Download editable Word <span aria-hidden="true">↓</span></a>` : '';
const supplementDownloads = b => (b.supplements || []).map(item => `<div class="supplement-resources">
  <p class="book-includes"><strong>${e(item.title)}</strong> · ${item.pages} pages</p>
  <div class="book-actions"><a class="button" href="${assetUrl(item.pdf)}" target="_blank" rel="noopener">Practice booklet (PDF) <span aria-hidden="true">↗</span>${newTab}</a>${item.word ? `<a class="button" href="${assetUrl(item.word)}" download>Practice booklet (Word) <span aria-hidden="true">↓</span></a>` : ''}</div>
</div>`).join('');
const previousEdition = b => {
  if (!b.previousEdition) return '';
  const old = b.previousEdition;
  return `<details class="teacher-resources previous-edition"><summary>Previous edition ${e(old.edition)} · ${old.pages} pages</summary><div class="teacher-resource-links"><p>Use this edition when your teacher or an existing Classroom reading refers to its page numbers.</p><a href="${e(old.pdf)}" target="_blank" rel="noopener">Previous student workbook (PDF)${newTab}</a>${old.word ? `<a href="${e(old.word)}" download>Previous editable workbook (Word)</a>` : ''}${old.teacherGuide ? `<a href="${e(old.teacherGuide)}" target="_blank" rel="noopener">Previous teacher guide (PDF)${newTab}</a>` : ''}</div></details>`;
};

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
    <p class="book-facts"><span>${b.pages} pages</span><span>${b.sheets} double-sided sheets</span><span>A4</span><span>${e(b.editionLabel || `Edition ${b.edition}`)}</span></p>
    <div class="book-actions"><a class="button primary" href="${assetUrl(b.pdf)}" target="_blank" rel="noopener">Open workbook (PDF) <span aria-hidden="true">↗</span>${newTab}</a><a class="button" href="${assetUrl(b.pdf)}" download="${e(b.id)}-student-workbook.pdf">Download PDF <span aria-hidden="true">↓</span></a>${wordDownloadButton(b)}</div>
    <p class="download-note">PDF · ${size(b.pdf)}. ${e(b.printNote || 'Print double-sided on A4, flipping on the long edge.')}</p>
    ${b.supplements?.length ? supplementDownloads(b) + '\n    ' : ''}<a class="course-link" href="${e(b.course)}" target="_blank" rel="noopener">Open the matching course <span aria-hidden="true">↗</span>${newTab}</a>${b.classroom ? `
    <a class="course-link" href="${e(b.classroom)}">${e(b.classroomLabel || 'Open the matching Google Classroom')} <span aria-hidden="true">→</span></a>` : ''}${b.previousEdition ? `\n    ${previousEdition(b)}` : ''}${b.word || b.teacherGuide ? `
    ${teacherResources(b)}` : ''}
  </div>
</article>`;

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function replace(name, value) {
  const re = new RegExp(`<!-- ${name}_START -->[\\s\\S]*?<!-- ${name}_END -->`);
  if (!re.test(html)) throw new Error(`Missing ${name} template markers`);
  html = html.replace(re, `<!-- ${name}_START -->\n${value}\n<!-- ${name}_END -->`);
}
if (onlyId) {
  const book = books.find(item => item.id === onlyId);
  const pattern = new RegExp(`<article class="book-card" id="${onlyId}"[\\s\\S]*?</article>`, 'g');
  const matches = [...html.matchAll(pattern)];
  if (matches.length !== 1) throw new Error(`Expected one existing card for ${onlyId}`);
  if (!matches[0][0].includes(`data-subject="${e(book.subject)}"`)) {
    throw new Error('A subject change requires a full catalogue build');
  }
  // Keeping an existing ID and subject leaves counts and section placement intact.
  html = html.replace(pattern, () => card(book));
} else {
  const groups = groupBooks(books);
  replace('BOOKS', renderBookSections(groups, card));
  replace('SUBJECT_NAV', renderSubjectNavigation(groups));
  replace('COUNT', `${books.length} ${books.length === 1 ? 'book' : 'books'} available`);
  replace('SUBJECTS', [...new Set(books.map(b => b.subject))].sort().map(s => `<option value="${e(s)}">${e(s)}</option>`).join('\n'));
}
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(onlyId ? `Updated ${onlyId} with verified active assets; other cards unchanged.` : `Built ${books.length} student workbook ${books.length === 1 ? 'card' : 'cards'} with verified local files and registered release PDF metadata.`);

