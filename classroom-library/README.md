# Google Classroom library

This library adds Google Classroom to the existing course sites and textbook library.
Cards are grouped into visible subject sections using the textbook library’s
subject categories, with quick links at the top of the collection.
No student or submission data is displayed here.

## Add the next completed classroom

1. Verify its class name, year/subject, direct URL and joining code in Classroom.
2. Save its approved banner in assets.
3. Add a card to its subject section using the Mirror card’s structure, h4 title
   and unique IDs. Link its matching course and textbook-library anchor, then add
   its joining instructions. Keep existing card IDs stable for incoming links.
   Add a new subject section and navigation link when its first card is ready.
4. Update the subject heading and navigation counts. Count draft-only classrooms
   in their section, but keep their status explicit and exclude them from the
   available-classroom total. Update copy-button labels/status handling as needed.
5. Add its Classroom link to the main menu project card and its direct Classroom
   link to that course's Teacher resources page.
6. Check the card, links, image crop and joining instructions on desktop and mobile.
7. Publish only with Steve's explicit authorisation, then verify the live page.

The banner was created using the built-in image-generation tool, referencing the
existing Mirror website image, then reframed for Google Classroom's shallow crop.
The class title and "Yr 10 Timber Technology" are native text over the artwork.

The Footstool banner was generated from the corresponding course artwork and is
reused from the Classroom package. Its native Classroom upload remains pending;
the library hosts its own copy. Class names and year/subject labels are accessible
HTML text over both banners. Code-copy status and fallback selection stay within
the selected card.
