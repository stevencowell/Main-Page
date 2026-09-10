'use strict';
const form = document.querySelector('.filters');
const search = document.querySelector('#book-search');
const subject = document.querySelector('#subject-filter');
const cards = Array.from(document.querySelectorAll('.book-card'));
const count = document.querySelector('#result-count');
const empty = document.querySelector('.empty-state');
form.hidden = false;
function filterBooks() {
  const terms = search.value.toLocaleLowerCase('en-AU').trim().split(/\s+/).filter(Boolean);
  let visible = 0;
  for (const card of cards) {
    const matches = terms.every(term => card.dataset.search.includes(term)) && (!subject.value || card.dataset.subject === subject.value);
    card.hidden = !matches;
    if (matches) visible++;
  }
  count.textContent = `${visible} ${visible === 1 ? 'book' : 'books'} ${terms.length || subject.value ? 'found' : 'available'}`;
  empty.hidden = visible !== 0;
}
form.addEventListener('submit', event => event.preventDefault());
search.addEventListener('input', filterBooks);
subject.addEventListener('change', filterBooks);
function resetFilters() { search.value = ''; subject.value = ''; filterBooks(); }
form.addEventListener('reset', () => { resetFilters(); search.focus(); });
document.querySelector('#reset-results').addEventListener('click', () => { resetFilters(); search.focus(); });
const dialog = document.querySelector('#preview-dialog');
let previewTrigger = null;
for (const link of document.querySelectorAll('[data-preview]')) {
  link.addEventListener('click', event => {
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    previewTrigger = link;
    document.querySelector('#preview-title').textContent = `Inside ${link.dataset.title}`;
    const image = document.querySelector('#preview-image');
    image.src = link.href;
    image.alt = `Selected cover, reading and diagram pages from the ${link.dataset.title} workbook`;
    document.querySelector('#preview-pdf').href = link.dataset.pdf;
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
}
document.querySelector('#close-preview').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); previewTrigger?.focus(); });
