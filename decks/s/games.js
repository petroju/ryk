/* =================== games: sound S =================== */
Object.assign(W,{sumka:'сумка',sanky:'санки',samokat:'самокат',sobaka:'собака',sosna:'сосна',stil:'стіл',stilets:'стілець',sklianka:'склянка',salat:'салат',suknia:'сукня',slyva:'слива',kapusta:'капуста',
 ananas:'ананас',avtobus:'автобус',kaktus:'кактус',lysytsia:'лисиця',osa:'оса',koleso:'колесо',myska:'миска',sosyska:'сосиска',lystok:'листок',kokos:'кокос',hlobus:'глобус',som:'сом',
 snihovyk:'сніговик',kubok:'кубок',sova:'сова',slon:'слон',syr:'сир',sontse:'сонце',banan:'банан',yabluko:'яблуко',lymon:'лимон'});

/* hissing air: the "S-s-s" sound */
let hs=null;
function hiss(on){try{ if(on&&!hs&&!muted){const a=AC(),b=a.createBuffer(1,a.sampleRate,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    const n=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();n.buffer=b;n.loop=true;f.type='highpass';f.frequency.value=4500;g.gain.value=.1;n.connect(f).connect(g).connect(a.destination);n.start();hs=n;}
  else if(!on&&hs){hs.stop();hs=null;}}catch(e){hs=null}}
const balloonSVG=(c,k)=>`<svg viewBox="0 0 230 290"><defs><radialGradient id="bg${k}" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".25" stop-color="${c}"/><stop offset="1" stop-color="${c}"/></radialGradient></defs>
  <path d="M115 6 C40 6 6 62 6 122 c0 76 64 124 109 132 c45 -8 109 -56 109 -132 C224 62 190 6 115 6z" fill="url(#bg${k})" stroke="rgba(0,0,0,.18)" stroke-width="4"/><path d="M100 252 l30 0 l-6 28 l-18 0z" fill="${c}"/>
  <ellipse cx="70" cy="70" rx="22" ry="34" fill="#fff" opacity=".45" transform="rotate(-28 70 70)"/></svg>`;

/* 1 — pump: isolated sound */
game({id:'g-pump',bg:'sky',task:'Накачай кульки насосом',sub:'тримай синю кнопку і свисти: С-с-с-с!',hero:'sava_wave',hx:50,hy:560,hw:320,
 build(p,s,alive){const C=['#e8336d','#2fa84f','#ff8a1f'];let n=0,k=.2,on=false,fly=false,last=0;
  p.innerHTML=`<svg class="lines" viewBox="0 0 1920 1080"><path d="M 560 930 Q 760 1010 960 884" fill="none" stroke="#3a3157" stroke-width="12" stroke-linecap="round"/></svg>
   <img class="pump" src="${I('nasos')}" alt="насос"><div class="bl"></div><div class="score" style="left:1440px;top:190px">${'<i>🎈</i>'.repeat(3)}</div><button class="hold" aria-label="Тримай і свисти">С-с-с</button>`;
  const bl=$('.bl',p),pump=$('.pump',p),btn=$('.hold',p);
  const put=()=>{$('svg',bl).style.transform=`scale(${k})`};
  const fresh=()=>{k=.2;fly=false;bl.getAnimations().forEach(a=>a.cancel());bl.innerHTML=balloonSVG(C[n],n);put()};fresh();
  const stop=()=>{if(!on)return;on=false;hiss(false);pump.classList.remove('on');btn.classList.remove('on')};
  const tick=now=>{if(!on||!alive()||!active(s))return stop();k=Math.min(1.12,k+(now-last)*.0003);last=now;put();
    if(k>=1.12){stop();fly=true;sfx.ding();const [x,y]=center($('svg',bl));burst(x,y,18);$$('.score i',p)[n].classList.add('on');
      bl.animate([{transform:'translate(0,0) rotate(0)'},{transform:'translate(140px,-1350px) rotate(18deg)'}],{duration:1700,easing:'cubic-bezier(.5,0,.8,.5)',fill:'forwards'}).onfinish=()=>{if(!alive())return;n++;n===3?done(s):fresh()};}
    else requestAnimationFrame(tick)};
  const start=e=>{e.preventDefault();if(on||fly||s.dataset.done)return;on=true;hiss(true);pump.classList.add('on');btn.classList.add('on');last=performance.now();requestAnimationFrame(tick)};
  btn.onpointerdown=start;btn.onpointerup=btn.onpointerleave=btn.onpointercancel=stop;btn.onkeydown=e=>{if(e.key===' '||e.key==='Enter')start(e)};btn.onkeyup=stop;}});

/* 2 — garden: syllables */
game({id:'g-garden',bg:'garden',task:'Полий квітку — назви склад і слово',sub:'натисни на пуп\'янок, і квітка розквітне',hero:'sava_water',hx:40,hy:150,hw:230,
 build(p,s){const L=[['СА','sanky'],['СО','sova'],['СУ','sumka'],['СИ','syr'],['СЛО','slon'],['СТІ','stil']];let left=L.length;
  L.forEach(([sy,n],i)=>{const d=el('div','plant',`<img class="bud" src="${I('bud')}" alt="" style="animation-delay:${-i*.5}s"><b>${sy}</b><div class="bloom"><img class="fl" src="${I('flower')}" alt=""><img class="pc" src="${I(n)}" alt="${W[n]}"><span class="tag">${hi(W[n],sy)}</span></div>`);
   d.style.left=(85+i*295)+'px';d.setAttribute('role','button');
   d.onclick=()=>{if(d.classList.contains('open')){anim($('.pc',d),'jelly');sfx.ding();return;}d.classList.add('open');const [x,y]=center(d);burst(x,y-40,24,['#7fd3ff','#2f8fe6','#fff']);sfx.pop();setTimeout(()=>sfx.ding(),300);
     if(--left===0)setTimeout(()=>done(s),1100);};p.appendChild(d);});}});

/* 3 — wipe the snow */
game({id:'g-snow',bg:'winter',task:'Зітри сніг і назви, що сховалось',sub:'води пальцем або мишкою по снігу',hero:'sonia_point',hx:1650,hy:800,hw:220,
 build(p,s){const L=['sobaka','lysytsia','samokat','kapusta'];let left=L.length;
  L.forEach((n,i)=>{const c=el('div','scr paper in',`<img src="${I(n)}" alt="${W[n]}"><span class="tag">${tagR(W[n])}</span><canvas width="370" height="450"></canvas>`);c.style.cssText=`left:${150+i*415}px;animation-delay:${.2+i*.1}s`;p.appendChild(c);
   const cv=$('canvas',c),x=cv.getContext('2d'),g=x.createLinearGradient(0,0,0,450);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#cfe6ff');x.fillStyle=g;x.fillRect(0,0,370,450);
   x.fillStyle='rgba(110,165,230,.6)';x.font='46px serif';for(let q=0;q<10;q++)x.fillText('❄',rnd(8,320),rnd(50,435));
   x.globalCompositeOperation='destination-out';let down=false,moves=0,fin=false;
   const rub=e=>{const r=cv.getBoundingClientRect();x.beginPath();x.arc((e.clientX-r.left)/r.width*370,(e.clientY-r.top)/r.height*450,50,0,7);x.fill();
     if(++moves%6===0&&!fin){const d=x.getImageData(0,0,370,450).data;let t=0,all=0;for(let q=3;q<d.length;q+=64){all++;if(d[q]<40)t++;}
       if(t/all>.5){fin=true;cv.style.opacity=0;cv.style.pointerEvents='none';c.classList.add('ok');anim($('img',c),'jelly');yes(c);if(--left===0)setTimeout(()=>done(s),800);}}};
   cv.onpointerdown=e=>{down=true;try{cv.setPointerCapture(e.pointerId)}catch(_){}rub(e)};cv.onpointermove=e=>{if(down)rub(e)};cv.onpointerup=cv.onpointercancel=()=>{down=false};});}});

/* 4 — feed by dragging */
game({id:'g-feed',bg:'room',task:'Нагодуй Саву їжею зі звуком С',sub:'перетягни до слоненяти тільки те, де чуєш С',hero:'sava_eat',hx:1320,hy:330,hw:480,say:'Ням-ням!',
 build(p,s){const L=shuffle([['sosyska',1],['salat',1],['slyva',1],['ananas',1],['kokos',1],['banan',0],['yabluko',0],['lymon',0]]);let left=5;const hero=$('.hero',s);
  const tr=el('div','platter paper in');p.appendChild(tr);
  L.forEach(([n,ok])=>{const c=pic(n,false);c.classList.add('drag');tr.appendChild(c);let sx,sy,dr=false;
   c.onpointerdown=e=>{dr=true;sx=e.clientX;sy=e.clientY;try{c.setPointerCapture(e.pointerId)}catch(_){}c.style.transition='none';c.style.zIndex=9};
   c.onpointermove=e=>{if(dr)c.style.transform=`translate(${(e.clientX-sx)/scale}px,${(e.clientY-sy)/scale}px) scale(1.12)`};
   c.onpointerup=c.onpointercancel=()=>{if(!dr)return;dr=false;const [x,y]=center(c),[hx,hy]=center(hero),near=Math.hypot(x-hx,y-hy)<280;
     if(near&&ok){word(c,n);sfx.ding();c.style.transition='transform .35s ease-in,opacity .35s';c.style.transform+=' scale(.1)';c.style.opacity=0;c.style.pointerEvents='none';setTimeout(()=>anim(hero,'roar'),300);if(--left===0)setTimeout(()=>done(s),900);}
     else{if(near){sfx.no();roar(hero,'Тут немає С!')}c.style.transition='transform .35s var(--spring)';c.style.transform='';c.style.zIndex=''}};});}});

/* 5 — flashlight */
game({id:'g-light',bg:'night',task:'Посвіти ліхтариком і знайди предмети',sub:'води світлом по темряві; знайшов — натисни і назви',hero:'sava_light',hx:40,hy:730,hw:260,
 build(p,s){const L=[['sobaka',520,360],['kaktus',900,600],['koleso',1300,330],['hlobus',1580,660],['osa',700,860],['lystok',1180,860]];let left=L.length;const dk=el('div','dark');
  L.forEach(([n,x,y])=>{const c=pic(n);c.classList.add('hobj');c.style.cssText=`left:${x}px;top:${y}px`;
    c.onclick=()=>{if(c.classList.contains('found'))return anim($('img',c),'jelly');c.classList.add('found');yes(c);if(--left===0){dk.style.opacity=0;setTimeout(()=>done(s),1000)}};p.appendChild(c);});
  p.appendChild(dk);const mv=e=>{const r=s.getBoundingClientRect();dk.style.setProperty('--x',(e.clientX-r.left)/scale+'px');dk.style.setProperty('--y',(e.clientY-r.top)/scale+'px')};
  s.onpointermove=mv;s.onpointerdown=mv;}});

/* 6 — puzzle */
game({id:'g-puzzle',bg:'school',task:'Склади картинку',sub:'натисни дві частинки, щоб поміняти їх місцями',hero:'sava_think',hx:50,hy:590,hw:340,say:'Що це буде?',
 build(p,s,alive){const L=['avtobus','lysytsia'],CW=3,CH=2,T=220;const fr=el('div','pz paper');p.appendChild(fr);const cap=el('div','pzcap');p.appendChild(cap);
  const show=k=>{const n=L[k],im=new Image();im.onload=()=>{if(!alive())return;const BW=T*CW,BH=T*CH,r=Math.min(BW/im.naturalWidth,BH/im.naturalHeight)*.94,bw=im.naturalWidth*r,bh=im.naturalHeight*r,ox=(BW-bw)/2,oy=(BH-bh)/2;
    let ord=shuffle([0,1,2,3,4,5]),sel=null;while(ord.every((v,i)=>v===i))ord=shuffle(ord);fr.classList.remove('solved');cap.textContent=`${k+1} / ${L.length}`;
    const draw=()=>{fr.innerHTML='';ord.forEach((v,i)=>{const t=el('div','pt'+(sel===i?' sel':''));t.setAttribute('role','button');t.dataset.v=v;
      t.style.cssText=`background-image:url(${I(n)});background-size:${bw}px ${bh}px;background-position:${ox-(v%CW)*T}px ${oy-Math.floor(v/CW)*T}px`;
      t.onclick=()=>{if(fr.classList.contains('solved'))return;if(sel===null){sel=i;sfx.tick();draw();return}[ord[sel],ord[i]]=[ord[i],ord[sel]];sel=null;sfx.flip();draw();
        if(ord.every((v,j)=>v===j)){fr.classList.add('solved');yes(fr);word(fr,n);setTimeout(()=>{if(!alive())return;k+1<L.length?show(k+1):done(s)},2200)}};fr.appendChild(t);});};draw();};im.src=I(n);};show(0);}});

/* 7 — fishing */
game({id:'g-fish',bg:'water',task:'Спіймай рибку і назви слово',sub:'натисни на рибку — вона принесе картинку',hero:'sava_cheer',hx:40,hy:130,hw:230,
 build(p,s){const L=['som','sumka','suknia','sklianka','stilets','myska'];let left=L.length;const tr=el('div','catchrow');p.appendChild(tr);
  L.forEach((n,i)=>{const slot=el('div','paper');tr.appendChild(slot);const f=el('div','swim',`<img class="fish" src="${I('fish'+(i%3+1))}" alt=""><div class="bub"><img src="${I(n)}" alt="${W[n]}"></div>`);
   const d=rnd(10,16),dl=-rnd(0,d);f.style.cssText=`top:${430+i*90}px;animation-duration:${d}s;animation-delay:${dl}s`;$('.fish',f).style.cssText=`animation-duration:${d}s;animation-delay:${dl}s`;f.setAttribute('role','button');
   f.onclick=()=>{f.style.pointerEvents='none';f.style.animationPlayState='paused';const [x,y]=center(f);burst(x,y,14,['#fff','#bfe9ff','#7fd3ff']);sfx.pop();
     flyTo($('.bub',f),slot,n,120,()=>{slot.innerHTML=`<img src="${I(n)}" alt=""><span>${tagR(W[n])}</span>`;slot.classList.add('got');yes(slot);if(--left===0)setTimeout(()=>done(s),700)});f.style.opacity=0;setTimeout(()=>f.remove(),800);};p.appendChild(f);});}});

/* 8 — big and small */
game({id:'g-small',bg:'stage',task:'Назви лагідно',sub:'торкнись чарівною паличкою — і велике стане маленьким',hero:'sava_wand',hx:20,hy:700,hw:260,
 build(p,s){const L=[['sumka','сумочка'],['sobaka','собачка'],['lysytsia','лисичка'],['sosna','сосонка'],['stilets','стільчик'],['myska','мисочка']];const seen=new Set();
  L.forEach(([n,sm],i)=>{const c=el('div','mg paper in',`<img src="${I(n)}" alt=""><span class="tag">${tagR(W[n])}</span>`);c.style.cssText=`left:${330+(i%3)*460}px;top:${185+Math.floor(i/3)*372}px;animation-delay:${.25+i*.1}s`;c.setAttribute('role','button');
   c.onclick=()=>{const m=c.classList.toggle('tiny'),t=$('.tag',c);t.innerHTML=tagR(m?sm:W[n]);anim(t,'jelly');if(m){const [x,y]=center(c);burst(x,y,14,['#ffc531','#fff','#ff8ad0']);sfx.ding();seen.add(n);if(seen.size===L.length)setTimeout(()=>done(s),600)}else sfx.flip()};p.appendChild(c);});}});

/* 9 — match a picture with its shadow */
game({id:'g-lines',bg:'meadow',task:'З\'єднай картинку з її тінню',sub:'натисни картинку, а потім її тінь',hero:'sonia_wave',hx:830,hy:720,hw:250,
 build(p,s){const L=['samokat','sanky','kaktus','ananas','hlobus'],R=shuffle(L),Y=i=>250+i*158;let sel=null,left=L.length;
  p.innerHTML=`<svg class="lines" viewBox="0 0 1920 1080"></svg>`;const sv=$('svg',p);
  const A=L.map((n,i)=>{const c=pic(n);c.classList.add('ln','paper');c.style.cssText=`left:350px;top:${Y(i)}px`;p.appendChild(c);
    c.onclick=()=>{if(c.classList.contains('ok'))return;A.forEach(a=>a.classList.remove('sel'));c.classList.add('sel');sel=[n,i,c];sfx.tick()};return c});
  R.forEach((n,j)=>{const c=el('div','ln sh paper',`<img src="${I(n)}" alt="тінь">`);c.style.cssText=`left:1570px;top:${Y(j)}px`;p.appendChild(c);
    c.onclick=()=>{if(c.classList.contains('ok'))return;if(!sel||sel[0]!==n)return nope($('img',c));const [,i,a]=sel;sel=null;a.classList.remove('sel');a.classList.add('ok');c.classList.add('ok');
      const ln=document.createElementNS('http://www.w3.org/2000/svg','line');ln.setAttribute('x1',480);ln.setAttribute('y1',Y(i));ln.setAttribute('x2',1440);ln.setAttribute('y2',Y(j));sv.appendChild(ln);yes(c);word(a,n);if(--left===0)setTimeout(()=>done(s),800)};});}});

/* 10 — clap the syllables */
game({id:'g-clap',bg:'fair',task:'Поплескай слово по складах',sub:'скільки разів плеснемо: один, два чи три?',hero:'sava_clap',hx:60,hy:210,hw:270,
 build(p,s,alive){const Q=shuffle([['syr',['сир']],['som',['сом']],['sumka',['сум','ка']],['sova',['со','ва']],['samokat',['са','мо','кат']],['kapusta',['ка','пус','та']]]);let k=0,busy=false;
  const now=el('div','nowc');p.appendChild(now);const row=el('div','claps');p.appendChild(row);
  row.innerHTML=[1,2,3].map(n=>`<button class="clapb paper"><span>${'👏'.repeat(n)}</span><b>${n}</b><div class="shelfc"></div></button>`).join('');
  const show=()=>{now.innerHTML='';const c=pic(Q[k][0],false);now.appendChild(c);now.appendChild(el('div','syl',''));anim($('img',c),'jelly')};show();
  $$('.clapb',row).forEach((b,i)=>b.onclick=()=>{if(busy||k>=Q.length)return;const [n,sy]=Q[k];if(sy.length!==i+1)return nope(b);busy=true;const cap=$('.syl',now);
    sy.forEach((t,j)=>setTimeout(()=>{if(!alive())return;cap.innerHTML=sy.slice(0,j+1).map(tagR).join(' · ');sfx.beat(j);anim($('span',b),'jelly');anim($('img',now),'jelly')},j*520));
    setTimeout(()=>{if(!alive())return;const m=el('img');m.src=I(n);m.alt=W[n];$('.shelfc',b).appendChild(m);yes(b);k++;busy=false;k<Q.length?show():done(s)},sy.length*520+800);});}});

/* 11 — board game */
game({id:'g-board',bg:'meadow',task:'Гра-ходилка: кинь кубик',sub:'іди по доріжці й називай слово, на яке потрапив',
 build(p,s,alive){const T=[[330,300],[600,300],[870,300],[1140,300],[1410,300],[1275,530],[1005,530],[735,530],[465,530],[330,760],[600,760],[870,760],[1140,760],[1410,760]];
  const L=['sumka','sova','sobaka','sosna','stil','salat','slyva','ananas','avtobus','kaktus','lysytsia','koleso'],E=T.length-1;let pos=0,busy=false;
  p.innerHTML=`<svg class="lines" viewBox="0 0 1920 1080"><polyline points="${T.map(t=>t.join(',')).join(' ')}"/></svg>`;
  const tiles=T.map(([x,y],i)=>{const t=el('div','tile'+(i===0||i===E?' end':''),i===0?'Старт':i===E?`<img src="${I('kubok')}" alt="фініш">`:`<img src="${I(L[i-1])}" alt="${W[L[i-1]]}">`);t.style.cssText=`left:${x}px;top:${y}px`;p.appendChild(t);return t});
  const tk=el('div','token',`<img src="${I('sava_wave')}" alt="">`);p.appendChild(tk);const put=i=>{tk.style.transform=`translate(${T[i][0]}px,${T[i][1]}px)`};put(0);
  const die=el('button','die','🎲');die.setAttribute('aria-label','Кинути кубик');p.appendChild(die);const msg=el('div','dmsg','Кидай кубик!');p.appendChild(msg);
  die.onclick=()=>{if(busy||pos>=E)return;busy=true;const v=1+Math.floor(Math.random()*3);die.textContent='🎲';anim(die,'roll');sfx.tick();
    setTimeout(()=>{if(!alive())return;die.innerHTML=`<b>${v}</b>`;msg.textContent=['','Один крок','Два кроки','Три кроки'][v];let st=0;
      const hop=()=>{if(!alive())return;if(st===v||pos===E){busy=false;const t=tiles[pos];anim(t,'jelly');yes(t);if(pos===E){msg.textContent='Фініш!';done(s)}else word(t,L[pos-1]);return}pos++;st++;put(pos);sfx.hop();setTimeout(hop,450)};hop()},750);};}});

/* 12 — does it happen? */
game({id:'g-tf',bg:'library',task:'Буває чи не буває?',sub:'послухай речення і скажи: так чи ні',hero:'sonia_think',hx:60,hy:540,hw:340,say:'Подумай!',
 build(p,s,alive){const L=shuffle([['Сова спить удень.','sova',1],['Собака літає в небі.','sobaka',0],['Сом живе у воді.','som',1],['Слон сидить на сосні.','sosna',0],['Сонце світить у небі.','sontse',1],['Автобус їсть капусту.','avtobus',0]]);let k=0,busy=false;
  const c=el('div','stmt paper in');p.appendChild(c);const bt=el('div','tfb',`<button class="btn yesb">👍 Так</button><button class="btn nob">👎 Ні</button>`);p.appendChild(bt);
  const show=()=>{const [t,n]=L[k];c.innerHTML=`<img src="${I(n)}" alt=""><p>${tagR(t)}</p><span class="step">${k+1} / ${L.length}</span>`;anim($('img',c),'jelly')};show();
  $$('button',bt).forEach((b,i)=>b.onclick=()=>{if(busy||s.dataset.done)return;if((i===0)!==!!L[k][2])return nope(b);busy=true;yes(c);c.appendChild(el('div','verdict',L[k][2]?'Так, буває!':'Ні, не буває!'));
    setTimeout(()=>{if(!alive())return;busy=false;++k<L.length?show():done(s)},1600)});}});

/* ---- four more games (mechanics shared with the first deck, new words) ---- */
Object.assign(W,{kit:'кіт',zhaba:'жаба',ryba:'риба'});

/* wheel */
game({id:'g-wheel',bg:'fair',task:'Крути колесо і називай слово',sub:'збери п\'ять зірочок',hero:'sava_cheer',hx:1610,hy:740,hw:270,
 build(p,s,alive){const L=['sanky','samokat','sklianka','kapusta','kokos','lystok','myska','sosyska'];
  p.innerHTML=`<div class="wheelbox"><div class="wheel">${L.map((n,i)=>`<img src="${I(n)}" alt="" style="transform:rotate(${i*45}deg) translateY(-235px)">`).join('')}</div><i class="pin"></i><button class="hub">Крути!</button></div>
   <div class="result paper">Натисни «Крути!»<br>і подивись, що випаде</div><div class="score" style="left:1110px;top:790px">${'<i>⭐</i>'.repeat(5)}</div>`;
  const wh=$('.wheel',p),hub=$('.hub',p),res=$('.result',p);let rot=0,pool=shuffle(L.map((_,i)=>i)),n=0;
  hub.onclick=()=>{if(!pool.length)pool=shuffle(L.map((_,i)=>i));const i=pool.pop();hub.disabled=true;rot=Math.ceil(rot/360)*360+1440+((360-i*45)%360);wh.style.transform=`rotate(${rot}deg)`;
    for(let k=0;k<26;k++)setTimeout(()=>alive()&&active(s)&&sfx.tick(),k*k*5.2);
    setTimeout(()=>{if(!alive())return;res.innerHTML=`<img src="${I(L[i])}" alt="${W[L[i]]}"><span class="tag">${tagR(W[L[i]])}</span>`;anim($('img',res),'jelly');yes(res);
      const st=$$('.score i',p)[n];if(st)st.classList.add('on');n++;hub.disabled=false;if(n===5)done(s);},3900);};}});

/* odd one out */
game({id:'g-odd',bg:'room',task:'Знайди зайву картинку',sub:'у назві зайвої немає звука С',hero:'sonia_think',hx:70,hy:580,hw:340,say:'Хм-м…',
 build(p,s){const R=[[['sumka','sova','sobaka'],'kit'],[['sosna','stil','salat'],'zhaba'],[['ananas','kaktus','avtobus'],'ryba']];let left=R.length;
  R.forEach(([ok,odd],i)=>{const sh=el('div','shelf paper in');sh.style.cssText=`top:${178+i*262}px;animation-delay:${.3+i*.15}s`;
    shuffle([...ok,odd]).forEach(n=>{const c=pic(n);c.onclick=()=>{if(n!==odd)return nope(c);yes(c);c.classList.add('gone');sh.classList.add('ok');if(--left===0)setTimeout(()=>done(s),800);};sh.appendChild(c);});p.appendChild(sh);});}});

/* pairs */
game({id:'g-pairs',bg:'stage',task:'Знайди однакові картинки',sub:'відкривай по дві картки і називай слова',hero:'sonia_cheer',hx:1660,hy:810,hw:210,
 build(p,s,alive){const L=['som','osa','koleso','slyva','hlobus','suknia'];let a=null,lock=false,left=L.length;
  const g=el('div','grid');g.style.cssText='left:150px;top:210px;grid-template-columns:repeat(6,250px);gap:24px';p.appendChild(g);
  shuffle([...L,...L]).forEach((n,i)=>{const c=el('div','card mem',`<div class="face q">С</div><div class="face a"><img src="${I(n)}" alt="${W[n]}"><span class="tag">${tagR(W[n])}</span></div>`);c.style.animationDelay=`${.2+i*.05}s`;c.setAttribute('role','button');
    c.onclick=()=>{if(lock||c.classList.contains('open'))return;c.classList.add('open');sfx.flip();if(!a){a=[c,n];return;}
      const [c0,n0]=a;a=null;if(n0===n){setTimeout(()=>{c.classList.add('match');c0.classList.add('match');yes(c);yes(c0);if(--left===0)setTimeout(()=>done(s),700);},500);}
      else{lock=true;setTimeout(()=>{if(!alive())return;c.classList.remove('open');c0.classList.remove('open');sfx.no();lock=false;},1300);}};g.appendChild(c);});}});

/* rhymes */
game({id:'g-rhymes',bg:'oasis',task:'Чистомовки',sub:'натисни «Ритм» і повторюй разом із Савою',hero:'sava_clap',hx:60,hy:560,hw:340,say:'Са-са-са!',
 build(p,s,alive){const L=[['Са-са-са','летить оса.','osa'],['Со-со-со','у Сави колесо.','koleso'],['Су-су-су','я сумку несу.','sumka'],['Ас-ас-ас','у нас ананас.','ananas']];const heard=new Set();let k=0,busy=false;
  const v=el('div','verse paper in');p.appendChild(v);const ct=el('div','ctrl',`<button class="btn sm">▶ Ритм</button><button class="btn sm">Далі →</button>`);p.appendChild(ct);const [pl,nx]=$$('button',ct);
  const sp=t=>t.split(' ').map(w=>`<span>${tagR(w)}</span>`).join('');
  const show=()=>{const [a,b,im]=L[k];v.innerHTML=`<img src="${I(im)}" alt=""><p><em>${a.split('-').map((x,i,r)=>`<span style="margin-right:0">${tagR(x)}${i<r.length-1?'-':''}</span>`).join('')}</em>${sp(b)}</p><span class="step">${k+1} / ${L.length}</span>`;anim($('img',v),'jelly')};show();
  pl.onclick=()=>{if(busy)return;busy=true;const ws=$$('p span',v),im=$('img',v);ws.forEach((w,i)=>setTimeout(()=>{if(!alive())return;ws.forEach(x=>x.classList.remove('hot'));w.classList.add('hot');sfx.beat(i);anim(im,'jelly');},i*520));
    setTimeout(()=>{if(!alive())return;ws.forEach(x=>x.classList.remove('hot'));busy=false;heard.add(k);if(heard.size===L.length)done(s);},ws.length*520+200);};
  nx.onclick=()=>{if(busy)return;k=(k+1)%L.length;sfx.flip();show();};}});

{const ORD=['g-pump','g-garden','g-snow','g-wheel','g-feed','g-odd','g-light','g-puzzle','g-pairs','g-fish','g-small','g-lines','g-clap','g-board','g-tf','g-rhymes'];
 G.sort((a,b)=>ORD.indexOf(a.id)-ORD.indexOf(b.id));}

