
const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
const input=document.getElementById('photoInput'),placeholder=document.getElementById('placeholder');
const W=2525,H=1894,VERSION='7.0.0';

let photo=null,course=localStorage.getItem('popshotLastCourse')||'zumba',beauty=+(localStorage.getItem('popshotLastBeauty')||38),charIndex=0,titleIndex=0,frameIndex=1,stickerIndex=0,layoutIndex=0;
let selectedLayer=null, dragging=false, dragOffset={x:0,y:0};

const charFiles={
  lelepop:['lelepop_01.png','lelepop_02.png','lelepop_03.png','lelepop_04.png','lelepop_05.png','lelepop_06.png'],
  buttscaler:['buttscaler_01.png','buttscaler_02.png','buttscaler_03.png','buttscaler_04.png','buttscaler_05.png','buttscaler_06.png'],
  zumba:['zumba_01.png','zumba_02.png','zumba_03.png','zumba_04.png','zumba_05.png','zumba_06.png'],
  'zumba-camp':['zumba_camp_01.png','zumba_camp_02.png','zumba_camp_03.png','zumba_camp_04.png','zumba_camp_05.png','zumba_camp_06.png']
};
const titleSets={
  lelepop:['LELEPOP','Lelepop','LELE POP','LELEPOP DANCE','LELEPOP ✦'],
  buttscaler:['BUTTSCALER','Buttscaler','GLUTE & LEG','BUTTSCALER FITNESS','BUTTSCALER ✦'],
  zumba:['ZUMBA','ZUMBA DANCE','ZUMBA!','ZUMBA ✦','ZUMBA / DANCE'],
  'zumba-camp':['ZUMBA CAMP','ZUMBA CLASS','ZUMBA BREAKDOWN','ZUMBA PRACTICE','ZUMBA SESSION']
};
const palettes={lelepop:['#7357ff','#ff4e9b'],buttscaler:['#ff7a24','#191919'],zumba:['#ff2d8f','#6557ff'],'zumba-camp':['#447cff','#22bda6']};
const genericStickers=['✦','♡','★','♪','⚡','🐻','🐰','✨','♫'];
const loaded={};

let layers={};
function resetLayers(){
  const side = layoutIndex===1 ? 'right' : 'left';
  layers={
    title:{x:side==='left'?90:W-90,y:72,scale:1,anchor:side==='left'?'left':'right',visible:true},
    character:{x:layoutIndex===1?65:W-500,y:H-620,scale:1,visible:true},
    logo:{x:layoutIndex===1?70:W-540,y:H-190,scale:1.18,visible:true},
    sticker:{x:W-120,y:95,scale:1,visible:true}
  };
}
resetLayers();

function assetPath(c,i){return `./public/assets/characters/${c}/${charFiles[c][i]}`}
function loadAsset(path){
  if(loaded[path])return loaded[path];
  loaded[path]=new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=path});
  return loaded[path];
}
function holiday(){
  const d=new Date(),m=d.getMonth()+1,day=d.getDate();
  if(m===12&&day>=20)return ['🎄','🎅','❄️','🎁'];
  if(m===10&&day>=25)return ['🎃','👻','🦇','🕸️'];
  if(m===2&&day>=10&&day<=16)return ['💘','💗','💝','🌹'];
  if(d.getFullYear()===2026&&m===9&&day>=23&&day<=27)return ['🌕','🐇','🥮','✨'];
  if(d.getFullYear()===2027&&m===2&&day>=4&&day<=10)return ['🧧','🏮','✨','🐉'];
  return null;
}
function stickers(){return holiday()||genericStickers}


