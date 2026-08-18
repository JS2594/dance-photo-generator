const POPSHOT_VERSION='1.0.9';

function comparePopShotVersion(a,b){
  const pa=String(a||'0').replace(/^v/i,'').split('.').map(n=>parseInt(n,10)||0);
  const pb=String(b||'0').replace(/^v/i,'').split('.').map(n=>parseInt(n,10)||0);
  const len=Math.max(pa.length,pb.length);
  for(let i=0;i<len;i++){
    const av=pa[i]||0,bv=pb[i]||0;
    if(av>bv)return 1;
    if(av<bv)return -1;
  }
  return 0;
}

function compareVersion(a,b){
  const pa=String(a||'0').replace(/^v/i,'').split('.').map(n=>parseInt(n,10)||0);
  const pb=String(b||'0').replace(/^v/i,'').split('.').map(n=>parseInt(n,10)||0);
  const n=Math.max(pa.length,pb.length);
  for(let i=0;i<n;i++){
    const x=pa[i]||0,y=pb[i]||0;
    if(x>y)return 1;
    if(x<y)return -1;
  }
  return 0;
}

const INLINE_STICKER_SVGS={"./public/assets/stickers/cute/bow.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M114 111C87 57 25 54 30 113c4 47 56 46 84 17zM142 111c27-54 89-57 84 2-4 47-56 46-84 17z' fill='#ff79b8' stroke='#8a64ff' stroke-width='8'/><rect x='105' y='99' width='46' height='55' rx='15' fill='#ffd2e6' stroke='#8a64ff' stroke-width='7'/></svg>","./public/assets/stickers/cute/butterfly.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M121 119C90 53 34 46 35 94c1 36 42 49 78 45-35 20-65 58-36 78 31 21 54-20 51-71M135 119c31-66 87-73 86-25-1 36-42 49-78 45 35 20 65 58 36 78-31 21-54-20-51-71' fill='#ff78b6' stroke='#6d55ff' stroke-width='7'/><path d='M128 104v63' stroke='#333' stroke-width='8'/></svg>","./public/assets/stickers/cute/candyheart.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M128 216C92 179 36 144 36 92c0-34 27-56 56-56 18 0 31 9 36 22 6-13 19-22 37-22 30 0 55 22 55 56 0 52-55 87-92 124z' fill='#ff9acb' stroke='#fff' stroke-width='9'/><path d='M77 126h102' stroke='#8a64ff' stroke-width='13' stroke-linecap='round'/></svg>","./public/assets/stickers/cute/doubleheart.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M90 195C60 165 22 141 22 99c0-25 20-42 43-42 14 0 23 7 28 17 5-10 16-17 29-17 23 0 42 17 42 42 0 42-38 66-74 96z' fill='#ff4f91'/><path d='M174 177c-20-20-48-38-48-68 0-18 14-31 31-31 10 0 17 5 21 13 4-8 12-13 22-13 17 0 31 13 31 31 0 30-28 48-57 68z' fill='#8a64ff'/></svg>","./public/assets/stickers/cute/flower.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><g fill='#ff76b7' stroke='#fff' stroke-width='6'><circle cx='128' cy='65' r='38'/><circle cx='188' cy='105' r='38'/><circle cx='165' cy='176' r='38'/><circle cx='91' cy='176' r='38'/><circle cx='68' cy='105' r='38'/></g><circle cx='128' cy='128' r='36' fill='#ffd743'/></svg>","./public/assets/stickers/cute/mini_crown.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M35 82l46 36 46-72 48 72 46-36-18 112H53z' fill='#ffd34d' stroke='#7b4d00' stroke-width='10' stroke-linejoin='round'/><circle cx='35' cy='82' r='10' fill='#ff4fa3'/><circle cx='127' cy='46' r='10' fill='#8a64ff'/><circle cx='221' cy='82' r='10' fill='#ff4fa3'/></svg>","./public/assets/stickers/dance/disco.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><circle cx='128' cy='132' r='73' fill='#d8ddff' stroke='#775fff' stroke-width='8'/><g stroke='#8a7ee0' stroke-width='5'><path d='M55 110h146M57 145h142M72 80h112M72 180h112M95 63c-18 40-18 101 0 139M128 59v146M161 63c18 40 18 101 0 139'/></g><path d='M128 20v38' stroke='#555' stroke-width='8'/></svg>","./public/assets/stickers/dance/headphones.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M50 137v-18c0-49 34-87 78-87s78 38 78 87v18' fill='none' stroke='#7b5cff' stroke-width='18' stroke-linecap='round'/><rect x='34' y='126' width='43' height='74' rx='18' fill='#ff4fa3'/><rect x='179' y='126' width='43' height='74' rx='18' fill='#ff4fa3'/></svg>","./public/assets/stickers/dance/mic.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><rect x='91' y='25' width='74' height='112' rx='37' fill='#ff5aa4' stroke='#5d3dff' stroke-width='8'/><path d='M67 111c0 43 23 69 61 69s61-26 61-69M128 180v50M94 230h68' fill='none' stroke='#5d3dff' stroke-width='12' stroke-linecap='round'/></svg>","./public/assets/stickers/dance/music_note.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M102 54v116c0 24-17 43-42 43-18 0-31-11-31-27 0-20 18-34 43-34 7 0 13 1 18 3V73l121-27v94c0 24-17 43-42 43-18 0-31-11-31-27 0-20 18-34 43-34 6 0 12 1 17 3V20z' fill='#7b5cff' stroke='white' stroke-width='7'/></svg>","./public/assets/stickers/dance/rhythm.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M18 150c30-78 55 78 85 0s55 78 85 0 35-25 50-2' fill='none' stroke='#ff4fa3' stroke-width='16' stroke-linecap='round'/><path d='M28 98h52M176 98h50' stroke='#7b5cff' stroke-width='12' stroke-linecap='round'/></svg>","./public/assets/stickers/dance/spotlight.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M68 38h120l-26 56H94z' fill='#7b5cff'/><path d='M95 94L42 222h172L161 94z' fill='#ffe66b' opacity='.75'/><circle cx='128' cy='177' r='24' fill='#ff4fa3'/></svg>","./public/assets/stickers/fitness/dumbbell.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><g fill='#282633'><rect x='58' y='108' width='140' height='40' rx='12'/><rect x='24' y='88' width='38' height='80' rx='10'/><rect x='194' y='88' width='38' height='80' rx='10'/><rect x='9' y='103' width='18' height='50' rx='7'/><rect x='229' y='103' width='18' height='50' rx='7'/></g><rect x='92' y='112' width='72' height='32' rx='10' fill='#8a64ff'/></svg>","./public/assets/stickers/fitness/energy.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M144 18L59 136h55l-3 102 87-134h-54z' fill='#8a64ff'/><path d='M44 204h70M160 54h55' stroke='#ff4fa3' stroke-width='11' stroke-linecap='round'/></svg>","./public/assets/stickers/fitness/flame.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M139 20c12 53-35 61-18 102 10-23 32-37 47-60 25 39 47 68 35 112-11 39-42 63-80 62-45-1-76-32-72-75 3-30 23-52 44-75 2 31 12 41 26 53-1-44 16-70 18-119z' fill='#ff6b2d' stroke='#ffcf3d' stroke-width='9'/></svg>","./public/assets/stickers/fitness/kettlebell.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M89 74c0-35 18-54 39-54s39 19 39 54' fill='none' stroke='#33313b' stroke-width='16'/><path d='M68 82h120c19 35 30 63 30 88 0 43-39 68-90 68s-90-25-90-68c0-25 11-53 30-88z' fill='#7b5cff' stroke='#33313b' stroke-width='9'/><circle cx='128' cy='160' r='21' fill='#ff4fa3'/></svg>","./public/assets/stickers/fitness/plate.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><circle cx='128' cy='128' r='92' fill='#2d2b35' stroke='#ff4fa3' stroke-width='10'/><circle cx='128' cy='128' r='28' fill='#fff'/><circle cx='128' cy='128' r='13' fill='#2d2b35'/><path d='M128 45v28M128 183v28M45 128h28M183 128h28' stroke='#777' stroke-width='8'/></svg>","./public/assets/stickers/fitness/strong_star.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M128 18l27 72 77 4-60 48 20 75-64-42-64 42 20-75-60-48 77-4z' fill='#ffd34d' stroke='#6f50ff' stroke-width='8'/><path d='M90 145c23-31 53-31 76 0' fill='none' stroke='#333' stroke-width='12' stroke-linecap='round'/></svg>","./public/assets/stickers/general/crown.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M35 82l46 36 46-72 48 72 46-36-18 112H53z' fill='#ffd34d' stroke='#7b4d00' stroke-width='10' stroke-linejoin='round'/><circle cx='35' cy='82' r='10' fill='#ff4fa3'/><circle cx='127' cy='46' r='10' fill='#8a64ff'/><circle cx='221' cy='82' r='10' fill='#ff4fa3'/></svg>","./public/assets/stickers/general/heart.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M128 214C92 178 36 145 36 91c0-34 27-55 56-55 18 0 31 9 36 22 6-13 19-22 37-22 30 0 55 22 55 55 0 54-55 87-92 123z' fill='#ff4f91' stroke='white' stroke-width='9'/></svg>","./public/assets/stickers/general/lightning.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M145 18L57 143h59l-6 95 89-132h-58z' fill='#ffd23d' stroke='#7a55ff' stroke-width='10' stroke-linejoin='round'/></svg>","./public/assets/stickers/general/smiley.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><circle cx='128' cy='128' r='92' fill='#ffd83d' stroke='#5d4b00' stroke-width='10'/><circle cx='94' cy='105' r='10' fill='#5d4b00'/><circle cx='162' cy='105' r='10' fill='#5d4b00'/><path d='M82 150c20 32 73 32 92 0' fill='none' stroke='#5d4b00' stroke-width='12' stroke-linecap='round'/></svg>","./public/assets/stickers/general/sparkle.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M128 22 L146 102 L226 120 L146 138 L128 218 L110 138 L30 120 L110 102 Z' fill='#8a64ff' stroke='white' stroke-width='8'/></svg>","./public/assets/stickers/general/sparkle_burst.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><g stroke='#ff4fa3' stroke-width='14' stroke-linecap='round'><path d='M128 26v50M128 180v50M26 128h50M180 128h50M55 55l36 36M165 165l36 36M201 55l-36 36M91 165l-36 36'/></g><circle cx='128' cy='128' r='30' fill='#ffd34d'/></svg>","./public/assets/stickers/graphic/arrow.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M30 132h158M150 76l58 56-58 56' fill='none' stroke='#ff4fa3' stroke-width='18' stroke-linecap='round' stroke-linejoin='round'/></svg>","./public/assets/stickers/graphic/checker.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><rect x='28' y='28' width='200' height='200' rx='24' fill='#fff' stroke='#222' stroke-width='8'/><g fill='#222'><rect x='40' y='40' width='44' height='44'/><rect x='128' y='40' width='44' height='44'/><rect x='84' y='84' width='44' height='44'/><rect x='172' y='84' width='44' height='44'/><rect x='40' y='128' width='44' height='44'/><rect x='128' y='128' width='44' height='44'/><rect x='84' y='172' width='44' height='44'/><rect x='172' y='172' width='44' height='44'/></g></svg>","./public/assets/stickers/graphic/corner.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M35 112V35h77M221 144v77h-77' fill='none' stroke='#8a64ff' stroke-width='17' stroke-linecap='round'/><circle cx='192' cy='63' r='18' fill='#ff4fa3'/></svg>","./public/assets/stickers/graphic/dots.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><g fill='#ff4fa3'><circle cx='55' cy='58' r='16'/><circle cx='108' cy='92' r='13'/><circle cx='168' cy='54' r='20'/><circle cx='204' cy='113' r='11'/><circle cx='68' cy='171' r='20'/><circle cx='145' cy='184' r='13'/><circle cx='205' cy='193' r='18'/></g></svg>","./public/assets/stickers/graphic/scribble.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M24 163c38-85 46 80 84-5s46 75 83-3 34-54 41-26' fill='none' stroke='#7b5cff' stroke-width='15' stroke-linecap='round'/></svg>","./public/assets/stickers/graphic/tape.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><rect x='35' y='72' width='186' height='112' rx='12' fill='#ffe6a8' opacity='.9' stroke='#d2a953' stroke-width='7'/><path d='M58 91l-12 18M92 83l-14 21M180 90l-14 20M208 111l-13 20' stroke='#fff' stroke-width='7'/></svg>","./public/assets/stickers/holiday/christmas/candycane.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M90 218V90c0-46 74-50 77-3 2 27-17 42-40 42' fill='none' stroke='#fff' stroke-width='34' stroke-linecap='round'/><path d='M90 218V90c0-46 74-50 77-3 2 27-17 42-40 42' fill='none' stroke='#e94259' stroke-width='34' stroke-linecap='round' stroke-dasharray='28 24'/></svg>","./public/assets/stickers/holiday/christmas/gift.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><rect x='38' y='94' width='180' height='130' rx='12' fill='#ff506d' stroke='#fff' stroke-width='8'/><rect x='113' y='94' width='30' height='130' fill='#ffd64d'/><rect x='28' y='75' width='200' height='44' rx='12' fill='#ff6f89'/><path d='M128 75c-24-48-66-45-60-13 6 27 44 24 60 13zm0 0c24-48 66-45 60-13-6 27-44 24-60 13z' fill='#ffd64d'/></svg>","./public/assets/stickers/holiday/christmas/snowflake.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><g stroke='#63b7ff' stroke-width='12' stroke-linecap='round'><path d='M128 24v208M38 76l180 104M38 180L218 76'/></g><g stroke='#63b7ff' stroke-width='8'><path d='M128 48l-20-18M128 48l20-18M128 208l-20 18M128 208l20 18'/></g></svg>","./public/assets/stickers/holiday/christmas/tree.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M128 25l-54 68h27l-48 62h36l-43 54h164l-43-54h36l-48-62h27z' fill='#2fb36f' stroke='#176b44' stroke-width='7'/><rect x='113' y='203' width='30' height='31' fill='#8b542f'/><circle cx='128' cy='45' r='12' fill='#ffd33d'/></svg>","./public/assets/stickers/holiday/cny/firecracker.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M75 43c45 26 65 54 94 99' fill='none' stroke='#d6a52d' stroke-width='9'/><g fill='#e9434e' stroke='#94212a' stroke-width='5'><rect x='55' y='64' width='35' height='51' rx='7' transform='rotate(-23 72 89)'/><rect x='89' y='92' width='35' height='51' rx='7' transform='rotate(-23 106 117)'/><rect x='123' y='123' width='35' height='51' rx='7' transform='rotate(-23 140 148)'/><rect x='155' y='154' width='35' height='51' rx='7' transform='rotate(-23 172 179)'/></g><path d='M198 47l10 22 23 5-19 16 3 23-20-12-20 12 4-23-18-16 23-5z' fill='#ffd64d'/></svg>","./public/assets/stickers/holiday/cny/lantern.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M94 39h68M103 54c-38 23-42 116 25 140 67-24 63-117 25-140z' fill='#ef3e48' stroke='#9f2028' stroke-width='8'/><path d='M128 58v132M99 95h58M101 150h54M128 194v36M111 230h34' stroke='#ffd44b' stroke-width='7'/></svg>","./public/assets/stickers/holiday/cny/luckyfan.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M128 218L48 72c53-44 108-44 160 0z' fill='#ef424f' stroke='#9f232d' stroke-width='8'/><path d='M128 218L78 62M128 218l0-170M128 218l50-156' stroke='#ffd64d' stroke-width='7'/><circle cx='128' cy='218' r='14' fill='#ffd64d'/></svg>","./public/assets/stickers/holiday/cny/redpacket.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><rect x='55' y='35' width='146' height='190' rx='18' fill='#e9424d' stroke='#a11e2a' stroke-width='8'/><path d='M58 72l70 48 70-48' fill='#f55d68'/><circle cx='128' cy='148' r='36' fill='#ffd64d'/><path d='M110 148h36M128 130v36' stroke='#ad6b00' stroke-width='7'/></svg>","./public/assets/stickers/holiday/halloween/bat.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M128 116c-22-26-35-22-54-11L31 74l8 70 52 8 37 43 37-43 52-8 8-70-43 31c-19-11-32-15-54 11z' fill='#2b2541' stroke='#8f6cff' stroke-width='8'/></svg>","./public/assets/stickers/holiday/halloween/ghost.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M56 214V113c0-48 31-82 72-82s72 34 72 82v101l-25-22-24 22-23-22-24 22-24-22z' fill='#fff' stroke='#7763c7' stroke-width='8'/><circle cx='102' cy='111' r='11' fill='#333'/><circle cx='155' cy='111' r='11' fill='#333'/><ellipse cx='128' cy='150' rx='17' ry='22' fill='#333'/></svg>","./public/assets/stickers/holiday/halloween/pumpkin.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><ellipse cx='128' cy='145' rx='92' ry='72' fill='#ff8428' stroke='#6b3512' stroke-width='9'/><path d='M128 72c-10-24 9-44 29-42' fill='none' stroke='#3c8a3a' stroke-width='13'/><path d='M73 131l25-20 17 27M183 131l-25-20-17 27M86 166c27 20 57 20 84 0' fill='none' stroke='#4b250d' stroke-width='11' stroke-linecap='round'/></svg>","./public/assets/stickers/holiday/halloween/web.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><g fill='none' stroke='#8f6cff' stroke-width='7'><circle cx='128' cy='128' r='92'/><circle cx='128' cy='128' r='60'/><circle cx='128' cy='128' r='30'/><path d='M128 22v212M22 128h212M52 52l152 152M204 52L52 204'/></g></svg>","./public/assets/stickers/holiday/midautumn/cloudmoon.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><circle cx='154' cy='95' r='65' fill='#ffd866'/><path d='M39 176c0-22 18-40 41-40 8-25 29-39 53-34 13 3 24 11 31 23 6-4 15-7 24-7 24 0 43 19 43 43 0 23-18 42-42 42H77c-21 0-38-10-38-27z' fill='#eaf0ff' stroke='#9aa9de' stroke-width='7'/></svg>","./public/assets/stickers/holiday/midautumn/lanternmoon.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><circle cx='68' cy='73' r='39' fill='#ffd866'/><rect x='115' y='58' width='88' height='119' rx='30' fill='#ff5b66' stroke='#a62f3b' stroke-width='8'/><path d='M128 58V39h62v19M128 177v19h62v-19M159 58v119' stroke='#ffd36b' stroke-width='7'/></svg>","./public/assets/stickers/holiday/midautumn/mooncake.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><circle cx='128' cy='128' r='88' fill='#d99a45' stroke='#8a5c24' stroke-width='10'/><circle cx='128' cy='128' r='58' fill='none' stroke='#f5c779' stroke-width='8'/><path d='M92 128h72M128 92v72M102 102l52 52M154 102l-52 52' stroke='#f5c779' stroke-width='7'/></svg>","./public/assets/stickers/holiday/midautumn/moonrabbit.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><circle cx='133' cy='127' r='92' fill='#ffd866' stroke='#f0a83c' stroke-width='7'/><path d='M102 158c-18-22-14-51 10-65 6-27 7-49 18-50 12-1 8 28 8 43 13-31 24-49 35-42 11 7-6 33-16 51 22 9 37 31 34 56-5 40-54 53-89 7z' fill='#fff' opacity='.95'/></svg>","./public/assets/stickers/holiday/valentine/doubleheart.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M90 195C60 165 22 141 22 99c0-25 20-42 43-42 14 0 23 7 28 17 5-10 16-17 29-17 23 0 42 17 42 42 0 42-38 66-74 96z' fill='#ff4f91'/><path d='M174 177c-20-20-48-38-48-68 0-18 14-31 31-31 10 0 17 5 21 13 4-8 12-13 22-13 17 0 31 13 31 31 0 30-28 48-57 68z' fill='#8a64ff'/></svg>","./public/assets/stickers/holiday/valentine/heartarrow.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M116 212C83 179 36 149 36 99c0-32 24-52 51-52 17 0 29 8 34 21 6-13 18-21 35-21 27 0 51 20 51 52 0 50-47 80-91 113z' fill='#ff4f91'/><path d='M24 192L220 56M184 55h37v38' stroke='#6e55ff' stroke-width='12' stroke-linecap='round' stroke-linejoin='round'/></svg>","./public/assets/stickers/holiday/valentine/kiss.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M48 141c26-18 47-42 80-42s54 24 80 42c-28 51-132 51-160 0z' fill='#ff6c93' stroke='#b72b52' stroke-width='8'/><path d='M70 141c38 12 77 12 116 0' stroke='#fff' stroke-width='8'/></svg>","./public/assets/stickers/holiday/valentine/rose.svg":"<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'><path d='M126 116c-35-8-48-41-27-66 18-22 48-10 55 7 12-20 45-22 55 4 11 29-19 56-55 61z' fill='#ff4f72' stroke='#a6274b' stroke-width='7'/><path d='M143 117c-6 49-8 75-5 111M137 159c-30-4-45-18-56-35M141 184c30-5 43-22 53-40' fill='none' stroke='#319456' stroke-width='10'/></svg>"};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let canvas = $('#canvas');
let ctx = canvas.getContext('2d');
const input = $('#photoInput');
const W = 2525, H = 1894, VERSION = '1.0.9';
let currentPhotoObjectURL=null, photoLoadSeq=0;

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
    g:{br:1.015,ct:1.08,sa:1.16,hue:0, tint:'rgba(255,90,150,.018)', glow:.10}},
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


