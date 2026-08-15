
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const canvas = $('#canvas');
const ctx = canvas.getContext('2d');
const input = $('#photoInput');
const W = 2525, H = 1894, VERSION = '10.1.0';

const charFiles = {
  lelepop: [1,2,3,4,5,6].map(n=>`lelepop_0${n}.png`),
  buttscaler: [1,2,3,4,5,6].map(n=>`buttscaler_0${n}.png`),
  zumba: [1,2,3,4,5,6].map(n=>`zumba_0${n}.png`),
  'zumba-camp': [1,2,3,4,5,6].map(n=>`zumba_camp_0${n}.png`)
};
const courseNames = {
  lelepop: 'Lelepop',
  buttscaler: 'Buttscaler',
  zumba: 'ZUMBA',
  'zumba-camp': 'ZUMBA CAMP'
};
const styles = {
  energetic:{label:'活力',p:['#ff2f91','#7658ff'],st:['✦','⚡','♪','✨']},
  cool:{label:'酷飒',p:['#2f63ff','#171723'],st:['⚡','★','✦','♫']},
  cute:{label:'可爱',p:['#ff62ad','#9a73ff'],st:['♡','🐻','🐰','✨']},
  clean:{label:'清爽',p:['#5d7dff','#48cbb3'],st:['✦','·','♡','✨']},
  y2k:{label:'Y2K',p:['#ff3fa4','#6c5cff'],st:['✦','★','♡','♫']}
};

let photo = null;
let course = localStorage.popshotLastCourse || 'zumba';
let beauty = +(localStorage.popshotLastBeauty || 38);
let visualStyle = localStorage.popshotStyle || 'energetic';
let density = 'normal';

let photoZoom = 1, photoDX = 0, photoDY = 0, photoAdjust = false;
let boxesDetected = [];
let charIndex = 0, titleIndex = 0, frameIndex = 1, stickerIndex = 0, layoutIndex = 1;

let composeMode = localStorage.getItem('popshotComposeMode') || 'linked';
let forcedSide = null; // 布局按钮可强制人物在标题左端/右端，null 表示自动选人少的一侧
let selected = null, dragging = false, dragOffset = {x:0,y:0}, locked = null;
let undo = [], redo = [], loaded = {};
let zOrder = ['title','character','sticker'];
let layers = {};
const drawer = $('#drawer'), drawerBody = $('#drawerBody');

function resetLayers(){
  layers = {
    title:{x:88,y:62,scale:1,anchor:'left',visible:true},
    character:{x:W-500,y:H-585,scale:.88,visible:true},
    sticker:{x:W-190,y:H-280,scale:1,visible:false}
  };
}
resetLayers();

function asset(c,i){ return `./public/assets/characters/${c}/${charFiles[c][i]}`; }
function load(path){
  if(loaded[path]) return loaded[path];
  loaded[path] = new Promise((resolve,reject)=>{
    const im = new Image();
    im.onload = ()=>resolve(im);
    im.onerror = reject;
    im.src = path;
  });
  return loaded[path];
}

function holidayStickers(){
  const d=new Date(), m=d.getMonth()+1, day=d.getDate(), y=d.getFullYear();
  if(m===12 && day>=20) return ['🎄','🎅','❄️','🎁'];
  if(m===10 && day>=25) return ['🎃','👻','🦇'];
  if(m===2 && day>=10 && day<=16) return ['💘','💗','🌹'];
  if(y===2026 && m===9 && day>=23 && day<=27) return ['🌕','🐇','🥮'];
  if(y===2027 && m===2 && day>=4 && day<=10) return ['🧧','🏮','🐉'];
  return null;
}
function stickerPool(){ return holidayStickers() || styles[visualStyle].st; }

async function detectPeople(img){
  boxesDetected = [];
  $('#detectStatus').textContent = '正在识别合照主体…';
  try{
    const mod = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm');
    const vision = await mod.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm');
    const fd = await mod.FaceDetector.createFromOptions(vision,{
      baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite'},
      runningMode:'IMAGE', minDetectionConfidence:.32
    });
    const r = fd.detect(img);
    boxesDetected = (r.detections||[]).map(d=>d.boundingBox).map(b=>({x:b.originX,y:b.originY,w:b.width,h:b.height}));
    fd.close();
  }catch(e){
    if('FaceDetector' in window){
      try{
        const f = await new FaceDetector({fastMode:true,maxDetectedFaces:40}).detect(img);
        boxesDetected = f.map(x=>({x:x.boundingBox.x,y:x.boundingBox.y,w:x.boundingBox.width,h:x.boundingBox.height}));
      }catch(_){}
    }
  }
  $('#detectStatus').textContent = boxesDetected.length
    ? `已识别 ${boxesDetected.length} 位主体 · 可手动调整裁剪`
    : '已启用保守智能裁剪 · 可手动调整照片';
  return boxesDetected;
}

