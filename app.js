
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const canvas = $('#canvas');
const ctx = canvas.getContext('2d');
const input = $('#photoInput');
const W = 2525, H = 1894, VERSION = '13.1.0';

const charFiles = {
  lelepop: Array.from({length:10},(_,i)=>`lelepop_${String(i+1).padStart(2,'0')}.png`),
  buttscaler: Array.from({length:11},(_,i)=>`buttscaler_${String(i+1).padStart(2,'0')}.png`),
  zumba: Array.from({length:13},(_,i)=>`zumba_${String(i+1).padStart(2,'0')}.png`),
  'zumba-camp': Array.from({length:9},(_,i)=>`zumba_camp_${String(i+1).padStart(2,'0')}.png`)
};
const courseNames = {
  lelepop: 'Lelepop',
  buttscaler: 'Buttscaler',
  zumba: 'ZUMBA',
  'zumba-camp': 'ZUMBA CAMP'
};
const styles = {
  // p=装饰配色  st=贴纸池  g=照片调色滤镜（br亮度/ct对比/sa饱和/hue色相偏移/tint色调纱/glow柔光强度）
  energetic:{label:'活力',p:['#ff2f91','#7658ff','#ffc63d'],st:['✦','⚡','♪','✨','♫','★','➜','●','♡','MOVE','DANCE','WOW'],
    g:{br:1.05,ct:1.05,sa:1.18,hue:0,  tint:'rgba(255,90,150,.11)', glow:1.0}},
  cool:{label:'酷飒',p:['#2f63ff','#171723','#3de0c8'],st:['⚡','★','✦','♫','➜','◆','●','MOVE','BEAT','GO'],
    g:{br:1.0, ct:1.13,sa:.92, hue:-8, tint:'rgba(70,115,255,.15)', glow:.7}},
  cute:{label:'可爱',p:['#ff62ad','#9a73ff','#ffd166'],st:['♡','✨','★','✦','☺','🎀','➜','SMILE','YAY','LOVE'],
    g:{br:1.10,ct:.94, sa:1.06,hue:4,  tint:'rgba(255,150,205,.17)',glow:1.4}},
  clean:{label:'清爽',p:['#5d7dff','#48cbb3','#ffb84d'],st:['✦','·','♡','✨','○','＋','➜','MOVE','TODAY'],
    g:{br:1.09,ct:1.0, sa:.90, hue:-4, tint:'rgba(215,238,255,.15)',glow:.95}},
  y2k:{label:'Y2K',p:['#ff3fa4','#6c5cff','#3ddcff'],st:['✦','★','♡','♫','⚡','◆','➜','Y2K','POP','DANCE'],
    g:{br:1.04,ct:1.15,sa:1.30,hue:-10,tint:'rgba(190,85,255,.13)', glow:1.2}},
  fair:{label:'白皙',p:['#f36fa8','#8fa0ff','#ffd9a0'],st:['✨','♡','✦','·','○','＋','SMILE','DAY'],
    g:{br:1.15,ct:.97, sa:.80, hue:0,  tint:'rgba(255,236,240,.24)',glow:1.5}},
  cream:{label:'奶油',p:['#ff9f68','#f56fa1','#ffe08a'],st:['♡','✨','·','★','○','🎀','SMILE','HAPPY'],
    g:{br:1.11,ct:.95, sa:.96, hue:6,  tint:'rgba(255,226,200,.21)',glow:1.35}},
  film:{label:'胶片',p:['#3f7f6e','#e8563f','#f2c94c'],st:['✦','·','★','♪','REC','●','DATE','FILM','SNAP'],
    g:{br:1.02,ct:1.11,sa:.85, hue:-3, tint:'rgba(125,150,142,.15)',glow:.6}}
};

let photo = null;
let course = localStorage.popshotLastCourse || 'zumba';
let beauty = +(localStorage.popshotLastBeauty || 55);
// 一次性迁移：老用户的默认 38 提升到 55，上来就有美颜打光。
if(!localStorage.popshotBeautyV2){
  if(beauty<55) beauty=55;
  localStorage.popshotLastBeauty=beauty;
  localStorage.popshotBeautyV2='1';
}
let visualStyle = localStorage.popshotStyle || 'energetic';
let density = 'normal';
let graffitiSeed = +(localStorage.popshotGraffitiSeed || 7);

let photoZoom = 1, photoDX = 0, photoDY = 0, photoAdjust = false;
let boxesDetected = [];
let charIndex = 0, titleIndex = 0, frameIndex = 1, stickerIndex = 0, layoutIndex = 1;

let composeMode = localStorage.getItem('popshotComposeMode') || 'linked';
// 一次性迁移：v10.2 之前留下的"角落独立"记忆会让新排版继续散着摆，强制回到紧密组合。
if(!localStorage.popshotComposeModeV2){
  composeMode='linked';
  localStorage.setItem('popshotComposeMode','linked');
  localStorage.popshotComposeModeV2='1';
}
let forcedSide = null; // 布局按钮可强制人物在标题左端/右端，null 表示自动选人少的一侧
let selected = null, dragging = false, dragOffset = {x:0,y:0}, locked = null;
let undo = [], redo = [], loaded = {};
let zOrder = ['title','character','sticker'];
let layers = {};
const drawer = $('#drawer'), drawerBody = $('#drawerBody');
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    r=Math.min(r,w/2,h/2);
    this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);
    this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;
  };
}

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

// ── 本地人脸检测（pico.js）：完全离线，无需访问任何外网，专治 MediaPipe 加载失败 ──
let picoReady=null;
function loadPico(){
  if(picoReady) return picoReady;
  picoReady=(async()=>{
    if(!window.pico){
      await new Promise((res,rej)=>{
        const s=document.createElement('script');
        s.src='./public/vendor/pico.js';s.onload=res;s.onerror=rej;
        document.head.appendChild(s);
      });
    }
    const buf=await (await fetch('./public/vendor/facefinder')).arrayBuffer();
    return pico.unpack_cascade(new Int8Array(buf));
  })();
  return picoReady;
}
async function detectWithPico(img){
  try{
    const classify=await loadPico();
    const maxSide=1600, sc=Math.min(1,maxSide/Math.max(img.width,img.height));
    const w=Math.round(img.width*sc), h=Math.round(img.height*sc);
    const c=document.createElement('canvas');c.width=w;c.height=h;
    const g=c.getContext('2d');
    g.drawImage(img,0,0,w,h);
    const data=g.getImageData(0,0,w,h).data;
    const gray=new Uint8Array(w*h);
    for(let i=0;i<w*h;i++) gray[i]=(2*data[i*4]+7*data[i*4+1]+data[i*4+2])/10;
    let dets=pico.run_cascade(
      {pixels:gray,nrows:h,ncols:w,ldim:w},classify,
      {shiftfactor:.1,
       minsize:Math.max(18,Math.round(Math.min(w,h)*.035)),
       maxsize:Math.round(Math.min(w,h)*.7),
       scalefactor:1.1});
    dets=pico.cluster_detections(dets,.2);
    return dets.filter(d=>d[3]>12)
      .map(d=>({x:(d[1]-d[2]/2)/sc, y:(d[0]-d[2]/2)/sc, w:d[2]/sc, h:d[2]/sc}));
  }catch(e){return[]}
}