let detectedFaces=[];
async function detectFaces(img){
  detectedFaces=[];
  if(!('FaceDetector' in window)) return detectedFaces;
  try{
    const fd=new FaceDetector({fastMode:true,maxDetectedFaces:40});
    const faces=await fd.detect(img);
    detectedFaces=faces.map(f=>f.boundingBox).filter(Boolean);
  }catch(e){detectedFaces=[]}
  return detectedFaces;
}
function unionFaces(faces){
  if(!faces.length)return null;
  let x1=Infinity,y1=Infinity,x2=-Infinity,y2=-Infinity;
  for(const f of faces){x1=Math.min(x1,f.x);y1=Math.min(y1,f.y);x2=Math.max(x2,f.x+f.width);y2=Math.max(y2,f.y+f.height)}
  return {x:x1,y:y1,w:x2-x1,h:y2-y1};
}
function faceSafeZones(){
  if(!photo||!detectedFaces.length)return [];
  const c=getSmartCrop(photo), sx=W/c.sw, sy=H/c.sh;
  return detectedFaces.map(f=>({
    x:(f.x-c.sx)*sx, y:(f.y-c.sy)*sy, w:f.width*sx, h:f.height*sy
  })).filter(b=>b.x+b.w>0&&b.y+b.h>0&&b.x<W&&b.y<H);
}
function overlapArea(a,b){
  const x=Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x));
  const y=Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  return x*y;
}
function faceOverlapScore(box){
  return faceSafeZones().reduce((s,f)=>s+overlapArea(box,{x:f.x-45,y:f.y-55,w:f.w+90,h:f.h+110}),0);
}
function autoPlaceLayers(){
  // Choose among safe corner compositions and keep title/character/logo away from detected faces.
  const candidates=[
    {title:{x:90,y:72,anchor:'left'},char:{x:W-530,y:H-650},logo:{x:W-540,y:H-195}},
    {title:{x:W-90,y:72,anchor:'right'},char:{x:65,y:H-650},logo:{x:70,y:H-195}},
    {title:{x:85,y:H-420,anchor:'left'},char:{x:W-520,y:80},logo:{x:W-535,y:500}},
    {title:{x:W-85,y:H-420,anchor:'right'},char:{x:65,y:80},logo:{x:70,y:500}}
  ];
  let best=candidates[0],bestScore=Infinity;
  for(const c of candidates){
    const tbox={x:c.title.anchor==='left'?c.title.x:c.title.x-1050,y:c.title.y,w:1050,h:260};
    const cbox={x:c.char.x,y:c.char.y,w:500,h:620};
    const lbox={x:c.logo.x,y:c.logo.y,w:500,h:130};
    const score=faceOverlapScore(tbox)*1.0+faceOverlapScore(cbox)*1.35+faceOverlapScore(lbox)*1.2;
    if(score<bestScore){bestScore=score;best=c}
  }
  layers.title.x=best.title.x;layers.title.y=best.title.y;layers.title.anchor=best.title.anchor;
  layers.character.x=best.char.x;layers.character.y=best.char.y;
  layers.logo.x=best.logo.x;layers.logo.y=best.logo.y;
  // If face density is high, reduce visual density automatically.
  const faceCount=detectedFaces.length;
  if(faceCount>=12){layers.character.scale=.76;layers.logo.scale=1.06;layers.sticker.scale=.01}
  else if(faceCount>=7){layers.character.scale=.88;layers.logo.scale=1.12;layers.sticker.scale=.68}
  else{layers.character.scale=1;layers.logo.scale=1.18}
}

function getSmartCrop(img){
  const iw=img.width,ih=img.height,tr=W/H,ir=iw/ih;
  let sw,sh;if(ir>tr){sh=ih;sw=ih*tr}else{sw=iw;sh=iw/tr}

  const group=unionFaces(detectedFaces);
  let cx=iw/2,cy=ih/2;
  if(group){
    // Center around all detected faces with generous padding so edge people survive.
    cx=group.x+group.w/2;
    cy=group.y+group.h/2 + group.h*.22;
  }
  let sx=Math.max(0,Math.min(iw-sw,cx-sw/2));
  let sy=Math.max(0,Math.min(ih-sh,cy-sh*.48));

  // Never crop more aggressively than required by target aspect ratio.
  // This preserves the largest possible group area and mainly removes surplus blank space.
  return {sx,sy,sw,sh};
}
function drawCover(img){const c=getSmartCrop(img);ctx.drawImage(img,c.sx,c.sy,c.sw,c.sh,0,0,W,H)}
function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}

function drawFrame(){
  ctx.save();
  if(frameIndex===1){ctx.strokeStyle='rgba(255,255,255,.82)';ctx.lineWidth=10;ctx.strokeRect(28,28,W-56,H-56)}
  if(frameIndex===2){ctx.strokeStyle='rgba(255,255,255,.68)';ctx.lineWidth=18;ctx.strokeRect(32,32,W-64,H-64)}
  if(frameIndex===3){const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,palettes[course][0]);g.addColorStop(1,palettes[course][1]);ctx.strokeStyle=g;ctx.globalAlpha=.62;ctx.lineWidth=12;ctx.strokeRect(30,30,W-60,H-60)}
  ctx.restore();
}

