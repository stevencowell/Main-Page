/* Year 10 Food Technology: all learning evidence stays in this browser. */
(() => {
  'use strict';
  const PREFIX = 'ft10-2026-v1:';
  const safeRead = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const allPackages = [...document.querySelectorAll('.learning-package[data-storage-key]')];

  function packageState(drawer) {
    const saved = safeRead(drawer.dataset.storageKey);
    return saved && typeof saved === 'object' ? saved : {answers:{}, completed:{}, response:''};
  }
  function completeCount(drawer, state) {
    const questions = [...drawer.querySelectorAll('.question')];
    return questions.filter(q => state.completed && state.completed[q.id]).length + (String(state.response || '').trim().length >= 80 ? 1 : 0);
  }
  function showFeedback(question, chosen) {
    const box = question.querySelector('.feedback');
    const option = question.querySelector('input[value="' + CSS.escape(chosen) + '"]');
    if (!box || !option) return;
    box.textContent = option.dataset.feedback || '';
    box.classList.toggle('correct', option.dataset.correct === 'true');
    box.classList.toggle('review', option.dataset.correct !== 'true');
  }
  function updatePackage(drawer) {
    const state = packageState(drawer);
    const count = completeCount(drawer, state);
    const status = drawer.querySelector('.save-status');
    if (status) status.textContent = (count === 11 ? 'Complete' : `${count} of 11 saved`) + ' on this device';
    drawer.dataset.complete = count === 11 ? 'true' : 'false';
    const checklistStatus = document.querySelector(`[data-check-for="${drawer.id}"]`);
    if (checklistStatus) checklistStatus.textContent = count === 11 ? 'Complete' : `${count}/11 saved`;
    updateModule();
  }
  function updateModule() {
    const pkg = [...document.querySelectorAll('.learning-package')];
    if (!pkg.length) return;
    const finished = pkg.filter(x => x.dataset.complete === 'true').length;
    document.querySelectorAll('[data-module-progress]').forEach(x => x.textContent = `${finished} of ${pkg.length} sections complete`);
    document.querySelectorAll('[data-progress-fill]').forEach(x => x.style.width = `${100 * finished / pkg.length}%`);
  }
  function savePackage(drawer) {
    const state = packageState(drawer);
    state.answers = state.answers || {};
    state.completed = state.completed || {};
    drawer.querySelectorAll('.question').forEach(q => {
      const choice = q.querySelector('input[type="radio"]:checked');
      if (choice) { state.answers[q.id] = choice.value; state.completed[q.id] = true; }
    });
    const response = drawer.querySelector('textarea[data-long-response]');
    if (response) state.response = response.value;
    state.savedAt = new Date().toISOString();
    const okay = safeWrite(drawer.dataset.storageKey, state);
    updatePackage(drawer);
    if (!okay) { const status=drawer.querySelector('.save-status'); if(status) status.textContent='Could not save on this device; use print or export.'; }
  }
  for (const drawer of allPackages) {
    const state = packageState(drawer);
    drawer.querySelectorAll('.question').forEach(q => {
      const chosen = state.answers && state.answers[q.id];
      if (chosen) {
        const input = [...q.querySelectorAll('input[type="radio"]')].find(x => x.value === chosen);
        if (input) { input.checked = true; showFeedback(q, chosen); }
      }
    });
    const response = drawer.querySelector('textarea[data-long-response]');
    if (response) response.value = state.response || '';
    drawer.addEventListener('change', e => {
      if (e.target.matches('input[type="radio"]')) showFeedback(e.target.closest('.question'), e.target.value);
      savePackage(drawer);
    });
    drawer.addEventListener('input', e => { if (e.target.matches('textarea')) savePackage(drawer); });
    const reset = drawer.querySelector('[data-reset-package]');
    if (reset) reset.addEventListener('click', () => {
      if (!confirm('Clear only this section’s saved practice on this device?')) return;
      localStorage.removeItem(drawer.dataset.storageKey);
      drawer.querySelectorAll('input[type="radio"]').forEach(x => x.checked = false);
      drawer.querySelectorAll('.feedback').forEach(x => { x.textContent = ''; x.className = 'feedback'; });
      if (response) response.value = '';
      updatePackage(drawer);
    });
    updatePackage(drawer);
  }

  function openHashTarget() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    if (target.matches('details')) {
      target.open = true;
      if (target.hasAttribute('tabindex')) target.focus({preventScroll:true});
      else target.querySelector('summary')?.focus({preventScroll:true});
    }
    else if (target.closest('details')) target.closest('details').open = true;
    else if (target.matches('[tabindex]')) target.focus({preventScroll:true});
  }
  window.addEventListener('hashchange', openHashTarget);
  window.addEventListener('load', openHashTarget, {once:true});
  openHashTarget();
  document.querySelectorAll('[data-module-resume]').forEach(button => button.addEventListener('click', () => {
    const next = allPackages.find(x => x.dataset.complete !== 'true');
    if (next) { next.open = true; location.hash = next.id; next.querySelector('summary')?.focus(); }
    else { const href = button.dataset.nextHref; if (href) location.href = href; }
  }));

  document.querySelectorAll('textarea[data-evidence-key]').forEach(area => {
    const key = PREFIX + area.dataset.evidenceKey;
    area.value = safeRead(key)?.text || '';
    const status = document.querySelector(`[data-evidence-status="${area.dataset.evidenceKey}"]`);
    const update = () => {
      const okay = safeWrite(key, {text:area.value,savedAt:new Date().toISOString()});
      if (status) status.textContent = okay ? 'Saved on this device' : 'Could not save; export or print your work';
    };
    area.addEventListener('input', update);
    if (status && area.value) status.textContent='Restored from this device';
  });

  document.querySelectorAll('select[data-mini-key]').forEach(select => {
    const key = PREFIX + select.dataset.miniKey;
    const state = safeRead(key);
    if (state && Number.isInteger(state.choice)) select.value = String(state.choice);
    const feedback = select.nextElementSibling;
    const update = (save) => {
      const chosen = select.value;
      if (feedback?.matches('[data-mini-feedback]')) {
        if (!chosen) feedback.textContent = '';
        else if (chosen === select.dataset.miniAnswer) feedback.textContent = `That fits: ${select.selectedOptions[0].textContent}. Explain why before you use it in a real brief.`;
        else feedback.textContent = 'Recheck what the statement actually proves, then try another choice. The matching module explains the reasoning.';
      }
      if (save) safeWrite(key, {choice:chosen === '' ? null : Number(chosen), savedAt:new Date().toISOString()});
    };
    select.addEventListener('change', () => update(true));
    update(false);
  });

  document.querySelectorAll('[data-reset-mini]').forEach(button => button.addEventListener('click', () => {
    const scope = button.closest('[data-mini-scope], article, details');
    const selects = [...(scope?.querySelectorAll('select[data-mini-key]') || [])];
    if (!selects.length || !confirm('Clear these saved practice choices on this device?')) return;
    selects.forEach(select => {
      localStorage.removeItem(PREFIX + select.dataset.miniKey);
      select.value = '';
      const feedback = select.nextElementSibling;
      if (feedback?.matches('[data-mini-feedback]')) feedback.textContent = '';
    });
  }));

  document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));
  const printOpen = new Map();
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('details').forEach(d => { printOpen.set(d, d.open); d.open = true; });
    document.querySelectorAll('textarea').forEach(a => { a.dataset.printHeight = a.style.height; a.style.height = `${Math.max(a.scrollHeight, 100)}px`; });
  });
  window.addEventListener('afterprint', () => {
    printOpen.forEach((open, d) => { d.open = open; }); printOpen.clear();
    document.querySelectorAll('textarea').forEach(a => { a.style.height = a.dataset.printHeight || ''; delete a.dataset.printHeight; });
  });
  document.querySelectorAll('[data-export]').forEach(b => b.addEventListener('click', () => {
    const records = {};
    for (let i=0;i<localStorage.length;i++) { const k=localStorage.key(i); if(k?.startsWith(PREFIX)) records[k]=safeRead(k); }
    const blob=new Blob([JSON.stringify({course:'Year 10 Food Technology',version:1,exportedAt:new Date().toISOString(),records},null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='year-10-food-technology-my-evidence.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }));
  document.querySelectorAll('input[data-import]').forEach(input => input.addEventListener('change', async () => {
    const file=input.files?.[0]; if(!file) return;
    try {
      const payload=JSON.parse(await file.text());
      if(payload.course!=='Year 10 Food Technology' || payload.version!==1 || !payload.records || typeof payload.records!=='object' || Array.isArray(payload.records)) throw Error('Wrong evidence file');
      if (!confirm('Restore this Year 10 Food Technology evidence file to this device? Matching saved entries will be replaced.')) return;
      for(const [k,v] of Object.entries(payload.records)) if(k.startsWith(PREFIX)) safeWrite(k,v);
      location.reload();
    } catch { alert('This is not a valid Year 10 Food Technology evidence file.'); }
  }));
  document.querySelectorAll('[data-reset-all]').forEach(button => button.addEventListener('click', () => {
    if (!confirm('Clear all Year 10 Food Technology practice and folio writing saved in this browser? Download a backup first if you need it.')) return;
    for (const key of Object.keys(localStorage)) if (key.startsWith(PREFIX)) localStorage.removeItem(key);
    location.reload();
  }));

  const keys = window.FT10_PACKAGE_KEYS || [];
  if (keys.length) {
    const done=keys.filter(k => { const s=safeRead(k); return s && Object.keys(s.completed||{}).length===10 && String(s.response||'').trim().length>=80; }).length;
    const activities=Array.from({length:4},(_,i)=>PREFIX+`activity-module-${String(i+1).padStart(2,'0')}`);
    const folio=Array.from({length:4},(_,i)=>PREFIX+`folio-module-${String(i+1).padStart(2,'0')}`);
    const activityDone=activities.filter(k=>String(safeRead(k)?.text||'').trim().length>=80 && safeRead(k+'-choice')?.choice!==null && Number.isInteger(safeRead(k+'-choice')?.choice)).length;
    const folioDone=folio.filter(k=>String(safeRead(k)?.text||'').trim().length>=80).length;
    document.querySelectorAll('[data-course-progress]').forEach(x=>x.textContent=`${done}/${keys.length} section checks · ${activityDone}/4 activities · ${folioDone}/4 folio cards saved on this device`);
    document.querySelectorAll('[data-course-resume]').forEach(a=>{
      let next='folio.html';
      for(let i=0;i<4;i++) {
        const number=String(i+1).padStart(2,'0');
        const incomplete=keys.slice(i*3,i*3+3).find(k=>{const s=safeRead(k); return !(s && Object.keys(s.completed||{}).length===10 && String(s.response||'').trim().length>=80);});
        if(incomplete) {const sid=incomplete.split(':').pop(); next=`modules/module-${number}.html#${sid}-package`; break;}
        const activity=activities[i];
        if(String(safeRead(activity)?.text||'').trim().length<80 || !Number.isInteger(safeRead(activity+'-choice')?.choice)) {next=`activities.html#module-${number}-activity`; break;}
        if(String(safeRead(folio[i])?.text||'').trim().length<80) {next=`folio.html#module-${number}-folio`; break;}
      }
      a.href=next;
    });
  }

  // A single native dialog gives every teaching image an in-page larger view.
  const largerLinks = [...document.querySelectorAll('.teaching-figure > a[data-open-larger]')];
  if (largerLinks.length && typeof HTMLDialogElement !== 'undefined' && HTMLDialogElement.prototype.showModal) {
    const dialog = document.createElement('dialog');
    dialog.className = 'image-lightbox';
    dialog.setAttribute('aria-labelledby', 'image-lightbox-title');
    dialog.innerHTML = '<div class="image-lightbox__panel"><div class="image-lightbox__header"><h2 id="image-lightbox-title">Image detail</h2><button class="image-lightbox__close" type="button">Close larger view</button></div><img class="image-lightbox__image" alt=""><p class="image-lightbox__notice"></p></div>';
    document.body.append(dialog);
    const title = dialog.querySelector('#image-lightbox-title');
    const image = dialog.querySelector('.image-lightbox__image');
    const notice = dialog.querySelector('.image-lightbox__notice');
    const closeButton = dialog.querySelector('.image-lightbox__close');
    let invokingLink = null;

    largerLinks.forEach(link => link.addEventListener('click', event => {
      const figure = link.closest('figure');
      const preview = figure?.querySelector('img');
      if (!preview) return; // The direct image link remains a usable fallback.
      event.preventDefault();
      invokingLink = link;
      title.textContent = figure.querySelector('figcaption')?.textContent.trim() || 'Image detail';
      image.src = link.href;
      image.alt = preview.alt;
      notice.textContent = figure.querySelector('.image-question')?.textContent.trim() || '';
      notice.hidden = !notice.textContent;
      dialog.showModal();
      closeButton.focus({preventScroll:true});
    }));
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') event.stopPropagation(); // Let the native dialog close without also closing a video.
      if (event.key === 'Tab') { event.preventDefault(); closeButton.focus(); }
    });
    dialog.addEventListener('close', () => {
      image.removeAttribute('src');
      if (invokingLink?.isConnected) invokingLink.focus({preventScroll:true});
      invokingLink = null;
    });
  }

  // YouTube is contacted for playback only after the student selects Play.
  let openVideo = null;
  document.querySelectorAll('[data-video-frame]').forEach(frame => {
    const play = frame.querySelector('[data-video-play]');
    if (!play) return;
    const poster = [...frame.childNodes];
    const stop = (restoreFocus = true) => {
      if (openVideo?.frame !== frame) return;
      frame.replaceChildren(...poster);
      frame.classList.remove('is-playing');
      openVideo = null;
      if (restoreFocus) play.focus();
    };
    play.addEventListener('click', () => {
      if (openVideo) openVideo.stop(false);
      const id = frame.dataset.videoId || '';
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      const query = new URLSearchParams({rel:'0', playsinline:'1'});
      const start = Number(frame.dataset.videoStart || 0);
      const end = Number(frame.dataset.videoEnd || 0);
      if (start > 0) query.set('start', String(start));
      if (end > start) query.set('end', String(end));
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?${query}`;
      iframe.title = `Video player: ${play.getAttribute('aria-label')?.replace(/^Play /, '') || 'course clip'}`;
      iframe.allow = 'encrypted-media; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'video-close';
      close.textContent = 'Close video';
      close.addEventListener('click', () => stop());
      frame.replaceChildren(iframe, close);
      frame.classList.add('is-playing');
      openVideo = {frame, stop};
      close.focus();
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && openVideo) {
      event.preventDefault();
      openVideo.stop();
    }
  });
})();