const BEAUTY_PRESETS={
  original:{label:'原图',ex:0,ct:0,sa:0,temp:0,hi:0,sh:0,tint:null},
  natural:{label:'鲜活自然',ex:.025,ct:.120,sa:.175,temp:-2,hi:-.035,sh:.018,tint:null},
  texture:{label:'质感',ex:-.02,ct:.24,sa:.28,temp:1,hi:-.08,sh:.02,tint:null},
  bright:{label:'明亮',ex:.13,ct:-.01,sa:.02,temp:0,hi:.07,sh:.09,tint:'rgba(255,255,255,.025)'},
  vivid:{label:'活力',ex:.07,ct:.08,sa:.18,temp:2,hi:.03,sh:.01,tint:'rgba(255,90,150,.025)'},
  clear:{label:'清透',ex:.10,ct:.05,sa:-.03,temp:-3,hi:.06,sh:.07,tint:'rgba(210,235,255,.035)'},
  warm:{label:'暖阳',ex:.08,ct:.02,sa:.07,temp:10,hi:.04,sh:.04,tint:'rgba(255,180,90,.055)'},
  coolwhite:{label:'冷白',ex:.11,ct:.03,sa:-.08,temp:-10,hi:.08,sh:.05,tint:'rgba(165,210,255,.055)'},
  softpink:{label:'柔粉',ex:.08,ct:-.03,sa:.02,temp:3,hi:.07,sh:.08,tint:'rgba(255,155,200,.06)'},
  creamtone:{label:'奶油',ex:.09,ct:-.05,sa:-.02,temp:7,hi:.05,sh:.07,tint:'rgba(255,216,170,.065)'},
  retro:{label:'复古',ex:-.01,ct:.09,sa:-.14,temp:5,hi:-.02,sh:-.03,tint:'rgba(160,125,95,.05)'},
  contrast:{label:'高对比',ex:.02,ct:.16,sa:.03,temp:0,hi:.01,sh:-.06,tint:null},
  desat:{label:'低饱和',ex:.05,ct:.02,sa:-.26,temp:0,hi:.03,sh:.05,tint:'rgba(210,215,210,.03)'},
  colorful:{label:'鲜艳',ex:.06,ct:.06,sa:.27,temp:1,hi:.02,sh:.01,tint:null}
};
let beautyPreset=localStorage.popshotBeautyPreset||'natural';
let manualColor={ex:0,ct:0,sa:0,temp:0,hi:0,sh:0};
try{
  const saved=JSON.parse(localStorage.popshotMyColor||'null');
  if(saved&&saved.manualColor){beautyPreset=saved.beautyPreset||'natural';manualColor={...manualColor,...saved.manualColor};}
}catch(e){}
let stickerCategory='recommended';
const STICKER_CATEGORIES={
  recommended:{label:'推荐',files:[]},
  general:{label:'通用',files:[...['sparkle','sparkle_burst','crown','heart','smiley','lightning'].map(x=>`./public/assets/stickers/general/${x}.svg`),...Array.from({length:30},(_,i)=>`./public/sticker-library/general/sticker_${String(i+1).padStart(2,'0')}.png`)]},
  dance:{label:'Dance',files:['music_note','headphones','disco','rhythm','spotlight','mic'].map(x=>`./public/assets/stickers/dance/${x}.svg`)},
  fitness:{label:'Fitness',files:['dumbbell','plate','flame','energy','kettlebell','strong_star'].map(x=>`./public/assets/stickers/fitness/${x}.svg`)},
  cute:{label:'可爱',files:['bow','doubleheart','butterfly','flower','candyheart','mini_crown'].map(x=>`./public/assets/stickers/cute/${x}.svg`)},
  graphic:{label:'图形',files:['checker','arrow','tape','scribble','dots','corner'].map(x=>`./public/assets/stickers/graphic/${x}.svg`)},
  christmas:{label:'圣诞限定',holiday:true,files:['tree','snowflake','gift','candycane'].map(x=>`./public/assets/stickers/holiday/christmas/${x}.svg`)},
  halloween:{label:'万圣限定',holiday:true,files:['pumpkin','ghost','bat','web'].map(x=>`./public/assets/stickers/holiday/halloween/${x}.svg`)},
  valentine:{label:'情人节限定',holiday:true,files:['heartarrow','rose','kiss','doubleheart'].map(x=>`./public/assets/stickers/holiday/valentine/${x}.svg`)},
  midautumn:{label:'中秋限定',holiday:true,files:['moonrabbit','mooncake','lanternmoon','cloudmoon'].map(x=>`./public/assets/stickers/holiday/midautumn/${x}.svg`)},
  cny:{label:'春节限定',holiday:true,files:['redpacket','lantern','firecracker','luckyfan'].map(x=>`./public/assets/stickers/holiday/cny/${x}.svg`)}
};
const FESTIVAL_DATES={
  midautumn:{2026:'09-25',2027:'09-15',2028:'10-03',2029:'09-22',2030:'09-12'},
  cny:{2026:'02-17',2027:'02-06',2028:'01-26',2029:'02-13',2030:'02-03'}
};
function nearDate(mmdd,days=4){
  if(!mmdd)return false;const d=new Date(),[m,da]=mmdd.split('-').map(Number),t=new Date(d.getFullYear(),m-1,da);
  return Math.abs(d-t)<=days*864e5;
}
function activeHolidayCategory(){
  const d=new Date(),m=d.getMonth()+1,day=d.getDate(),y=d.getFullYear();
  if(m===12&&day>=18&&day<=27)return'christmas';
  if(m===10&&day>=24&&day<=31)return'halloween';
  if(m===2&&day>=10&&day<=16)return'valentine';
  if(nearDate(FESTIVAL_DATES.midautumn[y],4))return'midautumn';
  if(nearDate(FESTIVAL_DATES.cny[y],7))return'cny';
  return null;
}
const USER_STICKER_SLOTS=Array.from({length:30},(_,i)=>String(i+1).padStart(2,'0'));
function userStickerFiles(cat){return USER_STICKER_SLOTS.map(n=>`./public/sticker-library/${cat}/sticker_${n}.png`)}
function recommendedStickerFiles(){
  // 推荐与通用彻底分开：推荐 = 当前课程专属 + 用户后续补充的 recommended/课程 文件夹。
  const base=[...userStickerFiles('recommended/'+course)];
  if(course==='buttscaler')base.push(...STICKER_CATEGORIES.fitness.files,...userStickerFiles('fitness'));
  else base.push(...STICKER_CATEGORIES.dance.files,...userStickerFiles('dance')); 
  if(visualStyle==='cute'||visualStyle==='cream'||visualStyle==='fair')base.push(...STICKER_CATEGORIES.cute.files);
  const h=activeHolidayCategory();if(h)base.push(...STICKER_CATEGORIES[h].files);
  return base;
}

