# Publication trigger: 31 August 2026 — immediate deployment retry
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

if 'id="design-technology"' not in html:
    section = '''    <section class="section section-white" id="design-technology" aria-labelledby="design-technology-heading">
      <div class="shell">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Design and Technology</p>
            <h2 id="design-technology-heading">Stage 6 Design and Technology</h2>
          </div>
          <p>Begin the two-year senior course through design theory, research, CAD, projects, communication, production and evaluation.</p>
        </div>

        <article class="featured-course">
          <div class="featured-image" style="background-image:url('Year-11-Design-and-Technology/assets/hero-workshop.svg');background-position:center;background-size:cover" role="img" aria-label="Design and Technology drawings, prototype and measuring tools"></div>
          <div class="featured-copy">
            <span class="tag">Stage 6 · Preliminary · current build</span>
            <h3>Year 11 Design and Technology</h3>
            <p>Open the 15-module Preliminary course with formative checks, project pathways, folio evidence, assessment support and teacher programs. Further refinement can continue while the course is live.</p>
            <div class="featured-actions">
              <a class="button button-primary" href="Year-11-Design-and-Technology/" target="_blank" rel="noopener">Open Year 11 course <span aria-hidden="true">↗</span></a>
              <a class="button button-ghost" href="Year-11-Design-and-Technology/program.html" target="_blank" rel="noopener">Teaching program <span aria-hidden="true">↗</span></a>
              <a class="button button-ghost" href="https://www.nsw.gov.au/education-and-training/nesa/curriculum/tas/design-and-technology-stage-6-2013" target="_blank" rel="noopener">Official syllabus <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </article>
      </div>
    </section>

'''
    anchor = '    <section class="section" id="textiles" aria-labelledby="textiles-heading">'
    if anchor not in html:
        raise SystemExit('Could not locate the Textiles section insertion point.')
    html = html.replace(anchor, section + anchor, 1)

html = html.replace(
    'Graphics · Multimedia · Textiles',
    'Graphics · Multimedia · Design &amp; Technology · Textiles',
)
INDEX.write_text(html, encoding='utf-8')

print('Prepared Year 11 Design and Technology site and main-menu entry.')
