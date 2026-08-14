
const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
const input=document.getElementById('photoInput'),placeholder=document.getElementById('placeholder');
let photo=null, course='zumba', beauty=38, charIndex=0, titleIndex=0, frameIndex=1, stickerIndex=0, layoutIndex=0;
const VERSION='3.0.0', W=2525, H=1894;
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

function assetPath(c,i){return `./public/assets/characters/${c}/${charFiles[c][i]}`}
function loadAsset(path){
 if(loaded[path]) return loaded[path];
 loaded[path]=new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=path});
 return loaded[path];
}
function holiday(){
 const d=new Date(),m=d.getMonth()+1,day=d.getDate();
 if(m===12 && day>=20) return {emoji:['🎄','🎅','❄️','🎁'],name:'Christmas'};
 if(m===10 && day>=25) return {emoji:['🎃','👻','🦇','🕸️'],name:'Halloween'};
 if(m===2 && day>=10 && day<=16) return {emoji:['💘','💗','💝','🌹'],name:'Valentine'};
 // Mid-autumn varies annually; configured exact 2026 window only.
 if(d.getFullYear()===2026 && m===9 && day>=23 && day<=27) return {emoji:['🌕','🐇','🥮','✨'],name:'Mid-Autumn'};
 // CNY varies annually; configured exact 2027 window only.
 if(d.getFullYear()===2027 && m===2 && day>=4 && day<=10) return {emoji:['🧧','🏮','✨','🐉'],name:'CNY'};
 return null;
}
function stickers(){const h=holiday();return h?h.emoji:genericStickers}

