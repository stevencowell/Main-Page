
(() => {
  const D = window.DT_COURSE_DATA;
  if (!D) return;
  const body = document.body;
  const root = body.dataset.root || '';
  const active = body.dataset.active || 'course';
  const prefix = D.meta.storage_prefix;
  const esc = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const get = key => localStorage.getItem(`${prefix}:${key}`) || '';
  const set = (key, value) => localStorage.setItem(`${prefix}:${key}`, value);
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
  const completedSections = () => D.modules.flatMap(m => m.sections).filter(s => get(sectionKey(s.id)) === 'yes').length;
  const moduleProgress = module => module.sections.filter(s => get(sectionKey(s.id)) === 'yes').length;

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
    if (progress) progress.innerHTML = `<span>${completedSections()} of ${D.meta.sections}</span><br><span class="fine">sections complete on this device</span>`;
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
    return `<fieldset class="question" data-question="${q.id}"><legend>${n}. ${esc(q.prompt)}</legend>${optionsHtml(q)}<div class="question-actions"><button class="button secondary" type="button" data-check-question>Check answer</button><a class="help-link" href="${q.help_anchor}">Review nearby theory</a></div><p class="feedback" aria-live="polite"></p></fieldset>`;
  }
  function writtenHtml(s){ const w=s.written;
    return `<div class="written-response"><p class="eyebrow">${esc(w.command_verb)} response · ${esc(w.suggested_length)}</p><h3>${esc(w.prompt)}</h3><div class="scaffold-grid"><div><strong>Build the response</strong><ol>${w.scaffolds.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></div><div><strong>Success criteria</strong><ul>${w.success_criteria.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><label><span class="sr-only">Written response for ${esc(s.title)}</span><textarea data-written="${w.id}" placeholder="Draft your response here..."></textarea></label><div class="response-controls"><button class="button secondary" type="button" data-save-written>Save on this device</button><span class="fine" data-word-count>0 words</span></div><p class="save-status" aria-live="polite"></p></div>`;
  }
  function sectionHtml(s, idx){
    return `<article class="theory-section" id="${s.id}"><header class="theory-head"><p class="section-number">Section ${idx}</p><h2>${esc(s.title)}</h2><p class="learning-intention"><strong>Learning intention:</strong> ${esc(s.intention)}</p></header><div class="theory-body" id="${s.id}-theory"><p>${esc(s.intro)}</p><div class="key-grid"><section class="idea-card"><h3>Key ideas</h3><ul>${s.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="misconception-card" id="${s.id}-misconceptions"><h3>Claims that need correction</h3><ul>${s.misconceptions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div><section class="worked-card" id="${s.id}-worked"><p class="eyebrow">Worked decision</p><h3>${esc(s.application[0])}</h3><p class="answer"><strong>Defensible response:</strong> ${esc(s.application[1])}</p></section><section class="evidence-card" id="${s.id}-evidence"><h3>${esc(s.evidence[0])}</h3><p><strong>Stronger evidence:</strong> ${esc(s.evidence[1])}</p></section><h3 id="${s.id}-sequence">A defensible sequence</h3><ol class="sequence-list">${s.sequence.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><section id="${s.id}-judgement"><h3>Judgement standard</h3><p>${esc(s.judgement[1])}</p></section><h3 id="${s.id}-terms">Course terms</h3><table class="terms-table"><tbody>${s.terms.map(([t,d])=>`<tr><th>${esc(t)}</th><td>${esc(d)}</td></tr>`).join('')}</tbody></table><p class="source-note"><strong>Source basis:</strong> ${esc(s.source_note)}</p></div><details class="learning-cycle"><summary>Knowledge check and written response <span>10 questions + 1 saved response</span></summary><div class="learning-body"><div class="question-set">${s.questions.map((q,i)=>questionHtml(q,i+1)).join('')}</div>${writtenHtml(s)}<div class="completion-box"><div><strong>Section evidence complete?</strong><br><span class="fine">Mark complete after checking the questions and saving any useful response.</span></div><button class="button" type="button" data-complete-section="${s.id}">Mark section complete</button></div></div></details></article>`;
  }
  function renderModule(){
    const id=body.dataset.module; if(!id)return;
    const m=D.modules.find(x=>x.id===id); if(!m)return;
    const main=document.querySelector('[data-module-content]'), aside=document.querySelector('[data-module-aside]');
    main.innerHTML=`<figure class="module-visual"><a href="../assets/module-${String(m.number).padStart(2,'0')}-map.svg" target="_blank" rel="noopener"><img src="../assets/module-${String(m.number).padStart(2,'0')}-map.svg" alt="Learning map for Module ${m.number}: ${esc(m.title)}"></a></figure>${m.sections.map((s,i)=>sectionHtml(s,i+1)).join('')}<nav class="module-pagination">${m.number>1?`<a class="button secondary" href="module-${String(m.number-1).padStart(2,'0')}.html">← Module ${m.number-1}</a>`:'<span></span>'}${m.number<D.modules.length?`<a class="button" href="module-${String(m.number+1).padStart(2,'0')}.html">Module ${m.number+1} →</a>`:`<a class="button" href="../folio.html">Open My folio →</a>`}</nav>`;
    const done=moduleProgress(m),pct=Math.round(done/m.sections.length*100);
    aside.innerHTML=`<div class="panel"><p class="eyebrow">Module progress</p><h2>${done}/${m.sections.length} sections</h2><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div><div class="panel"><h2>In this module</h2><ol class="section-nav">${m.sections.map((s,i)=>`<li><a href="#${s.id}">${i+1}. ${esc(s.title)}</a></li>`).join('')}</ol></div><div class="panel"><h2>Apply and keep</h2><p>${esc(m.applied)}</p><a class="text-link" href="../folio.html">Open My folio</a></div><div class="panel"><h2>Project context</h2><p>${esc(m.project)}</p><p class="fine">Current teacher instructions and task notices remain authoritative.</p></div>`;
    bindQuestions(); bindWritten(); bindCompletion(); restoreQuestionState();
  }
  function bindQuestions(){
    document.querySelectorAll('[data-check-question]').forEach(btn=>btn.addEventListener('click',()=>{
      const field=btn.closest('[data-question]'),qid=field.dataset.question;
      const q=D.modules.flatMap(m=>m.sections).flatMap(s=>s.questions).find(x=>x.id===qid);
      const chosen=field.querySelector('input:checked'), feedback=field.querySelector('.feedback');
      if(!chosen){feedback.className='feedback try';feedback.textContent='Choose an option before checking.';return;}
      const opt=q.options.find(o=>o.id===chosen.value); feedback.textContent=opt.feedback; feedback.className=`feedback ${opt.correct?'good':'try'}`;
      set(`question:${qid}`,chosen.value); set(`question-feedback:${qid}`,opt.correct?'good':'try');
    }));
  }
  function restoreQuestionState(){
    document.querySelectorAll('[data-question]').forEach(field=>{
      const qid=field.dataset.question, value=get(`question:${qid}`); if(!value)return;
      const input=field.querySelector(`input[value="${value}"]`); if(input)input.checked=true;
    });
  }
  function bindWritten(){
    document.querySelectorAll('[data-written]').forEach(area=>{
      area.value=get(`written:${area.dataset.written}`);
      const count=area.closest('.written-response').querySelector('[data-word-count]');
      const update=()=>count.textContent=`${area.value.trim()?area.value.trim().split(/\s+/).length:0} words`;
      update();area.addEventListener('input',update);
    });
    document.querySelectorAll('[data-save-written]').forEach(btn=>btn.addEventListener('click',()=>{
      const box=btn.closest('.written-response'), area=box.querySelector('[data-written]');set(`written:${area.dataset.written}`,area.value);box.querySelector('.save-status').textContent='Saved on this device.';
    }));
  }
  function bindCompletion(){
    document.querySelectorAll('[data-complete-section]').forEach(btn=>{
      const id=btn.dataset.completeSection, done=get(sectionKey(id))==='yes';
      if(done){btn.textContent='Section complete ✓';btn.classList.add('secondary')}
      btn.addEventListener('click',()=>{const now=get(sectionKey(id))!=='yes';set(sectionKey(id),now?'yes':'');btn.textContent=now?'Section complete ✓':'Mark section complete';btn.classList.toggle('secondary',now);});
    });
  }
  function renderFolio(){
    const grid=document.querySelector('[data-folio-grid]'); if(!grid)return;
    grid.innerHTML=D.folio_cards.map((c,i)=>`<article class="folio-card"><p class="eyebrow">Evidence card ${i+1}</p><h2>${esc(c.title)}</h2><p>${esc(c.prompt)}</p><a class="text-link" href="modules/module-${c.link.slice(1,3)}.html#${c.link}">Open linked theory</a><label><span class="sr-only">Notes for ${esc(c.title)}</span><textarea data-folio-id="${c.id}" placeholder="Record concise evidence, decisions and next actions..."></textarea></label><button class="button secondary" type="button" data-save-folio>Save card</button><p class="save-status" aria-live="polite"></p></article>`).join('');
    grid.querySelectorAll('[data-folio-id]').forEach(a=>a.value=get(`folio:${a.dataset.folioId}`));
    grid.querySelectorAll('[data-save-folio]').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.folio-card'),a=card.querySelector('[data-folio-id]');set(`folio:${a.dataset.folioId}`,a.value);card.querySelector('.save-status').textContent='Saved on this device.';}));
    const status=document.querySelector('[data-folio-status]');
    document.querySelector('[data-export-folio]')?.addEventListener('click',()=>{
      const data={course:D.meta.course,exported:new Date().toISOString(),cards:D.folio_cards.map(c=>({title:c.title,notes:get(`folio:${c.id}`)})),written_responses:D.modules.flatMap(m=>m.sections).map(s=>({section:s.id,title:s.title,response:get(`written:${s.written.id}`)})).filter(x=>x.response)};
      const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='year-11-design-technology-folio-backup.json';a.click();URL.revokeObjectURL(a.href);if(status)status.textContent='Folio backup exported.';
    });
    document.querySelector('[data-clear-folio]')?.addEventListener('click',()=>{if(!confirm('Clear all locally saved folio cards and written responses on this device?'))return;Object.keys(localStorage).filter(k=>k.startsWith(`${prefix}:folio:`)||k.startsWith(`${prefix}:written:`)).forEach(k=>localStorage.removeItem(k));renderFolio();if(status)status.textContent='Local folio cleared.';});
  }
  function renderBusy(){const grid=document.querySelector('[data-busy-grid]');if(!grid)return;grid.innerHTML=D.busy_work.map((x,i)=>`<article class="busy-card"><div class="busy-number">${String(i+1).padStart(2,'0')}</div><div><h2>${esc(x.title)}</h2><p>${esc(x.task)}</p><p class="busy-evidence"><strong>Evidence:</strong> ${esc(x.evidence)}</p><a class="text-link" href="modules/module-${x.link.slice(1,3)}.html#${x.link}">Open linked section</a></div></article>`).join('')}
  document.querySelectorAll('[data-print]').forEach(x=>x.addEventListener('click',()=>window.print()));
  renderTermFilter();renderModuleGrid();renderModule();renderFolio();renderBusy();
})();