let photo = null;
if(!localStorage.popshotColorA104){
  if(!localStorage.popshotMyColor){beautyPreset='natural';manualColor={ex:0,ct:0,sa:0,temp:0,hi:0,sh:0};localStorage.popshotBeautyPreset='natural';}
  localStorage.popshotColorA104='1';
}
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
    const inlineSvg=INLINE_STICKER_SVGS[path];
    im.src=inlineSvg
      ? 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(inlineSvg)
      : (path.includes('?')?path:path+'?v=1.0.8');
  });
  return loaded[path];
}

function holidayStickers(){const h=activeHolidayCategory();return h?STICKER_CATEGORIES[h].files:null;}
function stickerPool(){return stickerCategory==='recommended'?recommendedStickerFiles():(STICKER_CATEGORIES[stickerCategory]?.files||recommendedStickerFiles());}

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
  boxesDetected=[];
  $('#detectStatus').textContent='正在识别合照主体…';
  const iou=(a,b)=>{const o=overlap(a,b);return o/(a.w*a.h+b.w*b.h-o||1)};
  const add=bs=>{for(const b of (bs||[])){if(b.w>4&&b.h>4&&!boxesDetected.some(e=>iou(e,b)>.35))boxesDetected.push(b)}};
  // V1.0.9：优先本地 pico，不再等待外网 MediaPipe 4 秒超时。
  try{ add(await Promise.race([detectWithPico(img),new Promise(r=>setTimeout(()=>r([]),1800))])); }catch(e){}
  // 支持原生 FaceDetector 的浏览器做快速补充。
  if(boxesDetected.length<3 && 'FaceDetector' in window){
    try{const f=await new FaceDetector({fastMode:true,maxDetectedFaces:40}).detect(img);add(f.map(x=>({x:x.boundingBox.x,y:x.boundingBox.y,w:x.boundingBox.width,h:x.boundingBox.height})))}catch(e){}
  }
  $('#detectStatus').textContent=boxesDetected.length?`已识别 ${boxesDetected.length} 位主体`:'已使用群像安全构图';
  return boxesDetected;
}
function smartCrop(){
  const iw=photo.naturalWidth||photo.width, ih=photo.naturalHeight||photo.height, tr=4/3;
  let maxSw,maxSh;
  if(iw/ih>tr){maxSh=ih;maxSw=ih*tr}else{maxSw=iw;maxSh=iw/tr}

  // 没有可靠主体识别时，也默认适度推进，不再把整个场地都塞进画面。
  if(boxesDetected.length<2){
    const z=(Number(photoZoom)||1)===1 ? 1.28 : Math.max(.72,Number(photoZoom)||1);
    let sw=maxSw/z, sh=sw/tr;
    let sx=(iw-sw)/2-photoDX*iw/W, sy=(ih-sh)/2-sh*.115-photoDY*ih/H;
    sx=Math.max(0,Math.min(iw-sw,sx)); sy=Math.max(0,Math.min(ih-sh,sy));
    return {sx,sy,sw,sh};
  }

  const faces=boxesDetected.slice();
  const x1=Math.min(...faces.map(b=>b.x));
  const x2=Math.max(...faces.map(b=>b.x+b.w));
  const y1=Math.min(...faces.map(b=>b.y));
  const y2=Math.max(...faces.map(b=>b.y+b.h));
  const ws=faces.map(b=>b.w).sort((a,b)=>a-b);
  const hs=faces.map(b=>b.h).sort((a,b)=>a-b);
  const medW=ws[Math.floor(ws.length/2)]||iw*.04;
  const medH=hs[Math.floor(hs.length/2)]||ih*.05;

  // 相邻主体中心距离 ≈ 一个人站位；左右各留一个站位。
  const centers=faces.map(b=>b.x+b.w/2).sort((a,b)=>a-b);
  const gaps=[];
  for(let i=1;i<centers.length;i++){
    const g=centers[i]-centers[i-1];
    if(g>medW*.9 && g<iw*.25)gaps.push(g);
  }
  gaps.sort((a,b)=>a-b);
  const onePerson=gaps.length?gaps[Math.floor(gaps.length/2)]:medW*2.25;
  const sideMargin=Math.max(medW*1.75,onePerson*.92);

  const groupW=x2-x1;
  let desiredW=groupW+sideMargin*2;

  // 从人脸向上下估算全身；优先人物填充，同时避免切头/切脚。
  const top=y1-medH*1.55;
  const bottom=y2+medH*6.6;
  let desiredH=Math.max(medH*8.4,bottom-top);

  let sw=Math.max(desiredW,desiredH*tr);
  let sh=sw/tr;
  if(sh<desiredH){sh=desiredH;sw=sh*tr}

  // 不能超过原图最大 4:3；也不要因为旧逻辑强行拉回近乎整图。
  sw=Math.min(sw,maxSw);sh=sw/tr;

  // 防止误检导致裁得过狠：默认最大推进约 1.65 倍。
  const minSw=maxSw/1.65;
  sw=Math.max(sw,minSw);sh=sw/tr;

  // 用户手动缩放继续生效。
  const userZoom=Number(photoZoom)||1;
  if(userZoom!==1){
    const factor=Math.max(.72,userZoom);
    sw=Math.min(maxSw,sw/factor);sh=sw/tr;
  }

  const cx=(x1+x2)/2;
  let sx=cx-sw/2-photoDX*iw/W;
  // V1.0.9：主体在成片中整体下移约 5%，减少‘人物贴顶’感，同时保留脚部。
  let sy=(y1+y2)/2-sh*.405-photoDY*ih/H;
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
  const c=smartCrop(), b=beauty/100, gr=styles[visualStyle].g;
  const bp=BEAUTY_PRESETS[beautyPreset]||BEAUTY_PRESETS.natural;
  const ex=bp.ex+manualColor.ex/100, ct=bp.ct+manualColor.ct/100, sa=bp.sa+manualColor.sa/100;
  const temp=bp.temp+manualColor.temp/4, hi=bp.hi+manualColor.hi/400, sh=bp.sh+manualColor.sh/400;
  const isNatural=beautyPreset==='natural';
  // V1.0.9：默认 A 不再靠“提白”制造通透，改为微对比+有色区域增艳。
  const br=Math.max(.65,(1+b*(isNatural?.025:.12)+ex)*gr.br);
  const con=Math.max(.6,(1+b*(isNatural?.035:.02)+ct)*gr.ct);
  const sat=Math.max(.2,(1+b*(isNatural?.075:.05)+sa)*gr.sa);
  ctx.save();
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.filter=`brightness(${br.toFixed(3)}) contrast(${con.toFixed(3)}) saturate(${sat.toFixed(3)}) hue-rotate(${gr.hue}deg)`;
  ctx.drawImage(photo,c.sx,c.sy,c.sw,c.sh,0,0,W,H);ctx.restore();
  // 高清细节叠加：原图直接二次轻刷，不经过低清中间图。
  if(!dragging){ctx.save();ctx.globalAlpha=isNatural?.22:.14;ctx.filter=isNatural?'contrast(1.095) saturate(1.045)':'contrast(1.055) saturate(1.025)';ctx.drawImage(photo,c.sx,c.sy,c.sw,c.sh,0,0,W,H);ctx.restore();}
  if(b>0&&!dragging&&beautyPreset!=='texture'&&!isNatural){ctx.save();ctx.globalAlpha=Math.min(.10,(.035*b+.008)*gr.glow);ctx.globalCompositeOperation='screen';ctx.filter='blur(10px) brightness(1.02)';ctx.drawImage(photo,c.sx,c.sy,c.sw,c.sh,0,0,W,H);ctx.restore();}
  // 默认 A 禁止粉/紫全局雾层；其他风格保持原逻辑。
  if(beautyPreset!=='texture'&&!isNatural){ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle=gr.tint;ctx.fillRect(0,0,W,H);ctx.restore();}
  if(bp.tint&&!isNatural){ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle=bp.tint;ctx.fillRect(0,0,W,H);ctx.restore();}
  if(temp!==0){ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle=temp>0?`rgba(255,145,65,${Math.min(.12,Math.abs(temp)/150).toFixed(3)})`:`rgba(90,165,255,${Math.min(.10,Math.abs(temp)/170).toFixed(3)})`;ctx.fillRect(0,0,W,H);ctx.restore();}
  if(hi!==0){ctx.save();ctx.globalCompositeOperation=hi>0?'screen':'multiply';ctx.globalAlpha=Math.min(.12,Math.abs(hi));ctx.fillStyle=hi>0?'#fff':'#8b8791';ctx.fillRect(0,0,W,H);ctx.restore();}
  if(sh!==0){ctx.save();ctx.globalCompositeOperation=sh>0?'screen':'multiply';ctx.globalAlpha=Math.min(.12,Math.abs(sh));ctx.fillStyle=sh>0?'#a6a0b2':'#4b4753';ctx.fillRect(0,0,W,H);ctx.restore();}
  // 自然模式不再叠白；避免肤色“白光”和画面发雾。
  if(b>0&&!isNatural){ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle=`rgba(255,250,246,${(.11*b).toFixed(3)})`;ctx.fillRect(0,0,W,H);ctx.restore();}
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

async function drawSticker(){
  const l=layers.sticker;if(!l.visible)return null;
  const pool=stickerPool();if(!pool.length)return null;
  const src=pool[stickerIndex%pool.length];
  try{
    const im=await load(src), base=190*l.scale, ar=im.width/im.height||1;
    let w=base,h=base;if(ar>1)h=base/ar;else w=base*ar;
    l.w=w;l.h=h;ctx.save();ctx.globalAlpha=.95;ctx.drawImage(im,l.x,l.y,w,h);
    if(density==='rich'&&crowd()==='low'&&pool.length>1){const im2=await load(pool[(stickerIndex+1)%pool.length]);const s=base*.48,ar2=im2.width/im2.height||1;ctx.globalAlpha=.62;ctx.drawImage(im2,l.x-50,l.y+h+10,ar2>1?s:s*ar2,ar2>1?s/ar2:s);}
    ctx.restore();return{x:l.x,y:l.y,w,h};
  }catch(e){return null}
}

function selectBox(b,n){
  if(selected!==n||!b) return;
  ctx.save();ctx.strokeStyle='#805cff';ctx.lineWidth=5;ctx.setLineDash([14,10]);
  ctx.strokeRect(b.x-8,b.y-8,b.w+16,b.h+16);ctx.restore();
}


// V15.8 P1 user combos — NEVER block the first photo frame.
const CUSTOM_COMBO_ACTIVE={"zumba":["zumba_01.png","zumba_02.png","zumba_03.png","zumba_04.png"],"lelepop":["lelepop_01.png","lelepop_02.png","lelepop_03.png","lelepop_04.png","lelepop_05.png"],"buttscaler":["buttscaler_01.png","buttscaler_02.png","buttscaler_03.jpg"],"zumba-camp":["zumba-camp_01.png","zumba-camp_02.png","zumba-camp_03.png","zumba-camp_04.png","zumba-camp_05.png"]};
const comboImageCache=new Map();
let customComboSrc=null,customComboImage=null,customComboScale=1;
function comboPath(c,name){return `./public/custom-combos/${c}/${name}`;}
function loadComboImage(src){
  if(comboImageCache.has(src)) return Promise.resolve(comboImageCache.get(src));
  return new Promise(resolve=>{
    const im=new Image();
    im.onload=()=>{comboImageCache.set(src,im);resolve(im)};
    im.onerror=()=>resolve(null);
    im.src=src+'?v=1.0.8';
  });
}
const DEFAULT_COMBO_FILE={
  'lelepop':'lelepop_01.png',
  'buttscaler':'buttscaler_01.png',
  'zumba':'zumba_01.png',
  'zumba-camp':'zumba-camp_01.png'
};

async function listCustomCombos(targetCourse=course){
  const names=CUSTOM_COMBO_ACTIVE[targetCourse]||[];
  const arr=await Promise.all(names.map(async name=>{
    const src=comboPath(targetCourse,name),im=await loadComboImage(src);
    return im?{src,im,name}:null;
  }));
  return arr.filter(Boolean);
}

// 默认搭配：严格读取用户固定成品图 _01。
// 不随机、不拼装独立 Q 版人物和课程文字，也不静默 fallback 到自定义搭配。
async function loadStrictDefaultCombo(targetCourse=course){
  const filename=DEFAULT_COMBO_FILE[targetCourse];
  if(!filename)return false;
  const src=comboPath(targetCourse,filename);
  const im=await loadComboImage(src);
  if(!im){
    customComboSrc=null;customComboImage=null;
    comboMode='finished';
    layers.title.visible=false;layers.character.visible=false;
    return false;
  }
  customComboSrc=src;
  customComboImage=im;
  comboMode='finished';
  layers.title.visible=false;
  layers.character.visible=false;
  localStorage.setItem('popshotLastCombo_'+targetCourse,src);
  return true;
}

async function nextCustomCombo(){
  const names=CUSTOM_COMBO_ACTIVE[course]||[];
  if(!names.length){customComboSrc=null;customComboImage=null;return false;}
  let cur=names.findIndex(n=>customComboSrc===comboPath(course,n));
  let next=(cur+1+names.length)%names.length;
  // 只加载“下一张”，不再每次 Promise.all 把整个课程素材池重新等一遍。
  for(let tries=0;tries<names.length;tries++){
    const name=names[(next+tries)%names.length],src=comboPath(course,name);
    const im=await Promise.race([loadComboImage(src),new Promise(r=>setTimeout(()=>r(null),1600))]);
    if(im){
      customComboSrc=src;customComboImage=im;comboMode='finished';
      localStorage.setItem('popshotLastCombo_'+course,customComboSrc);
      // 后台预热再下一张，不阻塞当前切换。
      const ni=(next+tries+1)%names.length;setTimeout(()=>loadComboImage(comboPath(course,names[ni])).catch(()=>{}),30);
      return true;
    }
  }
  return false;
}
function drawCustomCombo(){
  if(!customComboImage)return null;
  const im=customComboImage,ar=im.width/im.height||1;
  const maxW=W*.64,maxH=H*.22;
  let w=Math.min(maxW,maxH*ar)*customComboScale,h=w/ar;
  if(h>maxH){h=maxH;w=h*ar;}
  if(w>maxW){w=maxW;h=w/ar;}
  const x=(W-w)/2,y=24;
  ctx.drawImage(im,x,y,w,h);
  return {x,y,w,h};
}

async function render(){
  ctx.clearRect(0,0,W,H);
  if(!photo) return;
  $('#placeholder').classList.add('hidden');
  drawPhoto();
  if(beautyPreset!=='natural'){
    const wash=ctx.createLinearGradient(0,0,W,H);
    wash.addColorStop(0,'rgba(90,60,170,.022)');
    wash.addColorStop(1,'rgba(255,70,145,.018)');
    ctx.fillStyle=wash;ctx.fillRect(0,0,W,H);
  }
  drawFrame();
  drawGraffiti();

  const boxes={};
  if(comboMode==='finished'){
    layers.title.visible=false;layers.character.visible=false;
    if(customComboImage) boxes.customCombo=drawCustomCombo();
  }else{
    layers.title.visible=true;layers.character.visible=true;
    boxes.title=drawTitle();
    boxes.character=await drawCharacter();
  }
  if(layers.sticker.visible) boxes.sticker=await drawSticker();
  Object.entries(boxes).forEach(([n,b])=>selectBox(b,n));
  updateCheck();
}

function state(){
  return JSON.stringify({version:VERSION,layers,course,beauty,visualStyle,density,photoZoom,photoDX,photoDY,charIndex,titleIndex,frameIndex,stickerIndex,layoutIndex,zOrder,composeMode,graffitiSeed,beautyPreset,manualColor,stickerCategory});
}
function push(){undo.push(state());if(undo.length>30)undo.shift();redo=[];}
function restore(raw){
  const s=JSON.parse(raw);
  if(s.version!==VERSION){
    resetLayers();selected=null;locked=null;
    localStorage.removeItem('popshotDraftState');
    syncUI();render();return;
  }
  layers=s.layers||{};course=s.course||course;beauty=s.beauty??beauty;visualStyle=s.visualStyle||'energetic';density=s.density||'normal';composeMode=s.composeMode||composeMode;beautyPreset=s.beautyPreset||beautyPreset;manualColor=s.manualColor||manualColor;stickerCategory=s.stickerCategory||'recommended';
  photoZoom=s.photoZoom||1;photoDX=s.photoDX||0;photoDY=s.photoDY||0;
  charIndex=s.charIndex||0;titleIndex=s.titleIndex||0;frameIndex=s.frameIndex??1;stickerIndex=s.stickerIndex||0;layoutIndex=s.layoutIndex||1;graffitiSeed=s.graffitiSeed??graffitiSeed;
  zOrder=(s.zOrder||['title','character','sticker']).filter(x=>['title','character','sticker'].includes(x));
  if(!layers.title||!layers.character||!layers.sticker) resetLayers();
  if(comboMode==='finished'){
    layers.title.visible=false;
    layers.character.visible=false;
  }else{
    layers.title.visible=true;
    layers.character.visible=true;
    if(!zOrder.includes('title'))zOrder.unshift('title');
    if(!zOrder.includes('character'))zOrder.push('character');
  }
  syncUI();render();
}

function hist(){try{return JSON.parse(localStorage.popshotHistory||'[]')}catch{return[]}}
function comboKey(){return[course,charIndex,titleIndex,frameIndex,stickerIndex,layoutIndex,visualStyle].join('|')}
function pickCombo(){
  graffitiSeed=Math.floor(Math.random()*1e6);
  localStorage.popshotGraffitiSeed=graffitiSeed;
  const now=Date.now(), h=hist().filter(x=>x.time>now-14*864e5), wd=new Date().getDay();
  for(let i=0;i<120;i++){
    charIndex=Math.floor(Math.random()*Math.max(1,charFiles[course]?.length||1));
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
    $$('[data-style]').forEach(b=>b.classList.toggle('on',b.dataset.style===visualStyle));
  $$('[data-density]').forEach(b=>b.classList.toggle('on',b.dataset.density===density));
  $('#beautyText').textContent=(BEAUTY_PRESETS[beautyPreset]||BEAUTY_PRESETS.natural).label;
function warmCourseFirstCombos(){
  const current=course;
  const jobs=['lelepop','buttscaler','zumba','zumba-camp'].map(c=>{
    const names=CUSTOM_COMBO_ACTIVE[c]||[];
    return names[0]?loadComboImage(comboPath(c,names[0])):Promise.resolve(null);
  });
  Promise.allSettled(jobs).finally(()=>{course=current});
}
if('requestIdleCallback' in window) requestIdleCallback(warmCourseFirstCombos,{timeout:1800});
else setTimeout(warmCourseFirstCombos,900);

$$('[data-preset]').forEach(b=>b.classList.toggle('on',b.dataset.preset===beautyPreset));
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
  const seq=++photoLoadSeq;
  const oldURL=currentPhotoObjectURL;
  const u=URL.createObjectURL(f);
  currentPhotoObjectURL=u;
  const im=new Image();
  const ph=$('#placeholder'), status=$('#detectStatus');
  if(ph){ph.classList.remove('hidden');ph.textContent='正在读取原图…';}
  if(status)status.textContent='正在读取原图…';

  let done=false;
  const fail=(msg)=>{
    if(done||seq!==photoLoadSeq)return;
    done=true;
    if(currentPhotoObjectURL===u){try{URL.revokeObjectURL(u)}catch(_){} currentPhotoObjectURL=null;}
    if(ph){ph.classList.remove('hidden');ph.textContent='照片读取失败，请重新选择';}
    if(status)status.textContent='照片读取失败';
    toast(msg||'照片读取失败，请重新选择图片');
  };
  const timer=setTimeout(()=>fail('照片读取时间过长，请重新选择一次'),12000);

  im.onload=async()=>{
    if(seq!==photoLoadSeq)return;
    clearTimeout(timer);done=true;
    if(oldURL&&oldURL!==u){try{URL.revokeObjectURL(oldURL)}catch(_){}}
    photo=im;photoZoom=1;photoDX=photoDY=0;boxesDetected=[];
    const sourceW=im.naturalWidth||im.width, sourceH=im.naturalHeight||im.height;
    if(status)status.textContent=`原图 ${sourceW}×${sourceH} · 已读取`;

    customComboSrc=null;customComboImage=null;
    pickCombo();resetLayers();autoPlace();
    await render();
    if(ph)ph.classList.add('hidden');

    // 固定默认搭配后台加载，最多4秒，不阻塞首屏
    if(status)status.textContent=`原图 ${sourceW}×${sourceH} · 正在匹配默认搭配…`;
    Promise.race([
      loadStrictDefaultCombo(course),
      new Promise(resolve=>setTimeout(()=>resolve(false),4000))
    ]).then(ok=>{
      if(seq!==photoLoadSeq)return;
      if(ok)render();
      if(status)status.textContent=`原图 ${sourceW}×${sourceH} · ${ok?'默认搭配已加载':'默认搭配素材待刷新'}`;
      updateCheck();
    }).catch(()=>{});

    // 主体识别后台跑，失败/超时不影响生成
    setTimeout(()=>Promise.race([
      detectPeople(im),
      new Promise(resolve=>setTimeout(()=>resolve([]),5000))
    ]).then(()=>{
      if(seq!==photoLoadSeq)return;
      autoPlace();render();saveDraft();updateCheck();
    }).catch(()=>{}),80);

    setTimeout(()=>Promise.resolve(saveImage(f)).catch(()=>{}),120);
    setTimeout(()=>Promise.resolve(saveDraft()).catch(()=>{}),150);
  };
  im.onerror=()=>{clearTimeout(timer);fail('照片读取失败，请重新选择图片');};
  im.src=u;
  input.value='';
};

let courseSwitchSeq=0;
$('#courseGrid').onclick=e=>{
  const b=e.target.closest('[data-course]');if(!b)return;
  const nextCourse=b.dataset.course;
  if(nextCourse===course && !b.classList.contains('is-switching'))return;

  push();
  const seq=++courseSwitchSeq;
  course=nextCourse;
  localStorage.popshotLastCourse=course;
  customComboSrc=null;customComboImage=null;
  comboMode='finished';
  layers.title.visible=false;layers.character.visible=false;
  syncUI();render();

  document.querySelectorAll('[data-course]').forEach(x=>x.classList.remove('is-switching'));
  b.classList.add('is-switching');
  $('#detectStatus').textContent='正在切换 '+(courseNames[course]||course)+'…';

  Promise.race([
    loadStrictDefaultCombo(course),
    new Promise(resolve=>setTimeout(()=>resolve(false),2200))
  ]).then(ok=>{
    if(seq!==courseSwitchSeq)return;
    document.querySelectorAll('[data-course]').forEach(x=>x.classList.remove('is-switching'));
    comboMode='finished';
    layers.title.visible=false;layers.character.visible=false;
    syncUI();render();saveDraft();updateCheck();
    $('#detectStatus').textContent=ok
      ? `${courseNames[course]||course} · 默认搭配已加载`
      : `${courseNames[course]||course} · 默认搭配素材未加载`;
    if(!ok)toast((courseNames[course]||course)+' 默认搭配素材未加载，请刷新素材');
  }).catch(err=>{
    console.warn('course switch',err);
    if(seq!==courseSwitchSeq)return;
    document.querySelectorAll('[data-course]').forEach(x=>x.classList.remove('is-switching'));
    $('#detectStatus').textContent=(courseNames[course]||course)+' · 切换失败，请重试';
    toast('课程切换失败，请再点一次');
  });
};
$$('[data-preset]').forEach(b=>b.onclick=()=>{push();beautyPreset=b.dataset.preset;beauty=beautyPreset==='original'?0:55;manualColor={ex:0,ct:0,sa:0,temp:0,hi:0,sh:0};localStorage.popshotBeautyPreset=beautyPreset;localStorage.popshotLastBeauty=beauty;syncUI();render();saveDraft();});
$$('[data-style]').forEach(b=>b.onclick=()=>{
  if(comboMode!=='custom'){toast('一键换风格仅用于「自定义搭配」');return;}
  push();visualStyle=b.dataset.style;localStorage.popshotStyle=visualStyle;stickerIndex=0;syncUI();render();saveDraft();
});
$$('[data-density]').forEach(b=>b.onclick=()=>{
  push();density=b.dataset.density;autoPlace();syncUI();render();saveDraft();
});

let generateBusy=false;
$('#generateBtn').onclick=async()=>{
  if(!photo)return alert('请先上传照片');
  if(generateBusy)return;
  generateBusy=true;
  const btn=$('#generateBtn'),old=btn.textContent;
  btn.disabled=true;btn.textContent='正在生成…';
  try{
    push();pickCombo();resetLayers();autoPlace();selected=null;
    customComboSrc=null;customComboImage=null;
    const ok=await loadStrictDefaultCombo(course);
    if(ok){comboMode='finished';layers.title.visible=false;layers.character.visible=false;}
    else{comboMode='finished';layers.title.visible=false;layers.character.visible=false;}
    render();saveDraft();updateCheck();
  }finally{
    generateBusy=false;btn.disabled=false;btn.textContent=old||'✦ 一键生成';
  }
};
let shuffleBusy=false;
$('#shuffleBtn').onclick=async()=>{
  if(!photo||shuffleBusy)return;
  shuffleBusy=true;
  const btn=$('#shuffleBtn'),old=btn.textContent;
  btn.disabled=true;btn.textContent='切换中…';
  try{
    push();
    const ok=await nextCustomCombo();
    if(!ok){
      customComboSrc=null;customComboImage=null;pickCombo();resetLayers();autoPlace();
      comboMode='custom';layers.title.visible=true;layers.character.visible=true;
    }else{
      comboMode='finished';layers.title.visible=false;layers.character.visible=false;
    }
    selected=null;syncComboQuickUI();render();saveDraft();updateCheck();
  }finally{
    shuffleBusy=false;btn.disabled=false;btn.textContent=old||'↻ 换一版';
  }
};



let comboMode='finished';
let finishedComboScale=1;

function applyFinishedComboScale(v){
  finishedComboScale=Math.max(.65,Math.min(1.45,Number(v)||1));
  customComboScale=finishedComboScale;
  render();saveDraft();
}

function syncComboQuickUI(){
  const f=$('#finishedQuickBtn'),c=$('#customQuickBtn');
  if(f)f.classList.toggle('on',comboMode!=='custom');
  if(c)c.classList.toggle('on',comboMode==='custom');
  const styleRow=document.querySelector('.style-row');
  if(styleRow)styleRow.style.display=comboMode==='custom'?'block':'none';
  const comp=document.getElementById('compositionMode');
  if(comp)comp.style.display=comboMode==='custom'?'flex':'none';
}
async function activateFinishedQuick(){
  comboMode='finished';
  layers.title.visible=false;layers.character.visible=false;
  if(!customComboImage){await loadStrictDefaultCombo(course);}
  if(!customComboImage){toast('当前课程暂无默认搭配');comboMode='custom';layers.title.visible=true;layers.character.visible=true;}
  syncComboQuickUI();render();saveDraft();
}
function activateCustomQuick(){
  comboMode='custom';customComboSrc=null;customComboImage=null;
  layers.title.visible=true;layers.character.visible=true;
  syncComboQuickUI();render();saveDraft();showCustomComboControls();
}

function showComboHub(){
  $('#drawerTitle').textContent='搭配';
  drawerBody.innerHTML=`
    <div class="combo-mode-tabs">
      <button id="comboTabFinished" class="on">默认搭配</button>
      <button id="comboTabCustom">自定义搭配</button>
    </div>
    <div id="comboModeContent"></div>`;
  drawer.classList.add('show');
  $('#comboTabFinished').onclick=()=>renderComboMode('finished');
  $('#comboTabCustom').onclick=()=>renderComboMode('custom');
  renderComboMode(comboMode==='custom'?'custom':'finished');
}
async function renderComboMode(mode){
  const a=$('#comboTabFinished'),b=$('#comboTabCustom'),wrap=$('#comboModeContent');
  a.classList.toggle('on',mode==='finished');b.classList.toggle('on',mode==='custom');
  syncComboQuickUI();
  if(mode==='finished'){
    comboMode='finished';
    wrap.innerHTML=`
      <div class="adjust-tip">系统已经搭配好的完整方案。默认优先使用，不会叠加自定义Q版人物或课程文字。</div>
      <div class="asset-picker" id="finishedComboPicker"><span>正在读取成品组合…</span></div>
      <label class="slider-row"><span>整体大小</span><input id="finishedScale" type="range" min="65" max="145" value="${Math.round((customComboScale||1)*100)}"><b>${Math.round((customComboScale||1)*100)}%</b></label>`;
    const arr=await listCustomCombos(),picker=$('#finishedComboPicker');picker.innerHTML='';
    if(!arr.length){picker.innerHTML='<div class="adjust-tip">当前课程暂无默认搭配。</div>'}
    else arr.forEach(({src,im})=>{const btn=document.createElement('button');btn.className='asset-option'+(src===customComboSrc?' on':'');btn.innerHTML=`<img src="${src}" alt="">`;btn.onclick=()=>{customComboSrc=src;customComboImage=im;comboMode='finished';render();saveDraft();renderComboMode('finished')};picker.appendChild(btn)});
    const r=$('#finishedScale'),v=r.nextElementSibling;
    r.oninput=()=>{customComboScale=Math.max(.65,Math.min(1.45,Number(r.value)/100));v.textContent=r.value+'%';render();saveDraft()};
  }else{
    comboMode='custom';customComboSrc=null;customComboImage=null;layers.title.visible=true;layers.character.visible=true;render();saveDraft();
    wrap.innerHTML=`
      <div class="adjust-tip">自己搭配 Q版人物 + 课程字样，可分别选择、拖动和缩放。</div>
      <button class="wide-btn" id="pickCustomChar">选择Q版人物</button>
      <button class="wide-btn" id="pickCustomLogo">选择课程字样</button>
      <div class="adjust-tip">选择后可在成图上拖动位置，并用大小控制调整尺寸。</div>`;
    $('#pickCustomChar').onclick=showCharacterPicker;
    $('#pickCustomLogo').onclick=showTitlePicker;
  }
}

function showFinishedComboControls(){
  $('#drawerTitle').textContent='成品组合（推荐）';
  drawerBody.innerHTML=`
    <div class="adjust-tip">人物和课程字样已经搭配好，直接使用即可。可以换款式，也可以只调整整体大小。</div>
    <button class="wide-btn" id="nextFinishedCombo">换一个成品组合</button>
    <label class="slider-row"><span>整体大小</span><input id="finishedComboScale" type="range" min="65" max="145" value="${Math.round(finishedComboScale*100)}"><b>${Math.round(finishedComboScale*100)}%</b></label>`;
  drawer.classList.add('show');
  $('#nextFinishedCombo').onclick=async()=>{const ok=await nextCustomCombo();comboMode='finished';if(ok){render();toast('已更换成品组合')}saveDraft()};
  const r=$('#finishedComboScale'),b=r.nextElementSibling;
  r.oninput=()=>{b.textContent=r.value+'%';applyFinishedComboScale(r.value/100)};
}
function showCustomComboControls(){
  comboMode='custom';
  customComboSrc=null;customComboImage=null;
  layers.title.visible=true;layers.character.visible=true;
  $('#drawerTitle').textContent='自定义组合';
  drawerBody.innerHTML=`
    <div class="adjust-tip">想自己搭配时使用：分别选择Q版人物和课程字样，并可调整各自大小和位置。</div>
    <button class="wide-btn" id="customCharPick">选择Q版人物</button>
    <button class="wide-btn" id="customLogoPick">选择课程字样</button>
    <div class="adjust-tip">选中画布上的人物或字样后，可直接拖动位置；使用原有大小调整控制修改尺寸。</div>`;
  drawer.classList.add('show');
  $('#customCharPick').onclick=showCharacterPicker;
  $('#customLogoPick').onclick=showTitlePicker;
  render();saveDraft();
}


function warmFinishedCombos(){
  listCustomCombos().catch(()=>{});
}

async function showComboPicker(){
  $('#drawerTitle').textContent='成品组合';
  drawerBody.innerHTML='<div class="asset-picker" id="comboPicker"><span>读取中…</span></div>';
  drawer.classList.add('show');
  const arr=await listCustomCombos(),wrap=$('#comboPicker');wrap.innerHTML='';
  if(!arr.length){wrap.innerHTML='<div class="adjust-tip">当前课程暂无成品组合</div>';return;}
  arr.forEach(({src,im})=>{
    const b=document.createElement('button');b.className='asset-option';
    b.innerHTML=`<img src="${src}" alt="">`;
    b.onclick=()=>{customComboSrc=src;customComboImage=im;comboMode='finished';drawer.classList.remove('show');render();toast('已更换成品组合');saveDraft();};
    wrap.appendChild(b);
  });
}

function showCharacterPicker(){
  $('#drawerTitle').textContent='选择人物';
  drawerBody.innerHTML='<div class="asset-picker" id="characterPicker"></div>';
  const wrap=$('#characterPicker');
  charFiles[course].forEach((f,i)=>{
    const b=document.createElement('button');
    b.className='asset-option'+(i===charIndex?' on':'');
    b.innerHTML=`<img src="${asset(course,i)}" alt="">`;
    b.onclick=()=>{push();customComboSrc=null;customComboImage=null;charIndex=i;drawer.classList.remove('show');render();saveDraft()};
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
    b.onclick=()=>{push();customComboSrc=null;customComboImage=null;titleIndex=i;drawer.classList.remove('show');render();saveDraft()};
    wrap.appendChild(b);
  });
  drawer.classList.add('show');
}
function showStickerPicker(){
  $('#drawerTitle').textContent='选择贴纸';
  const active=activeHolidayCategory();
  const cats=['recommended','general','dance','fitness','cute','graphic'];if(active)cats.push(active);
  if(STICKER_CATEGORIES[stickerCategory]?.holiday&&!active)stickerCategory='recommended';
  drawerBody.innerHTML=`${active?`<div class="holiday-badge">✦ ${STICKER_CATEGORIES[active].label}已开启</div>`:''}<div class="sticker-tabs">${cats.map(k=>`<button data-sc="${k}" class="${k===stickerCategory?'on':''}">${STICKER_CATEGORIES[k].label}</button>`).join('')}</div><div class="sticker-grid" id="stickerPicker"></div>`;
  const stickerName=(src,i)=>{const f=(src.split('/').pop()||'').replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ');return f?f.replace(/\b\w/g,c=>c.toUpperCase()):`贴纸 ${i+1}`};
  const build=()=>{const wrap=$('#stickerPicker'),pool=stickerPool();wrap.innerHTML='';pool.forEach((s,i)=>{const b=document.createElement('button');b.className='sticker-option'+(i===stickerIndex?' on':'');const name=stickerName(s,i);b.innerHTML=`<img src="${s}" alt=""><span class="sticker-name">${name}</span>`;const im=b.querySelector('img');im.onerror=()=>{ if(s.includes('/sticker-library/')) b.remove(); else {im.remove();b.classList.add('text-only')} };b.onclick=()=>{push();stickerIndex=i;layers.sticker.visible=true;layers.sticker.scale=Math.max(1.15,layers.sticker.scale||1);selected='sticker';drawer.classList.remove('show');render();saveDraft();syncScaleUI();toast(`已添加：${name}，可直接在图片上拖动`)};wrap.appendChild(b)});if(!pool.length)wrap.innerHTML='<div class="adjust-tip">当前分类暂无贴纸</div>';};
  $$('[data-sc]').forEach(b=>b.onclick=()=>{stickerCategory=b.dataset.sc;stickerIndex=0;$$('[data-sc]').forEach(x=>x.classList.toggle('on',x===b));build();});
  build();drawer.classList.add('show');
}



$('#changeStickerBtn').onclick=showStickerPicker;
$('#changeFrameBtn').onclick=()=>{
  $('#drawerTitle').textContent='选择相框';
  drawerBody.innerHTML='<div class="adjust-tip">点击相框即可立即预览。大按钮和大缩略图更适合手机操作。</div><div class="frame-grid" id="frameGrid"></div>';
  const wrap=$('#frameGrid');
  for(let i=0;i<12;i++){
    const b=document.createElement('button');b.className='frame-option'+(i===frameIndex?' on':'');
    b.innerHTML=`<span class="frame-preview fp-${i}"></span><b>${i===0?'无边框':'相框 '+i}</b>`;
    b.onclick=()=>{push();frameIndex=i;drawer.classList.remove('show');render();saveDraft();};
    wrap.appendChild(b);
  }
  drawer.classList.add('show');
};
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
  $('#drawerTitle').textContent='美化与调色';
  const keys=['natural','bright','vivid','clear','warm','coolwhite','softpink','creamtone','retro','contrast','desat','colorful'];
  drawerBody.innerHTML=`<div class="adjust-tip">首次默认使用「鲜活自然」：轻提气色与主色，不做重饱和。所有调节都会作用于最终高清导出。</div><div class="beauty-preset-grid">${keys.map(k=>`<button data-bp="${k}" class="${beautyPreset===k?'on':''}">${BEAUTY_PRESETS[k].label}</button>`).join('')}</div><div class="adjust-grid">${[['ex','亮度'],['ct','对比'],['sa','饱和'],['temp','色温'],['hi','高光'],['sh','阴影']].map(([k,n])=>`<div class="range-row"><span>${n}</span><input data-color="${k}" type="range" min="-50" max="50" value="${manualColor[k]||0}"><b>${manualColor[k]||0}</b></div>`).join('')}</div><div class="saved-color-actions"><button id="saveMyColor" class="primary-mini">保存为我的常用</button><button id="useDefaultA" class="ghost">恢复默认 A</button></div><div class="adjust-tip" id="myColorStatus">${localStorage.popshotMyColor?'✓ 已保存个人常用配置，下次会优先使用':'尚未保存个人配置'}</div>`;
  drawer.classList.add('show');
  $$('[data-bp]').forEach(b=>b.onclick=()=>{push();beautyPreset=b.dataset.bp;beauty=55;manualColor={ex:0,ct:0,sa:0,temp:0,hi:0,sh:0};localStorage.popshotBeautyPreset=beautyPreset;$('#beautyText').textContent=BEAUTY_PRESETS[beautyPreset].label;$('#beautyBtn').click();render();saveDraft();});
  $$('[data-color]').forEach(r=>r.oninput=e=>{manualColor[e.target.dataset.color]=+e.target.value;e.target.nextElementSibling.textContent=e.target.value;render();saveDraft();});
  $('#saveMyColor').onclick=()=>{localStorage.popshotMyColor=JSON.stringify({beautyPreset,manualColor});localStorage.popshotBeautyPreset=beautyPreset;$('#myColorStatus').textContent='✓ 已保存为我的常用，下次进入优先使用';saveDraft();};
  $('#useDefaultA').onclick=()=>{beautyPreset='natural';beauty=55;manualColor={ex:0,ct:0,sa:0,temp:0,hi:0,sh:0};localStorage.removeItem('popshotMyColor');localStorage.popshotBeautyPreset='natural';localStorage.popshotLastBeauty=beauty;$('#beautyText').textContent=BEAUTY_PRESETS.natural.label;$('#beautyBtn').click();render();saveDraft();};
};
$('#adjustPhotoBtn').onclick=()=>{
  photoAdjust=true;selected=null;$('.canvas-stage').classList.add('adjusting');
  $('#drawerTitle').textContent='调整原图';
  drawerBody.innerHTML=`<div class="adjust-tip"><b>原图级调整</b> · 成图保持 4:3；最终保存会按当前裁剪区域的原始有效像素重新渲染。直接拖动原始照片；手机可双指缩放。</div><div class="range-row"><span>原图缩放</span><input id="zoomRange" type="range" min="72" max="220" value="${Math.round(photoZoom*100)}"><b>${Math.round(photoZoom*100)}%</b></div><div class="crop-actions"><button id="showFull" class="ghost">显示更多原图</button><button id="cropReset" class="ghost">智能构图</button><button id="cropDone" class="primary-mini">完成</button></div>`;
  drawer.classList.add('show');
  $('#zoomRange').oninput=e=>{photoZoom=+e.target.value/100;e.target.nextElementSibling.textContent=e.target.value+'%';render();saveDraft()};
  $('#showFull').onclick=()=>{photoZoom=.78;photoDX=photoDY=0;render();saveDraft()};
  $('#cropReset').onclick=()=>{photoZoom=1;photoDX=photoDY=0;render();saveDraft()};
  $('#cropDone').onclick=()=>{photoAdjust=false;$('.canvas-stage').classList.remove('adjusting');drawer.classList.remove('show');saveDraft()};
};

function getLosslessExportSize(){
  if(!photo)return {w:W,h:H,crop:null,scale:1};
  const c=smartCrop();
  const iw=photo.naturalWidth||photo.width, ih=photo.naturalHeight||photo.height;

  // 最终像素规格取“原图能提供的最大 4:3 分辨率”，不再因为自动构图放大
  // 就把成片从 1706×1279 主动降到 1444×1083。
  let w,h;
  if(iw/ih>=4/3){
    h=Math.floor(ih);
    w=Math.floor(h*4/3);
  }else{
    w=Math.floor(iw);
    h=Math.floor(w*3/4);
  }
  w=Math.max(4,w-(w%4));
  h=Math.max(3,Math.round(w*3/4));
  return {w,h,crop:c,scale:w/W};
}

function updateCheck(){
  if(!photo)return;
  const q=getLosslessExportSize();
  const iw=photo.naturalWidth||photo.width, ih=photo.naturalHeight||photo.height;
  $('#exportCheck').textContent=`✓ 原图 ${iw}×${ih} → 高清导出 ${q.w}×${q.h} · 4:3 · PNG无损`;
  $('#exportCheck').classList.add('ok');
}


function popshotV108FinalColorPass(ctx,w,h){
  // V1.0.9: remove haze, enhance colored clothing/background, protect skin.
  try{
    const img=ctx.getImageData(0,0,w,h), d=img.data;
    for(let i=0;i<d.length;i+=4){
      let r=d[i], g=d[i+1], b=d[i+2];
      const skin = r>92 && g>42 && b>24 && r>g && g>b*0.72 &&
                   (r-g)>8 && (r-b)>14 && (Math.max(r,g,b)-Math.min(r,g,b))<125;
      const c=1.075; // micro-contrast / dehaze
      r=(r-128)*c+128; g=(g-128)*c+128; b=(b-128)*c+128;
      const gray=.299*r+.587*g+.114*b;
      const chroma=Math.max(r,g,b)-Math.min(r,g,b);
      if(skin){
        // no white glow; slightly neutralize excess red/yellow
        r = r*0.992; g = g*1.004; b = b*1.010;
      }else if(chroma>15){
        const s=1.13;
        r=gray+(r-gray)*s; g=gray+(g-gray)*s; b=gray+(b-gray)*s;
      }
      d[i]=Math.max(0,Math.min(255,r));
      d[i+1]=Math.max(0,Math.min(255,g));
      d[i+2]=Math.max(0,Math.min(255,b));
    }
    ctx.putImageData(img,0,0);
  }catch(e){ console.warn('V108 color pass skipped',e); }
}

async function renderLosslessExport(){
  const q=getLosslessExportSize();
  const exportCanvas=document.createElement('canvas');
  exportCanvas.width=q.w; exportCanvas.height=q.h;
  const exportCtx=exportCanvas.getContext('2d',{alpha:false,willReadFrequently:false});
  exportCtx.imageSmoothingEnabled=true;
  exportCtx.imageSmoothingQuality='high';

  // 画面中的所有位置仍使用稳定的 2525×1894 逻辑坐标；
  // 这里只把逻辑坐标映射到原图有效像素级输出，绝不拿手机预览图二次放大。
  const previewCanvas=canvas, previewCtx=ctx;
  canvas=exportCanvas; ctx=exportCtx;
  ctx.setTransform(q.w/W,0,0,q.h/H,0,0);
  try{
    await render();
  }finally{
    canvas=previewCanvas; ctx=previewCtx;
  }
  return {canvas:exportCanvas,w:q.w,h:q.h};
}

$('#exportBtn').onclick=async()=>{
  if(!photo)return alert('请先上传照片');
  const btn=$('#exportBtn'),old=btn.innerHTML;
  try{
    btn.disabled=true;btn.innerHTML='正在按原图分辨率生成…';
    selected=null;photoAdjust=false;$('.canvas-stage').classList.remove('adjusting');

    const hi=await renderLosslessExport();
    const blob=await new Promise((res,rej)=>hi.canvas.toBlob(b=>b?res(b):rej(new Error('export')),'image/png'));
    const filename=`PopShot-${course}-${hi.w}x${hi.h}-${Date.now()}.png`;
    const file=new File([blob],filename,{type:'image/png'});
    const ua=navigator.userAgent||'', isiOS=/iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1), isAndroid=/Android/i.test(ua);

    if(isiOS&&navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      try{await navigator.share({files:[file],title:'保存 PopShot 原图级 PNG'});showSaveToast(`已生成 ${hi.w}×${hi.h} 无损PNG，请选择“存储图像”`);return}catch(err){if(err?.name==='AbortError')return}
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=filename;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
    if(isAndroid){setTimeout(()=>showSaveFallback(blob,filename,true),650)}
    else{showSaveToast(`已生成 ${hi.w}×${hi.h} 无损PNG`);setTimeout(()=>URL.revokeObjectURL(url),5000)}
  }catch(err){
    console.error(err);
    alert('原图级导出失败，请不要关闭页面并重新保存一次。');
  }finally{
    btn.disabled=false;btn.innerHTML=old||'↓ 保存到相册';
    render(); // 恢复手机预览
  }
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
      const file=new File([blob],filename,{type:'image/png'});
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
  const btn=$('#forceRefreshBtn'); if(btn){btn.disabled=true;btn.textContent='正在更新…';}
  showUpdateToast('正在更新到最新版本，请稍候…',false);
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


// v14.1 — 顶部人物×Logo组合：目标 150%，但始终服从真人安全区与左右留白。
function clampTopComboLayout(box, canvasW, canvasH, occupiedTopRects=[]){
  const halfCharacterGap=Math.max(70, box.characterVisualWidth*0.5);
  const sideSafe=halfCharacterGap;
  const topSafe=Math.max(28, canvasH*0.018);
  const maxW=Math.max(1, canvasW-sideSafe*2);

  let scale=Math.min(1.5, maxW/Math.max(1,box.baseWidth));
  let w=box.baseWidth*scale, h=box.baseHeight*scale;
  let x=(canvasW-w)/2, y=topSafe;

  // 若顶部真人安全区与组合相交，则逐级回落，绝不硬盖脸。
  const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  for(let i=0;i<12;i++){
    const test={x,y,w,h};
    if(!occupiedTopRects.some(r=>intersects(test,r))) break;
    scale*=0.94;
    w=box.baseWidth*scale; h=box.baseHeight*scale;
    x=(canvasW-w)/2;
  }
  return {x,y,w,h,scale,sideSafe};
}


document.addEventListener('dblclick',e=>{
  if(e.target.closest('button,.quick-actions,.bottom-bar')) e.preventDefault();
},{passive:false});

document.addEventListener('DOMContentLoaded',()=>{
  const a=$('#comboHubBtn');
  if(a)a.onclick=showComboHub;
  const fq=$('#finishedQuickBtn'),cq=$('#customQuickBtn');
  if(fq)fq.onclick=()=>{activateFinishedQuick();};
  if(cq)cq.onclick=activateCustomQuick;
  syncComboQuickUI();
});


async function refreshVersionStatusFixed(){
  try{
    const r=await fetch('./version.json?ts='+Date.now(),{cache:'no-store'});
    if(!r.ok)return;
    const data=await r.json();
    const remote=data.version||'0';
    const cmp=compareVersion(remote,VERSION);
    const badge=document.querySelector('#versionBadge,.version-badge');
    if(badge){
      if(cmp===0) badge.textContent=`v${VERSION} ✓ 最新`;
      else if(cmp>0) badge.textContent=`v${VERSION} · 可更新至 v${remote}`;
      else badge.textContent=`v${VERSION} · 部署同步中`;
    }
    const tip=document.querySelector('#updateTip');
    const msg=document.querySelector('#updateTipMsg');
    const btn=document.querySelector('#forceRefreshBtn');
    if(cmp>0){
      if(msg)msg.textContent=`发现新版本 v${remote}`;
      if(btn){btn.classList.remove('hidden');btn.textContent='更新并刷新';}
      if(tip)tip.classList.remove('hidden');
    }else if(tip){
      tip.classList.add('hidden');
    }
  }catch(e){console.warn('version check',e)}
}
async function forceUpdateAndReload(){
  const btn=document.querySelector('#forceRefreshBtn');
  try{
    if(btn){btn.disabled=true;btn.textContent='正在更新…';}
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister().catch(()=>false)));
    }
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
    location.replace(location.pathname+'?fresh='+Date.now());
  }catch(e){
    console.error(e);
    if(btn){btn.disabled=false;btn.textContent='更新并刷新';}
    toast('更新失败，请刷新页面后重试');
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  const b=document.querySelector('#forceRefreshBtn');
  if(b)b.onclick=forceUpdateAndReload;
  refreshVersionStatusFixed();
});



