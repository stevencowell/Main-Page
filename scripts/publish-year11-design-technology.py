# Publication trigger: 31 August 2026 — separate Year 11 and Year 12 course cards
from pathlib import Path
from zipfile import ZipFile, is_zipfile
import shutil

ARCHIVE = Path('/tmp/year11-design-technology-site.zip')
EXTRACT = Path('/tmp/year11-design-technology')
DESTINATION = Path('Year-11-Design-and-Technology')
INDEX = Path('index.html')

if not ARCHIVE.exists() or not is_zipfile(ARCHIVE):
    raise SystemExit('The downloaded Year 11 package is not a valid ZIP archive.')

if EXTRACT.exists():
    shutil.rmtree(EXTRACT)
EXTRACT.mkdir(parents=True)

with ZipFile(ARCHIVE) as package:
    bad_file = package.testzip()
    if bad_file:
        raise SystemExit(f'ZIP integrity failure: {bad_file}')
    package.extractall(EXTRACT)

source = EXTRACT / 'year11-design-technology-site'
if not source.is_dir():
    source = EXTRACT

if DESTINATION.exists():
    shutil.rmtree(DESTINATION)
shutil.copytree(source, DESTINATION)
(DESTINATION / '.nojekyll').touch()

html = INDEX.read_text(encoding='utf-8')

nav_anchor = '        <a href="#graphics">Graphics</a>'
nav_link = nav_anchor + '\n        <a href="#design-technology">Design &amp; Technology</a>'
if 'href="#design-technology"' not in html:
    if nav_anchor not in html:
        raise SystemExit('Could not locate the Graphics navigation link.')
    html = html.replace(nav_anchor, nav_link, 1)

if '.two-card-grid {' not in html:
    css_anchor = '    .resource-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n'
    css_rule = '    .two-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n'
    if css_anchor not in html:
        raise SystemExit('Could not locate the card-grid CSS rule.')
    html = html.replace(css_anchor, css_anchor + css_rule, 1)

design_start_marker = '    <section class="section section-white" id="design-technology" aria-labelledby="design-technology-heading">'
graphics_start_marker = '    <section class="section graphics-section" id="graphics" aria-labelledby="graphics-heading">'
start = html.find(design_start_marker)
end = html.find(graphics_start_marker, start + 1)
if start < 0 or end < 0:
    raise SystemExit('Could not locate the Design and Technology main-menu section.')

design_section = '''    <section class="section section-white" id="design-technology" aria-labelledby="design-technology-heading">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Stage 6 design</p>
            <h2 id="design-technology-heading">Design and Technology</h2>
          </div>
          <p>Follow the connected two-year pathway from Preliminary design projects and evidence habits into the Major Design Project, innovation and HSC examination practice.</p>
        </div>

        <article class="featured-course">
          <div class="featured-image featured-image-design" role="img" aria-label="Senior design workspace linking a user need, research, sketch development, prototype evidence and evaluation notes"></div>
          <div class="featured-copy">
            <span class="tag">Stage 6 course pathway</span>
            <h3>From Preliminary foundations to the HSC Major Design Project</h3>
            <p>Use Year 11 to establish strong research, communication, project and evaluation habits, then carry that evidence discipline into the Year 12 Major Design Project and HSC course.</p>
            <div class="featured-actions">
              <a class="button button-primary" href="#design-technology-courses">Explore Year 11 and Year 12 <span aria-hidden="true">↓</span></a>
              <a class="button button-ghost" href="https://www.nsw.gov.au/education-and-training/nesa/curriculum/tas/design-and-technology-stage-6-2013" target="_blank" rel="noopener">Official syllabus <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </article>

        <div class="card-grid resource-grid two-card-grid" id="design-technology-courses">
          <article class="project-card resource-card">
            <div class="card-image"><img src="Year-11-Design-and-Technology/assets/hero-workshop.svg" alt="Design and Technology workspace with technical drawings, a prototype and measuring tools" loading="lazy"></div>
            <div class="card-body">
              <span class="tag">Stage 6 · Preliminary · current build</span>
              <h3>Year 11 Design and Technology</h3>
              <p>Work through 15 modules covering design theory, research, CAD, projects, communication, production, evaluation and folio evidence. The current build is live while final refinements continue.</p>
              <div class="card-actions">
                <a class="card-link" href="Year-11-Design-and-Technology/" target="_blank" rel="noopener"><span>Open Year 11 course</span><span aria-hidden="true">↗</span></a>
                <a class="program-card-link" href="Year-11-Design-and-Technology/program.html" target="_blank" rel="noopener"><span>Teaching program</span><span aria-hidden="true">→</span></a>
                <a class="syllabus-card-link" href="https://www.nsw.gov.au/education-and-training/nesa/curriculum/tas/design-and-technology-stage-6-2013" target="_blank" rel="noopener"><span>Official syllabus</span><span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </article>

          <article class="project-card resource-card">
            <div class="card-image"><img src="assets/year-12-design-technology-card.png" alt="Senior design workspace with research, sketches, prototype evidence, material samples and evaluation notes" loading="lazy"></div>
            <div class="card-body">
              <span class="tag">Stage 6 · HSC · provisional build</span>
              <h3>Year 12 HSC Design and Technology</h3>
              <p>Continue through 12 connected modules linking innovation, Major Design Project planning and evidence, evaluation, and HSC response practice while the teaching programs are completed.</p>
              <div class="card-actions">
                <a class="card-link" href="https://stevencowell.github.io/Year-12-Design-and-Technology/" target="_blank" rel="noopener"><span>Open Year 12 course</span><span aria-hidden="true">↗</span></a>
                <a class="syllabus-card-link" href="https://www.nsw.gov.au/education-and-training/nesa/curriculum/tas/design-and-technology-stage-6-2013" target="_blank" rel="noopener"><span>Official syllabus</span><span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

'''

html = html[:start] + design_section + html[end:]
html = html.replace(
    'Graphics · Multimedia · Textiles',
    'Graphics · Multimedia · Design &amp; Technology · Textiles',
)
INDEX.write_text(html, encoding='utf-8')

print('Prepared separate Year 11 and Year 12 Design and Technology course cards.')