function titleMetrics(){
  const l=layers.title, title=titleSets[course][titleIndex%5], base=170*l.scale;
  ctx.save();ctx.font=`900 ${base}px Arial Black, Impact, sans-serif`;
  const w=Math.min(1450,ctx.measureText(title).width+80),h=260*l.scale;ctx.restore();
  return {x:l.anchor==='left'?l.x:l.x-w,y:l.y,w,h};
}
function drawTitle(){
  const l=layers.title,p=palettes[course],title=titleSets[course][titleIndex%5];
  const size=170*l.scale,x=l.x,y=l.y;
  ctx.save();ctx.textAlign=l.anchor==='left'?'left':'right';ctx.textBaseline='top';ctx.lineJoin='round';
  ctx.font=`900 ${size}px Arial Black, Impact, sans-serif`;
  ctx.strokeStyle='rgba(255,255,255,.96)';ctx.lineWidth=27*l.scale;ctx.strokeText(title,x,y);
  const g=ctx.createLinearGradient(Math.max(0,x-900),0,Math.min(W,x+900),0);g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);ctx.fillStyle=g;ctx.fillText(title,x,y);
  ctx.font=`800 ${42*l.scale}px sans-serif`;ctx.fillStyle='white';ctx.shadowColor='rgba(0,0,0,.34)';ctx.shadowBlur=10;
  const sub=course==='buttscaler'?'POWER · GLUTE · LEG':course==='zumba-camp'?'PRACTICE · BREAKDOWN':'MOVE · SMILE · ENJOY';
  ctx.fillText(sub,x,y+178*l.scale);
  ctx.restore();
  return titleMetrics();
}

async function drawCharacter(){
  const l=layers.character,im=await loadAsset(assetPath(course,charIndex));
  const maxW=520*l.scale,maxH=620*l.scale,s=Math.min(maxW/im.width,maxH/im.height);
  const w=im.width*s,h=im.height*s;
  l.w=w;l.h=h;
  ctx.save();ctx.shadowColor='rgba(20,15,35,.2)';ctx.shadowBlur=20;ctx.shadowOffsetY=8;ctx.drawImage(im,l.x,l.y,w,h);ctx.restore();
  return {x:l.x,y:l.y,w,h};
}
function drawLogo(){
  const l=layers.logo,p=palettes[course],w=400*l.scale,h=105*l.scale;
  l.w=w;l.h=h;
  ctx.save();rr(l.x,l.y,w,h,38*l.scale);
  const g=ctx.createLinearGradient(l.x,l.y,l.x+w,l.y+h);g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);ctx.fillStyle=g;ctx.fill();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='white';ctx.font=`900 ${44*l.scale}px Arial Black, sans-serif`;
  const main=course==='zumba-camp'?'ZUMBA':course==='buttscaler'?'BUTTSCALER':course==='lelepop'?'LELEPOP':'ZUMBA';
  ctx.fillText(main,l.x+w/2,l.y+h*.45);
  ctx.font=`700 ${20*l.scale}px sans-serif`;ctx.globalAlpha=.9;
  const sub=course==='zumba-camp'?'BREAKDOWN CLASS':course==='buttscaler'?'GLUTE & LEG':'CLASS';
  ctx.fillText(sub,l.x+w/2,l.y+h*.78);ctx.restore();
  return {x:l.x,y:l.y,w,h};
}
function drawSticker(){
  const l=layers.sticker,s=stickers()[stickerIndex%stickers().length],font=58*l.scale;
  ctx.save();ctx.globalAlpha=.88;ctx.font=`${font}px Apple Color Emoji,Segoe UI Emoji`;ctx.textBaseline='top';ctx.fillText(s,l.x,l.y);ctx.restore();
  l.w=font*1.25;l.h=font*1.25;return {x:l.x,y:l.y,w:l.w,h:l.h};
}
function drawSelection(box,name){
  if(selectedLayer!==name||!box)return;
  ctx.save();ctx.strokeStyle='rgba(128,88,255,.95)';ctx.lineWidth=5;ctx.setLineDash([14,10]);ctx.strokeRect(box.x-8,box.y-8,box.w+16,box.h+16);ctx.restore();
}
async function render(){
  ctx.clearRect(0,0,W,H);if(!photo)return;placeholder.classList.add('hidden');
  ctx.save();const b=beauty/100;ctx.filter=`brightness(${1+b*.10}) contrast(${1+b*.085}) saturate(${1+b*.14})`;drawCover(photo);ctx.restore();
  const wash=ctx.createLinearGradient(0,0,W,H);wash.addColorStop(0,'rgba(75,55,150,.028)');wash.addColorStop(1,'rgba(255,70,145,.025)');ctx.fillStyle=wash;ctx.fillRect(0,0,W,H);
  drawFrame();
  const tb=drawTitle(),cb=await drawCharacter(),lb=drawLogo(),sb=drawSticker();
  drawSelection(tb,'title');drawSelection(cb,'character');drawSelection(lb,'logo');drawSelection(sb,'sticker');
}