function smartCrop(){
  const iw=photo.width, ih=photo.height, tr=W/H;
  let sw,sh,baseSx,baseSy;

  if(boxesDetected.length){
    const avgH=boxesDetected.reduce((s,b)=>s+b.h,0)/boxesDetected.length;
    const fx1=Math.min(...boxesDetected.map(b=>b.x));
    const fx2=Math.max(...boxesDetected.map(b=>b.x+b.w));
    const fy1=Math.min(...boxesDetected.map(b=>b.y));
    const fy2=Math.max(...boxesDetected.map(b=>b.y+b.h));
    const faceCX=(fx1+fx2)/2;

    // 必须保留的区域：所有人头 + 估算的身体（前排下蹲约 5 个脸高以内）。
    const keepL=Math.max(0,fx1-avgH*1.7);
    const keepR=Math.min(iw,fx2+avgH*1.7);
    const keepT=Math.max(0,fy1-avgH*1.15);
    const keepB=Math.min(ih,fy2+avgH*5.4);

    // 先按必留区域算尺寸，再统一按 4:3 修正 —— 宽高始终成比例，不会拉伸。
    sh=keepB-keepT; sw=sh*tr;
    if(sw<keepR-keepL){ sw=keepR-keepL; sh=sw/tr; }
    if(sw>iw){ sw=iw; sh=sw/tr; }
    if(sh>ih){ sh=ih; sw=sh*tr; }

    const z=Math.max(1,photoZoom);
    sw/=z; sh/=z;

    // 水平：人群脸部中线居中。垂直：人脸顶从画面 ~30% 处开始，上方留出标题带。
    baseSx=faceCX-sw/2;
    baseSy=fy1-sh*.30;
    // 若这样会切到脚，则下移裁剪窗，但头顶至少保留画面 14% 的标题空间。
    if(baseSy+sh<keepB) baseSy=Math.min(keepB-sh, fy1-Math.max(avgH*.55, sh*.14));
  }else{
    if(iw/ih>tr){ sh=ih; sw=ih*tr; }
    else{ sw=iw; sh=iw/tr; }
    const z=Math.max(1,photoZoom);
    sw/=z; sh/=z;
    baseSx=(iw-sw)/2;
    baseSy=(ih-sh)/2;
  }

  let sx=baseSx-photoDX*iw/W;
  let sy=baseSy-photoDY*ih/H;
  sx=Math.max(0,Math.min(iw-sw,sx));
  sy=Math.max(0,Math.min(ih-sh,sy));
  return {sx,sy,sw,sh};
}

// 以 174px 基准字号测量当前课程主标题宽度，用于自动排版。
function titleTextWidth(px=174){
  const main = course==='zumba-camp' ? 'ZUMBA' : courseNames[course];
  ctx.save();
  ctx.font=`900 ${px}px Arial Black,Impact,sans-serif`;
  const w=ctx.measureText(main).width;
  ctx.restore();
  return w||600;
}

function faceZones(){
  if(!photo) return [];
  const c=smartCrop(), sx=W/c.sw, sy=H/c.sh;
  return boxesDetected.map(b=>({
    x:(b.x-c.sx)*sx, y:(b.y-c.sy)*sy, w:b.w*sx, h:b.h*sy
  })).filter(b=>b.x+b.w>0&&b.y+b.h>0&&b.x<W&&b.y<H);
}
function overlap(a,b){
  return Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)) *
         Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
}
function crowd(){
  const n=boxesDetected.length;
  if(n>=10) return 'high';
  if(n>=6) return 'mid';
  return 'low';
}

