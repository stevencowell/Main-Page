
(() => {
  const D = window.DT_COURSE_DATA;
  if (!D) return;
  const body = document.body;
  const root = body.dataset.root || '';
  const active = body.dataset.active || 'course';
  const prefix = D.meta.storage_prefix;
  const folioSchema = 'tas-course-folio-backup';
  const folioSchemaVersion = 2;
  const folioCourseId = 'year-11-design-and-technology';
  const responseMinimumWords = 40;
  const esc = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const get = key => localStorage.getItem(`${prefix}:${key}`) || '';
  const set = (key, value) => localStorage.setItem(`${prefix}:${key}`, value);
  const remove = key => localStorage.removeItem(`${prefix}:${key}`);
  const allSections = () => D.modules.flatMap(module => module.sections.map((section, index) => ({module, section, index})));
  const wordCount = value => value.trim() ? value.trim().split(/\s+/).length : 0;
  const sectionEvidenceState = section => {
    const checked = section.questions.filter(question => get(`question:${question.id}`)).length;
    const words = wordCount(get(`written:${section.written.id}`));
    const evidenceComplete = checked === section.questions.length && words >= responseMinimumWords;
    const managedKey = `complete-managed:${section.id}`;
    const managed = get(managedKey) === 'v2';
    const legacyComplete = get(`complete:${section.id}`) === 'yes' && !managed;
    if (evidenceComplete) {
      set(`complete:${section.id}`, 'yes');
      set(managedKey, 'v2');
    } else if (managed) {
      set(`complete:${section.id}`, '');
    }
    return {checked, words, complete:legacyComplete||evidenceComplete, evidenceComplete, legacyComplete};
  };
  const nextIncompleteSection = module => {
    const sections = module ? module.sections.map((section, index) => ({module, section, index})) : allSections();
    return sections.find(({section}) => !sectionEvidenceState(section).complete) || null;
  };
  const focusTarget = (id, updateHash=true) => {
    const target = document.getElementById(id);
    if (!target) return false;
    const learningPackage = target.matches('[data-section-package]') ? target : target.closest('[data-section-package]');
    if (learningPackage) learningPackage.open = true;
    if (updateHash) history.replaceState(null, '', `#${id}`);
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth', block:'start'});
    return true;
  };
  const bindFocusLinks = (scope=document) => scope.querySelectorAll('[data-focus-target]').forEach(link => link.addEventListener('click', event => {
    const id = link.dataset.focusTarget;
    if (!document.getElementById(id)) return;
    event.preventDefault();
    focusTarget(id);
  }));
  window.addEventListener('hashchange',()=>{
    const id=decodeURIComponent(location.hash.slice(1));
    if(id&&document.getElementById(id))focusTarget(id,false);
  });
  const destinations = [
    ['course', `${root}index.html`, 'Course'], ['modules', `${root}modules/index.html`, 'Modules'],
    ['projects', `${root}projects.html`, 'Projects'], ['folio', `${root}folio.html`, 'My folio'],
    ['assessment', `${root}assessment.html`, 'Assessment'], ['resources', `${root}resources.html`, 'Resources'],
    ['program', `${root}program.html`, 'Program'], ['teacher', `${root}teacher-resources.html`, 'Teacher resources'],
    ['main', 'https://stevencowell.github.io/Main-Page/', 'Main menu']
  ];
  const nav = document.querySelector('[data-site-nav]');
  if (nav) nav.innerHTML = `<div class="site-nav"><div class="wrap nav-inner"><a class="brand" href="${root}index.html"><span class="brand-mark">D&amp;T</span><span>Year 11 Design and Technology<small>Industrial Arts Learning Hub</small></span></a><nav class="nav-links" aria-label="Course navigation">${destinations.map(([key,url,label]) => `<a href="${url}"${key===active?' aria-current="page"':''}>${label}</a>`).join('')}</nav></div></div>`;

  const sectionKey = id => `complete:${id}`;
  const completedSections = () => D.modules.flatMap(m => m.sections).filter(s => sectionEvidenceState(s).complete).length;
  const moduleProgress = module => module.sections.filter(s => sectionEvidenceState(s).complete).length;

  function moduleCard(m){
    const done = moduleProgress(m), pct = Math.round(done / m.sections.length * 100);
    return `<article class="module-card" data-term="${esc(m.term)}"><div class="module-card-number"><span>${m.number}</span><span class="fine">${esc(m.weeks)}</span></div><p class="eyebrow">${esc(m.term)} · ${esc(m.project)}</p><h3>${esc(m.title)}</h3><p>${esc(m.summary)}</p><div class="module-card-progress"><div class="progress-track" aria-label="${done} of ${m.sections.length} sections complete"><div class="progress-fill" style="width:${pct}%"></div></div><span class="fine">${done}/${m.sections.length} sections complete</span></div><a class="module-link" href="${root}modules/module-${String(m.number).padStart(2,'0')}.html">Open Module ${m.number} →</a></article>`;
  }
  function renderModuleGrid(){
    document.querySelectorAll('[data-module-grid]').forEach(grid => {
      const filter = grid.dataset.currentFilter || 'All';
      grid.innerHTML = D.modules.filter(m => filter === 'All' || m.term === filter).map(moduleCard).join('');
    });
    const progress = document.querySelector('[data-home-progress]');
    if (progress) {
      const next = nextIncompleteSection();
      progress.innerHTML = `<span>${completedSections()} of ${D.meta.sections}</span><br><span class="fine">learning packages complete on this device</span>${next?`<a class="home-resume-link" data-resume href="${root}modules/module-${String(next.module.number).padStart(2,'0')}.html#${next.section.id}-learning">Continue: Module ${next.module.number}, Section ${next.index+1} — ${esc(next.section.title)}</a>`:`<a class="home-resume-link" data-resume href="${root}folio.html#folio-01">All packages complete — review My folio</a>`}`;
    }
  }
  function renderTermFilter(){
    const mount = document.querySelector('[data-term-filter]'); if(!mount) return;
    const labels = ['All','Term 1','Term 2','Term 3'];
    mount.innerHTML = labels.map((x,i)=>`<button class="filter-button" type="button" aria-pressed="${i===0}" data-filter="${x}">${x}</button>`).join('');
    mount.addEventListener('click', e => {
      const btn=e.target.closest('[data-filter]'); if(!btn)return;
      mount.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', String(b===btn)));
      document.querySelectorAll('[data-module-grid]').forEach(g=>g.dataset.currentFilter=btn.dataset.filter);
      renderModuleGrid();
    });
  }

  function optionsHtml(q){
    return q.options.map(o=>`<label class="option"><input type="radio" name="${q.id}" value="${o.id}"><span><strong>${o.id.toUpperCase()}.</strong> ${esc(o.text)}</span></label>`).join('');
  }
  function questionHtml(q, n){
    return `<fieldset class="question mcq" data-question="${q.id}"><legend>${n}. ${esc(q.prompt)}</legend>${optionsHtml(q)}<div class="question-actions"><button class="button secondary" type="button" data-check-question>Check answer</button><a class="help-link" href="${q.help_anchor}">Review nearby theory</a></div><p class="feedback" data-question-feedback aria-live="polite"></p></fieldset>`;
  }
  function writtenHtml(s){ const w=s.written;
    return `<section class="written-response" id="${s.id}-response"><p class="eyebrow">Formative learning evidence</p><h3>${esc(w.command_verb)} response · ${esc(w.suggested_length)}</h3><p>${esc(w.prompt)}</p><div class="scaffold-grid"><div><strong>Build the response</strong><ol>${w.scaffolds.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><div><strong>Success criteria</strong><ul>${w.success_criteria.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><label for="${w.id}"><strong>Your response</strong><span class="sr-only"> for ${esc(s.title)}</span></label><textarea id="${w.id}" data-written="${w.id}" data-evidence-response placeholder="Draft your response here. It autosaves only on this device."></textarea><div class="response-controls"><button class="button secondary" type="button" data-save-written>Save now</button><span class="fine" data-word-count>0 words</span></div><p class="save-status" data-save-status tabindex="-1" aria-live="polite">Not yet saved on this device.</p></section>`;
  }
  function sectionVisualHtml(s, moduleNumber){
    const mapPath=`../assets/module-${moduleNumber}-map.svg`;
    return `<figure class="section-purpose-visual" id="${s.id}-visual" data-section-visual><div class="section-map-scroll"><a href="${mapPath}" target="_blank" rel="noopener"><img src="${mapPath}" loading="lazy" alt="Module ${Number(moduleNumber)} learning map used to trace ${esc(s.title)}"></a></div><figcaption><strong>Section lens: ${esc(s.title)}.</strong> Locate this strand on the module map and notice how “${esc(s.points[0])}” supports the learning intention: ${esc(s.intention)} <a href="${mapPath}" target="_blank" rel="noopener">Open the full map</a>.</figcaption></figure>`;
  }
  function nonVideoPathwayHtml(s){
    return `<section class="section-media-pathway" id="${s.id}-media" data-section-media aria-labelledby="${s.id}-media-title"><p class="eyebrow">Non-video learning pathway</p><h3 id="${s.id}-media-title">Read → trace → explain</h3><ol><li><a href="#${s.id}-theory">Read the section theory</a> and identify its strongest claim.</li><li><a href="#${s.id}-visual">Trace that claim on the module map</a> and connect it to one other idea.</li><li>Use the <a href="#${s.id}-worked">worked decision</a> and <a href="#${s.id}-evidence">stronger evidence</a> to explain one defensible choice before opening the learning package.</li></ol></section>`;
  }
  function sectionHtml(s, idx, moduleNumber){
    return `<article class="theory-section" id="${s.id}" tabindex="-1" data-section-container="${s.id}"><header class="theory-head"><p class="section-number">Section ${idx}</p><h2>${esc(s.title)}</h2><p class="learning-intention"><strong>Learning intention:</strong> ${esc(s.intention)}</p></header><div class="theory-body" id="${s.id}-theory" data-section-theory><p>${esc(s.intro)}</p><div class="key-grid"><section class="idea-card"><h3>Key ideas</h3><ul>${s.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="misconception-card" id="${s.id}-misconceptions"><h3>Claims that need correction</h3><ul>${s.misconceptions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div><section class="worked-card" id="${s.id}-worked"><p class="eyebrow">Worked decision</p><h3>${esc(s.application[0])}</h3><p class="answer"><strong>Defensible response:</strong> ${esc(s.application[1])}</p></section><section class="evidence-card" id="${s.id}-evidence"><h3>${esc(s.evidence[0])}</h3><p><strong>Stronger evidence:</strong> ${esc(s.evidence[1])}</p></section><h3 id="${s.id}-sequence">A defensible sequence</h3><ol class="sequence-list">${s.sequence.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><section id="${s.id}-judgement"><h3>Judgement standard</h3><p>${esc(s.judgement[1])}</p></section><h3 id="${s.id}-terms">Course terms</h3><table class="terms-table"><tbody>${s.terms.map(([t,d])=>`<tr><th>${esc(t)}</th><td>${esc(d)}</td></tr>`).join('')}</tbody></table><p class="source-note"><strong>Source basis:</strong> ${esc(s.source_note)}</p></div>${sectionVisualHtml(s,moduleNumber)}${nonVideoPathwayHtml(s)}<details class="learning-cycle section-learning" id="${s.id}-learning" tabindex="-1" data-section-package="${s.id}"><summary id="${s.id}-learning-summary"><span><strong>Learning package ${idx}: ${esc(s.title)}</strong><small>Formative learning evidence · 10 questions + 1 scaffolded response</small></span><strong class="package-state" data-package-state="${s.id}">Not started</strong></summary><div class="learning-body"><p>Select and check every answer for feedback, then save a substantive response of at least ${responseMinimumWords} words.</p><div class="question-set">${s.questions.map((q,i)=>questionHtml(q,i+1)).join('')}</div>${writtenHtml(s)}<div class="package-actions"><button class="button secondary" type="button" data-reset-section="${s.id}">Reset only this package</button><button class="button secondary" type="button" data-print-section="${s.id}">Print / save PDF</button></div><div class="completion-box"><div><strong>Package readiness</strong><br><span class="fine" data-completion-summary="${s.id}">0/10 answers checked · 0 words saved</span></div><button class="button" type="button" data-complete-section="${s.id}">Check readiness</button></div><p class="fine evidence-boundary">This formative learning evidence is saved only in this browser. It is not formal assessment, proof of submission or teacher verification.</p></div></details></article>`;
  }
  function moduleProgressPanel(m){
    const done=moduleProgress(m),pct=Math.round(done/m.sections.length*100),next=nextIncompleteSection(m);
    const action=next
      ? `<a class="module-resume-link" data-resume href="#${next.section.id}-learning" data-focus-target="${next.section.id}-learning">Continue with Package ${next.index+1}: ${esc(next.section.title)}</a>`
      : (m.number<D.modules.length
        ? `<a class="module-resume-link" data-resume href="module-${String(m.number+1).padStart(2,'0')}.html#${D.modules[m.number].sections[0].id}-learning">Module complete — open Module ${m.number+1}</a>`
        : '<a class="module-resume-link" data-resume href="../folio.html#folio-01">Module complete — review My folio</a>');
    return `<p class="eyebrow">Module progress</p><h2>${done}/${m.sections.length} packages</h2><div class="progress-track" aria-label="${done} of ${m.sections.length} learning packages complete"><div class="progress-fill" style="width:${pct}%"></div></div>${action}`;
  }
  function reviewStateText(section){
    const state=sectionEvidenceState(section);
    return state.legacyComplete ? 'Complete · previous record' : state.complete ? 'Complete' : state.checked || state.words ? `${state.checked}/10 checked · ${state.words} words` : 'Not started';
  }
  function moduleReviewHtml(m){
    const next=nextIncompleteSection(m)||{section:m.sections[0],index:0};
    return `<section class="module-review-checklist" id="${m.id}-review" data-module-review><p class="eyebrow">Module review and checklist</p><h2><span data-module-review-count>${moduleProgress(m)}</span> of 3 packages complete</h2><p>Open the exact package you need. Each drawer stays closed until you choose it.</p><ul class="module-review-grid" id="${m.id}-review-checklist">${m.sections.map((s,i)=>`<li><a href="#${s.id}-learning" data-review-link="${s.id}" data-focus-target="${s.id}-learning"><span>Package ${i+1}: ${esc(s.title)}</span><strong data-review-state="${s.id}">${reviewStateText(s)}</strong></a></li>`).join('')}</ul><a class="button secondary module-review-resume" data-resume href="#${next.section.id}-learning" data-focus-target="${next.section.id}-learning">${moduleProgress(m)===m.sections.length?'Review Package 1':`Resume Package ${next.index+1}`}</a><p class="fine">Complete means all ten answers have been checked and a substantive response of at least ${responseMinimumWords} words is saved. Formal assessment follows the current teacher-issued notification.</p></section>`;
  }
  function renderModule(){
    const id=body.dataset.module; if(!id)return;
    const m=D.modules.find(x=>x.id===id); if(!m)return;
    const main=document.querySelector('[data-module-content]'), aside=document.querySelector('[data-module-aside]');
    const moduleNumber=String(m.number).padStart(2,'0');
    const presentationPath=`../documents/presentations/Year-11-Design-and-Technology-Module-${moduleNumber}.pptx`;
    main.innerHTML=`<section class="module-presentation-card" id="module-presentation-${moduleNumber}" data-module-presentation="${m.id}" aria-labelledby="${m.id}-presentation-title"><div><p class="eyebrow">Module presentation</p><h2 id="${m.id}-presentation-title">Module ${m.number} PowerPoint</h2><p>Use the matching classroom deck to preview the module and keep the key learning sequence together.</p></div><a class="button" id="module-presentation-download-${moduleNumber}" href="${presentationPath}" download data-module-presentation-download>Download PowerPoint</a></section><figure class="module-visual"><a href="../assets/module-${moduleNumber}-map.svg" target="_blank" rel="noopener"><img src="../assets/module-${moduleNumber}-map.svg" alt="Learning map for Module ${m.number}: ${esc(m.title)}"></a><figcaption>Scroll the map sideways, or open it for a larger view.</figcaption></figure>${m.sections.map((s,i)=>sectionHtml(s,i+1,moduleNumber)).join('')}${moduleReviewHtml(m)}<nav class="module-pagination">${m.number>1?`<a class="button secondary" href="module-${String(m.number-1).padStart(2,'0')}.html">← Module ${m.number-1}</a>`:'<span></span>'}${m.number<D.modules.length?`<a class="button" href="module-${String(m.number+1).padStart(2,'0')}.html">Module ${m.number+1} →</a>`:`<a class="button" href="../folio.html#folio-01">Open My folio →</a>`}</nav>`;
    aside.innerHTML=`<div class="panel" data-module-progress-panel>${moduleProgressPanel(m)}</div><div class="panel"><h2>In this module</h2><ol class="section-nav">${m.sections.map((s,i)=>`<li><a href="#${s.id}" data-focus-target="${s.id}">${i+1}. ${esc(s.title)}</a><a class="aside-learning-link" href="#${s.id}-learning" data-focus-target="${s.id}-learning">Learning package</a></li>`).join('')}</ol></div><div class="panel"><h2>Apply and keep</h2><p>${esc(m.applied)}</p><a class="text-link" href="../folio.html">Open My folio</a></div><div class="panel"><h2>Project context</h2><p>${esc(m.project)}</p><p class="fine">Current teacher instructions and task notices remain authoritative.</p></div>`;
    bindQuestions(); bindWritten(); bindCompletion(); bindPackageReset(); bindPackagePrint(); restoreQuestionState(); updateModuleRuntime(m); bindFocusLinks(main); bindFocusLinks(aside);
    requestAnimationFrame(()=>{
      const hash=decodeURIComponent(location.hash.slice(1));
      if(hash&&document.getElementById(hash)) focusTarget(hash,false);
    });
  }
  function showQuestionFeedback(field,q,opt){
    const feedback=field.querySelector('[data-question-feedback]');
    feedback.textContent=opt.feedback;
    feedback.className=`feedback ${opt.correct?'good':'try'}`;
  }
  function bindQuestions(){
    document.querySelectorAll('[data-check-question]').forEach(btn=>btn.addEventListener('click',()=>{
      const field=btn.closest('[data-question]'),qid=field.dataset.question;
      const q=D.modules.flatMap(m=>m.sections).flatMap(s=>s.questions).find(x=>x.id===qid);
      const chosen=field.querySelector('input:checked'), feedback=field.querySelector('.feedback');
      if(!chosen){feedback.className='feedback try';feedback.textContent='Choose an option before checking.';return;}
      const opt=q.options.find(o=>o.id===chosen.value);showQuestionFeedback(field,q,opt);
      set(`question:${qid}`,chosen.value); set(`question-feedback:${qid}`,opt.correct?'good':'try');
      updateModuleRuntime();
    }));
  }
  function restoreQuestionState(){
    document.querySelectorAll('[data-question]').forEach(field=>{
      const qid=field.dataset.question, value=get(`question:${qid}`); if(!value)return;
      const input=field.querySelector(`input[value="${value}"]`); if(input)input.checked=true;
      const q=D.modules.flatMap(m=>m.sections).flatMap(s=>s.questions).find(x=>x.id===qid);
      const opt=q?.options.find(o=>o.id===value);
      if(q&&opt)showQuestionFeedback(field,q,opt);
    });
  }
  function bindWritten(){
    document.querySelectorAll('[data-written]').forEach(area=>{
      area.value=get(`written:${area.dataset.written}`);
      const box=area.closest('.written-response'),count=box.querySelector('[data-word-count]'),status=box.querySelector('[data-save-status]');
      const persist=announce=>{
        try{set(`written:${area.dataset.written}`,area.value);count.textContent=`${wordCount(area.value)} words`;status.textContent=`${announce?'Saved':'Autosaved'} on this device.`;updateModuleRuntime()}
        catch(error){status.textContent='This browser could not save the response. Copy or print it before closing.'}
      };
      count.textContent=`${wordCount(area.value)} words`;
      if(area.value)status.textContent='Saved draft restored from this device.';
      area.addEventListener('input',()=>persist(false));
      box.querySelector('[data-save-written]').addEventListener('click',()=>{persist(true);status.focus()});
    });
  }
  function bindCompletion(){
    document.querySelectorAll('[data-complete-section]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        updateModuleRuntime();
        const summary=document.querySelector(`[data-completion-summary="${CSS.escape(btn.dataset.completeSection)}"]`);
        if(summary){summary.setAttribute('tabindex','-1');summary.focus()}
      });
    });
  }
  function bindPackageReset(){
    document.querySelectorAll('[data-reset-section]').forEach(btn=>btn.addEventListener('click',()=>{
      const section=D.modules.flatMap(m=>m.sections).find(s=>s.id===btn.dataset.resetSection);
      if(!section||!confirm('Reset only this learning package’s saved answers and response on this device?'))return;
      section.questions.forEach(question=>{remove(`question:${question.id}`);remove(`question-feedback:${question.id}`)});
      remove(`written:${section.written.id}`);remove(sectionKey(section.id));remove(`complete-managed:${section.id}`);
      const packageElement=document.getElementById(`${section.id}-learning`);
      packageElement.querySelectorAll('input[type="radio"]').forEach(input=>{input.checked=false});
      packageElement.querySelectorAll('[data-question-feedback]').forEach(node=>{node.textContent='';node.className='feedback'});
      const area=packageElement.querySelector('[data-evidence-response]');area.value='';
      packageElement.querySelector('[data-word-count]').textContent='0 words';
      const status=packageElement.querySelector('[data-save-status]');status.textContent='Only this package was reset on this device.';status.focus();
      updateModuleRuntime();
    }));
  }
  function clearPackagePrintState(){
    body.classList.remove('learning-package-print');
    document.querySelectorAll('.is-print-target,.is-print-parent').forEach(node=>node.classList.remove('is-print-target','is-print-parent'));
  }
  function bindPackagePrint(){
    document.querySelectorAll('[data-print-section]').forEach(btn=>btn.addEventListener('click',()=>{
      clearPackagePrintState();
      const packageElement=document.getElementById(`${btn.dataset.printSection}-learning`);
      packageElement.open=true;packageElement.classList.add('is-print-target');packageElement.closest('[data-section-container]').classList.add('is-print-parent');body.classList.add('learning-package-print');window.print();
    }));
    window.addEventListener('afterprint',clearPackagePrintState);
  }
  function updateModuleRuntime(module=D.modules.find(item=>item.id===body.dataset.module)){
    if(!module)return;
    module.sections.forEach(section=>{
      const state=sectionEvidenceState(section);
      const stateText=state.legacyComplete?'Complete · previous record':state.complete?'Complete':state.checked||state.words?`${state.checked}/10 checked · ${state.words} words`:'Not started';
      document.querySelectorAll(`[data-package-state="${CSS.escape(section.id)}"],[data-review-state="${CSS.escape(section.id)}"]`).forEach(node=>{node.textContent=stateText;node.dataset.state=state.complete?'complete':state.checked||state.words?'draft':'not-started'});
      const summary=document.querySelector(`[data-completion-summary="${CSS.escape(section.id)}"]`);
      if(summary)summary.textContent=state.legacyComplete?'Complete from this browser’s previous course record. Reset only if you want to start this package again.':state.complete?'Complete: 10/10 answers checked and a substantive response saved.':`${state.checked}/10 answers checked · ${state.words} words saved · ${Math.max(0,responseMinimumWords-state.words)} more words needed`;
      const button=document.querySelector(`[data-complete-section="${CSS.escape(section.id)}"]`);
      if(button){button.textContent=state.legacyComplete?'Previously complete ✓':state.complete?'Package complete ✓':'Check readiness';button.classList.toggle('secondary',state.complete)}
    });
    const panel=document.querySelector('[data-module-progress-panel]');
    if(panel){panel.innerHTML=moduleProgressPanel(module);bindFocusLinks(panel)}
    const count=document.querySelector('[data-module-review-count]');if(count)count.textContent=String(moduleProgress(module));
    const next=nextIncompleteSection(module),resume=document.querySelector('.module-review-checklist [data-resume]');
    if(resume){const target=next||{section:module.sections[0],index:0};resume.href=`#${target.section.id}-learning`;resume.dataset.focusTarget=`${target.section.id}-learning`;resume.textContent=next?`Resume Package ${target.index+1}`:'Review Package 1'}
  }
  function downloadFile(filename, type, content){
    const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement('a');
    link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),0);
  }
  function folioWrittenItems(){
    return D.modules.flatMap(module=>module.sections.map(section=>({id:section.written.id,section:section.id,title:section.title,response:get(`written:${section.written.id}`)})));
  }
  function createFolioBackup(){
    return {schema:folioSchema,schema_version:folioSchemaVersion,course_id:folioCourseId,course:D.meta.course,build_id:D.meta.build_id,exported_at:new Date().toISOString(),contents:'Folio-card text and saved module written responses. No files or photographs are stored by this folio.',cards:D.folio_cards.map(card=>({id:card.id,title:card.title,notes:get(`folio:${card.id}`)})),written_responses:folioWrittenItems()};
  }
  function validateFolioBackup(data){
    if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('This is not a readable folio backup.');
    if(data.course&&data.course!==D.meta.course)throw new Error('This backup belongs to a different course. Nothing was changed.');
    const cardById=new Map(D.folio_cards.map(card=>[card.id,card])),cardByTitle=new Map(D.folio_cards.map(card=>[card.title,card]));
    const writtenById=new Map(D.modules.flatMap(module=>module.sections.map(section=>[section.written.id,section]))),writtenBySection=new Map(D.modules.flatMap(module=>module.sections.map(section=>[section.id,section])));
    const ensureText=(value,label)=>{if(typeof value!=='string'||value.length>1000000)throw new Error(`${label} is not valid text.`);return value};
    const cards=new Map(),written=new Map();
    if(data.schema===folioSchema){
      if(data.schema_version!==folioSchemaVersion)throw new Error('This backup version is not supported. Nothing was changed.');
      if(data.course_id!==folioCourseId)throw new Error('This backup belongs to a different course. Nothing was changed.');
      if(!Array.isArray(data.cards)||data.cards.length!==D.folio_cards.length)throw new Error('The backup does not contain the complete ten-card folio. Nothing was changed.');
      data.cards.forEach(item=>{
        if(!item||!cardById.has(item.id)||cards.has(item.id))throw new Error('The backup contains an unknown or repeated folio card. Nothing was changed.');
        cards.set(item.id,ensureText(item.notes,`Notes for ${item.id}`));
      });
      if(!Array.isArray(data.written_responses)||data.written_responses.length!==writtenById.size)throw new Error('The backup does not contain the complete set of saved module written responses. Nothing was changed.');
      data.written_responses.forEach(item=>{
        if(!item||!writtenById.has(item.id)||written.has(item.id))throw new Error('The backup contains an unknown or repeated written response. Nothing was changed.');
        written.set(item.id,ensureText(item.response,`Response for ${item.id}`));
      });
      if(written.size!==writtenById.size)throw new Error('The backup does not contain the complete set of saved module written responses. Nothing was changed.');
    }else{
      if(data.course!==D.meta.course||!Array.isArray(data.cards)||data.cards.length!==D.folio_cards.length)throw new Error('This is not a compatible Year 11 Design and Technology folio backup. Nothing was changed.');
      data.cards.forEach(item=>{
        const card=item&&cardByTitle.get(item.title);
        if(!card||cards.has(card.id))throw new Error('The older backup contains an unknown or repeated folio card. Nothing was changed.');
        cards.set(card.id,ensureText(item.notes,`Notes for ${card.id}`));
      });
      const items=Array.isArray(data.written_responses)?data.written_responses:[];
      items.forEach(item=>{
        const section=item&&writtenBySection.get(item.section);
        if(!section||written.has(section.written.id))throw new Error('The older backup contains an unknown or repeated written response. Nothing was changed.');
        written.set(section.written.id,ensureText(item.response,`Response for ${section.id}`));
      });
    }
    if(cards.size!==D.folio_cards.length)throw new Error('The backup is incomplete. Nothing was changed.');
    return {cards,written};
  }
  function restoreFolioBackup(backup){
    const storageItems=[...D.folio_cards.map(card=>[`folio:${card.id}`,backup.cards.get(card.id)||'']),...D.modules.flatMap(module=>module.sections.map(section=>[`written:${section.written.id}`,backup.written.get(section.written.id)||'']))];
    const before=new Map(storageItems.map(([key])=>[key,localStorage.getItem(`${prefix}:${key}`)]));
    try{
      storageItems.forEach(([key,value])=>value?set(key,value):localStorage.removeItem(`${prefix}:${key}`));
    }catch(error){
      try{before.forEach((value,key)=>value===null?localStorage.removeItem(`${prefix}:${key}`):localStorage.setItem(`${prefix}:${key}`,value))}catch(rollbackError){console.error('Folio rollback failed',rollbackError)}
      throw new Error('The backup could not be restored, so the previous local folio was put back.');
    }
  }
  function createFolioHtml(){
    const cards=D.folio_cards.map((card,index)=>`<article><p class="label">Evidence card ${index+1}</p><h2>${esc(card.title)}</h2><p><strong>Prompt:</strong> ${esc(card.prompt)}</p><div class="response">${esc(get(`folio:${card.id}`))||'<em>No notes saved.</em>'}</div></article>`).join('');
    const written=folioWrittenItems().filter(item=>item.response).map(item=>`<article><p class="label">Saved module response · ${esc(item.section)}</p><h2>${esc(item.title)}</h2><div class="response">${esc(item.response)}</div></article>`).join('');
    return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Year 11 Design and Technology folio export</title><style>body{max-width:900px;margin:0 auto;padding:32px;font:16px/1.55 Arial,sans-serif;color:#18231f}header{border-bottom:4px solid #173a32;margin-bottom:24px}article{break-inside:avoid;margin:0 0 22px;padding:20px;border:1px solid #d9d2c6;border-radius:12px}h1,h2{font-family:Georgia,serif}.label{color:#8e3b32;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.response{white-space:pre-wrap;padding:14px;background:#f7f0e3;border-radius:8px}@media print{body{padding:0}article{box-shadow:none}}</style></head><body><header><h1>Year 11 Design and Technology folio</h1><p>Self-contained export created ${esc(new Date().toLocaleString('en-AU'))}. This is a student-held learning record, not proof of submission.</p></header>${cards}${written?`<h1>Saved module responses</h1>${written}`:''}</body></html>`;
  }
  function renderFolio(){
    const grid=document.querySelector('[data-folio-grid]'); if(!grid)return;
    const status=document.querySelector('[data-folio-status]'),progress=document.querySelector('[data-folio-progress]'),resume=document.querySelector('[data-folio-resume]');
    const setStatus=message=>{if(status)status.textContent=message};
    const updateProgress=()=>{
      const started=D.folio_cards.filter(card=>get(`folio:${card.id}`).trim()).length,next=D.folio_cards.find(card=>!get(`folio:${card.id}`).trim());
      if(progress)progress.textContent=`${started} of ${D.folio_cards.length} cards have saved notes on this device.`;
      grid.querySelectorAll('[data-folio-card]').forEach(card=>{const hasNotes=get(`folio:${card.id}`).trim();card.querySelector('[data-card-state]').textContent=hasNotes?'Saved notes':'Not started'});
      if(resume){const target=next||D.folio_cards[0];resume.href=`#${target.id}`;resume.dataset.focusTarget=target.id;resume.textContent=next?`Continue with Card ${D.folio_cards.indexOf(target)+1}: ${target.title}`:'All cards have notes — review Card 1';resume.onclick=event=>{event.preventDefault();focusTarget(target.id)}};
    };
    const syncFields=()=>{grid.querySelectorAll('[data-folio-id]').forEach(area=>{const value=get(`folio:${area.dataset.folioId}`);area.value=value;area.closest('[data-folio-card]').querySelector('[data-folio-print-text]').textContent=value||'No notes saved.'});updateProgress()};
    grid.innerHTML=D.folio_cards.map((card,index)=>`<article class="folio-card" id="${card.id}" tabindex="-1" data-folio-card><div class="folio-card-heading"><div><p class="eyebrow">Evidence card ${index+1}</p><h2>${esc(card.title)}</h2></div><span class="folio-card-state" data-card-state>Not started</span></div><p><strong>Evidence prompt:</strong> ${esc(card.prompt)}</p><a class="text-link" href="modules/module-${card.link.slice(1,3)}.html#${card.link}">Open linked theory</a><label for="${card.id}-notes"><strong>Evidence notes</strong></label><textarea id="${card.id}-notes" data-folio-id="${card.id}" placeholder="Record concise evidence, decisions and next actions..."></textarea><div class="folio-print-response" data-folio-print-text></div><p class="fine">Saved only in this browser until you make a backup or export.</p><div class="folio-card-actions"><button class="button secondary" type="button" data-save-folio>Save card</button><button class="button secondary" type="button" data-print-folio-card>Print this card</button></div><p class="save-status" aria-live="polite"></p></article>`).join('');
    syncFields();
    grid.querySelectorAll('[data-folio-id]').forEach(area=>{
      const save=()=>{const card=area.closest('[data-folio-card]');try{set(`folio:${area.dataset.folioId}`,area.value);card.querySelector('[data-folio-print-text]').textContent=area.value||'No notes saved.';card.querySelector('.save-status').textContent='Saved on this device.';updateProgress()}catch(error){card.querySelector('.save-status').textContent='Could not save on this device. Export or copy your work before closing.'}};
      area.addEventListener('input',save);area.addEventListener('change',save);area.addEventListener('blur',save);
      area.closest('[data-folio-card]').querySelector('[data-save-folio]').addEventListener('click',save);
    });
    window.addEventListener('pagehide',()=>grid.querySelectorAll('[data-folio-id]').forEach(area=>{try{set(`folio:${area.dataset.folioId}`,area.value)}catch(error){console.error('Folio pagehide save failed',error)}}),{once:true});
    grid.querySelectorAll('[data-print-folio-card]').forEach(button=>button.addEventListener('click',()=>{
      grid.querySelectorAll('[data-print-active]').forEach(card=>card.removeAttribute('data-print-active'));
      button.closest('[data-folio-card]').setAttribute('data-print-active','');body.classList.add('folio-print-card');window.print();
    }));
    window.addEventListener('afterprint',()=>{body.classList.remove('folio-print-card');grid.querySelectorAll('[data-print-active]').forEach(card=>card.removeAttribute('data-print-active'))});
    document.querySelector('[data-export-folio]')?.addEventListener('click',()=>{downloadFile('year-11-design-technology-folio-backup-v2.json','application/json',JSON.stringify(createFolioBackup(),null,2));setStatus('Editable JSON backup exported. Keep it somewhere you can find again.')});
    document.querySelector('[data-export-folio-html]')?.addEventListener('click',()=>{downloadFile('year-11-design-technology-folio-export.html','text/html;charset=utf-8',createFolioHtml());setStatus('Readable self-contained HTML export created.')});
    document.querySelector('[data-print-folio-all]')?.addEventListener('click',()=>{body.classList.remove('folio-print-card');grid.querySelectorAll('[data-print-active]').forEach(card=>card.removeAttribute('data-print-active'));window.print()});
    document.querySelector('[data-import-folio]')?.addEventListener('change',async event=>{
      const input=event.currentTarget,file=input.files?.[0];if(!file)return;
      try{
        if(file.size>5000000)throw new Error('That file is too large to be this folio backup. Nothing was changed.');
        const backup=validateFolioBackup(JSON.parse(await file.text()));
        if(!confirm('Restore this backup? It will replace the locally saved folio cards and module written responses on this device.')){setStatus('Restore cancelled. Nothing was changed.');return}
        restoreFolioBackup(backup);syncFields();setStatus('Backup restored safely on this device.');
      }catch(error){setStatus(error instanceof SyntaxError?'That file is not valid JSON. Nothing was changed.':error.message)}finally{input.value=''}
    });
    document.querySelector('[data-clear-folio]')?.addEventListener('click',()=>{
      if(!confirm('Clear all locally saved folio cards and written responses on this device? Export a backup first if you may need them.'))return;
      try{Object.keys(localStorage).filter(key=>key.startsWith(`${prefix}:folio:`)||key.startsWith(`${prefix}:written:`)).forEach(key=>localStorage.removeItem(key));syncFields();setStatus('Local folio and saved module responses cleared.')}catch(error){setStatus('The local folio could not be cleared on this device.')}
    });
    requestAnimationFrame(()=>{const hash=decodeURIComponent(location.hash.slice(1));if(/^folio-\d{2}$/.test(hash))focusTarget(hash,false)});
  }
  function renderBusy(){const grid=document.querySelector('[data-busy-grid]');if(!grid)return;grid.innerHTML=D.busy_work.map((x,i)=>`<article class="busy-card"><div class="busy-number">${String(i+1).padStart(2,'0')}</div><div><h2>${esc(x.title)}</h2><p>${esc(x.task)}</p><p class="busy-evidence"><strong>Evidence:</strong> ${esc(x.evidence)}</p><a class="text-link" href="modules/module-${x.link.slice(1,3)}.html#${x.link}">Open linked section</a></div></article>`).join('')}
  document.querySelectorAll('[data-print]').forEach(x=>x.addEventListener('click',()=>window.print()));
  renderTermFilter();renderModuleGrid();renderModule();renderFolio();renderBusy();
})();