async function detectPeople(img){
  boxesDetected = [];
  $('#detectStatus').textContent = '正在识别合照主体…';

  const iou=(a,b)=>{const o=overlap(a,b);return o/(a.w*a.h+b.w*b.h-o||1)};
  const add=bs=>{for(const b of bs){if(b.w>4&&b.h>4&&!boxesDetected.some(e=>iou(e,b)>.35))boxesDetected.push(b)}};
  const withTimeout=(p,ms)=>Promise.race([p,new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);

  // 第一路：MediaPipe（国内网络可能加载不了，限时 4 秒，失败不阻塞）。
  try{
    await withTimeout((async()=>{
      const mod = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm');
      const vision = await mod.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm');
      const fd = await mod.FaceDetector.createFromOptions(vision,{
        baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite'},
        runningMode:'IMAGE', minDetectionConfidence:.25
      });
      const det=(src,ox,oy)=>(fd.detect(src).detections||[])
        .map(d=>d.boundingBox)
        .map(b=>({x:ox+b.originX,y:oy+b.originY,w:b.width,h:b.height}));
      add(det(img,0,0));
      if(boxesDetected.length<8){
        const tw=Math.round(img.width*.55), th=Math.round(img.height*.55);
        const tc=document.createElement('canvas');tc.width=tw;tc.height=th;
        const tg=tc.getContext('2d');
        for(const [ox,oy] of [[0,0],[img.width-tw,0],[0,img.height-th],[img.width-tw,img.height-th]]){
          tg.clearRect(0,0,tw,th);
          tg.drawImage(img,ox,oy,tw,th,0,0,tw,th);
          add(det(tc,ox,oy));
        }
      }
      fd.close();
    })(),4000);
  }catch(e){/* 加载失败或超时，交给本地 pico */}

  // 第二路：本地 pico.js（永远可用，随包部署，无外网依赖）。
  if(boxesDetected.length<3){
    add(await detectWithPico(img));
  }

  // 浏览器原生 FaceDetector 兜底（部分 Chrome 支持）。
  if(!boxesDetected.length && 'FaceDetector' in window){
    try{
      const f = await new FaceDetector({fastMode:true,maxDetectedFaces:40}).detect(img);
      add(f.map(x=>({x:x.boundingBox.x,y:x.boundingBox.y,w:x.boundingBox.width,h:x.boundingBox.height})));
    }catch(_){}
  }

  // 过滤离群误检：明显比中位脸大/小太多的框大概率是海报、倒影或误检。
  if(boxesDetected.length>2){
    const hs=boxesDetected.map(b=>b.h).sort((a,b)=>a-b);
    const med=hs[Math.floor(hs.length/2)];
    boxesDetected=boxesDetected.filter(b=>b.h>med*.35&&b.h<med*3.2);
  }

  $('#detectStatus').textContent = boxesDetected.length
    ? `已识别 ${boxesDetected.length} 位主体 · 可手动调整裁剪`
    : '未识别到人脸，已按下方主体估算裁剪 · 建议手动微调';
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

    // 必须保留的区域：收紧边距，让真人尽量占满画面（参考海报式构图）。
    const keepL=Math.max(0,fx1-avgH*0.95);
    const keepR=Math.min(iw,fx2+avgH*0.95);
    const keepT=Math.max(0,fy1-avgH*0.9);
    const keepB=Math.min(ih,fy2+avgH*4.4);

    // 先按必留区域算尺寸，再统一按 4:3 修正 —— 宽高始终成比例，不会拉伸。
    sh=keepB-keepT; sw=sh*tr;
    if(sw<keepR-keepL){ sw=keepR-keepL; sh=sw/tr; }
    if(sw>iw){ sw=iw; sh=sw/tr; }
    if(sh>ih){ sh=ih; sw=sh*tr; }

    const z=Math.max(.72,photoZoom);
    sw/=z; sh/=z;

    // 水平：人群脸部中线居中。垂直：人脸顶从画面 ~27% 处开始，上方留出标题带。
    baseSx=faceCX-sw/2;
    baseSy=fy1-sh*.26;
    // 若这样会切到脚，则下移裁剪窗，但头顶至少保留画面 13% 的标题空间。
    if(baseSy+sh<keepB) baseSy=Math.min(keepB-sh, fy1-Math.max(avgH*.55, sh*.13));
  }else{
    // 未识别到人脸：合照里人几乎总在中下部（上方是天花板/镜子），
    // 默认放大 1.22 倍并把裁剪窗对准画面 58% 高度的中心。
    if(iw/ih>tr){ sh=ih; sw=ih*tr; }
    else{ sw=iw; sh=iw/tr; }
    const z=Math.max(.72,photoZoom)*1.35;
    sw/=z; sh/=z;
    baseSx=(iw-sw)/2;
    baseSy=ih*.58-sh*.5;
  }

  let sx=baseSx-photoDX*iw/W;
  let sy=baseSy-photoDY*ih/H;
  sx=Math.max(0,Math.min(iw-sw,sx));
  sy=Math.max(0,Math.min(ih-sh,sy));
  return {sx,sy,sw,sh};
}