function autoPlace(){
  const zones=faceZones();
  const level=crowd();

  layers.title.visible=true;
  layers.character.visible=true;
  layers.sticker.visible=(density==='rich'); // 默认克制：只有"丰富"档才出贴纸

  if(composeMode==='corner'){
    // ── 角落独立模式：保留旧版的四套角落构图打分 ──
    if(level==='high'){ layers.title.scale=.74; layers.character.scale=.48; }
    else if(level==='mid'){ layers.title.scale=.86; layers.character.scale=.61; }
    else{ layers.title.scale=.98; layers.character.scale=.76; }

    const titleW=980*layers.title.scale;
    const titleH=245*layers.title.scale;
    const charW=420*layers.character.scale;
    const charH=525*layers.character.scale;

    const candidates=[
      {tx:72,ty:58,ta:'left',  cx:W-charW-58,cy:H-charH-46,kind:'cross'},
      {tx:W-72,ty:58,ta:'right',cx:58,cy:H-charH-46,kind:'cross'},
      {tx:72,ty:58,ta:'left',  cx:58,cy:H-charH-46,kind:'same'},
      {tx:W-72,ty:58,ta:'right',cx:W-charW-58,cy:H-charH-46,kind:'same'}
    ];

    let best=candidates[0],bestScore=Infinity;
    const centerPeople={x:W*.22,y:H*.28,w:W*.56,h:H*.70};
    for(const c of candidates){
      const tb={x:c.ta==='left'?c.tx:c.tx-titleW,y:c.ty,w:titleW,h:titleH};
      const cb={x:c.cx,y:c.cy,w:charW,h:charH};
      let score=0;
      for(const z of zones){ score+=1.55*overlap(tb,z); score+=2.25*overlap(cb,z); }
      score+=1.15*overlap(cb,centerPeople);
      if(c.kind==='same') score-=4200;
      if(tb.x<34||tb.x+tb.w>W-34) score+=1e7;
      if(cb.x<34||cb.x+cb.w>W-34||cb.y+cb.h>H-28) score+=1e7;
      if(score<bestScore){bestScore=score;best=c;}
    }
    layers.title.x=best.tx; layers.title.y=best.ty; layers.title.anchor=best.ta;
    layers.character.x=best.cx; layers.character.y=best.cy;
    return;
  }

  // ── 紧密组合模式（默认）：参考小红书团课封面 ──
  // 大标题横贯顶部，Q版人物"骑"在标题一端的字母上，两者构成一个视觉模块。
  const baseW=titleTextWidth(174);
  const frac = level==='high'?0.72 : level==='mid'?0.78 : 0.84;
  const ts=(W*frac)/baseW;
  layers.title.scale=ts;
  layers.title.anchor='center';
  layers.title.x=W/2;
  layers.title.y= level==='high'?38:52;

  let cs = level==='high'?0.52 : level==='mid'?0.64 : 0.78;
  const bandH=174*ts;                 // 标题字高近似
  const halfW=W*frac/2;

  // 人物放在上半区人脸更少的一侧，压在标题端部字母上。
  const leftFaces=zones.filter(z=>z.y<H*.45 && z.x+z.w/2< W/2).length;
  const rightFaces=zones.filter(z=>z.y<H*.45 && z.x+z.w/2>=W/2).length;
  const side = forcedSide || (leftFaces<=rightFaces ? 'left':'right');

  const place=(scale)=>{
    const cw=505*scale, ch=600*scale;
    let cx = side==='left' ? W/2-halfW-cw*.42 : W/2+halfW-cw*.58;
    cx=Math.max(16,Math.min(W-cw-16,cx));
    // 人物竖直中心略高于标题字中心 → 脚落在字母中下部，像"站在标题上"。
    let cy=layers.title.y + bandH*.60 - ch*.52;
    cy=Math.max(12,cy);
    return {cx,cy,cw,ch};
  };

  let p=place(cs);
  // 如果人物会明显压到某张真人脸，先缩小 20% 并上提一点。
  const cb={x:p.cx,y:p.cy,w:p.cw,h:p.ch};
  if(zones.some(z=>overlap(cb,z)>z.w*z.h*.25)){
    cs*=.8;
    p=place(cs);
    p.cy=Math.max(10,p.cy-40);
  }
  layers.character.scale=cs;
  layers.character.x=p.cx;
  layers.character.y=p.cy;
}

function drawPhoto(){
  const c=smartCrop(), b=beauty/100;
  ctx.save();
  ctx.filter=`brightness(${1+b*.10}) contrast(${1+b*.08}) saturate(${1+b*.14})`;
  ctx.drawImage(photo,c.sx,c.sy,c.sw,c.sh,0,0,W,H);
  ctx.restore();
}
function drawFrame(){
  if(!frameIndex) return;
  ctx.save();
  const p=styles[visualStyle].p;
  if(frameIndex===1){ctx.strokeStyle='rgba(255,255,255,.78)';ctx.lineWidth=10}
  else if(frameIndex===2){ctx.strokeStyle=p[0];ctx.globalAlpha=.52;ctx.lineWidth=12}
  else{
    const g=ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);
    ctx.strokeStyle=g;ctx.globalAlpha=.64;ctx.lineWidth=13;
  }
  ctx.strokeRect(30,30,W-60,H-60);
  ctx.restore();
}

