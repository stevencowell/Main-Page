const programs = [
  { title: "Stage 4 Technology 200-hour Master", family: "Technology", stage: "Stage 4", course: "Stage 4 Technology", periods: 200, version: "v1.0", master: true, masterNote: "Flexible two-year master program covering all four Stage 4 focus areas across a 200-hour course. Three source-specific items remain marked for confirmation.", syllabusAligned: true, pdf: "programs/Stage-4-Technology-200-Hour-Modular-Master-Teaching-Program-v1.0-Network-Benchmark.pdf", docx: "programs/Stage-4-Technology-200-Hour-Modular-Master-Teaching-Program-v1.0-Network-Benchmark.docx", manifest: "programs/Stage-4-Technology-200-Hour-Modular-Master-Alignment-Manifest-v1.0.json", syllabusTitle: "Technology 7–8 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/technology-7-8-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "29 August 2026" },
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










  { title: "Footstool", family: "Timber", stage: "Stage 4", course: "Industrial Technology – Timber", periods: 50, version: "v2.0", introUnit: true, syllabusAligned: true, pdf: "programs/Footstool-50-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Footstool-50-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Footstool-50-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Industrial Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/industrial-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-8-Intro-Timber-Technology/" },
  { title: "Food for Purpose", family: "Food Technology", stage: "Stage 4", course: "Food Technology", periods: 50, version: "v2.0", introUnit: true, syllabusAligned: true, pdf: "programs/Food-for-Purpose-50-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Food-for-Purpose-50-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Food-for-Purpose-50-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Food Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-8-Food-Technology/" },
  { title: "Intro Textiles Technology", family: "Textiles", stage: "Stage 4", course: "Textiles Technology", periods: 50, version: "v2.0", introUnit: true, syllabusAligned: true, pdf: "programs/Intro-Textiles-50-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Intro-Textiles-50-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Intro-Textiles-50-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Textiles Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/textiles-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-8-Textiles-Technology/" },
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

  { title: "Stage 5 Engineering Technology 200-hour Master", family: "Engineering", stage: "Stage 5", course: "Engineering Technology", periods: 200, version: "v2.0", master: true, masterNote: "Complete two-year course map: all 163 required Stage 5 content statements are allocated once across six connected engineering projects, with named website and evidence destinations.", syllabusAligned: true, pdf: "programs/Stage-5-Engineering-Technology-200-Hour-Master-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Stage-5-Engineering-Technology-200-Hour-Master-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Stage-5-Engineering-Technology-200-Hour-Master-Alignment-Manifest-v2.0.json", syllabusTitle: "Engineering Technology 7–10 Syllabus (2024)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/engineering-technology-7-10-2024/overview/course", syllabusStatus: "Mandatory from 2027", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Engineering-Website/" },
  { title: "Year 9 Engineering Technology", family: "Engineering", stage: "Stage 5", course: "Engineering Technology", periods: 100, version: "v2.0", syllabusAligned: true, pdf: "programs/Year-9-Engineering-Technology-100-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Year-9-Engineering-Technology-100-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Year-9-Engineering-Technology-100-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Engineering Technology 7–10 Syllabus (2024)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/engineering-technology-7-10-2024/overview/course", syllabusStatus: "Mandatory from 2027", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Engineering-Website/" },
  { title: "Year 10 Engineering Technology", family: "Engineering", stage: "Stage 5", course: "Engineering Technology", periods: 100, version: "v2.0", syllabusAligned: true, pdf: "programs/Year-10-Engineering-Technology-100-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Year-10-Engineering-Technology-100-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Year-10-Engineering-Technology-100-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Engineering Technology 7–10 Syllabus (2024)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/engineering-technology-7-10-2024/overview/course", syllabusStatus: "Mandatory from 2027", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Engineering-Website/" },

  { title: "Stage 5 Textiles Technology 200-hour Master", family: "Textiles", stage: "Stage 5", course: "Textiles Technology", periods: 200, version: "v2.0", master: true, masterNote: "Complete two-year program: all 92 required Stage 5 content statements are allocated across the connected Year 9 and Year 10 sequences; remaining website gaps are named in the manifest.", syllabusAligned: true, pdf: "programs/Stage-5-Textiles-200-Hour-Master-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Stage-5-Textiles-200-Hour-Master-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Stage-5-Textiles-200-Hour-Master-Alignment-Manifest-v2.0.json", syllabusTitle: "Textiles Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/textiles-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-9-Textiles-Technology/" },
  { title: "Year 9 Textiles Technology", family: "Textiles", stage: "Stage 5", course: "Textiles Technology", periods: 100, version: "v2.0", syllabusAligned: true, pdf: "programs/Year-9-Textiles-100-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Year-9-Textiles-100-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Year-9-Textiles-100-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Textiles Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/textiles-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-9-Textiles-Technology/" },
  { title: "Year 10 Textiles Technology", family: "Textiles", stage: "Stage 5", course: "Textiles Technology", periods: 100, version: "v2.0", syllabusAligned: true, pdf: "programs/Year-10-Textiles-100-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Year-10-Textiles-100-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Year-10-Textiles-100-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Textiles Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/textiles-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-10-Textiles-Technology/" },
  { title: "Year 11 Preliminary Textiles and Design", family: "Textiles and Design", stage: "Stage 6", course: "Textiles and Design", periods: 60, durationLabel: "120 hours · 60 two-hour blocks", version: "v2.0", syllabusAligned: true, pdf: "programs/Year-11-Preliminary-Textiles-and-Design-120-Hour-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Year-11-Preliminary-Textiles-and-Design-120-Hour-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Year-11-Preliminary-Textiles-and-Design-120-Hour-Alignment-Manifest-v2.0.json", syllabusTitle: "Textiles and Design Stage 6 Syllabus (2013)", syllabusUrl: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/tas/textiles-and-design-stage-6-2013", syllabusStatus: "Current Stage 6 syllabus", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-11-Preliminary-Textiles-and-Design/" },

  { title: "Stage 5 Food Technology 200-hour Master", family: "Food Technology", stage: "Stage 5", course: "Food Technology", periods: 200, version: "v2.0", master: true, masterNote: "Flexible two-year master: the three current sites provide 60 mapped periods; the remaining 140-period capacity and every unsupported official content point are explicitly registered for future units rather than claimed as complete.", syllabusAligned: true, pdf: "programs/Stage-5-Food-200-Hour-Master-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Stage-5-Food-200-Hour-Master-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Stage-5-Food-200-Hour-Master-Alignment-Manifest-v2.0.json", syllabusTitle: "Food Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-9-Food-in-Australia/" },
  { title: "Food in Australia", family: "Food Technology", stage: "Stage 5", course: "Food Technology", periods: 20, version: "v2.0", syllabusAligned: true, pdf: "programs/Food-in-Australia-20-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Food-in-Australia-20-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Food-in-Australia-20-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Food Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-9-Food-in-Australia/" },
  { title: "Food Selection and Health", family: "Food Technology", stage: "Stage 5", course: "Food Technology", periods: 20, version: "v2.0", syllabusAligned: true, pdf: "programs/Food-Selection-and-Health-20-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Food-Selection-and-Health-20-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Food-Selection-and-Health-20-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Food Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-9-Food-Selection-and-Health/" },
  { title: "Food for Specific Needs", family: "Food Technology", stage: "Stage 5", course: "Food Technology", periods: 20, version: "v2.0", syllabusAligned: true, pdf: "programs/Food-for-Specific-Needs-20-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Food-for-Specific-Needs-20-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Food-for-Specific-Needs-20-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Food Technology 7–10 Syllabus (2025)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/overview/course", syllabusStatus: "New syllabus — early implementation for 2027; mandatory 2028", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Food-for-Specific-Needs/" },
  { title: "Stage 5 Agriculture Technology 200-hour Master", family: "Agriculture", stage: "Stage 5", course: "Agriculture Technology", periods: 200, version: "v2.0", master: true, masterNote: "Flexible two-year master: all 88 official Stage 5 content statements are allocated. Current site learning, planned overlays and master-assurance items remain visibly distinguished for delivery sign-off.", syllabusAligned: true, pdf: "programs/Stage-5-Agriculture-Technology-200-Hour-Master-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Stage-5-Agriculture-Technology-200-Hour-Master-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Stage-5-Agriculture-Technology-200-Hour-Master-Alignment-Manifest-v2.0.json", syllabusTitle: "Agriculture Technology 7–10 Syllabus (2024)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/agriculture-technology-7-10-2024/overview/course", syllabusStatus: "Mandatory from 2027", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-9-Agriculture-Guided-Course/" },
  { title: "Year 9 Agriculture", family: "Agriculture", stage: "Stage 5", course: "Agriculture Technology", periods: 95, version: "v2.0", syllabusAligned: true, pdf: "programs/Year-9-Agriculture-95-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Year-9-Agriculture-95-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Year-9-Agriculture-95-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Agriculture Technology 7–10 Syllabus (2024)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/agriculture-technology-7-10-2024/overview/course", syllabusStatus: "Mandatory from 2027", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-9-Agriculture-Guided-Course/" },
  { title: "Year 10 Agriculture", family: "Agriculture", stage: "Stage 5", course: "Agriculture Technology", periods: 100, version: "v2.0", syllabusAligned: true, pdf: "programs/Year-10-Agriculture-100-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Year-10-Agriculture-100-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Year-10-Agriculture-100-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Agriculture Technology 7–10 Syllabus (2024)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/tas/agriculture-technology-7-10-2024/overview/course", syllabusStatus: "Mandatory from 2027", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-10-Agriculture-Guided-Course/" },
  { title: "Year 8 Science", family: "Science", stage: "Stage 4", course: "Science", periods: 100, version: "v2.0", syllabusAligned: true, pdf: "programs/Year-8-Science-100-Period-Teaching-Program-v2.0-Network-Benchmark.pdf", docx: "programs/Year-8-Science-100-Period-Teaching-Program-v2.0-Network-Benchmark.docx", manifest: "programs/Year-8-Science-100-Period-Alignment-Manifest-v2.0.json", syllabusTitle: "Science 7–10 Syllabus (2023)", syllabusUrl: "https://curriculum.nsw.edu.au/learning-areas/science/science-7-10-2023/overview/course", syllabusStatus: "Implemented from 2026", syllabusVerified: "29 August 2026", site: "https://stevencowell.github.io/Year-8-Science-Guided-Course/" }
];

const stage4UnitFocus = {
  "The Riv Burger": "fap",
  "Desk Tidy": "mpp",
  "Programmable Light": "integrated",
  "Hose Reel Holder": "mpp",
  "Catapult": "ets",
  "Crack the Code": "dct",
  "Multimedia": "dct",
  "Lunch Is Packed": "mpp",
  "Bucket Hat for a Cause": "mpp",
  "Fantastic Food": "fap",
  "Agriculture": "fap",
};

const stage4FocusAreas = [
  { key: "dct", title: "Digital and communication technologies", description: "Projects using data, digital systems and communication technologies." },
  { key: "ets", title: "Engineering technologies and systems", description: "Projects exploring components, forces, motion, energy and engineered solutions." },
  { key: "fap", title: "Food and agricultural practices", description: "Projects developing and evaluating food and agricultural solutions and practices." },
  { key: "mpp", title: "Materials and production processes", description: "Projects selecting, producing and evaluating materials and production processes." },
  { key: "integrated", title: "Integrated across focus areas", description: "A cross-focus project connecting materials and production, digital technologies and engineered systems." },
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
    key: "engineering-technology-7-10-2024",
    title: "Engineering Technology 7–10 Syllabus (2024)",
    url: "https://curriculum.nsw.edu.au/learning-areas/tas/engineering-technology-7-10-2024/overview/course",
    status: "Mandatory from 2027",
    description: "Stage 5 Engineering Technology master and year programs",
    tone: "engineering",
    order: 25,
  },
  {
    key: "food-technology-7-10-2025",
    title: "Food Technology 7–10 Syllabus (2025)",
    url: "https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/overview/course",
    status: "New syllabus — early implementation for 2027; mandatory from 2028",
    description: "Food Technology programs",
    tone: "food",
    order: 30,
  },
  {
    key: "textiles-technology-7-10-2025",
    title: "Textiles Technology 7–10 Syllabus (2025)",
    url: "https://curriculum.nsw.edu.au/learning-areas/tas/textiles-technology-7-10-2025/overview/course",
    status: "New syllabus — early implementation for 2027; mandatory from 2028",
    description: "Textiles Technology programs",
    tone: "textiles",
    order: 40,
  },
  {
    key: "agriculture-technology-7-10-2024",
    title: "Agriculture Technology 7–10 Syllabus (2024)",
    url: "https://curriculum.nsw.edu.au/learning-areas/tas/agriculture-technology-7-10-2024/overview/course",
    status: "Mandatory from 2027",
    description: "Stage 5 Agriculture Technology master and year programs",
    tone: "agriculture",
    order: 50,
  },
  {
    key: "textiles-and-design-stage-6-2013",
    title: "Textiles and Design Stage 6 Syllabus (2013)",
    url: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/tas/textiles-and-design-stage-6-2013",
    status: "Current Stage 6 syllabus",
    description: "Preliminary Textiles and Design program",
    tone: "senior-textiles",
    order: 60,
  },
  {
    key: "science-7-10-2023",
    title: "Science 7–10 Syllabus (2023)",
    url: "https://curriculum.nsw.edu.au/learning-areas/science/science-7-10-2023/overview/course",
    status: "Implemented from 2026",
    description: "Stage 4 Science program",
    tone: "science",
    order: 70,
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
  const details = [program.stage, program.durationLabel || (program.periods ? `${program.periods} periods` : null), program.version].filter(Boolean);
  const isStage4Technology = program.syllabusUrl?.includes("/technology-7-8-2023/");
  if (program.syllabusAligned && !isStage4Technology) {
    details.push("Syllabus-aligned");
  }
  const focusAreaKey = program.master && isStage4Technology ? "all" : stage4UnitFocus[program.title];
  const statusLabel = program.master ? "Master" : (program.benchmark ? "Benchmark" : (ready ? "Ready" : (program.alignmentInProgress ? "Alignment in progress" : "Not yet added")));
  return `
    <article class="program-card${program.master ? " is-master" : ""}" data-family="${program.family}" data-program-title="${program.title}"${focusAreaKey ? ` data-focus-area="${focusAreaKey}"` : ""}>
      <div class="program-body">
        <div class="card-topline">
          <span class="subject-tag">${program.family}</span>
          <span class="status ${ready ? "ready" : "pending"}">${statusLabel}</span>
        </div>
        <h4>${program.title}</h4>
        <p class="course-meta">${courseLabel(program)}</p>
        <div class="program-details">${details.map(detail => `<span>${detail}</span>`).join("")}</div>
        <p class="card-note">${program.master ? (program.masterNote || "Two-year course map with exact site, evidence and syllabus destinations.") : (program.introUnit ? "A 50-period introductory unit that contributes to a named 100-hour elective; additional study is required to complete the course." : (program.benchmark ? "Network benchmark: outcome codes sit beside the syllabus content they support, and each teacher checkpoint says exactly what to check or observe." : (ready ? "Print-ready program and editable source, aligned to the matching course site." : (program.alignmentInProgress ? "Existing course materials are being converted into the network program format; the official syllabus is confirmed." : "The course remains listed so the program gap is visible and easy to complete."))))}</p>
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
  return null;
}

function syllabusFamilyMarkup(group, items) {
  const sorted = [...items].sort((a, b) => {
    const priority = program => program.master ? 0 : (program.benchmark ? 1 : 2);
    return priority(a) - priority(b) || programOrder.get(a) - programOrder.get(b);
  });
  const masters = sorted.filter(program => program.master);
  const projects = sorted.filter(program => !program.master);
  const programLabel = `${items.length} ${items.length === 1 ? "program" : "programs"}`;
  const focusAreaKey = group.key === "technology-7-8-2023" ? `
    <div class="focus-area-key" aria-label="Stage 4 syllabus focus-area colour key">
      <strong>Stage 4 focus-area colours</strong>
      <small>Colour and grouping show each unit's primary syllabus focus area, not a teaching order. Alignment strength is written separately on every card.</small>
      <span class="focus-key--dct">Digital and communication</span>
      <span class="focus-key--ets">Engineering systems</span>
      <span class="focus-key--fap">Food and agriculture</span>
      <span class="focus-key--mpp">Materials and production</span>
      <span class="focus-key--integrated">Integrated project</span>
    </div>
  ` : "";
  const groupedProjects = group.key === "technology-7-8-2023"
    ? stage4FocusAreas.map(area => {
        const areaProjects = projects.filter(program => stage4UnitFocus[program.title] === area.key);
        if (!areaProjects.length) return "";
        const unitLabel = `${areaProjects.length} ${areaProjects.length === 1 ? "unit" : "units"}`;
        return `
          <section class="focus-area-group focus-area-group--${area.key}" aria-labelledby="focus-area-${area.key}">
            <header class="focus-area-heading">
              <div>
                <p>${area.key === "integrated" ? "Cross-focus project" : "Official Stage 4 focus area"}</p>
                <h4 id="focus-area-${area.key}">${area.title}</h4>
                <small>${area.description}</small>
              </div>
              <strong>${unitLabel}</strong>
            </header>
            <div class="program-grid">${areaProjects.map(programCard).join("")}</div>
          </section>
        `;
      }).join("")
    : (projects.length ? `<div class="program-grid">${projects.map(programCard).join("")}</div>` : "");
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
      ${focusAreaKey}
      ${masters.length ? `<div class="master-program-grid" aria-label="Master programs">${masters.map(programCard).join("")}</div>` : ""}
      ${groupedProjects}
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