function preloadStrictDefaultCombos(){
  Object.entries(DEFAULT_COMBO_FILE).forEach(([c,f])=>{
    loadComboImage(comboPath(c,f)).catch(()=>null);
  });
}
if('requestIdleCallback' in window) requestIdleCallback(preloadStrictDefaultCombos,{timeout:1200});
else setTimeout(preloadStrictDefaultCombos,700);



function repairCourseImages(){
  const fallbacks={
    'lelepop':'./public/assets/characters/lelepop/lelepop_01.png?v=1.0.8',
    'buttscaler':'./public/assets/characters/buttscaler/buttscaler_01.png?v=1.0.8',
    'zumba':'./public/assets/characters/zumba/zumba_01.png?v=1.0.8',
    'zumba-camp':'./public/assets/characters/zumba-camp/zumba_camp_01.png?v=1.0.8'
  };
  document.querySelectorAll('.course-card img').forEach(img=>{
    img.loading='eager'; img.decoding='async';
    img.onerror=()=>{
      const c=img.closest('[data-course]')?.dataset.course;
      const fb=fallbacks[c];
      if(fb && !img.dataset.fallbackTried){
        img.dataset.fallbackTried='1'; img.src=fb;
      }
    };
  });
}
document.addEventListener('DOMContentLoaded',repairCourseImages);