function drawTitle(){
  const l=layers.title;
  if(!l.visible) return null;
  const p=styles[visualStyle].p;
  const variant=titleIndex%5;
  let main=courseNames[course], secondary='';
  if(course==='zumba-camp'){ main='ZUMBA'; secondary='CAMP'; }

  // 局部自适应：超出可用宽度只在本次绘制时缩小，不永久改写 l.scale。
  const available = l.anchor==='center' ? W-100
                  : Math.min(W*.60, l.anchor==='left' ? W-l.x-70 : l.x-70);
  let s=l.scale;
  ctx.save();ctx.font=`900 ${(variant===2?186:174)*s}px Arial Black,Impact,sans-serif`;
  const probeWidth=ctx.measureText(main).width+90;ctx.restore();
  if(probeWidth>available) s=Math.max(.3,s*(available/probeWidth));

  const x=l.x,y=l.y;
  ctx.save();
  ctx.textAlign=l.anchor;ctx.textBaseline='top';ctx.lineJoin='round';

  const size=(variant===2?186:174)*s;
  ctx.font=`900 ${size}px Arial Black,Impact,sans-serif`;
  const w=ctx.measureText(main).width+90;
  // 标题左边缘（三种对齐统一换算），后面的装饰线/星标/副标题都基于它。
  const bx = l.anchor==='left'?x : l.anchor==='right'?x-w : x-w/2;

  if(variant===0){
    ctx.strokeStyle='rgba(255,255,255,.97)';ctx.lineWidth=28*s;ctx.strokeText(main,x,y);
    const g=ctx.createLinearGradient(bx,y,bx+w,y);
    g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);ctx.fillStyle=g;ctx.fillText(main,x,y);
  }else if(variant===1){
    ctx.save();ctx.transform(1,-.03,-.08,1,0,0);
    ctx.strokeStyle='rgba(255,255,255,.98)';ctx.lineWidth=25*s;ctx.strokeText(main,x,y);
    ctx.fillStyle=p[0];ctx.fillText(main,x,y);ctx.restore();
    ctx.strokeStyle=p[1];ctx.lineWidth=11*s;ctx.beginPath();
    ctx.moveTo(bx,y+190*s);ctx.lineTo(bx+w*.72,y+190*s);ctx.stroke();
  }else if(variant===2){
    ctx.shadowColor='rgba(0,0,0,.34)';ctx.shadowBlur=25;ctx.fillStyle='white';ctx.fillText(main,x,y);
    ctx.shadowBlur=0;ctx.globalAlpha=.62;ctx.strokeStyle=p[0];ctx.lineWidth=6*s;ctx.strokeText(main,x+7*s,y+7*s);
  }else if(variant===3){
    ctx.strokeStyle=p[0];ctx.lineWidth=38*s;ctx.strokeText(main,x,y);
    ctx.strokeStyle='white';ctx.lineWidth=18*s;ctx.strokeText(main,x,y);
    ctx.fillStyle=p[1];ctx.fillText(main,x,y);
  }else{
    ctx.strokeStyle='white';ctx.lineWidth=30*s;ctx.strokeText(main,x,y);
    ctx.fillStyle=p[0];ctx.fillText(main,x,y);
    ctx.font=`900 ${50*s}px Arial Black,sans-serif`;ctx.fillStyle=p[1];
    ctx.textAlign='left';
    ctx.fillText('✦',bx+w+8,y+35*s);
    ctx.textAlign=l.anchor;
  }

  if(secondary){
    ctx.font=`900 ${52*s}px Arial Black,Impact,sans-serif`;
    ctx.strokeStyle='white';ctx.lineWidth=12*s;ctx.fillStyle=p[1];
    ctx.textAlign='left';
    const sx2=bx+w*.78, sy2=y+150*s;
    ctx.strokeText(secondary,sx2,sy2);ctx.fillText(secondary,sx2,sy2);
  }

  ctx.restore();
  const box={x:bx,y,w:w+(secondary?110*s:0),h:(secondary?230:200)*s};
  l.w=box.w;l.h=box.h; // 记录实测尺寸供点选命中使用
  return box;
}

async function drawCharacter(){
  const l=layers.character;
  if(!l.visible) return null;
  const im=await load(asset(course,charIndex));
  const maxW=505*l.scale,maxH=600*l.scale;
  const sc=Math.min(maxW/im.width,maxH/im.height);
  const w=im.width*sc,h=im.height*sc;
  l.w=w;l.h=h;
  ctx.save();
  ctx.shadowColor='rgba(25,15,40,.20)';ctx.shadowBlur=18;ctx.shadowOffsetY=7;
  ctx.drawImage(im,l.x,l.y,w,h);
  ctx.restore();
  return {x:l.x,y:l.y,w,h};
}

