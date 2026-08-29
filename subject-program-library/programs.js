const programs = [
  { title: "Stage 4 Technology 200-hour Master", family: "Technology", stage: "Stage 4", course: "Stage 4 Technology", periods: 200, version: "v1.0", master: true, masterNote: "Modular two-year control program: all 85 syllabus content points are placed across an exact 200-hour reference combination. Eighty-two are scheduled as primary coverage; three stay amber until authorised local sources and protocols are confirmed.", syllabusAligned: true, alignmentState: "conditional", alignmentLabel: "82 primary · 3 conditional", pdf: "programs/Stage-4-Technology-200-Hour-Modular-Master-Teaching-Program-v1.0-Network-Benchmark.pdf", docx: "programs/Stage-4-Technology-200-Hour-Modular-Master-Teaching-Program-v1.0-Network-Benchmark.docx", manifest: "programs/Stage-4-Technology-200-Hour-Modular-Master-Alignment-Manifest-v1.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "29 August 2026" },
  { title: "The Riv Burger", family: "Food and Agriculture", stage: "Stage 4", course: "Technology", periods: 25, version: "v2.4", benchmark: true, syllabusAligned: true, pdf: "programs/Riv-Burger-25-Period-Teaching-Program-v2.4-Network-Benchmark.pdf", docx: "programs/Riv-Burger-25-Period-Teaching-Program-v2.4-Network-Benchmark.docx", manifest: "programs/Riv-Burger-25-Period-Alignment-Manifest-v2.4.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-8-The-Riv-Burger/" },
  { title: "Desk Tidy", family: "Timber", stage: "Stage 4", course: "Technology", periods: 25, version: "v2.1", syllabusAligned: true, pdf: "programs/Desk-Tidy-25-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Desk-Tidy-25-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Desk-Tidy-25-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/desk-tidy/" },
  { title: "Programmable Light", family: "Timber", stage: "Stage 4", course: "Technology", periods: 25, version: "v2.0", syllabusAligned: true, pdf: "programs/Programmable-Light-25-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Programmable-Light-25-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Programmable-Light-25-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/programmable-light-guided-course/" },
  { title: "Hose Reel Holder", family: "Metalwork", stage: "Stage 4", course: "Technology", periods: 25, version: "v2.0", syllabusAligned: true, pdf: "programs/Hose-Reel-Holder-25-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Hose-Reel-Holder-25-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Hose-Reel-Holder-25-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Yr-8-Metal-Technology/" },
  { title: "Catapult", family: "Engineering", stage: "Stage 4", course: "Technology", periods: 25, version: "v2.0", syllabusAligned: true, pdf: "programs/Catapult-25-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Catapult-25-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Catapult-25-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-8-Catapult/" },
  { title: "Crack the Code", family: "Computing", stage: "Stage 4", course: "Technology", periods: 25, version: "v2.0", syllabusAligned: true, pdf: "programs/Crack-the-Code-25-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Crack-the-Code-25-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Crack-the-Code-25-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-8-Crack-the-Code/" },
  { title: "Multimedia", family: "Multimedia", stage: "Stage 4", course: "Technology", periods: 20, version: "v2.0", syllabusAligned: true, pdf: "programs/Multimedia-20-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Multimedia-20-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Multimedia-20-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-7-Multimedia/" },
  { title: "Lunch Is Packed", family: "Textiles", stage: "Stage 4", course: "Technology", periods: 25, version: "v2.0", syllabusAligned: true, pdf: "programs/Lunch-Is-Packed-25-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Lunch-Is-Packed-25-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Lunch-Is-Packed-25-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-7-8-Lunch-Is-Packed/" },
  { title: "Bucket Hat for a Cause", family: "Textiles", stage: "Stage 4", course: "Technology", periods: 30, version: "v2.0", syllabusAligned: true, pdf: "programs/Bucket-Hat-for-a-Cause-30-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Bucket-Hat-for-a-Cause-30-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Bucket-Hat-for-a-Cause-30-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-7-8-Bucket-Hat/" },
  { title: "Fantastic Food", family: "Food and Agriculture", stage: "Stage 4", course: "Technology", periods: 30, version: "v2.0", syllabusAligned: true, pdf: "programs/Fantastic-Food-30-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Fantastic-Food-30-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Fantastic-Food-30-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Fantastic-Food/" },
  { title: "Agriculture", family: "Food and Agriculture", stage: "Stage 4", course: "Technology", periods: 55, version: "v2.0", syllabusAligned: true, pdf: "programs/Agriculture-55-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Agriculture-55-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Agriculture-55-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-8-Agriculture-Guided-Course/" },










  { title: "Footstool", family: "Timber", stage: "Stage 4", course: "Industrial Technology – Timber", periods: 50, version: "v2.0", syllabusAligned: true, pdf: "programs/Footstool-50-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Footstool-50-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Footstool-50-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "2027 early implementation", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-8-Intro-Timber-Technology/" },
  { title: "Food for Purpose", family: "Food and Agriculture", stage: "Stage 4", course: "Food Technology", periods: 50, version: "v2.0", syllabusAligned: true, pdf: "programs/Food-for-Purpose-50-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Food-for-Purpose-50-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Food-for-Purpose-50-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Food Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/overview/course", syllabusStatus: "2027 early implementation", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-8-Food-Technology/" },
  { title: "Intro Textiles Technology", family: "Textiles", stage: "Stage 4", course: "Textiles Technology", periods: 50, version: "v2.0", syllabusAligned: true, pdf: "programs/Intro-Textiles-50-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Intro-Textiles-50-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Intro-Textiles-50-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Textiles Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/textiles-technology-7-10-2025/overview/course", syllabusStatus: "2027 early implementation", syllabusVerified: "28 August 2026", site: "https://stevencowell.github.io/Year-8-Textiles-Technology/" },
  { title: "Stage 5 Timber 200-hour Master", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 200, version: "v2.1", master: true, syllabusAligned: true, pdf: "programs/Stage-5-Timber-200-Hour-Master-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Stage-5-Timber-200-Hour-Master-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Stage-5-Timber-200-Hour-Master-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/year-9-10-timber/" },
  { title: "Breadboard", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 25, version: "v2.1", syllabusAligned: true, pdf: "programs/Breadboard-25-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Breadboard-25-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Breadboard-25-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/bread-board-guided-course/" },
  { title: "Small Box", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 15, version: "v2.1", syllabusAligned: true, pdf: "programs/Small-Box-15-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Small-Box-15-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Small-Box-15-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Small-Box/" },
  { title: "Clock", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 50, version: "v2.1", syllabusAligned: true, pdf: "programs/Clock-50-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Clock-50-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Clock-50-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Yr-9-Clock/" },
  { title: "Tool Carry-all", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 50, version: "v2.1", syllabusAligned: true, pdf: "programs/Tool-Carry-All-50-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Tool-Carry-All-50-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Tool-Carry-All-50-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Yr-9-Carry-All/" },
  { title: "Timber Pen", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 50, version: "v2.1", syllabusAligned: true, pdf: "programs/Timber-Pen-50-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Timber-Pen-50-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Timber-Pen-50-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Yr-9-Pen/" },
  { title: "Mirror", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 50, version: "v2.1", syllabusAligned: true, pdf: "programs/Mirror-50-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Mirror-50-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Mirror-50-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/year-10-timber-mirror-project/" },
  { title: "Bedside Table", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 50, version: "v2.1", syllabusAligned: true, pdf: "programs/Bedside-Table-50-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Bedside-Table-50-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Bedside-Table-50-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/bedside-table-guided-course/" },
  { title: "Folding Chair", family: "Timber", stage: "Stage 5", course: "Industrial Technology – Timber", periods: 50, version: "v2.1", syllabusAligned: true, pdf: "programs/Folding-Chair-50-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Folding-Chair-50-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Folding-Chair-50-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/folding-chair-guided-course/" },

  { title: "Stage 5 Metal 200-hour Master", family: "Metalwork", stage: "Stage 5", course: "Industrial Technology – Metal", periods: 200, version: "v2.1", master: true, masterNote: "Two-year course map: all 79 required Stage 5 Metal content statements are allocated across four documented projects, with exact site and evidence destinations.", syllabusAligned: true, pdf: "programs/Stage-5-Metal-200-Hour-Master-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Stage-5-Metal-200-Hour-Master-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Stage-5-Metal-200-Hour-Master-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Yr-9-Metal/teacher-resources/" },
  { title: "Sheet-metal Toolbox", family: "Metalwork", stage: "Stage 5", course: "Industrial Technology – Metal", periods: 50, version: "v2.1", syllabusAligned: true, pdf: "programs/Sheet-Metal-Toolbox-50-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Sheet-Metal-Toolbox-50-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Sheet-Metal-Toolbox-50-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Yr-9-Metal/toolbox/" },
  { title: "Fishing Rod Holder", family: "Metalwork", stage: "Stage 5", course: "Industrial Technology – Metal", periods: 50, version: "v2.1", syllabusAligned: true, pdf: "programs/Fishing-Rod-Holder-50-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Fishing-Rod-Holder-50-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Fishing-Rod-Holder-50-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Yr-9-Metal/fishing-rod-holder/" },
  { title: "BBQ and Case", family: "Metalwork", stage: "Stage 5", course: "Industrial Technology – Metal", periods: 60, version: "v2.1", syllabusAligned: true, pdf: "programs/BBQ-and-Case-60-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/BBQ-and-Case-60-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/BBQ-and-Case-60-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Yr-10-Metal/bbq-case/" },
  { title: "Folding Camping Shovel", family: "Metalwork", stage: "Stage 5", course: "Industrial Technology – Metal", periods: 40, version: "v2.1", syllabusAligned: true, pdf: "programs/Folding-Camping-Shovel-40-Period-Teaching-Program-v2.1-Network-Benchmark.pdf", docx: "programs/Folding-Camping-Shovel-40-Period-Teaching-Program-v2.1-Network-Benchmark.docx", manifest: "programs/Folding-Camping-Shovel-40-Period-Alignment-Manifest-v2.1.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "Early use in 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Yr-10-Metal/folding-camping-shovel/" },
  { title: "Year 9 Agriculture", family: "Food and Agriculture", stage: "Stage 5 / Year 9", course: "Agricultural Technology", periods: 95, version: "v1.0", pdf: "programs/Year-9-Agriculture-95-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Year-9-Agriculture-95-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-9-Agriculture-Guided-Course/" },
  { title: "Year 10 Agriculture", family: "Food and Agriculture", stage: "Stage 5 / Year 10", course: "Agricultural Technology", periods: 100, version: "v1.0", pdf: "programs/Year-10-Agriculture-100-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Year-10-Agriculture-100-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-10-Agriculture-Guided-Course/" },
  { title: "Year 8 Science Guided Course", family: "Science", stage: "Stage 4 / Year 8", course: "Science", periods: 100, version: "v1.0", pdf: "programs/Year-8-Science-100-Period-Teaching-Program-v1.0-Website-Complete-10pt.pdf", docx: "programs/Year-8-Science-100-Period-Teaching-Program-v1.0-Website-Complete-10pt.docx", site: "https://stevencowell.github.io/Year-8-Science-Guided-Course/" }
];

const syllabusFamilies = [
  {
    key: "technology-7-8-2023",
    title: "Technology 7–8 Syllabus (2023)",
    url: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course",
    status: "Implemented from 2026",
    description: "Stage 4 Technology programs",
    tone: "technology",
    order: 10,
  },
  {
    key: "industrial-technology-7-10-2025",
    title: "Industrial Technology 7–10 Syllabus (2025)",
    url: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course",
    status: "Early use in 2027; mandatory from 2028",
    description: "Industrial Technology content areas and aligned introductory electives",
    tone: "industrial",
    order: 20,
  },
  {
    key: "food-technology-7-10-2025",
    title: "Food Technology 7–10 Syllabus (2025)",
    url: "https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/overview/course",
    status: "2027 early implementation",
    description: "Food Technology programs",
    tone: "food",
    order: 30,
  },
  {
    key: "textiles-technology-7-10-2025",
    title: "Textiles Technology 7–10 Syllabus (2025)",
    url: "https://curriculum.nsw.edu.au/learning-areas/tas/textiles-technology-7-10-2025/overview/course",
    status: "2027 early implementation",
    description: "Textiles Technology programs",
    tone: "textiles",
    order: 40,
  },
  {
    key: "pending-agricultural-technology",
    title: "Agricultural Technology",
    status: "Syllabus alignment to confirm",
    description: "Existing Agriculture programs retained while their current syllabus mapping is reviewed",
    tone: "pending",
    order: 91,
  },
  {
    key: "pending-science",
    title: "Science",
    status: "Syllabus alignment to confirm",
    description: "Existing Science program retained while its current syllabus mapping is reviewed",
    tone: "pending",
    order: 92,
  },
];

const syllabusFamilyByUrl = new Map(syllabusFamilies.filter(group => group.url).map(group => [group.url, group]));
const syllabusFamilyByKey = new Map(syllabusFamilies.map(group => [group.key, group]));
const programOrder = new Map(programs.map((program, index) => [program, index]));

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

function courseLabel(program) {
  const isStage4Technology = program.stage === "Stage 4" && program.syllabusUrl?.includes("/technology-7-8-2023/");
  return isStage4Technology ? "Stage 4 Technology" : program.course;
}

function programCard(program) {
  const ready = Boolean(program.pdf);
  const details = [program.stage, program.periods ? `${program.periods} periods` : null, program.version].filter(Boolean);
  if (program.alignmentLabel) {
    details.push({ label: program.alignmentLabel, state: program.alignmentState || "primary" });
  } else if (program.syllabusAligned) {
    details.push("Syllabus-aligned");
  }
  const statusLabel = program.master ? "Master" : (program.benchmark ? "Benchmark" : (ready ? "Ready" : (program.alignmentInProgress ? "Alignment in progress" : "Not yet added")));
  return `
    <article class="program-card${program.master ? " is-master" : ""}" data-family="${program.family}" data-program-title="${program.title}">
      <div class="program-body">
        <div class="card-topline">
          <span class="subject-tag">${program.family}</span>
          <span class="status ${ready ? "ready" : "pending"}">${statusLabel}</span>
        </div>
        <h4>${program.title}</h4>
        <p class="course-meta">${courseLabel(program)}</p>
        <div class="program-details">${details.map(detail => typeof detail === "string" ? `<span>${detail}</span>` : `<span class="alignment-detail alignment-detail--${detail.state}">${detail.label}</span>`).join("")}</div>
        <p class="card-note">${program.master ? (program.masterNote || "Two-year course map with exact site, evidence and syllabus destinations.") : (program.benchmark ? "Network benchmark: outcome codes sit beside the syllabus content they support, and each teacher checkpoint says exactly what to check or observe." : (ready ? "Print-ready program and editable source, aligned to the matching course site." : (program.alignmentInProgress ? "Existing course materials are being converted into the network program format; the official syllabus is confirmed." : "The course remains listed so the program gap is visible and easy to complete.")))}</p>
        ${program.syllabusUrl ? `<div class="syllabus-meta"><span>Official syllabus</span><a href="${program.syllabusUrl}" target="_blank" rel="noopener">${program.syllabusTitle} ↗</a><small>${program.syllabusStatus} · verified ${program.syllabusVerified}</small></div>` : ""}
        <div class="card-actions">
          ${ready ? `<a class="primary" href="${program.pdf}" target="_blank">Open PDF</a><a href="${program.docx}" download>Word copy</a>` : ""}
          ${program.site ? `<a href="${program.site}" target="_blank" rel="noopener">Course site ↗</a>` : ""}
        </div>
      </div>
    </article>
  `;
}

function syllabusGroupFor(program) {
  if (program.syllabusKey && syllabusFamilyByKey.has(program.syllabusKey)) return syllabusFamilyByKey.get(program.syllabusKey);
  if (program.syllabusUrl && syllabusFamilyByUrl.has(program.syllabusUrl)) return syllabusFamilyByUrl.get(program.syllabusUrl);
  if (program.course.includes("Agricultural Technology")) return syllabusFamilyByKey.get("pending-agricultural-technology");
  return syllabusFamilyByKey.get("pending-science");
}

function syllabusFamilyMarkup(group, items) {
  const sorted = [...items].sort((a, b) => {
    const priority = program => program.master ? 0 : (program.benchmark ? 1 : 2);
    return priority(a) - priority(b) || programOrder.get(a) - programOrder.get(b);
  });
  const masters = sorted.filter(program => program.master);
  const projects = sorted.filter(program => !program.master);
  const programLabel = `${items.length} ${items.length === 1 ? "program" : "programs"}`;
  return `
    <section class="syllabus-family syllabus-family--${group.tone}" data-syllabus-key="${group.key}" aria-labelledby="syllabus-${group.key}">
      <header class="syllabus-family-header">
        <div>
          <p class="syllabus-family-kicker">${group.url ? "Syllabus family" : "Alignment still to confirm"}</p>
          <h3 id="syllabus-${group.key}">${group.title}</h3>
          <p>${group.description} · ${programLabel}</p>
        </div>
        <div class="syllabus-family-actions">
          <span>${group.status}</span>
          ${group.url ? `<a href="${group.url}" target="_blank" rel="noopener">Open official syllabus ↗</a>` : ""}
        </div>
      </header>
      ${masters.length ? `<div class="master-program-grid" aria-label="Master programs">${masters.map(programCard).join("")}</div>` : ""}
      ${projects.length ? `<div class="program-grid">${projects.map(programCard).join("")}</div>` : ""}
    </section>
  `;
}

function renderPrograms() {
  const query = search.value.trim().toLocaleLowerCase("en-AU");
  const visible = programs.filter(program => {
    const inFamily = activeFamily === "All" || program.family === activeFamily;
    const haystack = `${program.title} ${program.family} ${program.stage} ${program.course} ${program.syllabusTitle || ""}`.toLocaleLowerCase("en-AU");
    return inFamily && (!query || haystack.includes(query));
  });

  const grouped = new Map();
  for (const program of visible) {
    const group = syllabusGroupFor(program);
    if (!grouped.has(group.key)) grouped.set(group.key, { group, items: [] });
    grouped.get(group.key).items.push(program);
  }
  const visibleGroups = [...grouped.values()].sort((a, b) => a.group.order - b.group.order);

  grid.innerHTML = visibleGroups.map(({ group, items }) => syllabusFamilyMarkup(group, items)).join("");
  grid.hidden = visible.length === 0;
  emptyState.hidden = visible.length !== 0;
  const readyVisible = visible.filter(program => program.pdf).length;
  resultsSummary.textContent = `${visible.length} shown · ${readyVisible} ready · ${visibleGroups.length} syllabus ${visibleGroups.length === 1 ? "group" : "groups"}`;
}

search.addEventListener("input", renderPrograms);
renderFilters();
renderPrograms();