// ── 花体标题引擎：每个字母独立旋转/起伏/配色，参考手绘海报风 ──
const LETTER_ROT=[-5,4,-3,5,-4,3,-6,4];       // 每个字母的固定旋转角（度）
const LETTER_DY=[0,-.06,.045,-.045,.055,-.05,.035,-.03]; // 每个字母的基线起伏（字号比例）
function measureWord(text,size){
  ctx.save();
  ctx.font=`900 ${size}px Arial Black,Impact,sans-serif`;
  const ws=[...text].map(ch=>ctx.measureText(ch).width);
  ctx.restore();
  const track=size*.045;
  return {ws,track,total:ws.reduce((a,b)=>a+b,0)+track*(text.length-1)};
}
// 以 174px 基准字号测量当前课程主标题宽度（含字距与空格），用于自动排版。
function titleTextWidth(px=174){
  return measureWord(courseNames[course],px).total||600;
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
    // ── 顶部分开模式：人物与 Logo 不重叠，但两者都固定在照片顶部安全区。 ──
    // 仍以真人头顶为硬安全线；空间不足时同时缩小，绝不把装饰压到真人脸上。
    const medFaceH = zones.length ? zones.map(z=>z.h).sort((a,b)=>a-b)[Math.floor(zones.length/2)] : H*.09;
    const minFaceTop = zones.length ? Math.min(...zones.map(z=>z.y)) : H*.30;
    const safeBottom = Math.max(H*.15, minFaceTop - medFaceH*.35);
    layers.title.anchor='left'; layers.title.x=420; layers.title.y=38;
    let ts=level==='high'?.72:level==='mid'?.84:.98;
    const baseW=titleTextWidth(174), maxTitleW=W-520;
    ts=Math.min(ts,(maxTitleW/baseW),(safeBottom-layers.title.y)/(174*1.10));
    layers.title.scale=Math.max(.56,ts);
    let cs=level==='high'?.40:level==='mid'?.50:.60;
    const maxCharH=Math.max(230,safeBottom-24);
    cs=Math.min(cs,maxCharH/600);
    layers.character.scale=Math.max(.34,cs);
    const cw=505*layers.character.scale, ch=600*layers.character.scale;
    layers.character.x=42; layers.character.y=Math.max(14,(safeBottom-ch)/2);
    return;
  }

  // ── 紧密组合模式（默认）：参考小红书团课封面 ──
  // 大标题横贯顶部，Q版人物"骑"在标题一端的字母上，两者构成一个视觉模块。
  // 尺寸受双重约束：① 宽度上限；② 不得越过"人脸安全线"（最高人头再往上留一点余量，
  // 余量同时为漏检的更高个子兜底）。人多头高时标题自动变小，确保不遮人。
  const baseW=titleTextWidth(174);
  const frac = level==='high'?0.76 : level==='mid'?0.82 : 0.86;
  layers.title.anchor='center';
  layers.title.x=W/2;
  layers.title.y= level==='high'?34:44;

  const medFaceH = zones.length
    ? zones.map(z=>z.h).sort((a,b)=>a-b)[Math.floor(zones.length/2)]
    : H*.09;
  const minFaceTop = zones.length ? Math.min(...zones.map(z=>z.y)) : H*.30;
  const safeBottom = Math.max(H*.15, minFaceTop - medFaceH*.35);

  // 字号 = min(按宽度, 按头顶空间)，保底 90px 保证可读。
  const tsByWidth=(W*frac)/baseW;
  const tsByHead=(safeBottom-layers.title.y)/(174*1.08); // 1.08 ≈ 字高含起伏
  let ts=Math.min(tsByWidth*1.10, Math.max(tsByHead, 108/174));
  layers.title.scale=ts;

  let cs = level==='high'?0.55 : level==='mid'?0.68 : 0.82;
  const bandH=174*ts;                 // 标题字高近似
  const realHalf=(baseW*ts)/2; // 实际标题半宽

  // 人物同样受安全线约束：底边不越线。
  const chMax=(safeBottom - layers.title.y - bandH*.60)/.48;
  cs=Math.min(cs, Math.max(chMax/600, .34));

  // 人物放在上半区人脸更少的一侧，半骑在标题端部字母上（重叠约 45%）。
  const leftFaces=zones.filter(z=>z.y<H*.45 && z.x+z.w/2< W/2).length;
  const rightFaces=zones.filter(z=>z.y<H*.45 && z.x+z.w/2>=W/2).length;
  const side = forcedSide || (leftFaces<=rightFaces ? 'left':'right');

  const place=(scale)=>{
    const cw=505*scale, ch=600*scale;
    let cx = side==='left' ? W/2-realHalf-cw*.60 : W/2+realHalf-cw*.20;
    cx=Math.max(16,Math.min(W-cw-16,cx));
    // 人物竖直中心略高于标题字中心 → 脚落在字母中下部，像"站在标题上"。
    let cy=layers.title.y + bandH*.66 - ch*.50;
    cy=Math.max(12,cy);
    return {cx,cy,cw,ch};
  };

  let p=place(cs);
  // 终检：如果人物仍与某张真人脸有可见重叠，逐步缩小并上提，直到不遮脸或到保底尺寸。
  for(let guard=0;guard<4;guard++){
    const cb={x:p.cx,y:p.cy,w:p.cw,h:p.ch};
    const hit=zones.some(z=>overlap(cb,z)>z.w*z.h*.12) || p.cy+p.ch>safeBottom+medFaceH*.25;
    if(!hit||cs<=.36) break;
    cs*=.82;
    p=place(cs);
    p.cy=Math.max(10,p.cy-30);
  }
  layers.character.scale=cs;
  layers.character.x=p.cx;
  layers.character.y=p.cy;
}

function drawPhoto(){
  const c=smartCrop(), b=beauty/100;
  const gr=styles[visualStyle].g;
  ctx.save();
  // 美颜基线 × 风格滤镜：切换风格会真实改变照片的亮度/对比/饱和/色相。
  ctx.filter=`brightness(${((1+b*.21)*gr.br).toFixed(3)}) contrast(${((1+b*.03)*gr.ct).toFixed(3)}) saturate(${((1+b*.11)*gr.sa).toFixed(3)}) hue-rotate(${gr.hue}deg)`;
  ctx.drawImage(photo,c.sx,c.sy,c.sw,c.sh,0,0,W,H);
  ctx.restore();
  // 柔光滤镜：模糊图层以 screen 模式叠回，强度随风格变化（拖动时跳过以保证流畅）。
  if(b>0 && !dragging){
    ctx.save();
    ctx.globalAlpha=Math.min(.5,(.19*b+.07)*gr.glow);
    ctx.globalCompositeOperation='screen';
    ctx.filter='blur(28px) brightness(1.15)';
    ctx.drawImage(photo,c.sx,c.sy,c.sw,c.sh,0,0,W,H);
    ctx.restore();
  }
  // 风格色调纱：每种风格叠一层专属色调，切换风格的观感差异主要来自这里。
  ctx.save();
  ctx.globalCompositeOperation='soft-light';
  ctx.fillStyle=gr.tint;
  ctx.fillRect(0,0,W,H);
  ctx.restore();
  // 柔白提亮：soft-light 白色薄纱，肤色更白净透亮
  if(b>0){
    ctx.save();
    ctx.globalCompositeOperation='soft-light';
    ctx.fillStyle=`rgba(255,250,246,${(.38*b).toFixed(3)})`;
    ctx.fillRect(0,0,W,H);
    ctx.restore();
  }
}
function drawFrame(){
  if(!frameIndex) return;
  ctx.save();const p=styles[visualStyle].p;const v=frameIndex%12;
  const inset= v===5?46:30;
  if(v===1){ctx.strokeStyle='rgba(255,255,255,.86)';ctx.lineWidth=10;ctx.strokeRect(inset,inset,W-inset*2,H-inset*2)}
  else if(v===2){ctx.strokeStyle=p[0];ctx.globalAlpha=.65;ctx.lineWidth=12;ctx.strokeRect(inset,inset,W-inset*2,H-inset*2)}
  else if(v===3){const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,p[0]);g.addColorStop(.5,p[1]);g.addColorStop(1,p[2]);ctx.strokeStyle=g;ctx.lineWidth=15;ctx.strokeRect(inset,inset,W-inset*2,H-inset*2)}
  else if(v===4){ctx.strokeStyle='#fff';ctx.lineWidth=9;ctx.strokeRect(30,30,W-60,H-60);ctx.strokeStyle=p[0];ctx.lineWidth=4;ctx.strokeRect(48,48,W-96,H-96)}
  else if(v===5){ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(0,0,W,48);ctx.fillRect(0,H-48,W,48);ctx.fillRect(0,0,48,H);ctx.fillRect(W-48,0,48,H);ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.strokeRect(52,52,W-104,H-104)}
  else if(v===6){ctx.strokeStyle=p[1];ctx.lineWidth=18;ctx.setLineDash([70,24]);ctx.strokeRect(32,32,W-64,H-64)}
  else if(v===7){ctx.strokeStyle='#fff';ctx.lineWidth=22;ctx.strokeRect(24,24,W-48,H-48);ctx.strokeStyle='#18151f';ctx.lineWidth=5;ctx.strokeRect(40,40,W-80,H-80)}
  else if(v===8){ctx.strokeStyle=p[2];ctx.lineWidth=8;ctx.strokeRect(36,36,W-72,H-72);[['↗',65,95],['✦',W-105,100],['●',75,H-70],['＋',W-110,H-70]].forEach(([t,x,y])=>{ctx.font='700 54px Arial';ctx.fillStyle='#fff';ctx.fillText(t,x,y)})}
  else if(v===9){ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=8;ctx.strokeRect(28,28,W-56,H-56);ctx.globalAlpha=.7;ctx.strokeStyle=p[0];ctx.lineWidth=6;ctx.strokeRect(58,58,W-116,H-116)}
  else if(v===10){ctx.fillStyle='rgba(255,255,255,.92)';ctx.fillRect(0,H-78,W,78);ctx.fillRect(0,0,W,20);ctx.font='700 25px Arial';ctx.fillStyle='#222';ctx.fillText('POPSHOT · MOVE · SMILE · ENJOY',48,H-30)}
  else if(v===11){ctx.strokeStyle=p[0];ctx.lineWidth=20;ctx.globalAlpha=.38;ctx.strokeRect(20,20,W-40,H-40);ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.globalAlpha=.9;ctx.strokeRect(42,42,W-84,H-84)}
  ctx.restore();
}