function drawSticker(){
  const l=layers.sticker;
  if(!l.visible) return null;
  const pool=stickerPool(), sticker=pool[stickerIndex%pool.length];
  const font=62*l.scale;
  l.w=font*1.25;l.h=font*1.25;
  ctx.save();ctx.globalAlpha=.88;
  ctx.font=`${font}px Apple Color Emoji,Segoe UI Emoji,sans-serif`;
  ctx.fillText(sticker,l.x,l.y+font);
  // 丰富档可出现一个小一点的同主题点缀，但不额外增加第二个人物。
  if(density==='rich' && crowd()==='low'){
    ctx.globalAlpha=.58;ctx.font=`${font*.48}px Apple Color Emoji,Segoe UI Emoji,sans-serif`;
    ctx.fillText(pool[(stickerIndex+1)%pool.length],l.x-52,l.y+font*1.85);
  }
  ctx.restore();
  return {x:l.x,y:l.y,w:l.w,h:l.h};
}

function selectBox(b,n){
  if(selected!==n||!b) return;
  ctx.save();ctx.strokeStyle='#805cff';ctx.lineWidth=5;ctx.setLineDash([14,10]);
  ctx.strokeRect(b.x-8,b.y-8,b.w+16,b.h+16);ctx.restore();
}

async function render(){
  ctx.clearRect(0,0,W,H);
  if(!photo) return;
  $('#placeholder').classList.add('hidden');
  drawPhoto();
  const wash=ctx.createLinearGradient(0,0,W,H);
  wash.addColorStop(0,'rgba(90,60,170,.022)');
  wash.addColorStop(1,'rgba(255,70,145,.018)');
  ctx.fillStyle=wash;ctx.fillRect(0,0,W,H);
  drawFrame();

  // Mandatory visual layers: title + one Q character must never disappear.
  layers.title.visible=true;
  layers.character.visible=true;
  const boxes={};
  boxes.title=drawTitle();
  boxes.character=await drawCharacter();
  if(layers.sticker.visible) boxes.sticker=drawSticker();
  Object.entries(boxes).forEach(([n,b])=>selectBox(b,n));
  updateCheck();
}

function state(){
  return JSON.stringify({version:VERSION,layers,course,beauty,visualStyle,density,photoZoom,photoDX,photoDY,charIndex,titleIndex,frameIndex,stickerIndex,layoutIndex,zOrder,composeMode});
}
function push(){undo.push(state());if(undo.length>30)undo.shift();redo=[];}
function restore(raw){
  const s=JSON.parse(raw);
  if(s.version!==VERSION){
    resetLayers();selected=null;locked=null;
    localStorage.removeItem('popshotDraftState');
    syncUI();render();return;
  }
  layers=s.layers||{};course=s.course||course;beauty=s.beauty??beauty;visualStyle=s.visualStyle||'energetic';density=s.density||'normal';composeMode=s.composeMode||composeMode;
  photoZoom=s.photoZoom||1;photoDX=s.photoDX||0;photoDY=s.photoDY||0;
  charIndex=s.charIndex||0;titleIndex=s.titleIndex||0;frameIndex=s.frameIndex??1;stickerIndex=s.stickerIndex||0;layoutIndex=s.layoutIndex||1;
  zOrder=(s.zOrder||['title','character','sticker']).filter(x=>['title','character','sticker'].includes(x));
  if(!layers.title||!layers.character||!layers.sticker) resetLayers();
  layers.title.visible=true;
  layers.character.visible=true;
  if(!zOrder.includes('title'))zOrder.unshift('title');
  if(!zOrder.includes('character'))zOrder.push('character');
  syncUI();render();
}

function hist(){try{return JSON.parse(localStorage.popshotHistory||'[]')}catch{return[]}}
function comboKey(){return[course,charIndex,titleIndex,frameIndex,stickerIndex,layoutIndex,visualStyle].join('|')}
function pickCombo(){
  const now=Date.now(), h=hist().filter(x=>x.time>now-14*864e5), wd=new Date().getDay();
  for(let i=0;i<120;i++){
    charIndex=Math.floor(Math.random()*6);
    titleIndex=Math.floor(Math.random()*5);
    frameIndex=Math.floor(Math.random()*4);
    stickerIndex=Math.floor(Math.random()*stickerPool().length);
    layoutIndex=Math.floor(Math.random()*3);
    const k=comboKey();
    if(!h.some(x=>x.key===k) && !h.some(x=>x.course===course&&x.weekday===wd&&x.key===k)){
      h.push({key:k,course,time:now,weekday:wd});
      localStorage.popshotHistory=JSON.stringify(h.slice(-160));
      break;
    }
  }
}

function syncUI(){
  $$('[data-course]').forEach(b=>b.classList.toggle('active',b.dataset.course===course));
  $$('[data-beauty]').forEach(b=>b.classList.toggle('on',+b.dataset.beauty===beauty));
  $$('[data-style]').forEach(b=>b.classList.toggle('on',b.dataset.style===visualStyle));
  $$('[data-density]').forEach(b=>b.classList.toggle('on',b.dataset.density===density));
  $('#beautyText').textContent=beauty===0?'原图':beauty>=60?'活力':'自然';
}