function history(){try{return JSON.parse(localStorage.getItem('popshotHistory')||'[]')}catch{return[]}}
function keyFor(){return [course,charIndex,titleIndex,frameIndex,stickerIndex,layoutIndex].join('|')}
function pickCombo(){
  const now=Date.now(),limit=now-14*86400000,hist=history().filter(x=>x.time>=limit),weekday=new Date().getDay();
  for(let tries=0;tries<120;tries++){
    let ch=Math.floor(Math.random()*6),t=Math.floor(Math.random()*5),f=Math.floor(Math.random()*4),s=Math.floor(Math.random()*stickers().length),l=Math.floor(Math.random()*3);
    charIndex=ch;titleIndex=t;frameIndex=f;stickerIndex=s;layoutIndex=l;resetLayers();
    const k=keyFor(),recent=hist.some(x=>x.key===k),same=hist.some(x=>x.course===course&&x.weekday===weekday&&x.key===k);
    if(!recent&&!same){hist.push({key:k,course,time:now,weekday});localStorage.setItem('popshotHistory',JSON.stringify(hist.slice(-120)));return}
  }
}

function canvasPoint(e){
  const r=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e;
  return {x:(p.clientX-r.left)*W/r.width,y:(p.clientY-r.top)*H/r.height};
}
function boxes(){
  const tm=titleMetrics(),c=layers.character,l=layers.logo,s=layers.sticker;
  return {
    title:tm,
    character:{x:c.x,y:c.y,w:c.w||420,h:c.h||560},
    logo:{x:l.x,y:l.y,w:l.w||400,h:l.h||105},
    sticker:{x:s.x,y:s.y,w:s.w||80,h:s.h||80}
  };
}
function hitTest(pt){
  const b=boxes();for(const name of ['sticker','logo','character','title']){
    const q=b[name];if(pt.x>=q.x-20&&pt.x<=q.x+q.w+20&&pt.y>=q.y-20&&pt.y<=q.y+q.h+20)return name;
  }return null;
}
function pointerDown(e){
  if(!photo)return;const p=canvasPoint(e),name=hitTest(p);selectedLayer=name;
  if(name){dragging=true;const l=layers[name];dragOffset={x:p.x-l.x,y:p.y-l.y};e.preventDefault()}
  render();
}
function pointerMove(e){
  if(!dragging||!selectedLayer)return;const p=canvasPoint(e),l=layers[selectedLayer];
  l.x=Math.max(-200,Math.min(W-50,p.x-dragOffset.x));l.y=Math.max(-100,Math.min(H-50,p.y-dragOffset.y));e.preventDefault();render();
}
function pointerUp(){dragging=false}
canvas.addEventListener('mousedown',pointerDown);canvas.addEventListener('mousemove',pointerMove);window.addEventListener('mouseup',pointerUp);
canvas.addEventListener('touchstart',pointerDown,{passive:false});canvas.addEventListener('touchmove',pointerMove,{passive:false});window.addEventListener('touchend',pointerUp);

function scaleSelected(delta){
  if(!selectedLayer)return alert('请先点选画面中的人物、标题、贴纸或Logo');
  const l=layers[selectedLayer];l.scale=Math.max(.45,Math.min(2.2,(l.scale||1)+delta));render();
}
document.getElementById('smallerBtn').onclick=()=>scaleSelected(-.1);
document.getElementById('largerBtn').onclick=()=>scaleSelected(.1);
document.getElementById('resetLayerBtn').onclick=()=>{if(!selectedLayer)return;const name=selectedLayer;const old=layoutIndex;resetLayers();selectedLayer=name;render()};
document.getElementById('resetAllBtn').onclick=()=>{resetLayers();selectedLayer=null;render()};

