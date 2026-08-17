const programs = [
  { title: "Desk Tidy", family: "Timber", stage: "Stage 4 / Year 7–8", course: "Technology Mandatory", periods: 25, version: "v1.3", pdf: "programs/Desk-Tidy-25-Period-Teaching-Program-v1.3-Website-Complete-10pt.pdf", docx: "programs/Desk-Tidy-25-Period-Teaching-Program-v1.3-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/desk-tidy/" },
  { title: "Footstool", family: "Timber", stage: "Stage 4 / Year 8", course: "Industrial Technology – Timber", periods: 50, version: "v1.0", pdf: "programs/Footstool-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Footstool-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-8-Intro-Timber-Technology/" },
  { title: "Breadboard", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 25, version: "v1.0", pdf: "programs/Breadboard-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Breadboard-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/bread-board-guided-course/" },
  { title: "Small Box", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 15, version: "v1.0", pdf: "programs/Small-Box-15-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Small-Box-15-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Small-Box/" },
  { title: "Clock", family: "Timber", stage: "Stage 5 / Year 9", course: "Industrial Technology – Timber", periods: 50, version: "v1.0", pdf: "programs/Clock-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Clock-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Yr-9-Clock/" },
  { title: "Tool Carry-all", family: "Timber", stage: "Stage 5 / Year 9", course: "Industrial Technology – Timber", periods: 50, version: "v1.0", pdf: "programs/Tool-Carry-All-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Tool-Carry-All-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Yr-9-Carry-All/" },
  { title: "Timber Pen", family: "Timber", stage: "Stage 5 / Year 9", course: "Industrial Technology – Timber", periods: 50, version: "v1.0", pdf: "programs/Timber-Pen-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Timber-Pen-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Yr-9-Pen/" },
  { title: "Mirror", family: "Timber", stage: "Stage 5 / Year 10", course: "Industrial Technology – Timber", periods: 50, version: "v1.0", pdf: "programs/Mirror-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Mirror-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/year-10-timber-mirror-project/" },
  { title: "Bedside Table", family: "Timber", stage: "Stage 5 / Year 10", course: "Industrial Technology – Timber", periods: 50, version: "v1.0", pdf: "programs/Bedside-Table-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Bedside-Table-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/bedside-table-guided-course/" },
  { title: "Folding Chair", family: "Timber", stage: "Stage 5 / Year 10", course: "Industrial Technology – Timber", periods: 50, version: "v1.0", pdf: "programs/Folding-Chair-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Folding-Chair-50-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/folding-chair-guided-course/" },
  { title: "The Riv Burger", family: "Food and Agriculture", stage: "Stage 4 / Year 8", course: "Technology Mandatory", periods: 25, version: "v1.6", pdf: "programs/Riv-Burger-25-Period-Teaching-Program-v1.6-Compact-10pt.pdf", docx: "programs/Riv-Burger-25-Period-Teaching-Program-v1.6-Compact-10pt.docx", site: "https://stevencowell.github.io/Year-8-The-Riv-Burger/" },

  { title: "Programmable Light", family: "Timber", stage: "Stage 4", course: "Technology Mandatory", periods: 25, version: "v1.0", pdf: "programs/Programmable-Light-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Programmable-Light-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/programmable-light-guided-course/" },
  { title: "Hose Reel Holder", family: "Metalwork", stage: "Stage 4 / Year 8", course: "Industrial Technology – Metal", periods: 25, version: "v1.0", pdf: "programs/Hose-Reel-Holder-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Hose-Reel-Holder-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Yr-8-Metal-Technology/" },
  { title: "Sheet-metal Toolbox", family: "Metalwork", stage: "Stage 5 / Year 9", course: "Industrial Technology – Metal", periods: 25, version: "v1.0", pdf: "programs/Sheet-Metal-Toolbox-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Sheet-Metal-Toolbox-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Yr-9-Metal/toolbox/" },
  { title: "Fishing Rod Holder", family: "Metalwork", stage: "Stage 5 / Year 9", course: "Industrial Technology – Metal", periods: 25, version: "v1.0", pdf: "programs/Fishing-Rod-Holder-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Fishing-Rod-Holder-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Yr-9-Metal/fishing-rod-holder/" },
  { title: "BBQ and Case", family: "Metalwork", stage: "Stage 5 / Year 10", course: "Industrial Technology – Metal", periods: 45, version: "v1.0", pdf: "programs/BBQ-and-Case-45-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/BBQ-and-Case-45-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Yr-10-Metal/bbq-case/" },
  { title: "Folding Camping Shovel", family: "Metalwork", stage: "Stage 5 / Year 10", course: "Industrial Technology – Metal", periods: 25, version: "v1.0", pdf: "programs/Folding-Camping-Shovel-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Folding-Camping-Shovel-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Yr-10-Metal/folding-camping-shovel/" },
  { title: "Crack the Code", family: "Computing", stage: "Stage 4 / Year 7–8", course: "Technology Mandatory", periods: 25, version: "v1.0", pdf: "programs/Crack-the-Code-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Crack-the-Code-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-8-Crack-the-Code/" },
  { title: "Lunch Is Packed", family: "Textiles", stage: "Stage 4 / Year 7–8", course: "Technology Mandatory", periods: 25, version: "v1.0", pdf: "programs/Lunch-Is-Packed-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Lunch-Is-Packed-25-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-7-8-Lunch-Is-Packed/" },
  { title: "Bucket Hat for a Cause", family: "Textiles", stage: "Stage 4 / Year 7–8", course: "Technology Mandatory", periods: 30, version: "v1.0", pdf: "programs/Bucket-Hat-for-a-Cause-30-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Bucket-Hat-for-a-Cause-30-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-7-8-Bucket-Hat/" },
  { title: "Year 8 Agriculture", family: "Food and Agriculture", stage: "Stage 4 / Year 8", course: "Technology Mandatory", periods: 55, version: "v1.0", pdf: "programs/Year-8-Agriculture-55-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Year-8-Agriculture-55-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-8-Agriculture-Guided-Course/" },
  { title: "Year 9 Agriculture", family: "Food and Agriculture", stage: "Stage 5 / Year 9", course: "Agricultural Technology", periods: 95, version: "v1.0", pdf: "programs/Year-9-Agriculture-95-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Year-9-Agriculture-95-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-9-Agriculture-Guided-Course/" },
  { title: "Year 10 Agriculture", family: "Food and Agriculture", stage: "Stage 5 / Year 10", course: "Agricultural Technology", periods: 100, version: "v1.0", pdf: "programs/Year-10-Agriculture-100-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Year-10-Agriculture-100-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-10-Agriculture-Guided-Course/" },
  { title: "Year 8 Science Guided Course", family: "Science", stage: "Stage 4 / Year 8", course: "Science", periods: 100, version: "v1.0", pdf: "programs/Year-8-Science-100-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Year-8-Science-100-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-8-Science-Guided-Course/" }
];