function point(e){
  const r=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e;
  return{x:(p.clientX-r.left)*W/r.width,y:(p.clientY-r.top)*H/r.height};
}
function currentBoxes(){
  const t=layers.title,c=layers.character,s=layers.sticker;
  const tw=t.w||1200, th=t.h||280;
  return {
    title:{x:t.anchor==='left'?t.x:t.anchor==='right'?t.x-tw:t.x-tw/2,y:t.y,w:tw,h:th},
    character:{x:c.x,y:c.y,w:c.w||480,h:c.h||570},
    sticker:{x:s.x,y:s.y,w:s.w||90,h:s.h||90}
  };
}
function hit(p){
  const b=currentBoxes();
  for(const n of [...zOrder].reverse()){
    const q=b[n], l=layers[n];
    if(l.visible&&p.x>=q.x-20&&p.x<=q.x+q.w+20&&p.y>=q.y-20&&p.y<=q.y+q.h+20) return n;
  }
  return null;
}
function down(e){
  if(!photo)return;
  const p=point(e);push();
  if(photoAdjust){
    dragging=true;selected='__photo__';dragOffset={x:p.x-photoDX,y:p.y-photoDY};e.preventDefault();return;
  }
  const n=hit(p);selected=n;
  if(n&&n!==locked){dragging=true;dragOffset={x:p.x-layers[n].x,y:p.y-layers[n].y};e.preventDefault();}
  render();
}
function move(e){
  if(!dragging)return;
  const p=point(e);
  if(selected==='__photo__'){
    photoDX=Math.max(-W*.45,Math.min(W*.45,p.x-dragOffset.x));
    photoDY=Math.max(-H*.45,Math.min(H*.45,p.y-dragOffset.y));
  }else if(selected){
    const l=layers[selected];
    l.x=Math.max(-300,Math.min(W-40,p.x-dragOffset.x));
    l.y=Math.max(-150,Math.min(H-40,p.y-dragOffset.y));
  }
  e.preventDefault();render();
}
function up(){if(dragging)saveDraft();dragging=false;}

canvas.addEventListener('mousedown',down);
canvas.addEventListener('mousemove',move);
window.addEventListener('mouseup',up);
canvas.addEventListener('touchstart',down,{passive:false});
canvas.addEventListener('touchmove',move,{passive:false});
window.addEventListener('touchend',up);

function scale(d){
  if(!selected||selected==='__photo__') return alert('请先点选人物、标题或贴纸');
  push();layers[selected].scale=Math.max(.4,Math.min(2.3,layers[selected].scale+d));render();saveDraft();
}
$('#smallerBtn').onclick=()=>scale(-.1);
$('#largerBtn').onclick=()=>scale(.1);
$('#deleteBtn').onclick=()=>{if(!selected||selected==='__photo__')return;if(selected==='title'||selected==='character')return alert('课程标题和Q版人物为默认主视觉，不能隐藏；可以拖动或缩小。');push();layers[selected].visible=!layers[selected].visible;render();saveDraft()};
$('#frontBtn').onclick=()=>{if(!selected)return;push();zOrder=zOrder.filter(x=>x!==selected).concat(selected);render()};
$('#backBtn').onclick=()=>{if(!selected)return;push();zOrder=[selected,...zOrder.filter(x=>x!==selected)];render()};
$('#resetLayerBtn').onclick=()=>{if(!selected)return;push();const n=selected;const old={...layers};resetLayers();old[n]=layers[n];layers=old;render()};
$('#resetAllBtn').onclick=()=>{push();resetLayers();autoPlace();selected=null;render()};

input.onchange=e=>{
  const f=e.target.files?.[0];if(!f)return;
  const u=URL.createObjectURL(f),im=new Image();
  im.onload=async()=>{
    photo=im;URL.revokeObjectURL(u);photoZoom=1;photoDX=photoDY=0;
    await detectPeople(im);pickCombo();resetLayers();autoPlace();await saveImage(f);render();saveDraft();
  };
  im.src=u;
};

$('#courseGrid').onclick=e=>{
  const b=e.target.closest('[data-course]');if(!b)return;
  push();course=b.dataset.course;localStorage.popshotLastCourse=course;
  pickCombo();resetLayers();autoPlace();layers.title.visible=true;layers.character.visible=true;syncUI();render();saveDraft();
};
$$('[data-beauty]').forEach(b=>b.onclick=()=>{
  push();beauty=+b.dataset.beauty;localStorage.popshotLastBeauty=beauty;syncUI();render();saveDraft();
});
$$('[data-style]').forEach(b=>b.onclick=()=>{
  push();visualStyle=b.dataset.style;localStorage.popshotStyle=visualStyle;stickerIndex=0;syncUI();render();saveDraft();
});
$$('[data-density]').forEach(b=>b.onclick=()=>{
  push();density=b.dataset.density;autoPlace();syncUI();render();saveDraft();
});