function drawCover(img){
 const ir=img.width/img.height,tr=W/H;let sw,sh,sx,sy;
 if(ir>tr){sh=img.height;sw=sh*tr;sx=(img.width-sw)/2;sy=0}
 else{sw=img.width;sh=sw/tr;sx=0;sy=(img.height-sh)/2}
 ctx.drawImage(img,sx,sy,sw,sh,0,0,W,H);
}
function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function drawTitle(){
 const p=palettes[course], title=titleSets[course][titleIndex%5];
 const right=layoutIndex===1, x=right?W-90:90, y=115;
 ctx.save();ctx.textAlign=right?'right':'left';ctx.textBaseline='top';ctx.lineJoin='round';
 const style=titleIndex%5;
 if(style===0||style===3){
   ctx.font='900 178px Arial Black, Impact, sans-serif';ctx.strokeStyle='rgba(255,255,255,.98)';ctx.lineWidth=30;ctx.strokeText(title,x,y);
   const g=ctx.createLinearGradient(70,0,1000,0);g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);ctx.fillStyle=g;ctx.fillText(title,x,y);
 }else if(style===1){
   ctx.font='italic 900 170px Arial Black, sans-serif';ctx.strokeStyle='rgba(255,255,255,.98)';ctx.lineWidth=26;ctx.strokeText(title,x,y);
   ctx.fillStyle=p[0];ctx.fillText(title,x,y);
   ctx.strokeStyle=p[1];ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(right?W-800:95,y+185);ctx.lineTo(right?W-95:800,y+185);ctx.stroke();
 }else if(style===2){
   ctx.font='900 160px Arial Black, sans-serif';ctx.fillStyle='white';ctx.shadowColor='rgba(0,0,0,.48)';ctx.shadowBlur=22;ctx.fillText(title,x,y);
 }else{
   ctx.font='900 165px Arial Black, sans-serif';ctx.strokeStyle=p[0];ctx.lineWidth=38;ctx.strokeText(title,x,y);ctx.fillStyle='white';ctx.fillText(title,x,y);
 }
 ctx.shadowBlur=8;ctx.shadowColor='rgba(0,0,0,.28)';ctx.font='700 52px sans-serif';ctx.fillStyle='white';
 const sub=course==='buttscaler'?'POWER · GLUTE · LEG':course==='zumba-camp'?'PRACTICE · BREAKDOWN':'MOVE · SMILE · ENJOY';
 ctx.fillText(sub,x,y+200);ctx.restore();
}
async function drawCharacter(){
 const im=await loadAsset(assetPath(course,charIndex));
 const maxH=650,maxW=590,scale=Math.min(maxW/im.width,maxH/im.height);
 const w=im.width*scale,h=im.height*scale;
 let x=W-w-60,y=H-h-45;
 if(layoutIndex===1){x=55}
 if(layoutIndex===2){x=W-w-70;y=H-h-75}
 ctx.save();ctx.shadowColor='rgba(30,20,45,.22)';ctx.shadowBlur=24;ctx.shadowOffsetY=10;ctx.drawImage(im,x,y,w,h);ctx.restore();
}
function drawFrame(){
 ctx.save();
 if(frameIndex===1){ctx.strokeStyle='rgba(255,255,255,.93)';ctx.lineWidth=14;ctx.strokeRect(34,34,W-68,H-68)}
 if(frameIndex===2){ctx.strokeStyle='rgba(255,255,255,.78)';ctx.lineWidth=28;ctx.strokeRect(40,40,W-80,H-80)}
 if(frameIndex===3){const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,palettes[course][0]);g.addColorStop(1,palettes[course][1]);ctx.strokeStyle=g;ctx.lineWidth=18;ctx.strokeRect(38,38,W-76,H-76)}
 ctx.restore();
}
function drawDecor(){
 const s=stickers();ctx.save();ctx.globalAlpha=.93;ctx.font='72px Apple Color Emoji,Segoe UI Emoji';
 ctx.fillText(s[stickerIndex%s.length],W-155,110);ctx.font='54px Apple Color Emoji,Segoe UI Emoji';ctx.fillText(s[(stickerIndex+2)%s.length],80,H-100);ctx.restore();
}
async function render(){
 ctx.clearRect(0,0,W,H);if(!photo)return;placeholder.classList.add('hidden');
 ctx.save();const b=beauty/100;ctx.filter=`brightness(${1+b*.10}) contrast(${1+b*.085}) saturate(${1+b*.14})`;drawCover(photo);ctx.restore();
 const wash=ctx.createLinearGradient(0,0,W,H);wash.addColorStop(0,'rgba(75,55,150,.035)');wash.addColorStop(1,'rgba(255,70,145,.03)');ctx.fillStyle=wash;ctx.fillRect(0,0,W,H);
 drawFrame();drawTitle();drawDecor();await drawCharacter();
 ctx.save();ctx.textAlign='right';ctx.fillStyle='rgba(255,255,255,.9)';ctx.font='italic 38px cursive';ctx.shadowColor='rgba(0,0,0,.3)';ctx.shadowBlur=8;ctx.fillText('for Lisa, and only Lisa ♡',W-68,H-52);ctx.restore();
}
function history(){try{return JSON.parse(localStorage.getItem('popshotHistory')||'[]')}catch{return[]}}
function keyFor(c,ch,t,f,s,l){return [c,ch,t,f,s,l].join('|')}
function pickCombo(){
 const now=Date.now(),limit=now-14*86400000,hist=history().filter(x=>x.time>=limit);
 const weekday=new Date().getDay();
 for(let tries=0;tries<100;tries++){
   const ch=Math.floor(Math.random()*6),t=Math.floor(Math.random()*5),f=Math.floor(Math.random()*4),s=Math.floor(Math.random()*stickers().length),l=Math.floor(Math.random()*3);
   const k=keyFor(course,ch,t,f,s,l);
   const recent=hist.some(x=>x.key===k);
   const sameWeekday=hist.some(x=>x.course===course&&x.weekday===weekday&&x.key===k);
   if(!recent&&!sameWeekday){charIndex=ch;titleIndex=t;frameIndex=f;stickerIndex=s;layoutIndex=l;hist.push({key:k,course,time:now,weekday});localStorage.setItem('popshotHistory',JSON.stringify(hist.slice(-120)));return}
 }
 charIndex=(charIndex+1)%6;titleIndex=(titleIndex+1)%5;
}
input.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{photo=im;URL.revokeObjectURL(u);render()};im.src=u});
document.getElementById('courseGrid').addEventListener('click',e=>{const b=e.target.closest('button[data-course]');if(!b)return;course=b.dataset.course;document.querySelectorAll('[data-course]').forEach(x=>x.classList.toggle('active',x===b));pickCombo();render()});
document.querySelectorAll('[data-beauty]').forEach(b=>b.onclick=()=>{beauty=+b.dataset.beauty;document.querySelectorAll('[data-beauty]').forEach(x=>x.classList.toggle('on',x===b));document.getElementById('beautyText').textContent=b.textContent;render()});
document.getElementById('generateBtn').onclick=()=>{if(!photo)return alert('请先上传照片');pickCombo();render()};
document.getElementById('shuffleBtn').onclick=()=>{if(!photo)return;pickCombo();render()};
document.getElementById('changeCharacterBtn').onclick=()=>{charIndex=(charIndex+1)%6;render()};
document.getElementById('changeTagBtn').onclick=()=>{titleIndex=(titleIndex+1)%5;render()};
document.getElementById('changeStickerBtn').onclick=()=>{stickerIndex=(stickerIndex+1)%stickers().length;render()};
document.getElementById('changeFrameBtn').onclick=()=>{frameIndex=(frameIndex+1)%4;render()};
document.getElementById('layoutBtn').onclick=()=>{layoutIndex=(layoutIndex+1)%3;render()};
const drawer=document.getElementById('drawer'),body=document.getElementById('drawerBody');
document.getElementById('beautyBtn').onclick=()=>{document.getElementById('drawerTitle').textContent='美化调整';body.innerHTML=`<div class="range-row"><span>美化强度</span><input id="r1" type="range" min="0" max="100" value="${beauty}"><b>${beauty}</b></div><div style="color:#999;font-size:12px">只做基础提亮、对比度和色彩优化，不改变脸型与五官。</div>`;drawer.classList.add('show');document.getElementById('r1').oninput=e=>{beauty=+e.target.value;e.target.nextElementSibling.textContent=beauty;render()}};
document.getElementById('drawerClose').onclick=()=>drawer.classList.remove('show');
document.getElementById('exportBtn').onclick=()=>{if(!photo)return alert('请先上传照片');const a=document.createElement('a');a.download=`PopShot-${course}-${Date.now()}.jpg`;a.href=canvas.toDataURL('image/jpeg',.96);a.click()};
const old=localStorage.getItem('popshotAssetVersion');if(old&&old!==VERSION)document.getElementById('updateTip').classList.remove('hidden');localStorage.setItem('popshotAssetVersion',VERSION);
document.getElementById('closeUpdateTip').onclick=()=>document.getElementById('updateTip').classList.add('hidden');
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
