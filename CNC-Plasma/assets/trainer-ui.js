/* UI and isolated browser persistence for the limited virtual setup trainer. */
(function () {
  'use strict';
  const root = document.getElementById('plasma-trainer');
  if (!root) return;
  const E = window.PlasmaTrainerEngine;
  const $ = id => document.getElementById(id);
  const key = 'tas:cnc-plasma:trainer:v1';
  const svgNS = 'http://www.w3.org/2000/svg';
  const controls = [...root.querySelectorAll('[data-trainer-control]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animateMotion = !reduced.matches, motionOverridden = false;
  let state, baselineRaw = null, busy = false, recovery = null, sessionOnly = false;
  let panel = 'drawing', hintShown = false, animation = 0, animationEpoch = 0, feedback = '';
  if (!E) { $('trainer-feedback').textContent = 'The trainer could not load. Reload this page, or use the paper worksheet.'; return; }
  state = E.initialState();

  const copy = value => JSON.parse(JSON.stringify(value));
  function say(message, ok = true) {
    feedback = message;
    $('trainer-feedback').textContent = message;
    $('trainer-feedback').classList.toggle('is-error', !ok);
  }
  function getStored() {
    const raw = localStorage.getItem(key);
    if (raw === null) return {raw, state: E.initialState(state.mode)};
    let parsed;
    try { parsed = E.validateState(JSON.parse(raw)); } catch (_) { parsed = null; }
    if (!parsed) throw Object.assign(new Error('The saved trainer record could not be read safely. It has been left untouched.'), {trainerCorrupt: true});
    return {raw, state: parsed};
  }
  function lock(work) {
    return navigator.locks && navigator.locks.request ? navigator.locks.request(key, {mode: 'exclusive'}, work) : Promise.resolve().then(work);
  }
  function cancelRun() {
    animationEpoch += 1;
    if (animation) cancelAnimationFrame(animation);
    animation = 0;
  }
  function problem(kind, message) {
    cancelRun(); recovery = kind;
    if (state.status === 'running') state = E.reduce(state, {type: 'stop'}).state;
    $('trainer-recovery-message').textContent = message;
    $('trainer-recovery').hidden = false;
    $('trainer-use-saved').hidden = kind === 'corrupt' || kind === 'unavailable';
    $('trainer-retry-save').hidden = kind !== 'write';
    $('trainer-save-state').textContent = 'Practice not saved — choose how to continue';
    say(message, false); render();
  }
  function clearProblem() {
    recovery = null; $('trainer-recovery').hidden = true;
  }
  function setBusy(value) { busy = value; renderDisabled(); }
  function renderDisabled() {
    root.querySelectorAll('[data-trainer-action],[data-jog],[data-trainer-control],#trainer-drawing-form button,#trainer-path-form button,#trainer-load-form button[type=submit],#trainer-position-form button[type=submit],[data-position-preset]').forEach(button => {
      if (button.dataset.trainerControl !== 'reset') button.disabled = busy || !!recovery;
    });
    root.querySelectorAll('input[name=trainer-mode]').forEach(input => { input.disabled = busy || !!recovery; });
    // These are one-way selections in this rehearsal, not power or mode toggles.
    if (!busy && !recovery) {
      $('trainer-online').disabled = state.flags.online;
      $('trainer-simul').disabled = state.flags.simul;
    }
  }
  async function perform(action, options = {}) {
    if (busy || recovery) return;
    if (action.type === 'stop') cancelRun();
    setBusy(true);
    let result = null, didApply = false;
    try {
      await lock(() => {
        if (!sessionOnly) {
          let saved;
          try { saved = getStored(); }
          catch (error) { problem(error.trainerCorrupt ? 'corrupt' : 'unavailable', error.trainerCorrupt ? error.message : 'Browser storage is unavailable. Your saved trainer data has not been replaced.'); return; }
          if (saved.raw !== baselineRaw) { problem('conflict', 'Another tab changed this trainer. Your current practice has not overwritten it. Use the saved state, or deliberately reset this trainer.'); return; }
        }
        result = E.reduce(state, action);
        const next = result.state;
        if (!sessionOnly) {
          const serialised = JSON.stringify(next);
          try { localStorage.setItem(key, serialised); baselineRaw = serialised; }
          catch (_) { state = next; problem('write', 'This step could not be saved. Your current practice is still on this page. Retry saving, use the last saved state, or continue without saving.'); return; }
        }
        state = next; didApply = true;
      });
    } catch (_) { problem('unavailable', 'The browser could not protect this save. Your saved practice has not been deliberately replaced. Choose how to continue.'); }
    setBusy(false);
    if (didApply) {
      hintShown = false;
      say(options.note || result.message, result.ok);
      if (result.ok && state.mode === 'guided') showPanel(panelForStep(E.currentStep(state)));
      render();
      if (result.ok && action.type === 'start-dry-run') startAnimation();
    } else render();
  }
  function panelForStep(step) { return step.control === 'check-drawing' ? 'drawing' : step.control === 'inspect-toolpath' ? 'toolpath' : 'control'; }
  function showPanel(name, focus = false) {
    panel = name;
    root.querySelectorAll('[role=tab][data-panel]').forEach(tab => {
      const active = tab.dataset.panel === name;
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      $(tab.getAttribute('aria-controls')).hidden = !active;
      if (active && focus) tab.focus();
    });
  }
  function svgAt(point) { return {x: point.x + 15, y: 185 - point.y}; }
  function format(n) { return Math.abs(n) < .0001 ? '0.0' : n.toFixed(1); }
  function drawTorch(point) {
    const at = svgAt(point); $('trainer-torch').setAttribute('transform', `translate(${at.x} ${at.y})`);
    const x = state.origin ? point.x - state.origin.x : point.x;
    const y = state.origin ? point.y - state.origin.y : point.y;
    $('trainer-x').replaceChildren(document.createTextNode(format(x) + ' '), unit());
    $('trainer-y').replaceChildren(document.createTextNode(format(y) + ' '), unit());
    $('trainer-x').previousElementSibling.textContent = state.origin ? 'Virtual job X' : 'Sheet X';
    $('trainer-y').previousElementSibling.textContent = state.origin ? 'Virtual job Y' : 'Sheet Y';
  }
  function unit() { const small = document.createElement('small'); small.textContent = 'mm'; return small; }
  function drawGeometry() {
    $('trainer-job-geometry').toggleAttribute('hidden', !state.flags.loaded);
    $('trainer-job-geometry').style.display = state.flags.loaded ? '' : 'none';
    const placement = state.origin || state.position;
    const at = svgAt(placement), centre = svgAt({x: placement.x + 50, y: placement.y + 50});
    const square = $('trainer-square-edge'); square.setAttribute('x', at.x); square.setAttribute('y', at.y - 100);
    const hole = $('trainer-hole-edge'); hole.setAttribute('cx', centre.x); hole.setAttribute('cy', centre.y);
    $('trainer-retained-part').setAttribute('d', `M${at.x} ${at.y}h100v-100h-100Z M${centre.x + 15} ${centre.y}a15 15 0 1 0 -30 0a15 15 0 1 0 30 0Z`);
    $('trainer-allowance').setAttribute('x', at.x - 5); $('trainer-allowance').setAttribute('y', at.y - 105);
    const path = $('trainer-route'); path.replaceChildren();
    const trace = E.tracePoints(state);
    trace.slice(1).forEach((point, i) => {
      const start = svgAt(trace[i]), end = svgAt(point);
      const line = document.createElementNS(svgNS, 'path');
      line.setAttribute('d', `M${start.x} ${start.y}L${end.x} ${end.y}`);
      line.setAttribute('class', 'trainer-route-line' + (point.kind === 'rapid' || point.kind === 'lead' ? ' is-travel' : ''));
      path.append(line);
    });
    const marker = $('trainer-origin-marker'); marker.style.display = state.origin ? '' : 'none';
    marker.removeAttribute('hidden');
    if (state.origin) { const o = svgAt(state.origin); marker.setAttribute('transform', `translate(${o.x} ${o.y})`); }
    $('trainer-origin-readout').textContent = state.origin ? `Job origin on sheet: X ${format(state.origin.x)}, Y ${format(state.origin.y)} mm` : 'No job origin assigned';
    $('trainer-bed-description').textContent = state.flags.loaded ? `Fictional 200 by 160 millimetre sheet. The 100 millimetre square is previewed from sheet X ${placement.x}, Y ${placement.y}; its hole is 30 millimetres in diameter. ${state.origin ? 'An origin is assigned.' : 'No job origin is assigned.'}` : 'Fictional 200 by 160 millimetre sheet. No virtual job is loaded.';
    drawTorch(state.position);
  }
  function machineStatus() {
    if (!state.flags.connected) return 'Disconnected';
    if (!state.flags.online) return 'Connected · Offline';
    if (!state.flags.referenced) return 'Online · Not Referenced';
    if (state.status === 'running') return 'Virtual dry run moving';
    if (state.completed) return 'Virtual dry run completed';
    return state.flags.simul ? 'Online · Simul selected' : 'Online · Referenced';
  }
  function recordText() {
    const completed = Object.values(state.flags).filter(Boolean).length;
    const lines = ['VIRTUAL SETUP PRACTICE RECORD', 'Formative browser exercise only — not operator competence or a real cutting approval.', '', `Mode: ${state.mode === 'guided' ? 'Guided' : 'Practice'}`, `Progress: ${completed} of 10 exercise steps`, 'Practice job: practice-square-v1.tap (supplied virtual job)', 'Drawing: mm; 100 × 100 mm square; central Ø30 mm hole', 'Proposed sides/order: outside square; inside hole; hole first', 'Fictional sheet: 200 × 160 mm; 5 mm exercise allowance'];
    if (state.origin) lines.push(`Assigned virtual origin on sheet: X ${state.origin.x}, Y ${state.origin.y} mm`);
    lines.push(`Result: ${state.completed ? 'Virtual dry run completed' : 'Practice incomplete'}`, '', 'PRACTICE AND CORRECTIONS');
    state.history.forEach((entry, i) => lines.push(`${i + 1}. ${entry.ok ? 'Recorded' : 'Revisit'} — ${entry.message}`));
    lines.push('', 'The route is illustrative. Offsets and lead lengths are not calculated cutting settings. Physical setup, sensing, cutting, electrical isolation and handling are outside this rehearsal. Use the full teacher operating guide.');
    return lines.join('\n');
  }
  function render() {
    const step = E.currentStep(state), count = Object.values(state.flags).filter(Boolean).length;
    $('trainer-step-number').textContent = state.completed ? '10 steps completed' : `Step ${step.index} of ${step.total}`;
    $('trainer-step-title').textContent = state.completed ? 'Virtual dry run completed' : step.title;
    $('trainer-instruction').textContent = step.instruction;
    $('trainer-expected').textContent = step.expected;
    $('trainer-progress').value = count;
    $('trainer-progress-label').textContent = `${count} of 10 steps complete`;
    const coaching = state.mode === 'guided' || hintShown;
    $('trainer-coaching').hidden = !coaching;
    $('trainer-show-hint').hidden = state.mode !== 'practice';
    $('trainer-show-hint').textContent = hintShown ? 'Hide hint' : 'Show hint';
    controls.forEach(control => control.classList.toggle('is-next', state.mode === 'guided' && control.dataset.trainerControl === step.control && !recovery));
    root.querySelectorAll('input[name=trainer-mode]').forEach(input => { input.checked = input.value === state.mode; });
    $('trainer-machine-state').textContent = machineStatus();
    $('trainer-loaded-file').textContent = state.flags.loaded ? state.job.file + ' · virtual job' : 'No virtual job loaded';
    $('trainer-online').classList.toggle('is-selected', state.flags.online);
    $('trainer-online').title = state.flags.online ? 'Online selected — this limited trainer does not toggle it off.' : 'Select Online after connecting the virtual controller.';
    $('trainer-simul').classList.toggle('is-selected', state.flags.simul);
    $('trainer-simul').title = state.flags.simul ? 'Simul selected — retained for this virtual rehearsal.' : 'Select Simul for the browser dry run.';
    $('trainer-animate').checked = animateMotion;
    $('trainer-reduced-note').hidden = animateMotion;
    if (!recovery) $('trainer-save-state').textContent = sessionOnly ? 'Practice stays on this page only' : busy ? 'Saving this trainer…' : 'Saved only in this browser';
    $('trainer-completion').hidden = !state.completed;
    $('trainer-record').value = recordText();
    drawGeometry(); renderDisabled();
  }
  function startAnimation() {
    cancelRun();
    if (document.hidden) { perform({type: 'stop'}, {note: 'The tab was hidden. The virtual run is stopped and incomplete; start again when you return.'}); return; }
    const points = E.tracePoints(state), epoch = animationEpoch;
    if (!animateMotion) { drawTorch(points[points.length - 1]); perform({type: 'finish-dry-run'}, {note: 'Virtual run completed instantly without animation: the same hole-first route was checked. No real machine moved.'}); return; }
    const lengths = [], distances = [0];
    points.slice(1).forEach((p, i) => { const d = Math.hypot(p.x - points[i].x, p.y - points[i].y); lengths.push(d); distances.push(distances[i] + d); });
    const total = distances[distances.length - 1], duration = 8500;
    let began;
    function frame(now) {
      if (epoch !== animationEpoch || state.status !== 'running' || recovery) return;
      if (document.hidden) { cancelRun(); perform({type: 'stop'}, {note: 'The tab was hidden, so the virtual run stopped. It has not been recorded as completed.'}); return; }
      if (began === undefined) began = now;
      const fraction = Math.min((now - began) / duration, 1), travelled = fraction * total;
      let i = 0; while (i < lengths.length - 1 && distances[i + 1] < travelled) i += 1;
      const t = lengths[i] ? (travelled - distances[i]) / lengths[i] : 0;
      drawTorch({x: points[i].x + (points[i + 1].x - points[i].x) * t, y: points[i].y + (points[i + 1].y - points[i].y) * t});
      if (fraction >= 1) { animation = 0; perform({type: 'finish-dry-run'}); }
      else animation = requestAnimationFrame(frame);
    }
    animation = requestAnimationFrame(frame);
  }
  function openDialog(id) { if (!busy && !recovery || id === 'trainer-reset-dialog') $(id).showModal(); }
  function closeDialog(id) { $(id).close(); }
  async function applyPosition(x, y) { closeDialog('trainer-position-dialog'); await perform({type: 'position', x, y}); }

  root.querySelectorAll('[data-trainer-action]').forEach(button => button.addEventListener('click', () => perform({type: button.dataset.trainerAction})));
  root.querySelectorAll('[data-jog]').forEach(button => button.addEventListener('click', () => { const [dx, dy] = button.dataset.jog.split(',').map(Number); perform({type: 'jog', dx, dy}); }));
  $('trainer-drawing-form').addEventListener('submit', event => { event.preventDefault(); perform({type: 'check-drawing', units: $('trainer-units').value, width: $('trainer-width').valueAsNumber, height: $('trainer-height').valueAsNumber, hole: $('trainer-hole').valueAsNumber}); });
  $('trainer-path-form').addEventListener('submit', event => { event.preventDefault(); perform({type: 'inspect-toolpath', outer: $('trainer-outer').value, inner: $('trainer-inner').value, order: $('trainer-order').value}); });
  $('trainer-load-open').addEventListener('click', () => openDialog('trainer-load-dialog'));
  $('trainer-position-open').addEventListener('click', () => { $('trainer-position-x').value = state.flags.positioned ? state.position.x : 20; $('trainer-position-y').value = state.flags.positioned ? state.position.y : 20; openDialog('trainer-position-dialog'); });
  $('trainer-load-form').addEventListener('submit', event => { event.preventDefault(); closeDialog('trainer-load-dialog'); perform({type: 'load', file: $('trainer-file').value}); });
  $('trainer-position-form').addEventListener('submit', event => { event.preventDefault(); applyPosition($('trainer-position-x').valueAsNumber, $('trainer-position-y').valueAsNumber); });
  root.querySelectorAll('[data-position-preset]').forEach(button => button.addEventListener('click', () => { const [x, y] = button.dataset.positionPreset.split(',').map(Number); applyPosition(x, y); }));
  root.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(button.dataset.closeDialog)));
  root.querySelectorAll('input[name=trainer-mode]').forEach(input => input.addEventListener('change', () => { if (input.checked) perform({type: 'set-mode', mode: input.value}); }));
  root.querySelectorAll('[role=tab][data-panel]').forEach(tab => {
    tab.addEventListener('click', () => showPanel(tab.dataset.panel));
    tab.addEventListener('keydown', event => {
      const tabs = [...root.querySelectorAll('[role=tab][data-panel]')], i = tabs.indexOf(tab);
      const next = event.key === 'ArrowRight' ? (i + 1) % 3 : event.key === 'ArrowLeft' ? (i + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1;
      if (next >= 0) { event.preventDefault(); showPanel(tabs[next].dataset.panel, true); }
    });
  });
  $('trainer-show-hint').addEventListener('click', () => { hintShown = !hintShown; render(); });
  $('trainer-go-step').addEventListener('click', () => { const step = E.currentStep(state); showPanel(panelForStep(step)); const control = controls.find(c => c.dataset.trainerControl === step.control); if (control) { control.focus(); control.scrollIntoView({block: 'nearest', behavior: reduced.matches ? 'instant' : 'smooth'}); } });
  ['trainer-reset', 'trainer-recovery-reset'].forEach(id => $(id).addEventListener('click', () => { $('trainer-reset-error').textContent = ''; openDialog('trainer-reset-dialog'); }));
  $('trainer-confirm-reset').addEventListener('click', async () => {
    if (busy) return; setBusy(true); cancelRun();
    try {
      await lock(() => {
        const fresh = E.initialState(state.mode), serialised = JSON.stringify(fresh);
        if (!sessionOnly) localStorage.setItem(key, serialised);
        state = fresh; baselineRaw = sessionOnly ? baselineRaw : serialised; clearProblem();
      });
      closeDialog('trainer-reset-dialog'); hintShown = false; showPanel('drawing'); say('Only this trainer was reset. Your course answers, activities and folio were not changed.');
    } catch (_) { $('trainer-reset-error').textContent = 'Browser storage still cannot be written. Close this dialog with Keep my practice, then choose Continue without saving for a session-only rehearsal.'; }
    setBusy(false); render();
  });
  $('trainer-use-saved').addEventListener('click', () => loadSaved(true));
  $('trainer-session-only').addEventListener('click', () => { cancelRun(); sessionOnly = true; clearProblem(); if (!E.validateState(state)) state = E.initialState(); say('You are practising on this page without saving. Existing saved trainer data has been left untouched. Reloading will not retain this session.'); render(); });
  $('trainer-retry-save').addEventListener('click', async () => {
    if (busy) return; setBusy(true);
    try {
      await lock(() => {
        const saved = getStored();
        if (saved.raw !== baselineRaw) { problem('conflict', 'The saved practice changed while saving was unavailable. Use the saved state or reset deliberately.'); return; }
        const raw = JSON.stringify(state); localStorage.setItem(key, raw); baselineRaw = raw; clearProblem(); say('Your current trainer practice is now saved in this browser.');
      });
    } catch (_) { problem('write', 'This browser still cannot save the trainer. Your current practice remains on this page; you can continue without saving.'); }
    setBusy(false); render();
  });
  $('trainer-select-record').addEventListener('click', () => { $('trainer-record').focus(); $('trainer-record').select(); say('The record is selected. Use Copy, then paste it into your chosen document.'); });
  function print(which) {
    root.dataset.print = which;
    if (which === 'worksheet') $('trainer-worksheet').open = true;
    $('trainer-record').style.height = $('trainer-record').scrollHeight + 'px';
    window.print();
  }
  $('trainer-print-record').addEventListener('click', () => print('record'));
  $('trainer-print-worksheet').addEventListener('click', () => print('worksheet'));
  window.addEventListener('afterprint', () => { delete root.dataset.print; $('trainer-record').style.height = ''; });
  window.addEventListener('storage', event => { if (!sessionOnly && (event.key === key || event.key === null) && event.newValue !== baselineRaw) problem('conflict', 'Another tab changed or cleared this trainer. This page has stopped changing the saved record. Use the saved state or reset this trainer deliberately.'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && state.status === 'running') { cancelRun(); perform({type: 'stop'}, {note: 'The tab was hidden. The virtual dry run stopped and remains incomplete. Start it again when you return.'}); } });
  window.addEventListener('pagehide', cancelRun);
  $('trainer-animate').addEventListener('change', () => {
    motionOverridden = true; animateMotion = $('trainer-animate').checked;
    if (state.status === 'running' && !animateMotion) { cancelRun(); perform({type: 'stop'}, {note: 'Animation was turned off. This virtual run stopped; select Start again for the instant equivalent.'}); }
    else { say(animateMotion ? 'Virtual animation is enabled for this practice session. Start will show the movement and Stop can interrupt it.' : 'Animation is off. Start will complete the same ordered virtual route instantly.'); render(); }
  });
  reduced.addEventListener('change', () => {
    if (!motionOverridden) animateMotion = !reduced.matches;
    if (state.status === 'running' && !animateMotion) { cancelRun(); perform({type: 'stop'}, {note: 'Motion preference changed. The virtual run stopped; restart for the instant equivalent.'}); }
    else render();
  });
  async function loadSaved(explicit) {
    if (busy) return;
    setBusy(true); cancelRun();
    try {
      const saved = getStored(); state = saved.state; baselineRaw = saved.raw; sessionOnly = false; clearProblem();
      showPanel(panelForStep(E.currentStep(state)));
      say(explicit ? 'The current saved trainer state is now loaded.' : saved.raw ? 'Your saved trainer practice has been restored.' : 'Start with the drawing check. Try a choice and use the feedback to correct it.');
    } catch (error) { problem(error.trainerCorrupt ? 'corrupt' : 'unavailable', error.trainerCorrupt ? error.message : 'Browser storage is unavailable. Choose Continue without saving to practise on this page.'); }
    setBusy(false); render();
    if (!recovery && state.status === 'running') await perform({type: 'stop'}, {note: 'The previous virtual run was interrupted by leaving or reloading the page. It is stopped, not completed; select Start to try again.'});
  }
  loadSaved(false);
}());