$('#generateBtn').onclick=()=>{if(!photo)return alert('请先上传照片');push();pickCombo();resetLayers();autoPlace();layers.title.visible=true;layers.character.visible=true;selected=null;render();saveDraft()};
$('#shuffleBtn').onclick=()=>{if(!photo)return;push();pickCombo();resetLayers();autoPlace();layers.title.visible=true;layers.character.visible=true;selected=null;render();saveDraft()};

function showCharacterPicker(){
  $('#drawerTitle').textContent='选择人物';
  drawerBody.innerHTML='<div class="asset-picker" id="characterPicker"></div>';
  const wrap=$('#characterPicker');
  charFiles[course].forEach((f,i)=>{
    const b=document.createElement('button');
    b.className='asset-option'+(i===charIndex?' on':'');
    b.innerHTML=`<img src="${asset(course,i)}" alt="">`;
    b.onclick=()=>{push();charIndex=i;drawer.classList.remove('show');render();saveDraft()};
    wrap.appendChild(b);
  });
  drawer.classList.add('show');
}
function showTitlePicker(){
  $('#drawerTitle').textContent='选择标题样式';
  drawerBody.innerHTML='<div class="asset-picker" id="titlePicker"></div>';
  const wrap=$('#titlePicker');
  ['渐变粗体','斜切刷线','白字海报','双描边','贴纸感'].forEach((name,i)=>{
    const b=document.createElement('button');
    b.className='asset-option title-option'+(i===titleIndex?' on':'');
    b.textContent=name;
    b.onclick=()=>{push();titleIndex=i;drawer.classList.remove('show');render();saveDraft()};
    wrap.appendChild(b);
  });
  drawer.classList.add('show');
}
function showStickerPicker(){
  $('#drawerTitle').textContent='选择贴纸';
  drawerBody.innerHTML='<div class="asset-picker" id="stickerPicker"></div>';
  const wrap=$('#stickerPicker'), pool=stickerPool();
  pool.forEach((s,i)=>{
    const b=document.createElement('button');
    b.className='asset-option sticker-option'+(i===stickerIndex?' on':'');
    b.textContent=s;
    b.onclick=()=>{push();stickerIndex=i;layers.sticker.visible=true;drawer.classList.remove('show');render();saveDraft()};
    wrap.appendChild(b);
  });
  drawer.classList.add('show');
}
$('#changeCharacterBtn').onclick=showCharacterPicker;
$('#changeTagBtn').onclick=showTitlePicker;
$('#changeStickerBtn').onclick=showStickerPicker;
$('#changeFrameBtn').onclick=()=>{push();frameIndex=(frameIndex+1)%4;render()};
$('#layoutBtn').onclick=()=>{
  push();layoutIndex=(layoutIndex+1)%3;
  forcedSide = layoutIndex===0?'left' : layoutIndex===2?'right' : null;
  resetLayers();autoPlace();
  render();
};

$$('[data-candidate]').forEach(b=>b.onclick=()=>{
  push();const n=+b.dataset.candidate;
  density=n===0?'simple':n===2?'rich':'normal';layoutIndex=n;resetLayers();autoPlace();
  $$('[data-candidate]').forEach(x=>x.classList.toggle('active',x===b));
  syncUI();render();
});
$('#undoBtn').onclick=()=>{if(!undo.length)return;redo.push(state());restore(undo.pop())};
$('#redoBtn').onclick=()=>{if(!redo.length)return;undo.push(state());restore(redo.pop())};
$('#lockBtn').onclick=()=>{
  if(!selected||selected==='__photo__')return alert('请先点选一个元素');
  locked=locked===selected?null:selected;
  $('#lockBtn').textContent=locked?'🔒 已锁定':'🔓 锁定当前';
};
$('#favBtn').onclick=()=>{
  const f=JSON.parse(localStorage.popshotFavorites||'[]'),k=comboKey();
  if(!f.includes(k))f.push(k);
  localStorage.popshotFavorites=JSON.stringify(f.slice(-50));
  $('#favBtn').textContent='♥ 已收藏';
};