// 干净的月牙形收锋笔触（两端细中间粗），替代旧版糊成一团的粗黑条。
function brushStroke(x1,y1,x2,y2,width,color,alpha=1){
  ctx.save();
  ctx.globalAlpha=alpha;ctx.fillStyle=color;
  const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;
  const nx=-dy/len,ny=dx/len;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.quadraticCurveTo(x1+dx*.5+nx*width*.55, y1+dy*.5+ny*width*.55, x2,y2);
  ctx.quadraticCurveTo(x1+dx*.5-nx*width*.42, y1+dy*.5-ny*width*.42, x1,y1);
  ctx.closePath();ctx.fill();
  // 收笔处两三个渐小飞点
  for(let i=1;i<=3;i++){
    ctx.beginPath();
    ctx.arc(x2+dx/len*width*(.35*i), y2+ny*width*(i-2)*.18, width*.075*(4-i)/3, 0, 7);
    ctx.fill();
  }
  ctx.restore();
}

const TITLE_STYLE_NAMES=[
  'Pop渐变','白边贴纸','杂志粗体','霓虹夜色','运动斜体','Y2K错位','糖果泡泡','黑白海报',
  '彩虹层次','金属银感','手绘涂鸦','舞台明星','极简高亮','双色描边','速度冲刺','柔光糖果',
  '花漾手写','优雅花体','拉丁花体','潮流签名字','复古衬线','甜酷圆体','街头涂鸦','皇冠签名'
];
function drawTitle(){
  const l=layers.title;if(!l.visible)return null;
  const p=styles[visualStyle].p, variant=titleIndex%TITLE_STYLE_NAMES.length;
  const main=courseNames[course];
  const isScript=[16,17,18,19,23].includes(variant);
  const isSerif=variant===20;
  const family=isScript?`"Brush Script MT","Segoe Script","Snell Roundhand",cursive`:isSerif?`Georgia,"Times New Roman",serif`:`Arial Black,Impact,Arial,sans-serif`;
  const weight=isScript?700:900;
  let size=(isScript?245:235)*l.scale;
  const font=sz=>`${weight} ${sz}px ${family}`;
  ctx.save();ctx.font=font(size);
  const maxW=l.anchor==='center'?W-135:Math.min(W*.88,l.anchor==='left'?W-l.x-55:l.x-55);
  let mw=ctx.measureText(main).width;
  if(mw>maxW){size*=maxW/mw;ctx.font=font(size);mw=ctx.measureText(main).width;}
  size=Math.max(112,Math.min(size,isScript?285:265));ctx.font=font(size);mw=ctx.measureText(main).width;
  const x=l.anchor==='left'?l.x:l.anchor==='right'?l.x-mw:l.x-mw/2;
  const y=l.y,base=y+size*.86;
  const grad=ctx.createLinearGradient(x,0,x+mw,0);grad.addColorStop(0,p[0]);grad.addColorStop(.52,p[1]);grad.addColorStop(1,p[2]);
  ctx.lineJoin='round';ctx.textBaseline='alphabetic';ctx.textAlign='left';
  const fill=(c,dx=0,dy=0)=>{ctx.fillStyle=c;ctx.fillText(main,x+dx,base+dy)};
  const stroke=(c,w,dx=0,dy=0)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.strokeText(main,x+dx,base+dy)};
  const crown=(cx,cy,sc=.17,col=p[2])=>drawDoodle('crown',cx,cy,size*sc,col);
  const sparkle=(cx,cy,sc=.11,col='#fff')=>drawDoodle('sparkle',cx,cy,size*sc,col);
  if(variant===0){stroke('#fff',size*.11);ctx.fillStyle=grad;ctx.fillText(main,x,base);sparkle(x+mw+size*.07,y+size*.62,.10,p[2]);}
  else if(variant===1){stroke('rgba(20,18,28,.20)',size*.17);stroke('#fff',size*.13);fill(p[0]);crown(x+mw*.10,y-size*.01,.16,p[2]);}
  else if(variant===2){ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=size*.07;stroke('#fff',size*.055);fill('#fff');ctx.shadowBlur=0;ctx.fillStyle=p[0];ctx.fillRect(x,base+size*.08,mw*.48,Math.max(7,size*.04));}
  else if(variant===3){ctx.shadowColor=p[0];ctx.shadowBlur=size*.20;stroke(p[1],size*.09);fill('#fff');sparkle(x+mw+size*.05,y+size*.28,.10,p[2]);}
  else if(variant===4){ctx.save();ctx.transform(1,0,-.11,1,0,0);const dx=base*.11;stroke('#fff',size*.11,dx,0);ctx.fillStyle=grad;ctx.fillText(main,x+dx,base);ctx.restore();}
  else if(variant===5){stroke('#fff',size*.105);fill(p[1],size*.05,size*.035);fill(p[0]);sparkle(x-size*.05,y+size*.20,.09,p[2]);}
  else if(variant===6){stroke('#fff',size*.17);stroke(p[1],size*.08);fill(p[2]);crown(x+mw*.86,y+size*.02,.15,p[0]);}
  else if(variant===7){stroke('#fff',size*.085);fill('#18151f');sparkle(x+mw+size*.05,y+size*.60,.09,p[0]);}
  else if(variant===8){stroke('#fff',size*.115);ctx.fillStyle=grad;ctx.fillText(main,x,base);crown(x+mw*.12,y,.15,p[2]);}
  else if(variant===9){const g=ctx.createLinearGradient(0,y,0,base);g.addColorStop(0,'#fff');g.addColorStop(.45,'#d9dce5');g.addColorStop(.58,'#777b89');g.addColorStop(1,'#fafbff');stroke('#fff',size*.09);ctx.fillStyle=g;ctx.fillText(main,x,base);}
  else if(variant===10){stroke('#fff',size*.11);fill(p[0]);brushStroke(x,base+size*.10,x+mw*.68,base+size*.06,size*.036,p[2],.88);sparkle(x+mw+size*.05,y+size*.25,.10,p[1]);}
  else if(variant===11){stroke('#fff',size*.12);stroke(p[2],size*.065);ctx.fillStyle=grad;ctx.fillText(main,x,base);crown(x+mw*.82,y-size*.01,.19,p[2]);sparkle(x-size*.05,y+size*.55,.10,'#fff');}
  else if(variant===12){ctx.shadowColor='rgba(255,255,255,.75)';ctx.shadowBlur=size*.12;stroke(p[0],size*.055);fill('#fff');}
  else if(variant===13){stroke(p[2],size*.15,size*.04,size*.032);stroke('#fff',size*.10);fill(p[0]);}
  else if(variant===14){ctx.save();ctx.transform(1,0,-.17,1,0,0);const dx=base*.17;stroke('#fff',size*.10,dx,0);ctx.fillStyle=grad;ctx.fillText(main,x+dx,base);ctx.restore();ctx.save();ctx.lineCap='round';ctx.strokeStyle=p[1];for(let i=0;i<4;i++){ctx.lineWidth=Math.max(4,size*(.030-i*.004));ctx.beginPath();ctx.moveTo(Math.max(24,x-size*(.44+i*.10)),base-size*(.62-i*.13));ctx.lineTo(Math.max(34,x-size*(.05+i*.02)),base-size*(.62-i*.13));ctx.stroke();}ctx.restore();}
  else if(variant===15){ctx.shadowColor='rgba(255,255,255,.8)';ctx.shadowBlur=size*.17;stroke('#fff',size*.105);ctx.fillStyle=grad;ctx.fillText(main,x,base);}
  else if(variant===16){stroke('#fff',size*.055);fill(p[0]);brushStroke(x-size*.02,base+size*.11,x+mw*.78,base+size*.07,size*.025,p[1],.85);crown(x+mw*.86,y+size*.02,.14,p[2]);}
  else if(variant===17){stroke('rgba(255,255,255,.95)',size*.045);fill(p[0]);ctx.save();ctx.strokeStyle=p[1];ctx.lineWidth=size*.025;ctx.beginPath();ctx.moveTo(x+mw*.05,base+size*.10);ctx.bezierCurveTo(x+mw*.30,base+size*.18,x+mw*.60,base-size*.02,x+mw*.92,base+size*.10);ctx.stroke();ctx.restore();sparkle(x+mw+size*.04,y+size*.22,.09,p[2]);}
  else if(variant===18){stroke('#fff',size*.055);ctx.fillStyle=grad;ctx.fillText(main,x,base);crown(x+mw*.10,y+size*.02,.13,p[2]);sparkle(x+mw*.98,y+size*.55,.09,p[0]);}
  else if(variant===19){stroke('#fff',size*.06);fill('#171723');brushStroke(x+mw*.18,base+size*.10,x+mw*.92,base+size*.035,size*.032,p[0],.95);sparkle(x-size*.03,y+size*.24,.08,p[2]);}
  else if(variant===20){stroke('#fff',size*.075);fill(p[0]);ctx.save();ctx.fillStyle=p[2];ctx.fillRect(x,base+size*.08,mw,Math.max(5,size*.025));ctx.restore();crown(x+mw*.90,y+size*.02,.13,p[1]);}
  else if(variant===21){stroke('#fff',size*.15);stroke(p[1],size*.07);fill(p[0]);sparkle(x+mw+size*.04,y+size*.50,.10,p[2]);}
  else if(variant===22){ctx.save();ctx.transform(1,0,-.08,1,0,0);const dx=base*.08;stroke('#fff',size*.105,dx,0);fill('#171723',dx,0);ctx.restore();brushStroke(x-size*.04,base+size*.08,x+mw*.95,base+size*.03,size*.050,p[0],.92);crown(x+mw*.80,y-size*.01,.14,p[2]);}
  else {stroke('#fff',size*.052);ctx.fillStyle=grad;ctx.fillText(main,x,base);crown(x+mw*.14,y-size*.02,.20,p[2]);sparkle(x+mw+size*.04,y+size*.60,.10,p[1]);brushStroke(x+mw*.16,base+size*.12,x+mw*.90,base+size*.06,size*.025,p[0],.82);}
  ctx.restore();
  const box={x:Math.max(0,x-size*.18),y:Math.max(0,y-size*.16),w:Math.min(W-Math.max(0,x-size*.18),mw+size*.36),h:size*1.30};
  l.w=box.w;l.h=box.h;return box;
}

