// Shared by the full asset-checked build and layout-only migration tests.
// Display groups do not change the catalogue's original subject metadata.
export const subjectSections = [
  {id:'timber', title:'Timber', subjects:['Timber'], description:'Timber projects, workshop skills and design evidence.'},
  {id:'metal', title:'Metal', subjects:['Metal'], description:'Metal fabrication, machining and project evidence.'},
  {id:'technology', title:'Technology 7–8', subjects:['Technology 7–8'], description:'Materials, design and digital systems.'},
  {id:'graphics', title:'Graphics Technology', subjects:['Graphics Technology'], description:'Drawing, modelling and visual communication.'},
  {id:'design-technology', title:'Design and Technology', subjects:['Design and Technology'], description:'Design thinking, project development and evidence.'},
  {id:'multimedia', title:'Multimedia', subjects:['Multimedia'], description:'Visual identity, digital communication and media production.'},
  {id:'food', title:'Food Technology', subjects:['Food Technology'], description:'Food choices, cultures, practical skills and service.'},
  {id:'textiles', title:'Textiles', subjects:['Textiles'], description:'Textile design, materials, techniques and project work.'},
  {id:'agriculture', title:'Agriculture', subjects:['Agriculture Technology','Food and agricultural practices'], description:'Food production, agricultural systems and field evidence.'},
  {id:'engineering', title:'Engineering', subjects:['Engineering'], description:'Engineering projects, systems, testing and evaluation.'},
  {id:'work-studies', title:'Work Studies', subjects:['Work Studies'], description:'Career pathways, workplace learning and personal responses.'},
  {id:'science', title:'Science', subjects:['Science'], description:'Evidence, living systems, matter and scientific models.'},
];
const escape = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function groupBooks(books) {
  const known = new Set(subjectSections.flatMap(section => section.subjects));
  for (const book of books) if (!known.has(book.subject)) throw new Error(`Add a display section for subject: ${book.subject}`);
  return subjectSections.map(section => ({...section, books:books.filter(book => section.subjects.includes(book.subject))})).filter(section => section.books.length);
}

export function renderSubjectNavigation(groups) {
  return groups.map(group => `        <a href="#subject-${group.id}">${escape(group.title)} <span data-subject-nav-count aria-label="${group.books.length} ${group.books.length === 1 ? 'book' : 'books'}">${group.books.length}</span></a>`).join('\n');
}

export function renderBookSections(groups, renderCard) {
  return groups.map(group => `<section class="book-subject book-subject--${group.id}" id="subject-${group.id}" aria-labelledby="subject-${group.id}-title">
  <header class="subject-heading">
    <div><h2 id="subject-${group.id}-title">${escape(group.title)}</h2><p>${escape(group.description)}</p></div>
    <p class="subject-count" data-subject-count>${group.books.length} ${group.books.length === 1 ? 'book' : 'books'}</p>
  </header>
  <div class="book-grid">
${group.books.map(renderCard).join('\n')}
  </div>
  <a class="back-to-subjects" href="#subject-navigation">Back to subjects <span aria-hidden="true">↑</span></a>
</section>`).join('\n');
}