const grid = document.querySelector("#program-grid");
const filters = document.querySelector("#program-filters");
const search = document.querySelector("#program-search");
const resultsSummary = document.querySelector("#results-summary");
const emptyState = document.querySelector("#empty-state");
let activeFamily = "All";

const families = ["All", ...new Set(programs.map(program => program.family))];
const readyPrograms = programs.filter(program => program.pdf);

document.querySelector("#ready-count").textContent = readyPrograms.length;
document.querySelector("#total-count").textContent = programs.length;
document.querySelector("#subject-count").textContent = families.length - 1;

function filterLabel(family) {
  return family === "Food and Agriculture" ? "Food & Agriculture" : family;
}

function renderFilters() {
  filters.innerHTML = families.map(family => `
    <button class="filter-button" type="button" data-family="${family}" aria-pressed="${family === activeFamily}">${filterLabel(family)}</button>
  `).join("");

  filters.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeFamily = button.dataset.family;
      renderFilters();
      renderPrograms();
    });
  });
}

function programCard(program) {
  const ready = Boolean(program.pdf);
  const details = [program.stage, program.periods ? `${program.periods} periods` : null, program.version].filter(Boolean);
  return `
    <article class="program-card" data-family="${program.family}">
      <div class="program-body">
        <div class="card-topline">
          <span class="subject-tag">${program.family}</span>
          <span class="status ${ready ? "ready" : "pending"}">${ready ? "Ready" : "Not yet added"}</span>
        </div>
        <h3>${program.title}</h3>
        <p class="course-meta">${program.course}</p>
        <div class="program-details">${details.map(detail => `<span>${detail}</span>`).join("")}</div>
        <p class="card-note">${ready ? "Print-ready program and editable source, aligned to the matching course site." : "The course remains listed so the program gap is visible and easy to complete."}</p>
        <div class="card-actions">
          ${ready ? `<a class="primary" href="${program.pdf}" target="_blank">Open PDF</a><a href="${program.docx}" download>Word copy</a>` : ""}
          <a href="${program.site}" target="_blank" rel="noopener">Course site ↗</a>
        </div>
      </div>
    </article>
  `;
}

function renderPrograms() {
  const query = search.value.trim().toLocaleLowerCase("en-AU");
  const visible = programs.filter(program => {
    const inFamily = activeFamily === "All" || program.family === activeFamily;
    const haystack = `${program.title} ${program.family} ${program.stage} ${program.course}`.toLocaleLowerCase("en-AU");
    return inFamily && (!query || haystack.includes(query));
  });

  grid.innerHTML = visible.map(programCard).join("");
  grid.hidden = visible.length === 0;
  emptyState.hidden = visible.length !== 0;
  const readyVisible = visible.filter(program => program.pdf).length;
  resultsSummary.textContent = `${visible.length} shown · ${readyVisible} ready`;
}

search.addEventListener("input", renderPrograms);
renderFilters();
renderPrograms();