// 给 Q 版人物加白色"刀版贴纸"描边，和标题贴纸感统一。
const outlineCache={};
function outlinedSprite(im,key){
  if(outlineCache[key]) return outlineCache[key];
  const t=Math.max(6,Math.round(Math.max(im.width,im.height)*.022));
  const sil=document.createElement('canvas');
  sil.width=im.width;sil.height=im.height;
  const gs=sil.getContext('2d');
  gs.drawImage(im,0,0);
  gs.globalCompositeOperation='source-in';
  gs.fillStyle='#fff';gs.fillRect(0,0,sil.width,sil.height);
  const out=document.createElement('canvas');
  out.width=im.width+t*2+6;out.height=im.height+t*2+6;
  const go=out.getContext('2d');
  for(let a=0;a<16;a++){
    const ang=a/16*Math.PI*2;
    go.drawImage(sil,t+3+Math.cos(ang)*t,t+3+Math.sin(ang)*t);
  }
  go.drawImage(im,t+3,t+3);
  outlineCache[key]=out;
  return out;
}

async function drawCharacter(){
  const l=layers.character;
  if(!l.visible) return null;
  const im=await load(asset(course,charIndex));
  const sprite=outlinedSprite(im,`${course}-${charIndex}`);
  const maxW=505*l.scale,maxH=600*l.scale;
  const sc=Math.min(maxW/sprite.width,maxH/sprite.height);
  const w=sprite.width*sc,h=sprite.height*sc;
  l.w=w;l.h=h;
  ctx.save();
  ctx.shadowColor='rgba(25,15,40,.25)';ctx.shadowBlur=22;ctx.shadowOffsetY=9;
  ctx.drawImage(sprite,l.x,l.y,w,h);
  ctx.restore();
  return {x:l.x,y:l.y,w,h};
}

// ── 涂鸦层：四角笔刷泼溅 + 手绘小涂鸦（皇冠/爱心/星星/音符/闪光） ──
function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

