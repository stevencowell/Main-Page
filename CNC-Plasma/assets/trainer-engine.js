/* Browser-only teaching model. No hardware access or machine-code generation. */
(function (root, factory) {
  'use strict';
  var engine = factory();
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (root) root.PlasmaTrainerEngine = engine;
}(typeof window === 'object' ? window : null, function () {
  'use strict';

  var FLAG_KEYS = ['drawing', 'toolpath', 'connected', 'online', 'referenced', 'loaded', 'positioned', 'originSet', 'simul', 'dryRunComplete'];
  var STATE_KEYS = ['schema', 'mode', 'revision', 'flags', 'job', 'sheet', 'position', 'origin', 'status', 'completed', 'history'];
  var MODES = ['guided', 'practice'];
  var STEPS = [
    {id:'drawing', title:'Check the practice drawing', instruction:'Confirm millimetres, a 100 × 100 mm square and a 30 mm diameter hole.', expected:'The drawing matches the stated practice job.', control:'check-drawing'},
    {id:'toolpath', title:'Inspect the proposed path', instruction:'For this exercise, retain the square and remove the hole: outside the square, inside the hole, hole first.', expected:'The intended retained material and hole-first order agree.', control:'inspect-toolpath'},
    {id:'connected', title:'Connect the virtual controller', instruction:'Select Connect and read the resulting Offline state.', expected:'Connected, but Offline. Motion is not yet enabled.', control:'connect'},
    {id:'online', title:'Read Offline, then select Online', instruction:'Select Online in this browser exercise.', expected:'Online and Not Referenced. Real Online controls must follow the approved school procedure.', control:'online'},
    {id:'referenced', title:'Reference the virtual machine', instruction:'Select Reference to establish this model’s machine position.', expected:'Referenced. A job origin has not yet been assigned.', control:'reference'},
    {id:'loaded', title:'Load the checked program', instruction:'Choose practice-square-v1.tap and check its square and hole.', expected:'The checked practice revision appears. A drawing DXF is not this route’s controller program.', control:'load'},
    {id:'positioned', title:'Position the virtual torch', instruction:'Choose a point for the bottom-left job origin. Try X 20, Y 20 on this fictional 200 × 160 mm sheet.', expected:'The 100 mm square and the exercise’s 5 mm allowance fit within the virtual sheet.', control:'position'},
    {id:'originSet', title:'Assign the job origin', instruction:'Select Set Origin to assign the current point as the job’s zero.', expected:'The assigned origin is marked. Origin is a separate command that moves back to this point.', control:'set-origin'},
    {id:'simul', title:'Select simulation mode', instruction:'Select Simul before starting the virtual dry run.', expected:'Simul is selected. This browser trainer cannot move hardware; real SureControl Simul moves the machine.', control:'simul'},
    {id:'dryRunComplete', title:'Run and observe the virtual path', instruction:'Select Start dry run, then observe the hole followed by the outside profile.', expected:'The browser animation finishes in the intended order. No real cut is produced.', control:'start-dry-run'}
  ];

  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function record(value, keys) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    var proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return false;
    if (Reflect.ownKeys(value).length !== keys.length) return false;
    return keys.every(function (key) {
      var descriptor = Object.getOwnPropertyDescriptor(value, key);
      return descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value');
    });
  }
  function finite(value) { return typeof value === 'number' && Number.isFinite(value); }
  function point(value, sheet) {
    return record(value, ['x', 'y']) && finite(value.x) && finite(value.y) && value.x >= 0 && value.y >= 0 && value.x <= sheet.width && value.y <= sheet.height;
  }
  function fits(value, state) {
    var a = state.sheet.allowance;
    return value.x >= a && value.y >= a && value.x + state.job.width + a <= state.sheet.width && value.y + state.job.height + a <= state.sheet.height;
  }

  function initialState(mode) {
    if (mode === undefined) mode = 'guided';
    if (MODES.indexOf(mode) < 0) throw new RangeError('Use guided or practice mode.');
    var flags = {};
    FLAG_KEYS.forEach(function (key) { flags[key] = false; });
    return {schema:1, mode:mode, revision:0, flags:flags,
      job:{units:'mm', width:100, height:100, hole:30, file:'practice-square-v1.tap'},
      sheet:{width:200, height:160, allowance:5}, position:{x:0, y:0}, origin:null,
      status:'idle', completed:false, history:[]};
  }

  function validateState(raw) {
    try {
      if (!record(raw, STATE_KEYS) || raw.schema !== 1 || MODES.indexOf(raw.mode) < 0) return null;
      if (!Number.isSafeInteger(raw.revision) || raw.revision < 0) return null;
      if (!record(raw.flags, FLAG_KEYS) || !FLAG_KEYS.every(function (key) { return typeof raw.flags[key] === 'boolean'; })) return null;
      if (!record(raw.job, ['units','width','height','hole','file']) || raw.job.units !== 'mm' || raw.job.width !== 100 || raw.job.height !== 100 || raw.job.hole !== 30 || raw.job.file !== 'practice-square-v1.tap') return null;
      if (!record(raw.sheet, ['width','height','allowance']) || raw.sheet.width !== 200 || raw.sheet.height !== 160 || raw.sheet.allowance !== 5) return null;
      if (!point(raw.position, raw.sheet)) return null;
      if (raw.origin !== null && (!point(raw.origin, raw.sheet) || !fits(raw.origin, raw))) return null;
      if (['idle','running','complete'].indexOf(raw.status) < 0 || typeof raw.completed !== 'boolean') return null;
      for (var i = 1; i < FLAG_KEYS.length; i++) {
        if (raw.flags[FLAG_KEYS[i]] && !raw.flags[FLAG_KEYS[i - 1]]) return null;
      }
      if (raw.flags.originSet !== (raw.origin !== null)) return null;
      if (!raw.flags.positioned && (raw.position.x !== 0 || raw.position.y !== 0)) return null;
      if (raw.completed !== raw.flags.dryRunComplete || raw.completed !== (raw.status === 'complete')) return null;
      if (raw.status === 'running' && (!raw.flags.simul || raw.flags.dryRunComplete)) return null;
      if (!Array.isArray(raw.history) || raw.history.length > 50 || raw.history.length > raw.revision) return null;
      if (!raw.history.every(function (entry) {
        return record(entry, ['action','ok','message']) && typeof entry.action === 'string' && entry.action.length > 0 && entry.action.length <= 40 && typeof entry.ok === 'boolean' && typeof entry.message === 'string' && entry.message.length <= 600;
      })) return null;
      return copy(raw);
    } catch (_) { return null; }
  }

  function currentStep(state) {
    var valid = validateState(state);
    if (!valid) valid = initialState();
    if (valid.completed) return {id:'complete', title:'Virtual dry run complete', instruction:'Review your steps, select Start dry run to replay this setup, or reset to practise again.', expected:'Completion records this browser exercise only, not machine competence.', control:'reset', index:10, total:10};
    if (valid.status === 'running') return {id:'running', title:'Observe the virtual dry run', instruction:'Watch the hole first, then the square. Stop cancels this virtual run so it can be restarted.', expected:'Watch the virtual torch complete the hole and outside profile; no real cut is produced.', control:'stop', index:10, total:10};
    for (var i = 0; i < STEPS.length; i++) {
      if (!valid.flags[STEPS[i].id]) return Object.assign({}, STEPS[i], {index:i + 1, total:10});
    }
    return null;
  }

  function reduce(raw, action) {
    var state = validateState(raw);
    if (!state) return {state:initialState(), ok:false, message:'This saved exercise is not valid. Start again with the fixed practice job.'};
    var type = action && typeof action === 'object' && typeof action.type === 'string' ? action.type : '';
    var loggedType = type.length && type.length <= 40 ? type : 'invalid-action';
    function result(ok, message) {
      state.revision = Math.min(Number.MAX_SAFE_INTEGER, state.revision + 1);
      state.history.push({action:loggedType, ok:ok, message:message});
      state.history = state.history.slice(-50);
      return {state:state, ok:ok, message:message};
    }
    function clearRun() { state.flags.dryRunComplete = false; state.completed = false; state.status = 'idle'; }
    function requireLoaded() {
      return state.flags.loaded ? null : result(false, 'Load the checked practice program before positioning or jogging the virtual torch.');
    }
    if (type === 'reset') {
      var resetMode = action.mode === undefined ? state.mode : action.mode;
      if (MODES.indexOf(resetMode) < 0) return result(false, 'Choose guided or practice mode.');
      return {state:initialState(resetMode), ok:true, message:'The virtual exercise has been reset.'};
    }
    if (type === 'set-mode') {
      if (MODES.indexOf(action.mode) < 0) return result(false, 'Choose guided or practice mode.');
      state.mode = action.mode;
      return result(true, action.mode === 'guided' ? 'Guided instructions are available. Your setup is retained.' : 'Practise with optional hints. The same sequence checks still apply.');
    }
    if (type === 'stop') {
      if (state.status !== 'running') return result(false, 'There is no virtual motion to stop. Stop does not assign an origin or establish real electrical isolation.');
      clearRun();
      return result(true, 'Virtual motion stopped. This run is incomplete. Keep Simul selected and select Start dry run to restart from the beginning.');
    }
    if (state.status === 'running' && type !== 'finish-dry-run') return result(false, 'The virtual dry run is moving. Select Stop before changing the setup.');
    if (type === 'finish-dry-run') {
      if (state.status !== 'running') return result(false, 'A virtual dry run must be started and its animation completed before it can be recorded as finished.');
      state.status = 'complete'; state.flags.dryRunComplete = true; state.completed = true;
      state.position = copy(state.origin);
      return result(true, 'Virtual dry run complete: hole first, then outside profile. This browser exercise has not operated a machine or verified a real cutting setup.');
    }
    if (type === 'position' || type === 'jog') {
      var missingLoad = requireLoaded();
      if (missingLoad) return missingLoad;
      var next;
      if (type === 'position') next = {x:action.x, y:action.y};
      else {
        if (!finite(action.dx) || !finite(action.dy)) return result(false, 'Use finite numeric X and Y jog distances.');
        next = {x:state.position.x + action.dx, y:state.position.y + action.dy};
      }
      if (!point(next, state.sheet)) return result(false, 'The virtual torch must stay within X 0–200 and Y 0–160 on this fictional sheet.');
      state.position = next; state.flags.positioned = true; clearRun();
      if (type === 'position' || !state.flags.originSet) {
        state.origin = null; state.flags.originSet = false; state.flags.simul = false;
        return result(true, fits(next, state) ? 'Virtual position selected. Select Set Origin to assign this point as the job zero.' : 'The virtual torch is on the sheet, but the complete job and its fictional 5 mm allowance do not fit here. Inspect the overhang, then choose another position before Set Origin.');
      }
      return result(true, 'Only the virtual torch moved. The assigned job origin is unchanged. Origin moves back to it; Set Origin would assign a new job zero. Repeat the dry run after changing the setup.');
    }
    if (type === 'origin') {
      if (!state.flags.originSet) return result(false, 'There is no assigned job origin yet. Set Origin assigns the current position; Origin only moves back to an origin already assigned.');
      state.position = copy(state.origin);
      return result(true, 'The virtual torch moved back to the assigned job origin. The origin itself has not changed.');
    }
    if (type === 'set-origin' && state.flags.positioned) {
      if (!fits(state.position, state)) return result(false, 'This placement cannot fit the 100 mm square plus the fictional 5 mm allowance. For this exercise use X 5–95 and Y 5–55; X 20, Y 20 is a suitable practice point.');
      state.origin = copy(state.position); state.flags.originSet = true; state.flags.simul = false; clearRun();
      return result(true, 'The current virtual point is now the job origin. Set Origin assigned coordinates; it did not move the torch. Select Simul next.');
    }
    var expected = currentStep(state);
    var replay = state.completed && type === 'start-dry-run';
    if (!replay && (!expected || type !== expected.control)) return result(false, 'First: ' + expected.title + '. ' + expected.instruction);
    switch (type) {
      case 'check-drawing':
        if (action.units !== 'mm') return result(false, 'Choose millimetres. Units must be confirmed before transferring the drawing; a plausible shape can still have the wrong scale.');
        if (!finite(action.width) || !finite(action.height) || action.width !== 100 || action.height !== 100) return result(false, 'This practice drawing must measure 100 mm wide and 100 mm high. Correct the dimensions before continuing.');
        if (!finite(action.hole) || action.hole !== 30) return result(false, 'The hole is 30 mm in diameter, which means a 15 mm radius. A 30 mm radius would produce a 60 mm diameter hole.');
        state.flags.drawing = true;
        return result(true, 'Drawing checked: millimetres, 100 × 100 mm square, 30 mm diameter hole.');
      case 'inspect-toolpath':
        if (action.outer !== 'outside') return result(false, 'Retain the square in this exercise: the outside profile uses the outside cutting side. Cutting inside it would make the retained part smaller.');
        if (action.inner !== 'inside') return result(false, 'Remove the hole in this exercise: its cutting side is inside the circular outline. The surrounding square is the retained material.');
        if (action.order !== 'hole-first') return result(false, 'Use hole first for this proposed exercise, then the outside profile. The part remains supported while the internal feature is prepared.');
        state.flags.toolpath = true;
        return result(true, 'Proposed exercise path checked: inside the hole first, then outside the square. This is not a material recipe or a compensated machine program.');
      case 'connect':
        state.flags.connected = true;
        return result(true, 'Virtual controller connected: Offline. Connection and Online are separate states. Offline is not proof of real electrical isolation.');
      case 'online':
        state.flags.online = true;
        return result(true, 'Virtual controller Online: Not Referenced. Reference the model before loading the checked job.');
      case 'reference':
        state.flags.referenced = true;
        return result(true, 'Virtual machine referenced. This establishes a machine reference, not the position of the job on the sheet.');
      case 'load':
        if (action.file !== state.job.file) {
          if (typeof action.file === 'string' && /\.dxf$/i.test(action.file)) return result(false, 'That is a drawing DXF. In this taught route, Load Program needs the checked TAP program. Choose practice-square-v1.tap.');
          return result(false, 'That is not the checked practice revision. Choose practice-square-v1.tap and compare its square and hole with the intended job.');
        }
        state.flags.loaded = true;
        return result(true, 'The checked practice program is loaded: one 100 mm square and one central 30 mm hole. No TAP file was created or sent anywhere.');
      case 'simul':
        state.flags.simul = true;
        return result(true, 'Simul selected for this browser exercise. Real SureControl Simul moves the actual machine; this trainer has no hardware connection.');
      case 'start-dry-run':
        if (!state.origin || !fits(state.origin, state)) return result(false, 'Assign a fitting origin before starting the virtual dry run.');
        clearRun(); state.status = 'running';
        return result(true, 'Virtual dry run started. Observe the hole followed by the square. Stop cancels this run and permits a fresh start.');
      default: return result(false, 'Choose a supported control in this limited training model.');
    }
  }

  function tracePoints(raw) {
    var state = validateState(raw);
    if (!state || !state.flags.loaded) return [];
    var at = state.origin || state.position;
    var points = [{x:at.x, y:at.y, kind:'rapid'}, {x:at.x+50, y:at.y+50, kind:'rapid'}, {x:at.x+65, y:at.y+50, kind:'lead'}];
    for (var i = 1; i <= 48; i++) {
      var theta = i * Math.PI * 2 / 48;
      points.push({x:at.x+50+15*Math.cos(theta), y:at.y+50+15*Math.sin(theta), kind:'inner'});
    }
    points.push({x:at.x-5, y:at.y, kind:'rapid'}, {x:at.x, y:at.y, kind:'lead'});
    [[100,0],[100,100],[0,100],[0,0]].forEach(function (p) { points.push({x:at.x+p[0], y:at.y+p[1], kind:'outer'}); });
    return points;
  }

  return {initialState:initialState, reduce:reduce, currentStep:currentStep, validateState:validateState, tracePoints:tracePoints};
}));