input.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const u=URL.createObjectURL(f),im=new Image();im.onload=async()=>{photo=im;URL.revokeObjectURL(u);await detectFaces(im);pickCombo();autoPlaceLayers();saveImageToDB(f);render();saveDraft()};im.src=u});
document.getElementById('courseGrid').addEventListener('click',e=>{const b=e.target.closest('button[data-course]');if(!b)return;course=b.dataset.course;localStorage.setItem('popshotLastCourse',course);document.querySelectorAll('[data-course]').forEach(x=>x.classList.toggle('active',x===b));pickCombo();autoPlaceLayers();render();saveDraft()});
document.querySelectorAll('[data-beauty]').forEach(b=>b.onclick=()=>{beauty=+b.dataset.beauty;document.querySelectorAll('[data-beauty]').forEach(x=>x.classList.toggle('on',x===b));document.getElementById('beautyText').textContent=b.textContent;localStorage.setItem('popshotLastBeauty',beauty);render();saveDraft()});
document.getElementById('generateBtn').onclick=()=>{if(!photo)return alert('请先上传照片');pickCombo();autoPlaceLayers();selectedLayer=null;render();saveDraft()};
document.getElementById('shuffleBtn').onclick=()=>{if(!photo)return;pickCombo();autoPlaceLayers();selectedLayer=null;render();saveDraft()};
document.getElementById('changeCharacterBtn').onclick=()=>{charIndex=(charIndex+1)%6;render()};
document.getElementById('changeTagBtn').onclick=()=>{titleIndex=(titleIndex+1)%5;render()};
document.getElementById('changeStickerBtn').onclick=()=>{stickerIndex=(stickerIndex+1)%stickers().length;render()};
document.getElementById('changeFrameBtn').onclick=()=>{frameIndex=(frameIndex+1)%4;render()};
document.getElementById('layoutBtn').onclick=()=>{layoutIndex=(layoutIndex+1)%3;resetLayers();render()};

const drawer=document.getElementById('drawer'),body=document.getElementById('drawerBody');
document.getElementById('beautyBtn').onclick=()=>{document.getElementById('drawerTitle').textContent='美化调整';body.innerHTML=`<div class="range-row"><span>美化强度</span><input id="r1" type="range" min="0" max="100" value="${beauty}"><b>${beauty}</b></div><div style="color:#999;font-size:12px">只做基础提亮、对比度和色彩优化，不改变脸型与五官。</div>`;drawer.classList.add('show');document.getElementById('r1').oninput=e=>{beauty=+e.target.value;e.target.nextElementSibling.textContent=beauty;render()}};
document.getElementById('drawerClose').onclick=()=>drawer.classList.remove('show');
document.getElementById('exportBtn').onclick=()=>{if(!photo)return alert('请先上传照片');selectedLayer=null;render().then(()=>{const a=document.createElement('a');a.download=`PopShot-${course}-${Date.now()}.jpg`;a.href=canvas.toDataURL('image/jpeg',.96);a.click()})};


// v6 usability layer
let density='normal', undoStack=[], redoStack=[], lockedLayer=null;
function snapshot(){return JSON.stringify({layers,course,beauty,charIndex,titleIndex,frameIndex,stickerIndex,layoutIndex,density})}
function pushUndo(){undoStack.push(snapshot());if(undoStack.length>30)undoStack.shift();redoStack=[]}
function restoreState(raw){if(!raw)return;const s=JSON.parse(raw);Object.assign(window,s);layers=s.layers;course=s.course;beauty=s.beauty;charIndex=s.charIndex;titleIndex=s.titleIndex;frameIndex=s.frameIndex;stickerIndex=s.stickerIndex;layoutIndex=s.layoutIndex;density=s.density||'normal';render();saveDraft()}
function saveDraft(){if(!photo)return;localStorage.setItem('popshotDraftState',snapshot())}
function saveFavorite(){const k=keyFor(),f=JSON.parse(localStorage.getItem('popshotFavorites')||'[]');if(!f.includes(k))f.push(k);localStorage.setItem('popshotFavorites',JSON.stringify(f.slice(-50)));}

