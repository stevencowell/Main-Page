/* Browser-local learning evidence. This code has no machine connection or control API. */
(function () {
  'use strict';
  const PREFIX = 'tas:cnc-plasma:v1:';
  const FORMAT = 'tas-course-evidence';
  const COURSE = 'cnc-plasma';
  const MAX_BACKUP = 10 * 1024 * 1024;
  const MAX_IMAGE_BYTES=140000, MAX_SOURCE_IMAGE=8*1024*1024, MAX_SOURCE_PIXELS=24000000;
  const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  const plain = x => !!x && typeof x === 'object' && !Array.isArray(x);
  const clone = x => JSON.parse(JSON.stringify(x));
  const now = () => new Date().toISOString();
  const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const strictParse = text => JSON.parse(text, (key,value) => {
    if (['__proto__','prototype','constructor'].includes(key)) throw new Error('The backup contains an unsupported field.');
    return value;
  });
  function imageDimensions(bytes) {
    if(bytes.length>=24 && [137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b)) {
      const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
      if(String.fromCharCode(...bytes.slice(12,16))!=='IHDR')throw new Error('Invalid PNG header.');
      return {type:'image/png',width:v.getUint32(16),height:v.getUint32(20)};
    }
    if(bytes[0]!==255 || bytes[1]!==216)throw new Error('Choose a genuine JPEG or PNG image.');
    let offset=2;
    while(offset+4<=bytes.length) {
      if(bytes[offset++]!==255)throw new Error('The JPEG header is invalid.');
      while(bytes[offset]===255)offset++;
      const marker=bytes[offset++];
      if(marker===217 || marker===218)break;
      if(marker===1 || marker>=208&&marker<=215)continue;
      const length=(bytes[offset]<<8)+bytes[offset+1];
      if(length<2 || offset+length>bytes.length)throw new Error('The JPEG header is incomplete.');
      if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) {
        if(length<8)throw new Error('Invalid JPEG dimensions.');
        return {type:'image/jpeg',height:(bytes[offset+3]<<8)+bytes[offset+4],width:(bytes[offset+5]<<8)+bytes[offset+6]};
      }
      offset+=length;
    }
    throw new Error('The image dimensions could not be read.');
  }
  function jpegBytes(dataURL) {
    if(typeof dataURL!=='string' || dataURL.length>MAX_IMAGE_BYTES*1.4+30 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(dataURL))throw new Error('A backup image is not a supported JPEG.');
    const text=globalThis.atob?atob(dataURL.slice(23)):Buffer.from(dataURL.slice(23),'base64').toString('binary');
    return Uint8Array.from(text,c=>c.charCodeAt(0));
  }
  function validateImage(image) {
    if(!plain(image) || Object.keys(image).some(k=>!['id','data_url','width','height','bytes'].includes(k)))throw new Error('A backup image has invalid fields.');
    if(typeof image.id!=='string' || !/^[A-Za-z0-9-]{1,120}$/.test(image.id))throw new Error('A backup image identifier is invalid.');
    const bytes=jpegBytes(image.data_url), size=imageDimensions(bytes);
    if(size.type!=='image/jpeg' || bytes.length>MAX_IMAGE_BYTES || bytes.length!==image.bytes || bytes.at(-2)!==255 || bytes.at(-1)!==217 || image.width!==size.width || image.height!==size.height || image.width<1 || image.height<1 || image.width>1200 || image.height>1200)throw new Error('A backup image has invalid dimensions or size.');
    return {id:image.id,data_url:image.data_url,width:image.width,height:image.height,bytes:image.bytes};
  }
  function validateData(data, meta) {
    if (!plain(data)) throw new Error('Evidence must be an object.');
    const allowed = ['answers','checked','response','fields','complete','images','review'];
    if (Object.keys(data).some(key => !allowed.includes(key))) throw new Error('Evidence contains an unknown field.');
    if (!plain(data.answers) || !plain(data.checked) || !plain(data.fields) || typeof data.response !== 'string' || typeof data.complete !== 'boolean') throw new Error('Evidence has an incorrect field type.');
    if (data.response.length > 60000) throw new Error('A written response is too large.');
    for (const key of ['answers','checked']) {
      for (const [qid,value] of Object.entries(data[key])) {
        if (!own(meta.questions,qid) || !meta.questions[qid].includes(value)) throw new Error('A question or answer does not match this course version.');
        if (key === 'checked' && data.answers[qid] !== value) throw new Error('A checked answer does not match its selected answer.');
      }
    }
    for (const [key,value] of Object.entries(data.fields)) {
      if (!own(meta.fields,key)) throw new Error('An evidence field does not match this course version.');
      const type = meta.fields[key];
      if (type === 'checkbox' ? typeof value !== 'boolean' : typeof value !== 'string' || value.length > (meta.type==='profile'?120:type==='text'?4000:60000)) throw new Error('An evidence field has an incorrect type or size.');
    }
    if (meta.type==='section' && (Object.keys(data.fields).length || data.complete)) throw new Error('A section has unexpected evidence fields.');
    if (meta.type!=='section' && (Object.keys(data.answers).length || Object.keys(data.checked).length || data.response)) throw new Error('An activity has unexpected question fields.');
    if(meta.type==='profile'&&data.complete)throw new Error('Student details cannot be marked as learning evidence.');
    const images=data.images===undefined?[]:data.images, review=data.review===undefined?{}:data.review;
    if(!Array.isArray(images) || images.length>(meta.type==='folio'?Math.min(meta.image_limit||2,2):0))throw new Error('Images are limited to two per folio card.');
    const ids=new Set();
    for(const image of images){
      if(!plain(image) || Object.keys(image).some(k=>!['id','caption'].includes(k)) || typeof image.id!=='string' || !/^[A-Za-z0-9-]{1,120}$/.test(image.id) || typeof image.caption!=='string' || image.caption.length>2000 || ids.has(image.id))throw new Error('An image reference or caption is invalid.');
      ids.add(image.id);
    }
    if(!plain(review) || Object.entries(review).some(([id,value])=>!(meta.review_keys||[]).includes(id)||typeof value!=='boolean'))throw new Error('A self-review field does not match this course.');
    return {answers:{...data.answers},checked:{...data.checked},response:data.response,fields:{...data.fields},complete:data.complete,images:images.map(x=>({...x})),review:{...review}};
  }
  function validateRecord(record, registry) {
    if (!plain(record) || Object.keys(record).some(k=>!['schema_version','course_id','scope','revision','updated_at','writer','data'].includes(k))) throw new Error('A saved record has an invalid shape.');
    if (record.schema_version!==1 || record.course_id!==COURSE || typeof record.scope!=='string' || !own(registry,record.scope)) throw new Error('This evidence belongs to another course or unsupported version.');
    if (typeof record.revision!=='string' || record.revision.length>120 || typeof record.writer!=='string' || record.writer.length>120 || typeof record.updated_at!=='string' || !Number.isFinite(Date.parse(record.updated_at))) throw new Error('A saved record has invalid revision information.');
    return {schema_version:1,course_id:COURSE,scope:record.scope,revision:record.revision,updated_at:record.updated_at,writer:record.writer,data:validateData(record.data,registry[record.scope])};
  }
  function validateBackup(text, registry) {
    if (typeof text!=='string' || text.length>MAX_BACKUP || new TextEncoder().encode(text).byteLength>MAX_BACKUP) throw new Error('Choose a course backup smaller than 10 MB.');
    const backup=strictParse(text);
    if (!plain(backup) || Object.keys(backup).some(k=>!['format','schema_version','course_id','exported_at','records','images'].includes(k))) throw new Error('This is not a supported course backup.');
    if (backup.format!==FORMAT || backup.schema_version!==1 || backup.course_id!==COURSE || !Array.isArray(backup.records) || backup.records.length>Object.keys(registry).length) throw new Error('Choose a backup for this CNC Plasma course version.');
    if (typeof backup.exported_at!=='string' || !Number.isFinite(Date.parse(backup.exported_at))) throw new Error('The backup date is invalid.');
    const seen=new Set();
    const records=backup.records.map(r=>{
      const value=validateRecord(r,registry);
      if(seen.has(value.scope)) throw new Error('The backup repeats an evidence record.');
      seen.add(value.scope); return value;
    });
    if(!records.length) throw new Error('This backup contains no evidence to restore.');
    const incoming=backup.images===undefined?[]:backup.images;
    if(!Array.isArray(incoming)||incoming.length>Object.values(registry).filter(m=>m.type==='folio').length*2)throw new Error('The backup has too many images.');
    const images=incoming.map(validateImage), imageIds=new Set(images.map(x=>x.id));
    if(imageIds.size!==images.length)throw new Error('The backup repeats an image.');
    const used=new Set(records.flatMap(r=>r.data.images.map(i=>i.id)));
    if([...used].some(id=>!imageIds.has(id)) || [...imageIds].some(id=>!used.has(id)))throw new Error('The backup has a missing or unreferenced image.');
    return {...backup,records,images};
  }
  function prepareBackupText(records,images,exportedAt,registry){
    const text=JSON.stringify({format:FORMAT,schema_version:1,course_id:COURSE,exported_at:exportedAt,records,images},null,2);
    validateBackup(text,registry);
    return text;
  }
  function emptyData() {return {answers:{},checked:{},response:'',fields:{},complete:false,images:[],review:{}};}
  function progressFor(data,meta) {
    if(meta.type==='profile')return {done:0,total:0,complete:false};
    if(meta.type==='section') {
      const checked=Object.keys(meta.questions).filter(id=>data.checked[id] && data.checked[id]===data.answers[id]).length;
      const response=data.response.trim().length>0 ? 1 : 0;
      return {done:checked+response,total:11,checked,response,complete:checked===10 && !!response};
    }
    const content=Object.values(data.fields).some(v=>typeof v==='string'?v.trim().length>0:v===true)||(data.images||[]).some(i=>i.caption.trim());
    const done=data.complete&&content?1:0;
    return {done,total:1,complete:!!done};
  }
  function nextIncomplete(registry,data,order,remembered) {
    const scopes=order.filter(s=>own(registry,s)&&registry[s].type!=='profile'), start=Math.max(0,scopes.indexOf(remembered));
    const sequence=[...scopes.slice(start),...scopes.slice(0,start)];
    for(const scope of sequence){
      const meta=registry[scope], item=data[scope]||emptyData();
      if(progressFor(item,meta).complete)continue;
      let route=meta.route;
      if(meta.type==='section') {
        const qid=Object.keys(meta.questions).find(id=>!item.checked[id]||item.checked[id]!==item.answers[id]);
        route=route.split('#')[0]+'#'+(qid||scope+'-response');
      }
      return {scope,route,title:meta.title};
    }
    return null;
  }
  const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function evidenceHTML(config,records,images,date) {
    const data=Object.fromEntries(records.map(r=>[r.scope,r.data])), imageMap=Object.fromEntries(images.map(i=>[i.id,i]));
    const details=data['course-details']?.fields||{}, h=escapeHTML;
    let body=`<h1>${h(config.title)}</h1><p>Learning evidence · ${h(date)}</p><p>${details.name?'Name: '+h(details.name)+' · ':''}${details.class?'Class: '+h(details.class):''}</p><p>This copy records learning evidence. It is not operator authorisation, a teacher mark or confirmation of formal submission.</p>`;
    const order=config.learningOrder||Object.keys(config.registry);
    for(const scope of order){
      const meta=config.registry[scope], item=data[scope];if(!item||meta.type==='profile')continue;
      body+=`<article><h2>${h(meta.title)}</h2><p class="status">${progressFor(item,meta).complete?'Evidence recorded and checked':'Evidence in progress'}</p>`;
      if(meta.type==='section'){
        for(const question of config.sections[scope].questions){
          const selected=question.options.find(o=>o.option_id===item.answers[question.question_id]);
          body+=`<section><h3>${h(question.prompt)}</h3><p>Selected: ${h(selected?.text||'No answer selected.')}</p>`;
          if(selected&&item.checked[question.question_id]===selected.option_id)body+=`<p>Feedback after checking: ${h(selected.feedback)}</p>`;
          body+='</section>';
        }
        const response=config.sections[scope].long_response;
        body+=`<h3>Written response</h3><p>${h(response.prompt||'')}</p><div class="writing">${h(item.response||'No response recorded.')}</div>`;
        body+=reviewHTML(item,response);
      }else{
        body+=`<p>${h(meta.instructions_text||'')}</p><p>${h(meta.prompt||'')}</p>`;
        for(const [field,type] of Object.entries(meta.fields))body+=`<h3>${h(meta.labels?.[field]||field)}</h3><div class="writing">${h(type==='checkbox'?(item.fields[field]?'Checked':'Not checked'):item.fields[field]||'No response recorded.')}</div>`;
        for(const ref of item.images||[]){const image=imageMap[ref.id];if(image)body+=`<figure><img src="${image.data_url}" alt="${h(ref.caption||'Student-selected evidence image')}"><figcaption>${h(ref.caption||'No caption recorded.')}</figcaption></figure>`;}
        body+=reviewHTML(item,meta);
      }
      body+='</article>';
    }
    function reviewHTML(item,meta){
      let value='<h3>My self-review</h3><ul>';
      for(const [prefix,items] of [['scaffold',meta.scaffold_prompts||[]],['criterion',meta.success_criteria||[]]])items.forEach((text,i)=>{value+=`<li>${item.review?.[prefix+'-'+(i+1)]?'Checked':'Not checked'} — ${h(text)}</li>`;});
      return value+'</ul>';
    }
    return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${h(config.title)} — learning evidence</title><style>body{max-width:940px;margin:32px auto;padding:0 24px;font:17px/1.6 system-ui,sans-serif;color:#173244;background:#fffefa}h1,h2,h3{line-height:1.25}article{border-top:2px solid #aac1cb;margin-top:32px;padding-top:20px}section{margin:18px 0}.writing{white-space:pre-wrap;overflow-wrap:anywhere;padding:16px;border:1px solid #c5d4dc;background:#f4f7f7}.status{font-size:.9em}figure{margin:24px 0;break-inside:avoid}img{display:block;max-width:100%;max-height:650px;height:auto;object-fit:contain}figcaption{white-space:pre-wrap;overflow-wrap:anywhere;margin-top:10px}@media print{body{margin:0;font:11pt/1.5 Arial,sans-serif;padding:0}article{break-before:page}img{max-height:140mm}.writing{background:white}}@media(max-width:500px){body{margin:20px auto;padding:0 16px;font-size:16px}}</style></head><body>${body}</body></html>`;
  }
  if (typeof document==='undefined') {
    if(typeof module!=='undefined') module.exports={validateData,validateRecord,validateBackup,prepareBackupText,validateImage,imageDimensions,nextIncomplete,evidenceHTML,progressFor,emptyData,strictParse};
    return;
  }
  const configEl=document.getElementById('course-data');
  if(!configEl)return;
  const config=strictParse(configEl.textContent), registry=config.registry, states=new Map(), writer=makeId();
  const $=(selector,root=document)=>root.querySelector(selector), $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  let importBusy=false, printSnapshot=[], printMode=false;
  let exportPreparing=false, transferOpener=null;
  const preparedExports=new Map();
  let imageDBPromise;
  function imageDB(){
    if(!imageDBPromise)imageDBPromise=new Promise((resolve,reject)=>{
      if(!globalThis.indexedDB){reject(new Error('This browser cannot store images. Your writing still works; keep your original image files.'));return;}
      const request=indexedDB.open(PREFIX+'images',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('images',{keyPath:'id'});
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('Image storage is unavailable. Keep your original files.'));
      request.onblocked=()=>reject(new Error('Close older course tabs before trying image storage again.'));
    }).catch(error=>{imageDBPromise=null;throw error;});
    return imageDBPromise;
  }
  async function getImage(id){
    const db=await imageDB();return new Promise((resolve,reject)=>{
      const request=db.transaction('images','readonly').objectStore('images').get(id);
      request.onsuccess=()=>{try{resolve(request.result?validateImage(request.result):null);}catch(error){reject(error);}};request.onerror=()=>reject(new Error('An evidence image could not be read.'));
    });
  }
  async function putImage(image){
    validateImage(image);const db=await imageDB();return new Promise((resolve,reject)=>{
      const tx=db.transaction('images','readwrite');tx.objectStore('images').add(image);
      tx.oncomplete=()=>resolve(image);tx.onerror=()=>reject(new Error('This browser could not save the image. Your existing writing and images are unchanged.'));tx.onabort=tx.onerror;
    });
  }
  async function convertImage(file){
    if(!['image/jpeg','image/png'].includes(file.type)||file.size>MAX_SOURCE_IMAGE||!file.size)throw new Error('Choose a JPEG or PNG image no larger than 8 MB.');
    const bytes=new Uint8Array(await file.arrayBuffer()), source=imageDimensions(bytes);
    if(source.type!==file.type||source.width<1||source.height<1||source.width*source.height>MAX_SOURCE_PIXELS||source.width>16000||source.height>16000)throw new Error('Choose an image with no more than 24 megapixels and dimensions below 16,001 pixels.');
    const url=URL.createObjectURL(file), img=new Image();
    try{
      await new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>reject(new Error('This image could not be opened promptly. Try a smaller image.')),10000);
        img.onload=()=>{clearTimeout(timeout);resolve();};img.onerror=()=>{clearTimeout(timeout);reject(new Error('This image could not be decoded.'));};img.src=url;
      });
      if(img.naturalWidth*img.naturalHeight>MAX_SOURCE_PIXELS)throw new Error('The decoded image is too large.');
      let scale=Math.min(1,1200/Math.max(img.naturalWidth,img.naturalHeight)), output;
      const canvas=document.createElement('canvas'), ctx=canvas.getContext('2d');
      if(!ctx)throw new Error('Image conversion is unavailable in this browser.');
      for(let attempt=0;attempt<7;attempt++){
        canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
        ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
        const dataURL=canvas.toDataURL('image/jpeg',Math.max(.45,.82-attempt*.05));
        const estimated=Math.floor((dataURL.length-23)*3/4);
        if(estimated<=MAX_IMAGE_BYTES){const decoded=jpegBytes(dataURL);output={id:'img-'+makeId(),data_url:dataURL,width:canvas.width,height:canvas.height,bytes:decoded.length};break;}
        scale*=.8;
      }
      if(!output)throw new Error('This image could not be reduced enough. Try a smaller image.');
      return validateImage(output);
    }finally{img.src='';URL.revokeObjectURL(url);}
  }
  function imageStatus(state,text,error=false){const out=$('[data-image-status]',state.host);if(out){out.textContent=text;out.classList.toggle('error',error);}}
  function renderImages(state){
    const gallery=$('[data-evidence-images]',state.host);if(!gallery)return;
    gallery.replaceChildren();
    for(const ref of state.data.images||[]){
      const figure=document.createElement('figure');figure.className='evidence-image';
      const img=document.createElement('img');img.alt=ref.caption||'Your selected evidence image';figure.append(img);
      const label=document.createElement('label'), id=state.scope+'-caption-'+ref.id;label.htmlFor=id;label.textContent='Caption: what does this image show or prove?';
      const caption=document.createElement('textarea');caption.id=id;caption.rows=3;caption.maxLength=2000;caption.dataset.imageCaption=ref.id;caption.value=ref.caption;
      const remove=document.createElement('button');remove.type='button';remove.className='text-button';remove.dataset.removeImage=ref.id;remove.textContent='Remove this image';
      figure.append(label,caption,remove);gallery.append(figure);
      getImage(ref.id).then(image=>{if(!figure.isConnected)return;if(image)img.src=image.data_url;else{img.alt='This saved image is unavailable in this browser.';imageStatus(state,'A saved image is missing. Restore a backup containing it or add the original again. Your caption and writing remain here.',true);}}).catch(error=>{if(figure.isConnected)imageStatus(state,error.message,true);});
    }
  }
  async function addImages(state,files){
    if(state.imageTask){imageStatus(state,'An image is still being prepared. Please wait.');return;}
    if(!files.length)return;
    if(files.length+(state.data.images||[]).length>2){imageStatus(state,'Each folio card can hold two images. Remove one before adding another.',true);return;}
    const token=makeId();state.imageTask=token;const input=$('[data-image-input]',state.host);if(input)input.disabled=true;
    imageStatus(state,'Preparing your images locally…');
    try{
      const prepared=[];
      for(const file of files){const image=await convertImage(file);if(state.imageTask!==token)return;await putImage(image);prepared.push(image);}
      if(state.imageTask!==token)return;
      state.data=capture(state);state.data.images.push(...prepared.map(image=>({id:image.id,caption:''})));renderImages(state);markDirty(state);
      imageStatus(state,`Added ${prepared.length} image${prepared.length===1?'':'s'} locally. Add captions explaining the evidence; keep a backup before changing devices.`);
    }catch(error){imageStatus(state,error.message,true);}
    finally{if(state.imageTask===token)state.imageTask=null;if(input){input.disabled=false;input.value='';}}
  }
  let writing=Promise.resolve();
  let confirmationActive=false;
  function askConfirm(text,options={}) {
    if(confirmationActive)return Promise.resolve(false);
    confirmationActive=true;
    const opener=document.activeElement, dialog=document.createElement('dialog');
    dialog.className='confirmation-dialog';dialog.setAttribute('aria-labelledby','confirmation-title');dialog.setAttribute('aria-describedby','confirmation-description');
    const title=document.createElement('h2');title.id='confirmation-title';title.textContent=options.title||'Confirm this change';
    const description=document.createElement('p');description.id='confirmation-description';description.textContent=text;description.style.whiteSpace='pre-line';
    dialog.append(title,description);
    let typed=null;
    if(options.requiredText){
      const label=document.createElement('label');label.textContent='Type '+options.requiredText+' to confirm.';label.htmlFor='confirmation-typed';
      typed=document.createElement('input');typed.id='confirmation-typed';typed.type='text';typed.autocomplete='off';typed.spellcheck=false;
      dialog.append(label,typed);
    }
    const row=document.createElement('div');row.className='button-row';
    const cancel=document.createElement('button');cancel.type='button';cancel.className='secondary';cancel.textContent='Cancel — keep my work';
    const proceed=document.createElement('button');proceed.type='button';proceed.textContent=options.confirmText||'Confirm change';
    if(typed){proceed.disabled=true;typed.addEventListener('input',()=>{proceed.disabled=typed.value!==options.requiredText;});}
    row.append(cancel,proceed);dialog.append(row);document.body.append(dialog);
    return new Promise(resolve=>{
      let done=false;
      const finish=value=>{if(done)return;done=true;confirmationActive=false;dialog.close();dialog.remove();opener?.focus?.();resolve(value);};
      cancel.addEventListener('click',()=>finish(false));proceed.addEventListener('click',()=>finish(true));
      dialog.addEventListener('cancel',event=>{event.preventDefault();finish(false);});
      dialog.addEventListener('close',()=>finish(false));dialog.showModal();cancel.focus();
    });
  }
  function message(text,error=false) {
    const box=$('#global-message'); if(!box)return;
    box.textContent=text; box.hidden=false; box.setAttribute('role',error?'alert':'status');
  }
  function status(state,text,error=false) {
    const node=$('[data-save-status]',state.host);
    if(node){node.textContent=text;node.classList.toggle('error',error);}
  }
  function key(scope){return PREFIX+'scope:'+scope;}
  function readRecord(scope) {
    const raw=localStorage.getItem(key(scope));
    return raw===null?null:validateRecord(strictParse(raw),registry);
  }
  function makeRecord(scope,data) {return {schema_version:1,course_id:COURSE,scope,revision:makeId(),updated_at:now(),writer,data:clone(data)};}
  function withLock(action) {
    // Web Locks serialises saves and imports across same-origin tabs where available.
    // Revision comparison, storage-event conflicts and per-tab recovery also remain active.
    const execute=()=>navigator.locks?.request?navigator.locks.request(PREFIX+'write',action):action();
    const result=writing.then(execute,execute); writing=result.catch(()=>{}); return result;
  }
  function recovery(record,reason='before-change') {
    // One prior copy per scope and writer is retained; it never replaces canonical evidence.
    localStorage.setItem(PREFIX+'recovery:'+record.scope+':'+writer,JSON.stringify({reason,record}));
  }
  function conflict(state) {
    state.conflict=true; clearTimeout(state.timer);
    const panel=$('[data-conflict]',state.host);if(panel)panel.hidden=false;
    status(state,'Another tab changed this evidence. Your work here is protected.',true);
  }
  function clearConflict(state){state.conflict=false;const panel=$('[data-conflict]',state.host);if(panel)panel.hidden=true;}
  function capture(state) {
    const data=clone(state.data), meta=registry[state.scope];
    if(meta.type==='section') {
      for(const qid of Object.keys(meta.questions)) {
        const field=$(`[data-question="${qid}"]`,state.host), radio=field&&$('input[type=radio]:checked',field);
        if(radio) data.answers[qid]=radio.value; else delete data.answers[qid];
        if(data.checked[qid]!==data.answers[qid])delete data.checked[qid];
      }
      data.response=$('[data-long-response]',state.host)?.value||'';
    } else {
      for(const field of $$('[data-field]',state.host)) data.fields[field.dataset.field]=field.type==='checkbox'?field.checked:field.value;
      data.complete=!!$('[data-complete]',state.host)?.checked;
    }
    data.review=data.review||{};
    for(const field of $$('[data-review]',state.host))data.review[field.dataset.review]=field.checked;
    for(const field of $$('[data-image-caption]',state.host)){const image=data.images?.find(i=>i.id===field.dataset.imageCaption);if(image)image.caption=field.value;}
    return validateData(data,meta);
  }
  function renderFeedback(state,qid) {
    const q=config.sections[state.scope]?.questions.find(q=>q.question_id===qid), out=$(`[data-feedback="${qid}"]`,state.host);
    if(!q||!out)return;
    const checked=state.data.checked[qid], option=q.options.find(o=>o.option_id===checked);
    if(!option || checked!==state.data.answers[qid]) {out.hidden=true;out.textContent='';return;}
    const correct=checked===q.correct_option_id;
    out.textContent=(correct?'Checked — ':'Revisit — ')+option.feedback;
    out.classList.toggle('revisit',!correct);out.hidden=false;
  }
  function populate(state) {
    state.imageTask=null;
    const meta=registry[state.scope];
    if(meta.type==='section') {
      for(const input of $$('input[type=radio]',state.host))input.checked=state.data.answers[input.name]===input.value;
      const textarea=$('[data-long-response]',state.host);if(textarea)textarea.value=state.data.response;
      for(const qid of Object.keys(meta.questions))renderFeedback(state,qid);
      countWords(state);
    } else {
      for(const field of $$('[data-field]',state.host)) {
        const val=state.data.fields[field.dataset.field];
        if(field.type==='checkbox')field.checked=val===true;else field.value=typeof val==='string'?val:'';
      }
      const complete=$('[data-complete]',state.host);if(complete)complete.checked=state.data.complete;
    }
    for(const field of $$('[data-review]',state.host))field.checked=state.data.review?.[field.dataset.review]===true;
    renderImages(state);
  }
  function countWords(state) {
    const out=$('[data-word-count]',state.host);if(out)out.textContent=`${state.data.response.trim()?state.data.response.trim().split(/\s+/).length:0} words`;
  }
  function remember(scope) {
    if(registry[scope].type==='profile')return;
    try{localStorage.setItem(PREFIX+'resume',JSON.stringify({scope,route:registry[scope].route,updated_at:now()}));}catch{}
  }
  function markDirty(state) {
    if(importBusy)return;
    state.data=capture(state);state.dirty=true;state.generation++;countWords(state);remember(state.scope);
    try{localStorage.setItem(PREFIX+'draft:'+state.scope+':'+writer,JSON.stringify(makeRecord(state.scope,state.data)));}
    catch{status(state,'This browser could not save a recovery copy. Download a backup now.',true);}
    updateProgress();
    if(state.conflict || state.blocked)return;
    status(state,'Saving your changes…');clearTimeout(state.timer);
    state.timer=setTimeout(()=>saveState(state),500);
  }
  async function saveState(state,force=false) {
    clearTimeout(state.timer);
    if(!state.dirty || state.conflict&&!force || state.blocked)return;
    return withLock(async()=>{
      if(importBusy || !state.dirty)return;
      const generation=state.generation, data=clone(state.data);
      let latest;
      try{latest=readRecord(state.scope);}catch(err){state.blocked=true;status(state,'Saved data needs recovery. Download your current work before resetting this evidence.',true);return;}
      if(!force && (latest?.revision||null)!==state.baseRevision){conflict(state);return;}
      try {
        if(latest)recovery(latest);
        const record=makeRecord(state.scope,data);
        localStorage.setItem(key(state.scope),JSON.stringify(record));
        const verify=readRecord(state.scope);
        if(verify?.revision!==record.revision){recovery(record,'concurrent-save');conflict(state);return;}
        state.baseRevision=record.revision;state.record=record;
        if(state.generation===generation)state.dirty=false;
        clearConflict(state);
        if(!state.dirty){localStorage.removeItem(PREFIX+'draft:'+state.scope+':'+writer);status(state,'Saved in this browser · '+new Date(record.updated_at).toLocaleTimeString('en-AU',{hour:'2-digit',minute:'2-digit'}));}
        else state.timer=setTimeout(()=>saveState(state),150);
        updateProgress();
      } catch(err) {status(state,'Could not save in this browser. Your writing is still here — download a backup now.',true);message('Browser storage is unavailable or full. Keep this page open and download a backup.',true);}
    });
  }
  function currentData(scope){return states.has(scope)?states.get(scope).data:(readRecord(scope)?.data||emptyData());}
  function progressText(p,meta) {return meta.type==='section'?`${p.checked}/10 questions checked · ${p.response?'response recorded':'response to write'}`:p.complete?'Evidence checked and complete':'Evidence to complete';}
  function updateProgress() {
    const all={done:0,total:0}, map={}, dataMap={};
    for(const [scope,meta] of Object.entries(registry)) {
      let data=emptyData();try{data=currentData(scope);}catch{}
      dataMap[scope]=data;
      const p=progressFor(data,meta);map[scope]=p;all.done+=p.done;all.total+=p.total;
      for(const node of $$('[data-progress-scope]'))if(node.dataset.progressScope===scope)node.textContent=progressText(p,meta);
    }
    const percent=all.total?Math.round(all.done/all.total*100):0;
    for(const n of $$('[data-course-progress]'))n.textContent=`${all.done}/${all.total} learning evidence steps · ${percent}%`;
    for(const n of $$('[data-course-bar]')){n.value=percent;n.textContent=percent+'%';}
    for(const [mid,scopes] of Object.entries(config.moduleScopes)) {
      const p=scopes.reduce((acc,s)=>({done:acc.done+(map[s]?.done||0),total:acc.total+(map[s]?.total||0)}),{done:0,total:0});
      for(const n of $$('[data-module-progress]'))if(n.dataset.moduleProgress===mid)n.textContent=`${p.done}/${p.total} evidence steps completed`;
      for(const n of $$('[data-module-bar]'))if(n.dataset.moduleBar===mid){n.value=p.total?Math.round(p.done/p.total*100):0;n.textContent=n.value+'%';}
    }
    let resume;try{resume=strictParse(localStorage.getItem(PREFIX+'resume')||'null');}catch{}
    const next=nextIncomplete(registry,dataMap,config.learningOrder||Object.keys(registry),resume?.scope);
    for(const a of $$('[data-course-resume]')){a.href=config.root+(next?.route||'folio.html');a.textContent=next?'Continue: '+next.title:'Review your completed evidence';}
  }
  async function resetScope(state) {
    if(!await askConfirm('Reset only this evidence? Its answers, writing, self-review and selected images will be cleared from this card. Download a backup first if you want to keep a copy.',{title:'Reset this evidence only',confirmText:'Reset this evidence'}))return;
    await withLock(()=>{
      try {
        const raw=localStorage.getItem(key(state.scope));
        if(raw!==null)localStorage.setItem(PREFIX+'reset-recovery:'+state.scope,raw);
        if(state.dirty)recovery(makeRecord(state.scope,state.data),'unsaved-before-reset');
        const record=makeRecord(state.scope,emptyData());localStorage.setItem(key(state.scope),JSON.stringify(record));
        state.data=record.data;state.record=record;state.baseRevision=record.revision;state.dirty=false;state.blocked=false;clearConflict(state);populate(state);status(state,'Only this evidence has been reset.');updateProgress();
      }catch{status(state,'Reset could not be saved. Your existing evidence has been preserved.',true);}
    });
  }
  async function resolveSaved(state) {
    if(!await askConfirm('Use the saved version from the other tab? This will replace the writing currently visible here. Download a backup first to keep both.',{title:'Choose the saved version',confirmText:'Use saved version'}))return;
    try{recovery(makeRecord(state.scope,state.data),'before-use-saved');const record=readRecord(state.scope);state.data=record?.data||emptyData();state.baseRevision=record?.revision||null;state.record=record;state.dirty=false;state.blocked=false;clearConflict(state);populate(state);status(state,'The saved version is now shown.');updateProgress();}catch{status(state,'The saved version could not be read. Your current writing remains here.',true);}
  }
  async function gatherEvidence() {
    const records=[],errors=[], images=[], seen=new Set();
    for(const scope of Object.keys(registry)) {
      try {
        const state=states.get(scope), saved=state?.dirty||state?.conflict?makeRecord(scope,capture(state)):readRecord(scope);
        if(saved){
          const copy=clone(saved);copy.data=validateData(copy.data,registry[scope]);
          const available=[];
          for(const ref of copy.data.images){
            try{const image=await getImage(ref.id);if(!image)throw new Error('Missing image');available.push(ref);if(!seen.has(image.id)){images.push(image);seen.add(image.id);}}
            catch{errors.push(registry[scope].title+' — an unavailable image was excluded; its writing was retained');}
          }
          copy.data.images=available;records.push(copy);
        }
      }catch{errors.push(registry[scope].title);}
    }
    return {records,images,errors};
  }
  function transferPanel(){
    let panel=$('#evidence-transfers');
    if(!panel){panel=document.createElement('section');panel.id='evidence-transfers';panel.className='container evidence-transfers';$('#global-message').insertAdjacentElement('afterend',panel);}
    if(!panel.children.length){
      panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','transfer-title');panel.tabIndex=-1;
      const heading=document.createElement('h2');heading.id='transfer-title';heading.textContent='Keep or restore your evidence';panel.append(heading);
      const close=document.createElement('button');close.type='button';close.className='text-button';close.dataset.closeTransfers='';close.textContent='Close these tools';panel.append(close);
    }
    panel.hidden=false;return panel;
  }
  function showTransfer(node){const panel=transferPanel();panel.hidden=false;node.tabIndex=-1;node.focus({preventScroll:true});node.scrollIntoView({block:'start',behavior:'auto'});}
  function selectBackupText(textarea,status){
    textarea.closest('details')?.setAttribute('open','');textarea.focus();textarea.select();textarea.setSelectionRange(0,textarea.value.length);
    status.textContent='Backup text selected. Press Ctrl+C (or use Copy on your device), then paste it into a plain-text file and save it with a .json filename. You can also restore by pasting the complete text here.';
  }
  function preparedFile(kind,contents,type,name,description,errors=[]){
    const panel=transferPanel(), previous=preparedExports.get(kind), url=URL.createObjectURL(new Blob([contents],{type}));
    const card=document.createElement('section');card.className='prepared-export card';card.dataset.preparedKind=kind;
    const heading=document.createElement('h3');heading.textContent=kind==='backup'?'Your backup is prepared':'Your readable evidence is prepared';
    const summary=document.createElement('p');summary.textContent=description;
    const snapshot=document.createElement('p');snapshot.className='source-note';snapshot.textContent='Prepared '+new Date().toLocaleString('en-AU')+'. This is a snapshot. Prepare a new copy after changing your work.';
    const row=document.createElement('div');row.className='button-row';
    const link=document.createElement('a');link.href=url;link.download=name;link.className='button';link.dataset.preparedDownload=kind;link.textContent=kind==='backup'?'Download prepared backup':'Download prepared evidence';
    row.append(link);
    if(kind==='readable'){
      const open=document.createElement('a');open.href=url;open.target='_blank';open.rel='noopener noreferrer';open.className='button secondary';open.textContent='Open readable copy';row.append(open);
    }
    const status=document.createElement('p');status.className='prepared-file-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent='Choose the download link, then check that the file is saved in Downloads before leaving or changing devices.';
    card.append(heading,summary,snapshot,row,status);
    if(errors.length){const warning=document.createElement('p');warning.className='export-warning';warning.textContent='Unavailable records or images were excluded: '+errors.join(', ')+'. Keep this page open and review these gaps.';card.append(warning);}
    if(kind==='backup'){
      const fallback=document.createElement('details');fallback.className='backup-text-fallback';
      const title=document.createElement('summary');title.textContent='If downloading is blocked, copy the backup text';
      const instructions=document.createElement('p');instructions.textContent='This text contains the editable backup, including its available images. Copy all of it into a plain-text file and save with the .json filename shown below. Restore can also accept the complete pasted text.';
      const filename=document.createElement('p');filename.className='prepared-filename';filename.textContent=name;
      const label=document.createElement('label');label.htmlFor='prepared-backup-text';label.textContent='Complete backup text';
      const text=document.createElement('textarea');text.id='prepared-backup-text';text.dataset.backupText='';text.readOnly=true;text.rows=7;text.spellcheck=false;text.value=contents;
      const actions=document.createElement('div');actions.className='button-row';
      const copy=document.createElement('button');copy.type='button';copy.className='secondary';copy.textContent='Copy backup text';
      copy.addEventListener('click',async()=>{
        try{
          if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(text.value);
          status.textContent='Backup text copied. Paste it into a plain-text file and save it, or use Paste backup text when restoring. Copying alone has not saved a file.';
        }catch{selectBackupText(text,status);}
      });
      const select=document.createElement('button');select.type='button';select.className='text-button';select.textContent='Select all backup text';select.addEventListener('click',()=>selectBackupText(text,status));
      const restore=document.createElement('button');restore.type='button';restore.className='text-button';restore.dataset.import='';restore.textContent='Open restore options';
      actions.append(copy,select,restore);fallback.append(title,instructions,filename,label,text,actions);card.append(fallback);
    }
    if(previous){previous.node.replaceWith(card);URL.revokeObjectURL(previous.url);}else panel.append(card);
    preparedExports.set(kind,{url,node:card});showTransfer(card);
  }
  function showRestoreOptions(){
    const panel=transferPanel();let card=$('#backup-restore-tools');
    if(!card){
      card=document.createElement('section');card.id='backup-restore-tools';card.className='card backup-restore-tools';
      const title=document.createElement('h3');title.textContent='Restore a course backup';
      const description=document.createElement('p');description.textContent='Choose a saved JSON backup or paste its complete text. Both methods check the course, record types, size and images before asking you to confirm replacement. Nothing is restored just by choosing or pasting.';
      const choose=document.createElement('button');choose.type='button';choose.className='secondary';choose.dataset.chooseBackupFile='';choose.textContent='Choose backup JSON file';
      const details=document.createElement('details');details.className='backup-text-fallback';
      const summary=document.createElement('summary');summary.textContent='Paste backup text instead';
      const label=document.createElement('label');label.htmlFor='backup-paste-text';label.textContent='Complete JSON backup text (up to 10 MB)';
      const input=document.createElement('textarea');input.id='backup-paste-text';input.dataset.backupText='';input.rows=8;input.maxLength=MAX_BACKUP;input.spellcheck=false;input.autocomplete='off';input.setAttribute('autocapitalize','off');
      const restore=document.createElement('button');restore.type='button';restore.textContent='Check pasted backup';restore.dataset.restorePasted='';
      const note=document.createElement('p');note.className='source-note';note.textContent='Keep your saved copy. Checking this text does not change your course work; a separate confirmation explains which records would be replaced.';
      details.append(summary,label,input,restore,note);card.append(title,description,choose,details);panel.append(card);
    }
    showTransfer(card);
  }
  async function exportBackup() {
    if(exportPreparing){message('An evidence copy is still being prepared. Please wait.');return;}exportPreparing=true;
    transferOpener=document.activeElement;
    try{
      message('Preparing your backup, including available saved images…');
      const {records,images,errors}=await gatherEvidence();
      if(!records.length){message('No saved or written evidence is available to back up yet.');return;}
      const text=prepareBackupText(records,images,now(),registry);
      preparedFile('backup',text,'application/json','cnc-plasma-evidence-'+now().slice(0,10)+'.json',`${records.length} records and ${images.length} images. Writing was captured from this tab, including changes that had not yet autosaved.`,errors);
      message('Your backup is prepared. Use the visible download link or the backup-text fallback, then check your saved copy.',!!errors.length);
    }catch(error){message('The backup could not be prepared. Keep this page open. '+error.message,true);}finally{exportPreparing=false;}
  }
  async function exportReadableEvidence(){
    if(exportPreparing){message('An evidence copy is still being prepared. Please wait.');return;}exportPreparing=true;
    transferOpener=document.activeElement;
    try{
      message('Preparing a readable copy of your writing and available images…');
      const {records,images,errors}=await gatherEvidence();
      if(!records.length){message('Record some learning evidence before exporting a copy.');return;}
      const html=evidenceHTML(config,records,images,new Date().toLocaleString('en-AU'));
      preparedFile('readable',html,'text/html;charset=utf-8','cnc-plasma-learning-evidence-'+now().slice(0,10)+'.html',`${records.length} records and ${images.length} images, with writing and captions. This HTML copy opens without the course site. Use the JSON backup to restore editable work.`,errors);
      message('Your readable evidence is prepared. Download it with the visible link, or choose Open readable copy to inspect it in a new tab.',!!errors.length);
    }catch(error){message('The readable copy could not be prepared. Keep this page open. '+error.message,true);}finally{exportPreparing=false;}
  }
  async function restoreFile(file) {
    if(!file)return;
    try{if(file.size>MAX_BACKUP)throw new Error('Choose a backup smaller than 10 MB.');await restoreText(await file.text());}catch(error){message('Nothing restored. '+error.message,true);}
  }
  async function restoreText(text) {
    if(importBusy){message('A restore is already in progress. Please wait.');return;}
    if([...states.values()].some(state=>state.imageTask)){message('Let the image preparation finish before restoring a backup. Your current work is unchanged.');return;}
    let backup;
    try{backup=validateBackup(text,registry);}catch(err){message('Nothing restored. '+err.message,true);return;}
    const scopes=backup.records.map(r=>r.scope), existing=scopes.filter(s=>{try{return !!readRecord(s)||states.get(s)?.dirty;}catch{return true;}});
    if(!await askConfirm(`This backup contains ${scopes.length} evidence records and ${backup.images.length} images from ${new Date(backup.exported_at).toLocaleString('en-AU')}.\n\nRestoring will replace ${existing.length} existing records, including unsaved writing and selected images for those records in this tab. Other course records stay as they are.\n\nDownload a backup first if you need both versions.`,{title:'Restore this backup',confirmText:'Restore these records'}))return;
    await withLock(async()=>{
      importBusy=true;const before=new Map(), written=[];
      for(const state of states.values())state.host.inert=true;
      try {
        // Preflight and save a complete restore-recovery snapshot before any canonical overwrite.
        for(const scope of scopes)before.set(scope,localStorage.getItem(key(scope)));
        const localDirty=scopes.filter(s=>states.get(s)?.dirty).map(s=>makeRecord(s,states.get(s).data));
        localStorage.setItem(PREFIX+'restore-recovery',JSON.stringify({created_at:now(),before:[...before],localDirty}));
        // Fresh image IDs prevent an import from changing an image used by a preserved record.
        const imageIds=new Map();
        for(const image of backup.images){const id='img-'+makeId();await putImage({...image,id});imageIds.set(image.id,id);}
        const replacements=backup.records.map(r=>makeRecord(r.scope,{...r.data,images:r.data.images.map(ref=>({...ref,id:imageIds.get(ref.id)}))}));
        for(const scope of scopes)if(localStorage.getItem(key(scope))!==before.get(scope))throw new Error('Another tab changed evidence while the images were being prepared. Try restoring again after keeping a backup.');
        for(const record of replacements){localStorage.setItem(key(record.scope),JSON.stringify(record));written.push(record.scope);}
        for(const record of replacements) {
          const state=states.get(record.scope);if(!state)continue;
          clearTimeout(state.timer);state.data=record.data;state.record=record;state.baseRevision=record.revision;state.dirty=false;state.blocked=false;clearConflict(state);populate(state);status(state,'Restored from backup and saved in this browser.');
        }
        message(`Restored ${replacements.length} evidence records. Other records were preserved.`);updateProgress();
      } catch(err) {
        let rollback=true;
        for(const scope of written){try{const previous=before.get(scope);if(previous===null)localStorage.removeItem(key(scope));else localStorage.setItem(key(scope),previous);}catch{rollback=false;}}
        message(rollback?'Restore did not complete. Previously saved evidence was preserved; your downloaded backup is unchanged. '+err.message:'Restore could not finish. Recovery data was retained in this browser. Keep this page open and download a backup before seeking help.',true);
      } finally {importBusy=false;for(const state of states.values()){state.host.inert=false;if(state.dirty&&!state.conflict&&!state.blocked)state.timer=setTimeout(()=>saveState(state),0);}}
    });
  }
  async function resetAll() {
    if(!await askConfirm('This clears all CNC Plasma learning evidence in this browser, including questions, responses, activities, folio image selections and optional student details. Download a backup first. Other courses are unchanged.',{title:'Reset all course evidence',confirmText:'Reset all course evidence',requiredText:'RESET CNC PLASMA'}))return;
    await withLock(()=>{
      const before=[];
      try {
        for(const scope of Object.keys(registry))before.push([scope,localStorage.getItem(key(scope))]);
        const unsaved=[...states.values()].filter(s=>s.dirty).map(s=>makeRecord(s.scope,s.data));
        localStorage.setItem(PREFIX+'reset-recovery',JSON.stringify({created_at:now(),before,unsaved}));
        for(const scope of Object.keys(registry)) {
          const record=makeRecord(scope,emptyData());localStorage.setItem(key(scope),JSON.stringify(record));
          const state=states.get(scope);if(state){clearTimeout(state.timer);state.data=record.data;state.baseRevision=record.revision;state.record=record;state.dirty=false;state.blocked=false;clearConflict(state);populate(state);status(state,'Evidence reset.');}
        }
        localStorage.removeItem(PREFIX+'resume');message('This course’s learning evidence has been reset. Other courses were not changed.');updateProgress();
      }catch{message('Reset did not finish. Recovery data was retained. Download a backup and keep this page open.',true);}
    });
  }
  function openPackageFromHash(focus=false) {
    if(!location.hash)return;
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
    const target=document.getElementById(id);if(!target)return;
    const drawer=target.matches('details.section-package')?target:target.closest('details.section-package');
    if(drawer)drawer.open=true;
    if(focus && (drawer || target.closest('[data-scope]'))) {
      const destination=target===drawer?$('summary',drawer):target;
      if(!destination)return;
      if(!destination.matches('input,textarea,button,a,summary,select'))destination.tabIndex=-1;
      destination.focus({preventScroll:true});
      destination.scrollIntoView({block:'start',behavior:'auto'});
    }
  }
  function closeVideo(frame){
    const opener=$('[data-video-id]',frame);$('iframe',frame)?.remove();$('[data-close-video]',frame)?.remove();
    frame.removeAttribute('data-video-open');if(opener){opener.hidden=false;opener.focus();}
  }
  function printPrepare() {
    if(printMode)return;printMode=true;printSnapshot=[];
    for(const details of $$('details')){printSnapshot.push([details,details.open]);details.open=true;}
    for(const field of $$('textarea:not([data-backup-text]),input[type=text]')) {
      const p=document.createElement('div');p.className='print-value';p.textContent=field.value||'No response saved yet.';field.insertAdjacentElement('afterend',p);
    }
  }
  function printCleanup() {
    for(const [details,open] of printSnapshot)details.open=open;
    for(const value of $$('.print-value'))value.remove();
    for(const section of $$('.print-skip'))section.classList.remove('print-skip');
    document.body.classList.remove('print-all');$('#all-evidence-print').hidden=true;
    printSnapshot=[];printMode=false;
  }
  function appendText(parent,tag,text) {const node=document.createElement(tag);node.textContent=text;parent.append(node);return node;}
  async function printAllEvidence() {
    const output=$('#all-evidence-print');output.replaceChildren();
    const {records,images,errors}=await gatherEvidence();
    const doc=new DOMParser().parseFromString(evidenceHTML(config,records,images,new Date().toLocaleString('en-AU')),'text/html');
    for(const child of [...doc.body.childNodes])output.append(document.importNode(child,true));
    if(errors.length)appendText(output,'p','Unavailable records or images excluded: '+errors.join(', '));
    await Promise.all($$('img',output).map(img=>img.decode?.().catch(()=>{})||Promise.resolve()));
    output.hidden=false;document.body.classList.add('print-all');window.print();
  }
  for(const host of $$('[data-scope]')) {
    const scope=host.dataset.scope;if(!own(registry,scope))continue;
    let record=null, blocked=false;
    try{record=readRecord(scope);}catch{blocked=true;}
    const state={scope,host,record,data:clone(record?.data||emptyData()),baseRevision:record?.revision||null,dirty:false,blocked,conflict:false,generation:0,timer:null};states.set(scope,state);populate(state);
    status(state,blocked?'Saved evidence could not be read. Download your current work before any reset.':record?'Your saved work has been restored.':'Ready · your work will save in this browser.',blocked);
    host.addEventListener('input',event=>{if(event.target.matches('input:not([type=file]),textarea'))markDirty(state);});
    host.addEventListener('change',event=>{
      if(event.target.matches('[data-image-input]'))addImages(state,[...event.target.files]);
      else if(event.target.matches('input[type=checkbox],input[type=radio]')){markDirty(state);if(event.target.type==='radio')renderFeedback(state,event.target.name);}
    });
    host.addEventListener('click',async event=>{
      const button=event.target.closest('button');if(!button)return;
      if(button.hasAttribute('data-check')) {
        const qid=button.dataset.check;state.data=capture(state);
        if(!state.data.answers[qid]){const out=$(`[data-feedback="${qid}"]`,host);out.textContent='Choose an answer, then check your reasoning.';out.hidden=false;out.classList.add('revisit');return;}
        state.data.checked[qid]=state.data.answers[qid];markDirty(state);renderFeedback(state,qid);
      } else if(button.hasAttribute('data-save-now'))saveState(state);
      else if(button.hasAttribute('data-remove-image')){
        if(await askConfirm('Remove this image and caption from this folio card? Your other images and writing stay as they are.',{title:'Remove this evidence image',confirmText:'Remove image'})){
          state.data=capture(state);state.data.images=state.data.images.filter(i=>i.id!==button.dataset.removeImage);renderImages(state);markDirty(state);imageStatus(state,'The image was removed from this card.');
        }
      }
      else if(button.hasAttribute('data-reset'))resetScope(state);
      else if(button.hasAttribute('data-use-saved'))resolveSaved(state);
      else if(button.hasAttribute('data-keep-local')){if(await askConfirm('Replace the saved version with the work in this tab? Download a backup first if you need both versions.',{title:'Keep this tab’s work',confirmText:'Keep this tab’s work'})){state.dirty=true;saveState(state,true);}}
    });
  }
  document.addEventListener('click',event=>{
    const control=event.target.closest('button,a');if(!control)return;
    if(control.hasAttribute('data-export'))exportBackup();
    else if(control.hasAttribute('data-evidence-export'))exportReadableEvidence();
    else if(control.hasAttribute('data-import')){if(!control.closest('#evidence-transfers'))transferOpener=control;showRestoreOptions();}
    else if(control.hasAttribute('data-choose-backup-file'))$('#backup-file').click();
    else if(control.hasAttribute('data-restore-pasted'))restoreText($('#backup-paste-text').value);
    else if(control.hasAttribute('data-prepared-download')){
      const status=$('.prepared-file-status',control.closest('.prepared-export'));
      if(status)status.textContent='Download requested. Check the actual saved file in Downloads before leaving or changing devices. If it does not appear, use the available alternative below.';
      // Do not preventDefault or trigger another click: this genuine anchor click retains browser activation.
    }
    else if(control.hasAttribute('data-close-transfers')){$('#evidence-transfers').hidden=true;if(transferOpener?.isConnected)transferOpener.focus();}
    else if(control.hasAttribute('data-reset-all'))resetAll();
    else if(control.hasAttribute('data-print-all'))printAllEvidence();
    else if(control.hasAttribute('data-print'))window.print();
    else if(control.hasAttribute('data-print-selected')){
      for(const step of $$('.guided-step'))if(!$('[data-print-step]',step)?.checked)step.classList.add('print-skip');
      if(!$$('.guided-step:not(.print-skip)').length){for(const step of $$('.print-skip'))step.classList.remove('print-skip');message('Select at least one guide step to print.');return;}window.print();
    }
    else if(control.hasAttribute('data-video-id')) {
      const id=control.dataset.videoId;if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
      const iframe=document.createElement('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${id}?rel=0&start=${Number(control.dataset.videoStart)||0}`;iframe.title=control.dataset.videoTitle||'Learning video';iframe.allow='encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.loading='lazy';
      const frame=control.closest('[data-video-frame]'), close=document.createElement('button');close.type='button';close.className='secondary video-close';close.dataset.closeVideo='';close.textContent='Close video';
      control.hidden=true;frame.setAttribute('data-video-open','');frame.append(close,iframe);close.focus();
    } else if(control.hasAttribute('data-close-video'))closeVideo(control.closest('[data-video-frame]'));
    else if(control.hasAttribute('data-open-package'))setTimeout(()=>openPackageFromHash(true),0);
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!confirmationActive){const frame=$('[data-video-open]');if(frame){event.preventDefault();closeVideo(frame);}}});
  $('#backup-file').addEventListener('change',event=>{restoreFile(event.target.files[0]);event.target.value='';});
  // Full-resolution image links remain ordinary anchors. No interception or modal.
  for(const image of $$('.teaching-figure img')) {
    const cap=()=>{if(image.naturalWidth){image.style.width='100%';image.style.maxWidth=`min(100%, ${image.naturalWidth*1.5}px)`;}};
    image.addEventListener('load',cap);if(image.complete)cap();
  }
  window.addEventListener('hashchange',()=>openPackageFromHash(true));
  window.addEventListener('storage',event=>{
    if(event.key===null){for(const state of states.values())conflict(state);message('Browser storage was cleared in another tab. Download a backup of the work visible here.',true);return;}
    if(!event.key.startsWith(PREFIX+'scope:')){if(event.key===PREFIX+'resume')updateProgress();return;}
    const scope=event.key.slice((PREFIX+'scope:').length), state=states.get(scope);
    if(state) {
      let record;try{record=readRecord(scope);}catch{state.blocked=true;status(state,'Another tab wrote unreadable evidence. Your current work is protected.',true);return;}
      if(record?.revision===state.baseRevision)return;
      if(state.dirty||state.conflict){conflict(state);}else{state.record=record;state.baseRevision=record?.revision||null;state.data=clone(record?.data||emptyData());populate(state);status(state,'Updated from another tab.');}
    }
    updateProgress();
  });
  window.addEventListener('beforeunload',event=>{if([...states.values()].some(s=>s.dirty||s.conflict)){event.preventDefault();event.returnValue='';}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const state of states.values())saveState(state);});
  window.addEventListener('beforeprint',printPrepare);window.addEventListener('afterprint',printCleanup);
  updateProgress();openPackageFromHash(true);
  window.TASCourseEvidence=Object.freeze({exportBackup,exportReadableEvidence,progress:()=>Object.fromEntries(Object.keys(registry).filter(scope=>registry[scope].type!=='profile').map(scope=>[scope,progressFor(currentData(scope),registry[scope])]))});
})();
