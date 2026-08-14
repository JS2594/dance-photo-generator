
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const photoInput = document.getElementById('photoInput');
const beautyRange = document.getElementById('beautyRange');
const courseGrid = document.getElementById('courseGrid');
const generateBtn = document.getElementById('generateBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const changeCharacterBtn = document.getElementById('changeCharacterBtn');
const changeTagBtn = document.getElementById('changeTagBtn');
const toggleDecorationBtn = document.getElementById('toggleDecorationBtn');
const exportBtn = document.getElementById('exportBtn');

const VERSION = '1.1.0';

const assets = {
  'lelepop': {
    characters: Array.from({length:6},(_,i)=>`./public/assets/characters/lelepop/lelepop_${String(i+1).padStart(2,'0')}.png`),
    tags: Array.from({length:5},(_,i)=>`./public/assets/tags/lelepop/lelepop_tag_${String(i+1).padStart(2,'0')}.png`)
  },
  'buttscaler': {
    characters: Array.from({length:6},(_,i)=>`./public/assets/characters/buttscaler/buttscaler_${String(i+1).padStart(2,'0')}.png`),
    tags: Array.from({length:5},(_,i)=>`./public/assets/tags/buttscaler/buttscaler_tag_${String(i+1).padStart(2,'0')}.png`)
  },
  'zumba': {
    characters: Array.from({length:6},(_,i)=>`./public/assets/characters/zumba/zumba_${String(i+1).padStart(2,'0')}.png`),
    tags: Array.from({length:5},(_,i)=>`./public/assets/tags/zumba/zumba_tag_${String(i+1).padStart(2,'0')}.png`)
  },
  'zumba-camp': {
    characters: Array.from({length:6},(_,i)=>`./public/assets/characters/zumba-camp/zumba_camp_${String(i+1).padStart(2,'0')}.png`),
    tags: Array.from({length:5},(_,i)=>`./public/assets/tags/zumba-camp/zumba_camp_tag_${String(i+1).padStart(2,'0')}.png`)
  }
};

let photo = null;
let selectedCourse = 'zumba';
let characterIndex = 0;
let tagIndex = 0;
let decorationOn = true;

const rand = n => Math.floor(Math.random()*n);
function loadImg(src){ return new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; }); }

function drawCover(img, x,y,w,h){
  const ir=img.width/img.height, tr=w/h;
  let sw,sh,sx,sy;
  if(ir>tr){ sh=img.height; sw=sh*tr; sx=(img.width-sw)/2; sy=0; }
  else{ sw=img.width; sh=sw/tr; sx=0; sy=(img.height-sh)/2; }
  ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
}