function drawSplash(x,y,baseAng,color,size,rnd){
  ctx.save();ctx.translate(x,y);ctx.fillStyle=color;
  for(let i=0;i<7;i++){
    const ang=baseAng+(i/6-.5)*1.55+(rnd()-.5)*.22;
    const len=size*(.55+rnd()*.65), w2=size*(.055+rnd()*.09);
    ctx.save();ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(0,-w2);
    ctx.quadraticCurveTo(len*.5,-w2*.55,len,0);
    ctx.quadraticCurveTo(len*.5,w2*.55,0,w2);
    ctx.closePath();ctx.fill();
    ctx.restore();
  }
  for(let i=0;i<5;i++){
    const a2=baseAng+(rnd()-.5)*1.5, d=size*(.55+rnd()*.85), r=size*(.025+rnd()*.05);
    ctx.beginPath();ctx.arc(Math.cos(a2)*d,Math.sin(a2)*d,r,0,7);ctx.fill();
  }
  ctx.restore();
}

function drawDoodle(type,x,y,s,color){
  ctx.save();
  ctx.translate(x,y);
  ctx.strokeStyle=color;ctx.fillStyle=color;
  ctx.lineWidth=s*.13;ctx.lineCap='round';ctx.lineJoin='round';
  if(type==='crown'){
    ctx.beginPath();
    ctx.moveTo(-s*.5,s*.25);ctx.lineTo(-s*.55,-s*.25);ctx.lineTo(-s*.2,0);
    ctx.lineTo(0,-s*.45);ctx.lineTo(s*.2,0);ctx.lineTo(s*.55,-s*.25);ctx.lineTo(s*.5,s*.25);
    ctx.closePath();ctx.stroke();
  }else if(type==='heart'){
    ctx.beginPath();
    ctx.moveTo(0,s*.42);
    ctx.bezierCurveTo(-s*.75,-s*.12,-s*.32,-s*.62,0,-s*.2);
    ctx.bezierCurveTo(s*.32,-s*.62,s*.75,-s*.12,0,s*.42);
    ctx.stroke();
  }else if(type==='star'){
    ctx.beginPath();
    for(let i=0;i<5;i++){
      const a1=-Math.PI/2+i*2*Math.PI/5, a2=a1+Math.PI/5;
      ctx.lineTo(Math.cos(a1)*s*.5,Math.sin(a1)*s*.5);
      ctx.lineTo(Math.cos(a2)*s*.22,Math.sin(a2)*s*.22);
    }
    ctx.closePath();ctx.fill();
  }else if(type==='note'){
    ctx.beginPath();ctx.ellipse(-s*.18,s*.3,s*.16,s*.115,-.4,0,7);ctx.fill();
    ctx.beginPath();ctx.moveTo(-s*.04,s*.26);ctx.lineTo(-s*.04,-s*.4);
    ctx.quadraticCurveTo(s*.24,-s*.36,s*.3,-s*.12);ctx.stroke();
  }else{ // sparkle
    ctx.beginPath();
    ctx.moveTo(0,-s*.5);ctx.quadraticCurveTo(s*.06,-s*.06,s*.5,0);
    ctx.quadraticCurveTo(s*.06,s*.06,0,s*.5);
    ctx.quadraticCurveTo(-s*.06,s*.06,-s*.5,0);
    ctx.quadraticCurveTo(-s*.06,-s*.06,0,-s*.5);
    ctx.closePath();ctx.fill();
  }
  ctx.restore();
}

function drawGraffiti(){
  if(density==='simple') return;
  const rnd=mulberry32(graffitiSeed);
  const p=styles[visualStyle].p;
  const dark='rgba(24,17,36,.9)';
  const zones=faceZones();

  // 四角泼溅：默认对角两处，"丰富"档四角全开（贴角，几乎不会压到真人）。
  const corners=[
    {x:0,y:0,a:Math.PI*.25},{x:W,y:0,a:Math.PI*.75},
    {x:0,y:H,a:-Math.PI*.25},{x:W,y:H,a:-Math.PI*.75}
  ];
  const idx=density==='rich'?[0,1,2,3]:(rnd()<.5?[0,3]:[1,2]);
  idx.forEach((i,k)=>{
    drawSplash(corners[i].x,corners[i].y,corners[i].a,
      k%2?dark:p[0], W*(.10+rnd()*.035), rnd);
  });

  // 手绘涂鸦：沿边缘候选点摆放，跳过和人脸重叠的位置。
  const types=['crown','heart','star','note','sparkle'];
  const spots=[
    {x:W*.06,y:H*.30},{x:W*.94,y:H*.30},
    {x:W*.05,y:H*.55},{x:W*.95,y:H*.55},
    {x:W*.10,y:H*.87},{x:W*.90,y:H*.87},
    {x:W*.30,y:H*.06},{x:W*.72,y:H*.09},
    {x:W*.50,y:H*.93}
  ];
  const want=density==='rich'?6:3;
  let placed=0, ti=Math.floor(rnd()*types.length);
  for(const sp of spots.sort(()=>rnd()-.5)){
    if(placed>=want) break;
    const sz=W*(.028+rnd()*.02);
    const bb={x:sp.x-sz,y:sp.y-sz,w:sz*2,h:sz*2};
    if(zones.some(z=>overlap(bb,z)>0)) continue;
    ctx.save();
    ctx.globalAlpha=.92;
    ctx.translate(0,0);
    drawDoodle(types[ti%types.length],sp.x,sp.y,sz,
      placed%3===0?'#fff':(placed%3===1?p[2]:p[0]));
    ctx.restore();
    ti++;placed++;
  }
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
  drawGraffiti();

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
  return JSON.stringify({version:VERSION,layers,course,beauty,visualStyle,density,photoZoom,photoDX,photoDY,charIndex,titleIndex,frameIndex,stickerIndex,layoutIndex,zOrder,composeMode,graffitiSeed});
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
  charIndex=s.charIndex||0;titleIndex=s.titleIndex||0;frameIndex=s.frameIndex??1;stickerIndex=s.stickerIndex||0;layoutIndex=s.layoutIndex||1;graffitiSeed=s.graffitiSeed??graffitiSeed;
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
  graffitiSeed=Math.floor(Math.random()*1e6);
  localStorage.popshotGraffitiSeed=graffitiSeed;
  const now=Date.now(), h=hist().filter(x=>x.time>now-14*864e5), wd=new Date().getDay();
  for(let i=0;i<120;i++){
    charIndex=Math.floor(Math.random()*6);
    titleIndex=Math.floor(Math.random()*24);
    frameIndex=Math.floor(Math.random()*12);
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
  syncScaleUI();
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
let pinchStartDist=0,pinchStartZoom=1;
canvas.addEventListener('touchstart',e=>{
  if(photoAdjust&&e.touches.length===2){
    e.preventDefault();pinchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);pinchStartZoom=photoZoom;
  }
},{passive:false});
canvas.addEventListener('touchmove',e=>{
  if(photoAdjust&&e.touches.length===2&&pinchStartDist){
    e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);photoZoom=Math.max(.72,Math.min(2.2,pinchStartZoom*d/pinchStartDist));render();
  }
},{passive:false});
canvas.addEventListener('touchstart',down,{passive:false});
canvas.addEventListener('touchmove',move,{passive:false});
window.addEventListener('touchend',up);