$('#drawerClose').onclick=()=>drawer.classList.remove('show');
$('#beautyBtn').onclick=()=>{
  $('#drawerTitle').textContent='美化调整';
  drawerBody.innerHTML=`<div class="range-row"><span>美化强度</span><input id="beautyRange" type="range" min="0" max="100" value="${beauty}"><b>${beauty}</b></div><div class="adjust-tip">仅做基础提亮、对比度与色彩优化，不改变脸型和五官。</div>`;
  drawer.classList.add('show');
  $('#beautyRange').oninput=e=>{beauty=+e.target.value;e.target.nextElementSibling.textContent=beauty;render()};
};
$('#adjustPhotoBtn').onclick=()=>{
  photoAdjust=!photoAdjust;selected=null;$('.canvas-stage').classList.toggle('adjusting',photoAdjust);
  $('#drawerTitle').textContent='调整照片';
  drawerBody.innerHTML=`<div class="range-row"><span>照片缩放</span><input id="zoomRange" type="range" min="100" max="190" value="${Math.round(photoZoom*100)}"><b>${Math.round(photoZoom*100)}%</b></div><div class="adjust-tip">${photoAdjust?'调整模式已开启：直接拖动画面中的照片即可移动位置。':'点击“调整照片”再次开启拖动。'} 自动裁剪只是默认建议，最终位置完全可以人工决定。</div><button id="cropReset" class="ghost" style="margin-top:10px">恢复智能裁剪</button>`;
  drawer.classList.add('show');
  $('#zoomRange').oninput=e=>{photoZoom=+e.target.value/100;e.target.nextElementSibling.textContent=e.target.value+'%';render();saveDraft()};
  $('#cropReset').onclick=()=>{photoZoom=1;photoDX=photoDY=0;render();saveDraft()};
};

function updateCheck(){
  if(!photo)return;
  const h=holidayStickers();
  $('#exportCheck').textContent=`✓ 2525×1894 · ${boxesDetected.length?'主体识别 '+boxesDetected.length+' 人':'保守智能裁剪'} · ${h?'节日素材已开启':'通用素材模式'}`;
  $('#exportCheck').classList.add('ok');
}
$('#exportBtn').onclick=async()=>{
  if(!photo)return alert('请先上传照片');
  selected=null;photoAdjust=false;$('.canvas-stage').classList.remove('adjusting');
  await render();
  const a=document.createElement('a');
  a.download=`PopShot-${course}-${Date.now()}.jpg`;
  a.href=canvas.toDataURL('image/jpeg',.96);
  a.click();
};

function saveDraft(){if(photo)localStorage.popshotDraftState=state()}
function openDB(){
  return new Promise((resolve,reject)=>{
    const q=indexedDB.open('PopShotDB',1);
    q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('draft'))q.result.createObjectStore('draft')};
    q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);
  });
}
async function saveImage(file){
  try{const db=await openDB(),tx=db.transaction('draft','readwrite');tx.objectStore('draft').put(file,'photo')}catch{}
}
async function loadImage(){
  try{
    const db=await openDB();
    return await new Promise(resolve=>{
      const q=db.transaction('draft').objectStore('draft').get('photo');
      q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>resolve(null);
    });
  }catch{return null}
}
async function clearDraft(){
  try{const db=await openDB();db.transaction('draft','readwrite').objectStore('draft').delete('photo')}catch{}
  localStorage.removeItem('popshotDraftState');
}
async function resume(){
  const raw=localStorage.popshotDraftState,blob=await loadImage();
  if(!raw||!blob)return;
  try{
    const s=JSON.parse(raw);
    if(s.version!==VERSION){await clearDraft();return;}
  }catch(e){await clearDraft();return;}
  $('#resumeModal').classList.remove('hidden');
  $('#continueResume').onclick=()=>{
    const u=URL.createObjectURL(blob),im=new Image();
    im.onload=async()=>{
      photo=im;URL.revokeObjectURL(u);await detectPeople(im);restore(raw);$('#resumeModal').classList.add('hidden');
    };
    im.src=u;
  };
  $('#discardResume').onclick=async()=>{$('#resumeModal').classList.add('hidden');await clearDraft()};
}

$('#updateBtn').onclick=()=>$('#updateTip').classList.remove('hidden');
$('#closeUpdateTip').onclick=()=>$('#updateTip').classList.add('hidden');
$('#settingsBtn').onclick=()=>alert('PopShot v9 · 照片仅在本机浏览器处理');
if('serviceWorker'in navigator){navigator.serviceWorker.register('./service-worker.js?v=10.1.0').then(r=>r.update()).catch(()=>{});} window.addEventListener('load',()=>{const v=document.getElementById('versionBadge');if(v)v.textContent='v'+VERSION;});

$$('[data-compose]').forEach(b=>b.onclick=()=>{
  push();
  composeMode=b.dataset.compose;
  localStorage.setItem('popshotComposeMode',composeMode);
  $$('[data-compose]').forEach(x=>x.classList.toggle('on',x===b));
  resetLayers();autoPlace();render();saveDraft();
});
window.addEventListener('load',()=>{
  $$('[data-compose]').forEach(x=>x.classList.toggle('on',x.dataset.compose===composeMode));
  const vb=$('#versionBadge'); if(vb) vb.textContent='v10.1';
});

syncUI();
resume();