document.addEventListener('DOMContentLoaded',()=>{
  const dz=document.querySelector('.dropzone');
  const fi=document.querySelector('#photoInput');
  if(dz&&fi){
    fi.addEventListener('click',()=>{
      const s=document.querySelector('#detectStatus');
      if(s&&!photo)s.textContent='请选择一张照片…';
    },{passive:true});
  }
});


const POPSHOT_REFRESH_ONCE='popshot_refresh_once_'+POPSHOT_VERSION;
async function forcePopShotUpdate(){
  try{
    if(sessionStorage.getItem(POPSHOT_REFRESH_ONCE)==='1'){
      sessionStorage.removeItem(POPSHOT_REFRESH_ONCE);
      return;
    }
    sessionStorage.setItem(POPSHOT_REFRESH_ONCE,'1');
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      for(const reg of regs){ try{ await reg.update(); }catch(e){} }
    }
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.filter(k=>/popshot/i.test(k)).map(k=>caches.delete(k)));
    }
  }catch(e){console.warn('force update',e)}
  location.replace(location.pathname+'?v='+Date.now());
}
window.forcePopShotUpdate=forcePopShotUpdate;
setTimeout(checkPopShotUpdate,900);

async function checkForPopShotUpdate(){
  try{
    const res=await fetch('./version.json?t='+Date.now(),{cache:'no-store'});
    const remote=await res.json();
    const rv=String(remote.version||'');
    if(rv && comparePopShotVersion(rv,POPSHOT_VERSION)>0){
      if(confirm(`发现新版本 V${rv}，立即更新？`)){
        await forcePopShotUpdate();
      }
      return true;
    }
  }catch(e){console.warn('update check',e)}
  return false;
}