// 选中元素后的大小滑杆：数值为相对基准尺寸的百分比，实时生效。
const scaleRow=$('#scaleRow'), scaleRange=$('#scaleRange'), scaleVal=$('#scaleVal'), scaleName=$('#scaleName');
const layerLabels={title:'标题大小',character:'人物大小',sticker:'贴纸大小'};
function syncScaleUI(){
  if(!selected||selected==='__photo__'||!layers[selected]){scaleRow.style.display='none';return;}
  scaleRow.style.display='grid';
  scaleName.textContent=layerLabels[selected]||'大小';
  const v=Math.round((layers[selected].scale||1)*100);
  scaleRange.value=Math.max(30,Math.min(320,v));
  scaleVal.textContent=v+'%';
}
scaleRange.addEventListener('pointerdown',()=>{if(selected&&selected!=='__photo__')push()});
scaleRange.oninput=e=>{
  if(!selected||selected==='__photo__')return;
  layers[selected].scale=+e.target.value/100;
  scaleVal.textContent=e.target.value+'%';
  render();
};
scaleRange.onchange=()=>saveDraft();
$('#deleteBtn').onclick=()=>{if(!selected||selected==='__photo__')return;if(selected==='title'||selected==='character')return alert('课程标题和Q版人物为默认主视觉，不能隐藏；可以拖动或缩小。');push();layers[selected].visible=!layers[selected].visible;render();saveDraft();syncScaleUI()};
$('#frontBtn').onclick=()=>{if(!selected)return;push();zOrder=zOrder.filter(x=>x!==selected).concat(selected);render()};
$('#backBtn').onclick=()=>{if(!selected)return;push();zOrder=[selected,...zOrder.filter(x=>x!==selected)];render()};
$('#resetLayerBtn').onclick=()=>{if(!selected)return;push();const n=selected;const old={...layers};resetLayers();old[n]=layers[n];layers=old;render();syncScaleUI()};
$('#resetAllBtn').onclick=()=>{push();resetLayers();autoPlace();selected=null;render();syncScaleUI()};

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
  TITLE_STYLE_NAMES.forEach((name,i)=>{
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
$('#changeFrameBtn').onclick=()=>{push();frameIndex=(frameIndex+1)%12;render()};
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

$('#moreBtn').onclick=()=>{const p=$('#advancedPanel');p.classList.toggle('show');$('#moreBtn').classList.toggle('on',p.classList.contains('show'));};
$('#drawerClose').onclick=()=>drawer.classList.remove('show');
$('#beautyBtn').onclick=()=>{
  $('#drawerTitle').textContent='美化调整';
  drawerBody.innerHTML=`<div class="range-row"><span>美化强度</span><input id="beautyRange" type="range" min="0" max="100" value="${beauty}"><b>${beauty}</b></div><div class="adjust-tip">仅做基础提亮、对比度与色彩优化，不改变脸型和五官。</div>`;
  drawer.classList.add('show');
  $('#beautyRange').oninput=e=>{beauty=+e.target.value;e.target.nextElementSibling.textContent=beauty;render()};
};
$('#adjustPhotoBtn').onclick=()=>{
  photoAdjust=true;selected=null;$('.canvas-stage').classList.add('adjusting');
  $('#drawerTitle').textContent='调整原图';
  drawerBody.innerHTML=`<div class="adjust-tip"><b>原图级调整</b> · 成图框固定为 2525×1894。直接拖动原始照片；手机可双指缩放。系统不会真正裁掉原图。</div><div class="range-row"><span>原图缩放</span><input id="zoomRange" type="range" min="72" max="220" value="${Math.round(photoZoom*100)}"><b>${Math.round(photoZoom*100)}%</b></div><div class="crop-actions"><button id="showFull" class="ghost">显示更多原图</button><button id="cropReset" class="ghost">智能构图</button><button id="cropDone" class="primary-mini">完成</button></div>`;
  drawer.classList.add('show');
  $('#zoomRange').oninput=e=>{photoZoom=+e.target.value/100;e.target.nextElementSibling.textContent=e.target.value+'%';render();saveDraft()};
  $('#showFull').onclick=()=>{photoZoom=.78;photoDX=photoDY=0;render();saveDraft()};
  $('#cropReset').onclick=()=>{photoZoom=1;photoDX=photoDY=0;render();saveDraft()};
  $('#cropDone').onclick=()=>{photoAdjust=false;$('.canvas-stage').classList.remove('adjusting');drawer.classList.remove('show');saveDraft()};
};

function updateCheck(){
  if(!photo)return;
  const h=holidayStickers();
  $('#exportCheck').textContent=`✓ 2525×1894 · ${boxesDetected.length?'主体识别 '+boxesDetected.length+' 人':'保守智能裁剪'} · ${h?'节日素材已开启':'通用素材模式'}`;
  $('#exportCheck').classList.add('ok');
}
$('#exportBtn').onclick=async()=>{
  if(!photo)return alert('请先上传照片');
  const btn=$('#exportBtn'),old=btn.innerHTML;
  try{
    btn.disabled=true;btn.innerHTML='正在保存…';selected=null;photoAdjust=false;$('.canvas-stage').classList.remove('adjusting');await render();
    const blob=await new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('export')),'image/jpeg',.96));
    const filename=`PopShot-${course}-${Date.now()}.jpg`,file=new File([blob],filename,{type:'image/jpeg'});
    const ua=navigator.userAgent||'', isiOS=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1), isAndroid=/Android/i.test(ua);
    if(isiOS&&navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      try{await navigator.share({files:[file],title:'保存 PopShot 图片'});showSaveToast('请选择“存储图像”保存到相册');return}catch(err){if(err?.name==='AbortError')return}
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
    if(isAndroid){setTimeout(()=>showSaveFallback(blob,filename,true),650)}else{showSaveToast('高清图片已请求保存');setTimeout(()=>URL.revokeObjectURL(url),3000)}
  }catch(err){console.error(err);const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.96));if(blob)showSaveFallback(blob,`PopShot-${course}-${Date.now()}.jpg`,true)}
  finally{btn.disabled=false;btn.innerHTML=old||'↓ 保存到相册'}
};
function showSaveToast(text){let t=document.getElementById('saveToast');if(!t){t=document.createElement('div');t.id='saveToast';t.className='save-toast';document.body.appendChild(t)}t.textContent=text;t.classList.add('show');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove('show'),2600)}

