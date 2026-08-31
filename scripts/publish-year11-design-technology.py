# Publication trigger: 31 August 2026 — add Year 11 to existing Stage 6 menu section
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

course_link = 'href="Year-11-Design-and-Technology/"'
if course_link not in html:
    design_start_marker = '    <section class="section section-white" id="design-technology" aria-labelledby="design-technology-heading">'
    graphics_start_marker = '    <section class="section graphics-section" id="graphics" aria-labelledby="graphics-heading">'
    start = html.find(design_start_marker)
    end = html.find(graphics_start_marker, start + 1)
    if start < 0 or end < 0:
        raise SystemExit('Could not locate the existing Design and Technology main-menu section.')

    design_section = html[start:end]
    design_section = design_section.replace(
        'Connect innovation theory, Major Design Project evidence and HSC examination practice through the second year of the Stage 6 course.',
        'Follow the two-year Stage 6 pathway from Preliminary design projects and evidence habits into the Major Design Project, innovation and HSC examination practice.'
    )

    year11_card = '''        <div class="card-grid resource-grid">
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
        </div>
'''
    closing = '      </div>\n    </section>\n\n'
    if closing not in design_section:
        raise SystemExit('Could not locate the end of the Design and Technology section.')
    design_section = design_section.replace(closing, year11_card + closing, 1)
    html = html[:start] + design_section + html[end:]

html = html.replace(
    'Graphics · Multimedia · Textiles',
    'Graphics · Multimedia · Design &amp; Technology · Textiles',
)
INDEX.write_text(html, encoding='utf-8')

print('Prepared Year 11 Design and Technology site and main-menu card.')