const HISTORY_KEY='popshotHistoryV1';
function getHistory(){try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')}catch{return []}}
function saveHistory(x){
  const now=Date.now(), fourteen=14*24*60*60*1000;
  let h=getHistory().filter(v=>now-v.time<fourteen);
  h.push(x); localStorage.setItem(HISTORY_KEY,JSON.stringify(h.slice(-100)));
}
function comboKey(){return `${selectedCourse}|${characterIndex}|${tagIndex}|${decorationOn?1:0}`}
function randomizeNonRepeat(){
  const h=getHistory(), now=new Date(), weekday=now.getDay();
  let tries=0;
  do{
    characterIndex=rand(6); tagIndex=rand(5); tries++;
    const key=comboKey();
    const duplicate14=h.some(v=>v.course===selectedCourse && v.key===key);
    const sameWeekdayLast=[...h].reverse().find(v=>v.course===selectedCourse && v.weekday===weekday);
    const duplicateWeekday=sameWeekdayLast && sameWeekdayLast.key===key;
    if(!duplicate14 && !duplicateWeekday) return;
  }while(tries<80);
}
function recordCurrent(){
  const d=new Date();
  saveHistory({time:Date.now(),weekday:d.getDay(),course:selectedCourse,key:comboKey()});
}
// Holiday assets are opt-in by date only. Ordinary days never enter holiday pools.
function activeHoliday(){
  const d=new Date(), m=d.getMonth()+1, day=d.getDate();
  if(m===12 && day>=20) return 'Christmas';
  if(m===10 && day>=25 && day<=31) return 'Halloween';
  if(m===2 && day>=10 && day<=15) return 'Valentine';
  return null;
}

async function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(!photo){
    ctx.fillStyle='#ececf2';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#777';ctx.font='bold 48px sans-serif';ctx.textAlign='center';
    ctx.fillText('请先上传一张合照',canvas.width/2,canvas.height/2);
    return;
  }

  const beauty = Number(beautyRange.value)/100;
  ctx.save();
  ctx.filter = `brightness(${1+beauty*0.12}) contrast(${1+beauty*0.08}) saturate(${1+beauty*0.16})`;
  drawCover(photo,0,0,canvas.width,canvas.height);
  ctx.restore();

  const course = assets[selectedCourse];
  try{
    const [charImg, tagImg] = await Promise.all([
      loadImg(course.characters[characterIndex]),
      loadImg(course.tags[tagIndex])
    ]);

    // title near top-left
    const tagW = canvas.width*0.48;
    const tagH = tagW*(tagImg.height/tagImg.width);
    ctx.drawImage(tagImg, 38, 30, tagW, tagH);

    // character lower-right, bounded
    const maxW = canvas.width*0.34;
    const maxH = canvas.height*0.40;
    const scale = Math.min(maxW/charImg.width, maxH/charImg.height);
    const cw=charImg.width*scale, ch=charImg.height*scale;
    ctx.drawImage(charImg, canvas.width-cw-28, canvas.height-ch-28, cw, ch);

    if(decorationOn){
      // lightweight universal doodles without external assets
      ctx.save();
      ctx.font='54px sans-serif';
      ctx.globalAlpha=.9;
      ctx.fillText('✨',canvas.width-100,92);
      ctx.fillText('♡',55,canvas.height-70);
      ctx.restore();
    }
  }catch(e){
    console.warn('Asset load error',e);
  }
}

photoInput.addEventListener('change', e=>{
  const file=e.target.files?.[0]; if(!file)return;
  const url=URL.createObjectURL(file); const i=new Image();
  i.onload=()=>{photo=i; render(); URL.revokeObjectURL(url);}; i.src=url;
});

courseGrid.addEventListener('click', e=>{
  const btn=e.target.closest('button[data-course]'); if(!btn)return;
  selectedCourse=btn.dataset.course;
  [...courseGrid.querySelectorAll('button')].forEach(b=>b.classList.toggle('active',b===btn));
  characterIndex=rand(6); tagIndex=rand(5); render();
});
courseGrid.querySelector('[data-course="zumba"]').classList.add('active');

beautyRange.addEventListener('input',render);
generateBtn.addEventListener('click',()=>{randomizeNonRepeat();recordCurrent();render();});
shuffleBtn.addEventListener('click',()=>{randomizeNonRepeat();recordCurrent();render();});
changeCharacterBtn.addEventListener('click',()=>{characterIndex=(characterIndex+1)%6;render();});
changeTagBtn.addEventListener('click',()=>{tagIndex=(tagIndex+1)%5;render();});
toggleDecorationBtn.addEventListener('click',()=>{decorationOn=!decorationOn;render();});

exportBtn.addEventListener('click',()=>{
  const a=document.createElement('a');
  a.download=`dance-photo-${selectedCourse}-${Date.now()}.jpg`;
  a.href=canvas.toDataURL('image/jpeg',0.95);
  a.click();
});

const oldVersion=localStorage.getItem('assetVersion');
if(oldVersion && oldVersion!==VERSION) document.getElementById('updateTip').classList.remove('hidden');
localStorage.setItem('assetVersion',VERSION);
document.getElementById('closeUpdateTip').addEventListener('click',()=>document.getElementById('updateTip').classList.add('hidden'));

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.warn));
}
render();