function showSaveFallback(blob,filename,androidHint=false){
  let modal=document.getElementById('saveFallbackModal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='saveFallbackModal';
    modal.className='save-fallback-modal';
    modal.innerHTML=`
      <div class="save-fallback-card">
        <button class="save-fallback-close" aria-label="关闭">×</button>
        <h3>图片已生成 ✨</h3>
        <p>若没有自动保存，请点“保存图片”；仍无反应时可长按高清成图保存。</p>
        <img id="saveFallbackImage" alt="PopShot 高清成图">
        <div class="save-fallback-actions">
          <button id="saveDirectBtn">↓ 保存图片</button><button id="saveFallbackShare">系统分享</button>
          <button id="saveFallbackCloseBtn">完成</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const close=()=>{
      modal.classList.remove('show');
      const img=document.getElementById('saveFallbackImage');
      if(img?.dataset?.objectUrl){URL.revokeObjectURL(img.dataset.objectUrl);delete img.dataset.objectUrl;}
    };
    modal.querySelector('.save-fallback-close').onclick=close;
    modal.querySelector('#saveFallbackCloseBtn').onclick=close;
    modal.onclick=e=>{if(e.target===modal)close();};
  }

  const img=document.getElementById('saveFallbackImage');
  if(img.dataset.objectUrl) URL.revokeObjectURL(img.dataset.objectUrl);
  const url=URL.createObjectURL(blob);
  img.src=url;
  img.dataset.objectUrl=url;
  img.setAttribute('download',filename);

  
  const directBtn=document.getElementById('saveDirectBtn');
  if(directBtn) directBtn.onclick=()=>{const a=document.createElement('a');a.href=url;a.download=filename;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();showSaveToast('已请求手机保存图片')};

  const shareBtn=document.getElementById('saveFallbackShare');
  shareBtn.onclick=async()=>{
    try{
      const file=new File([blob],filename,{type:'image/jpeg'});
      if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
        await navigator.share({files:[file],title:'PopShot 高清图片'});
      }else{
        alert('当前浏览器不支持系统分享，请长按图片保存。');
      }
    }catch(e){
      if(e?.name!=='AbortError') alert('请长按图片保存到照片。');
    }
  };

  modal.classList.add('show');
}

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

// ── 更新提醒：拉取 version.json（带时间戳，穿透浏览器缓存 + SW + GitHub CDN）对比运行版本 ──
async function fetchLiveVersion(){
  try{
    const r=await fetch(`./version.json?t=${Date.now()}`,{cache:'no-store'});
    if(!r.ok) return null;
    return (await r.json()).version||null;
  }catch{return null}
}
function showUpdateToast(msg,showBtn){
  $('#updateTipMsg').textContent=msg;
  $('#forceRefreshBtn').classList.toggle('hidden',!showBtn);
  $('#updateTip').classList.remove('hidden');
}
async function forceRefresh(){
  try{
    if('serviceWorker'in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
    }
    if(window.caches){
      const ks=await caches.keys();
      await Promise.all(ks.map(k=>caches.delete(k)));
    }
  }catch{}
  const u=new URL(location.href);
  u.searchParams.set('fresh',Date.now());
  location.replace(u.toString());
}
async function checkUpdate(silent){
  const live=await fetchLiveVersion();
  const badge=$('#versionBadge');
  if(!live){
    if(!silent) showUpdateToast(`当前运行 v${VERSION} · 读不到线上 version.json（可能还没部署新文件）`,false);
    return;
  }
  if(live===VERSION){
    if(badge){badge.textContent=`v${VERSION} ✓ 最新`;badge.style.color='#4a9c72';}
    if(!silent) showUpdateToast(`当前 v${VERSION} 已是线上最新版本 ✓`,false);
  }else{
    if(badge){badge.textContent=`v${VERSION} → 线上已有 v${live}`;badge.style.color='#e8663d';}
    showUpdateToast(`线上已部署 v${live}，当前页面还在运行 v${VERSION}，点击立即更新`,true);
  }
}
$('#forceRefreshBtn').onclick=forceRefresh;
$('#updateBtn').onclick=()=>checkUpdate(false);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate(true)});
$('#closeUpdateTip').onclick=()=>$('#updateTip').classList.add('hidden');
$('#settingsBtn').onclick=()=>alert(`PopShot v${VERSION} · 照片仅在本机浏览器处理\n点击顶部 🔔 可检查线上是否有新版本`);

// ── v12：PWA 无感自动更新 ──
async function activateWaitingWorker(reg){
  if(!reg?.waiting) return false;
  return new Promise(resolve=>{
    let finished=false;
    const done=()=>{if(finished)return;finished=true;resolve(true)};
    navigator.serviceWorker.addEventListener('controllerchange',done,{once:true});
    reg.waiting.postMessage({type:'SKIP_WAITING'});
    setTimeout(done,2200);
  });
}
function reloadLatestOnce(){
  const k='popshotAutoReloadAt',now=Date.now(),last=+(sessionStorage.getItem(k)||0);
  if(now-last<8000)return;
  sessionStorage.setItem(k,String(now));
  const u=new URL(location.href);
  u.searchParams.set('v',VERSION);
  u.searchParams.set('fresh',String(now));
  location.replace(u.toString());
}
async function setupPwaAutoUpdate(){
  if(!('serviceWorker'in navigator))return;
  try{
    const reg=await navigator.serviceWorker.register(`./service-worker.js?v=${VERSION}`,{updateViaCache:'none'});
    try{await reg.update()}catch{}

    if(reg.waiting){
      await activateWaitingWorker(reg);
      reloadLatestOnce();
      return;
    }

    reg.addEventListener('updatefound',()=>{
      const w=reg.installing;
      if(!w)return;
      w.addEventListener('statechange',async()=>{
        if(w.state==='installed'&&navigator.serviceWorker.controller){
          await activateWaitingWorker(reg);
          reloadLatestOnce();
        }
      });
    });

    // 第二层：version.json 每次打开都 no-store 检查。
    const live=await fetchLiveVersion();
    if(live&&live!==VERSION){
      try{await reg.update()}catch{}
      if(reg.waiting)await activateWaitingWorker(reg);
      reloadLatestOnce();
    }

    // 应用保持打开时，每 15 分钟轻量检查一次。
    setInterval(async()=>{
      try{
        const live=await fetchLiveVersion();
        if(live&&live!==VERSION){
          await reg.update();
          if(reg.waiting)await activateWaitingWorker(reg);
          reloadLatestOnce();
        }
      }catch{}
    },15*60*1000);
  }catch(e){
    console.warn('PWA auto update failed',e);
  }
}
window.addEventListener('load',()=>{
  const v=document.getElementById('versionBadge');
  if(v)v.textContent='v'+VERSION;
  setupPwaAutoUpdate();
});


$$('[data-compose]').forEach(b=>b.onclick=()=>{
  push();
  composeMode=b.dataset.compose;
  localStorage.setItem('popshotComposeMode',composeMode);
  $$('[data-compose]').forEach(x=>x.classList.toggle('on',x===b));
  resetLayers();autoPlace();render();saveDraft();
});
window.addEventListener('load',()=>{
  $$('[data-compose]').forEach(x=>x.classList.toggle('on',x.dataset.compose===composeMode));
  const vb=$('#versionBadge'); if(vb) vb.textContent='v'+VERSION;
  checkUpdate(true);
});

syncUI();
resume();