document.querySelectorAll('[data-density]').forEach(b=>b.onclick=()=>{pushUndo();density=b.dataset.density;document.querySelectorAll('[data-density]').forEach(x=>x.classList.toggle('on',x===b));if(density==='simple'){layers.sticker.scale=.01;layers.logo.scale=1.08}else if(density==='rich'){layers.sticker.scale=1.25;layers.logo.scale=1.22}else{layers.sticker.scale=1;layers.logo.scale=1.18}render();saveDraft()});
document.getElementById('undoBtn').onclick=()=>{if(!undoStack.length)return;redoStack.push(snapshot());restoreState(undoStack.pop())};
document.getElementById('redoBtn').onclick=()=>{if(!redoStack.length)return;undoStack.push(snapshot());restoreState(redoStack.pop())};
document.getElementById('lockBtn').onclick=()=>{if(!selectedLayer)return alert('请先点选一个元素');lockedLayer=lockedLayer===selectedLayer?null:selectedLayer;document.getElementById('lockBtn').textContent=lockedLayer?'🔒 已锁定 '+selectedLayer:'🔓 锁定当前'};
document.getElementById('favBtn').onclick=()=>{saveFavorite();document.getElementById('favBtn').textContent='♥ 已收藏'};
document.querySelectorAll('[data-candidate]').forEach(b=>b.onclick=()=>{pushUndo();const n=+b.dataset.candidate;layoutIndex=n;charIndex=(charIndex+n+1)%6;titleIndex=(titleIndex+n)%5;frameIndex=n===0?1:n===1?3:2;stickerIndex=(stickerIndex+n+1)%stickers().length;resetLayers();if(n===0){layers.logo.scale=1.08;layers.sticker.scale=.7}else if(n===2){layers.logo.scale=1.22;layers.sticker.scale=1.15}else{layers.logo.scale=1.18}document.querySelectorAll('[data-candidate]').forEach(x=>x.classList.toggle('active',x===b));render();saveDraft()});

// prevent dragging a locked layer and autosave after edits
const _pointerDown=pointerDown;
pointerDown=function(e){const p=canvasPoint(e),name=hitTest(p);if(name&&name===lockedLayer){selectedLayer=name;render();return}pushUndo();_pointerDown(e)}
const _pointerUp=pointerUp;
pointerUp=function(){_pointerUp();saveDraft()}


// Persist the current uploaded photo locally so accidental refresh/close can be resumed.
function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open('PopShotDB',1);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('draft'))db.createObjectStore('draft')};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
}
async function saveImageToDB(file){
  try{const db=await openDB();const tx=db.transaction('draft','readwrite');tx.objectStore('draft').put(file,'photo')}catch(e){}
}
async function loadImageFromDB(){
  try{
    const db=await openDB();
    return await new Promise((resolve)=>{const tx=db.transaction('draft','readonly');const req=tx.objectStore('draft').get('photo');req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null)})
  }catch(e){return null}
}
async function clearDraftDB(){
  try{const db=await openDB();const tx=db.transaction('draft','readwrite');tx.objectStore('draft').delete('photo')}catch(e){}
  localStorage.removeItem('popshotDraftState');
}
async function maybeOfferResume(){
  const raw=localStorage.getItem('popshotDraftState');
  const blob=await loadImageFromDB();
  if(!raw||!blob)return;
  const modal=document.getElementById('resumeModal');modal.classList.remove('hidden');
  document.getElementById('continueResume').onclick=async()=>{
    modal.classList.add('hidden');
    const url=URL.createObjectURL(blob),im=new Image();
    im.onload=async()=>{photo=im;URL.revokeObjectURL(url);await detectFaces(im);restoreState(raw);autoPlaceLayers();render()};
    im.src=url;
  };
  document.getElementById('discardResume').onclick=async()=>{modal.classList.add('hidden');await clearDraftDB()};
}
window.addEventListener('load',()=>{maybeOfferResume()});

// Restore remembered course button + beauty UI
window.addEventListener('load',()=>{
  document.querySelectorAll('[data-course]').forEach(x=>x.classList.toggle('active',x.dataset.course===course));
  let nearest=[0,38,65].reduce((a,b)=>Math.abs(b-beauty)<Math.abs(a-beauty)?b:a,38);
  document.querySelectorAll('[data-beauty]').forEach(x=>x.classList.toggle('on',+x.dataset.beauty===nearest));
});

const old=localStorage.getItem('popshotAssetVersion');if(old&&old!==VERSION)document.getElementById('updateTip').classList.remove('hidden');localStorage.setItem('popshotAssetVersion',VERSION);
document.getElementById('closeUpdateTip').onclick=()=>document.getElementById('updateTip').classList.add('hidden');
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
