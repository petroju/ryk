/* words */
Object.assign(W,{raketa:'ракета',robot:'робот',rukavychka:'рукавичка',ryba:'риба',traktor:'трактор',baraban:'барабан',korona:'корона',troianda:'троянда',pyrih:'пиріг',hrusha:'груша',morkva:'морква',rak:'рак',
 korova:'корова',soroka:'сорока',harbuz:'гарбуз',pomidor:'помідор',parasolka:'парасолька',tort:'торт',zirka:'зірка',vynohrad:'виноград',syr:'сир',vidro:'відро',zebra:'зебра',mukhomor:'мухомор',
 zhyraf:'жираф',krokodyl:'крокодил',cherepakha:'черепаха',ravlyk:'равлик',morozyvo:'морозиво',tsukerka:'цукерка',cherevyk:'черевик',prapor:'прапор',derevo:'дерево',sertse:'серце',ohirok:'огірок',lokomotyv:'паровоз',
 kit:'кіт',miach:"м'яч",sontse:'сонце',yabluko:'яблуко',lymon:'лимон',banan:'банан',slon:'слон',zhaba:'жаба',sova:'сова',knyha:'книга',lozhka:'ложка',shapka:'шапка'});

/* =================== games =================== */

/* 1 — motor: isolated sound */
game({id:'motor',bg:'meadow',task:'Заведи мотор і приїдь до прапорця',sub:'тримай червону кнопку і гарчи: Р-р-р-р!',hero:'hero_wave',hx:1420,hy:150,hw:230,
 build(p,s,alive){const D='M 160 900 C 540 900 480 560 830 600 S 1120 940 1400 800 S 1440 470 1730 440';
  p.innerHTML=`<svg class="road" viewBox="0 0 1920 1080"><path class="a" d="${D}"/><path class="b" d="${D}"/><path class="c" d="${D}"/></svg>
   <img class="flag" src="${I('prapor')}" alt="прапорець"><div class="car"><img src="${I('traktor')}" alt="трактор"></div><button class="hold" aria-label="Тримай і гарчи">Р-р-р</button>`;
  const path=$('.c',p),L=path.getTotalLength(),car=$('.car',p),btn=$('.hold',p);let d=0,on=false,last=0;
  const put=()=>{const a=path.getPointAtLength(d),b=path.getPointAtLength(Math.min(L,d+10));let g=Math.atan2(b.y-a.y,b.x-a.x)*57.3;if(d>=L-10)g=0;g=Math.max(-32,Math.min(32,g));car.style.transform=`translate(${a.x}px,${a.y}px) rotate(${g}deg)`;return a};put();
  const stop=()=>{if(!on)return;on=false;engine(false);car.classList.remove('on');btn.classList.remove('on')};
  const tick=now=>{if(!on||!alive()||!active(s))return stop();d=Math.min(L,d+(now-last)*.2);last=now;const a=put();
    if(Math.random()<.2){const m=el('i','smoke');m.style.cssText=`left:${a.x-90}px;top:${a.y-120}px`;p.appendChild(m);m.animate([{transform:'scale(.5)',opacity:.8},{transform:`translate(${rnd(-70,-20)}px,${rnd(-90,-40)}px) scale(2)`,opacity:0}],{duration:800}).onfinish=()=>m.remove();}
    if(d>=L){stop();yes($('.flag',p));done(s)}else requestAnimationFrame(tick)};
  const start=e=>{e.preventDefault();if(on||s.dataset.done)return;on=true;engine(true);car.classList.add('on');btn.classList.add('on');last=performance.now();requestAnimationFrame(tick)};
  [car,btn].forEach(b=>{b.onpointerdown=start;b.onpointerup=b.onpointerleave=b.onpointercancel=stop;});
  btn.onkeydown=e=>{if(e.key===' '||e.key==='Enter')start(e)};btn.onkeyup=stop;}});

/* 2 — balloons: syllables */
game({id:'balloons',bg:'sky',task:'Лусни кульку — назви склад і слово',sub:'натисни на картинку, щоб повторити ще раз',hero:'hero_jump',hx:1610,hy:740,hw:270,
 build(p,s){const B=[['РА','raketa','#e8336d'],['РО','robot','#2f8fe6'],['РУ','rukavychka','#ff8a1f'],['РИ','ryba','#2fa84f'],['ТРА','traktor','#a35cff'],['ТРО','troianda','#ffb400'],['ГРУ','hrusha','#12b5b0'],['РАК','rak','#f0621b']];
  const hi=(w,y)=>{const i=w.toLowerCase().indexOf(y.toLowerCase());return i<0?w:w.slice(0,i)+'<u>'+w.slice(i,i+y.length)+'</u>'+w.slice(i+y.length)};let left=B.length;
  B.forEach(([syl,img,col],i)=>{const sp=el('div','spot');sp.style.cssText=`left:${250+(i%4)*385}px;top:${170+Math.floor(i/4)*400}px;animation-delay:${.15+i*.09}s`;
    sp.innerHTML=`<div class="prize"><img src="${I(img)}" alt="${W[img]}"><br><span class="tag">${hi(W[img],syl)}</span></div>
      <div class="balloon" style="animation-delay:${-i*.5}s" role="button" aria-label="Кулька ${syl}"><svg viewBox="0 0 230 380">
      <defs><radialGradient id="g${i}" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".25" stop-color="${col}"/><stop offset="1" stop-color="${col}"/></radialGradient></defs>
      <path d="M115 262 q-22 50 4 110" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M115 6 C40 6 6 62 6 122 c0 76 64 124 109 132 c45 -8 109 -56 109 -132 C224 62 190 6 115 6z" fill="url(#g${i})" stroke="rgba(0,0,0,.18)" stroke-width="4"/>
      <path d="M100 252 l30 0 l-6 20 l-18 0z" fill="${col}" stroke="rgba(0,0,0,.18)" stroke-width="3"/>
      <ellipse cx="70" cy="70" rx="22" ry="34" fill="#fff" opacity=".45" transform="rotate(-28 70 70)"/></svg><b>${syl}</b></div>`;
    const bal=$('.balloon',sp),pr=$('.prize',sp);
    bal.onclick=()=>{bal.classList.add('pop');sfx.pop();const [x,y]=center(bal);burst(x,y-60,22,[col,'#fff',col,'#ffc531']);
      setTimeout(()=>{pr.classList.add('show');sfx.ding()},160);if(--left===0)setTimeout(()=>done(s),900);};
    pr.onclick=()=>{anim(pr,'again');sfx.ding();};p.appendChild(sp);});}});

/* 3 — path */
game({id:'path',bg:'forest',task:'Допоможи Рику дійти додому',sub:'натискай на картинки і називай слова',
 build(p,s,alive){const START=[230,960,1],HOME=[1395,372,.55],P=[['baraban',640,905,1],['korona',1060,850,.95],['pyrih',1230,700,.85],['morkva',850,625,.78],['korova',1060,520,.7],['harbuz',1420,525,.66]];
  const tray=el('div','tray');p.appendChild(tray);const w=el('div','hero',`<img src="${I('hero_wave')}" alt="Тигреня Рик">`);w.id='walker';p.appendChild(w);
  let pos,walking=false,left=P.length;const im=$('img',w);
  const place=t=>{w.style.transform=`translate(${t[0]}px,${t[1]}px) scale(${t[2]})`;pos=t};place(START);
  const puff=(x,y)=>{for(let i=0;i<5;i++){const f=el('i','puff');f.style.cssText=`left:${x-13}px;top:${y-20}px`;p.appendChild(f);
    f.animate([{transform:'scale(.4)',opacity:.9},{transform:`translate(${rnd(-55,55)}px,${rnd(-60,-20)}px) scale(1.6)`,opacity:0}],{duration:520}).onfinish=()=>f.remove();}};
  const hopTo=(t,cb)=>{const [x0,y0,s0]=pos,[x1,y1,s1]=t,hops=Math.max(1,Math.round(Math.hypot(x1-x0,y1-y0)/260)),T=420*hops,t0=performance.now();walking=true;let last=-1;
    (function step(now){if(!alive())return;const k=Math.min(1,(now-t0)/T),q=k*hops,h=Math.floor(Math.min(q,hops-.0001)),f=q-h;
      if(h!==last){last=h;sfx.hop();puff(x0+(x1-x0)*h/hops,y0+(y1-y0)*h/hops);}
      const x=x0+(x1-x0)*k,y=y0+(y1-y0)*k,z=s0+(s1-s0)*k,up=Math.sin(Math.PI*f)*130*z,sq=1+Math.sin(Math.PI*f)*.12-(f<.12||f>.88?.14:0);
      w.style.transform=`translate(${x}px,${y-up}px) scale(${z})`;im.style.transform=`scale(${2-sq},${sq}) rotate(${(x1>x0?1:-1)*Math.sin(Math.PI*2*f)*7}deg)`;
      if(k<1)requestAnimationFrame(step);else{im.style.transform='';pos=t;walking=false;puff(x1,y1);cb&&cb();}})(t0);};
  P.forEach(([img,x,y,z],i)=>{const slot=el('div');tray.appendChild(slot);const st=el('div','stop',`<img src="${I(img)}" alt="${W[img]}" style="animation-delay:${-i*.4}s">`);
    st.setAttribute('role','button');st.style.cssText=`left:${x+95*z}px;top:${y-8}px;width:${175*z}px;animation-delay:${.4+i*.12}s`;
    st.onclick=()=>{if(walking)return;st.classList.add('done');hopTo([x,y,z],()=>{yes(st);
      const a=slot.getBoundingClientRect(),b=st.getBoundingClientRect(),dx=(a.left+a.width/2-b.left-b.width/2)/scale,dy=(a.top+a.height/2-b.top-b.height/2)/scale;
      st.animate([{transform:'translate(-50%,-100%) scale(1) rotate(0)'},{transform:'translate(-50%,-135%) scale(1.35) rotate(-12deg)',offset:.3},
        {transform:`translate(calc(-50% + ${dx}px),calc(-100% + ${dy+60}px)) scale(.45) rotate(360deg)`,opacity:.6}],{duration:800,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'})
        .onfinish=()=>{st.style.visibility='hidden';slot.classList.add('got');slot.innerHTML=`<img src="${I(img)}" alt="">${W[img]}`;
          if(--left===0)setTimeout(()=>{im.src=I('hero_jump');hopTo(HOME,()=>{im.src=I('hero_cheer');done(s);});},350);};});};
    p.appendChild(st);});}});

/* 4 — shadows */
game({id:'shadows',bg:'night',task:'Хто сховався в темряві?',sub:'відгадай за тінню, потім натисни і перевір',hero:'hero_look',hx:90,hy:470,hw:440,say:'Хто ж це?',
 build(p,s){const L=['soroka','pomidor','parasolka','tort','zirka','vynohrad','syr','zebra'];let left=L.length;
  for(let i=0;i<14;i++){const d=el('i','firefly');d.style.cssText=`left:${rnd(0,1900)}px;top:${rnd(150,1000)}px;animation-delay:${-rnd(0,7)}s;animation-duration:${rnd(5,10)}s`;p.appendChild(d);}
  const g=el('div','grid');g.style.cssText='left:600px;top:190px;grid-template-columns:repeat(4,290px)';p.appendChild(g);
  L.forEach((n,i)=>{const c=el('div','card',`<div class="face q"><img src="${I(n)}" alt=""></div><div class="face a"><img src="${I(n)}" alt="${W[n]}"><span class="tag">${tagR(W[n])}</span></div>`);c.style.animationDelay=`${.3+i*.08}s`;c.setAttribute('role','button');
    c.onclick=()=>{if(c.classList.contains('open')){sfx.ding();anim($('.a img',c),'jelly');return;}
      c.classList.add('open');sfx.flip();setTimeout(()=>{const [x,y]=center(c);burst(x,y,16,['#fff6a8','#ffc531','#fff']);sfx.ding()},450);if(--left===0)setTimeout(()=>done(s),1100);};g.appendChild(c);});}});

/* 5 — wheel */
game({id:'wheel',bg:'fair',task:'Крути колесо і називай слово',sub:'збери п\'ять зірочок',hero:'hero_cheer',hx:1610,hy:740,hw:270,
 build(p,s,alive){const L=['zhyraf','krokodyl','cherepakha','ravlyk','morozyvo','tsukerka','cherevyk','prapor'];
  p.innerHTML=`<div class="wheelbox"><div class="wheel">${L.map((n,i)=>`<img src="${I(n)}" alt="" style="transform:rotate(${i*45}deg) translateY(-235px)">`).join('')}</div><i class="pin"></i><button class="hub">Крути!</button></div>
   <div class="result paper">Натисни «Крути!»<br>і подивись, що випаде</div><div class="score" style="left:1110px;top:790px">${'<i>⭐</i>'.repeat(5)}</div>`;
  const wh=$('.wheel',p),hub=$('.hub',p),res=$('.result',p);let rot=0,pool=shuffle(L.map((_,i)=>i)),n=0;
  hub.onclick=()=>{if(!pool.length)pool=shuffle(L.map((_,i)=>i));const i=pool.pop();hub.disabled=true;rot=Math.ceil(rot/360)*360+1440+((360-i*45)%360);wh.style.transform=`rotate(${rot}deg)`;
    for(let k=0;k<26;k++)setTimeout(()=>alive()&&active(s)&&sfx.tick(),k*k*5.2);
    setTimeout(()=>{if(!alive())return;res.innerHTML=`<img src="${I(L[i])}" alt="${W[L[i]]}"><span class="tag">${tagR(W[L[i]])}</span>`;anim($('img',res),'jelly');yes(res);
      const st=$$('.score i',p)[n];if(st)st.classList.add('on');n++;hub.disabled=false;if(n===5)done(s);},3900);};}});

/* 6 — odd one out */
game({id:'odd',bg:'room',task:'Знайди зайву картинку',sub:'у назві зайвої немає звука Р',hero:'hero_think',hx:70,hy:560,hw:360,say:'Хм-м…',
 build(p,s){const R=[[['raketa','robot','ryba'],'kit'],[['troianda','korona','traktor'],'slon'],[['harbuz','pomidor','morkva'],'banan']];let left=R.length;
  R.forEach(([ok,odd],i)=>{const sh=el('div','shelf paper in');sh.style.cssText=`top:${178+i*262}px;animation-delay:${.3+i*.15}s`;
    shuffle([...ok,odd]).forEach(n=>{const c=pic(n);c.onclick=()=>{if(n!==odd)return nope(c);yes(c);c.classList.add('gone');sh.classList.add('ok');if(--left===0)setTimeout(()=>done(s),800);};sh.appendChild(c);});p.appendChild(sh);});}});

/* 7 — count */
game({id:'count',bg:'title',task:'Порахуй предмети',sub:'спершу порахуй сам, потім натисни «?» і перевір',hero:'hero_look',hx:30,hy:330,hw:250,say:'Раз, два, три!',
 build(p,s,alive){const K=[['hrusha',4,'чотири груші'],['zirka',3,'три зірки'],['morkva',5,"п'ять морквин"]];let left=K.length;
  const f=el('div','field paper in');p.appendChild(f);const cells=shuffle([...Array(12).keys()]);let c=0;
  K.forEach(([n,q,txt],i)=>{const mine=[];for(let k=0;k<q;k++){const m=el('img');m.src=I(n);m.alt='';const cell=cells[c++];m.style.cssText=`left:${50+(cell%4)*235+rnd(-18,18)}px;top:${40+Math.floor(cell/4)*235+rnd(-14,14)}px;transform:rotate(${rnd(-18,18)}deg)`;f.appendChild(m);mine.push(m);}
    const r=el('div','crow paper in',`<img src="${I(n)}" alt="${W[n]}"><button aria-label="Перевірити">?</button><span></span>`);r.style.cssText=`top:${230+i*200}px;animation-delay:${.3+i*.15}s`;p.appendChild(r);
    const b=$('button',r);b.onclick=()=>{if(b.disabled)return;b.disabled=true;mine.forEach((m,k)=>setTimeout(()=>{if(!alive())return;anim(m,'hit');b.textContent=k+1;tone(440+k*90,.15,'triangle',.22);
      if(k===q-1){b.classList.add('fin');$('span',r).innerHTML=tagR(txt);yes(r);if(--left===0)setTimeout(()=>done(s),700);}},k*480));};});}});

/* 8 — pairs */
game({id:'pairs',bg:'stage',task:'Знайди однакові картинки',sub:'відкривай по дві картки і називай слова',hero:'hero_look',hx:1650,hy:800,hw:220,
 build(p,s,alive){const L=['syr','tort','zirka','vynohrad','rak','baraban'];let a=null,lock=false,left=L.length;
  const g=el('div','grid');g.style.cssText='left:150px;top:210px;grid-template-columns:repeat(6,250px);gap:24px';p.appendChild(g);
  shuffle([...L,...L]).forEach((n,i)=>{const c=el('div','card mem',`<div class="face q">Р</div><div class="face a"><img src="${I(n)}" alt="${W[n]}"><span class="tag">${tagR(W[n])}</span></div>`);c.style.animationDelay=`${.2+i*.05}s`;c.setAttribute('role','button');
    c.onclick=()=>{if(lock||c.classList.contains('open'))return;c.classList.add('open');sfx.flip();if(!a){a=[c,n];return;}
      const [c0,n0]=a;a=null;if(n0===n){setTimeout(()=>{c.classList.add('match');c0.classList.add('match');yes(c);yes(c0);if(--left===0)setTimeout(()=>done(s),700);},500);}
      else{lock=true;setTimeout(()=>{if(!alive())return;c.classList.remove('open');c0.classList.remove('open');sfx.no();lock=false;},1300);}};g.appendChild(c);});}});

/* 9 — train: sound position */
game({id:'train',bg:'rail',task:'Де у слові сховався звук Р?',sub:'поклади картинку у вагон: початок, середина чи кінець',hero:'hero_think',hx:60,hy:230,hw:250,say:'Послухай слово!',
 build(p,s,alive){const Q=shuffle([['raketa',0],['ryba',0],['korona',1],['morkva',1],['syr',2],['pomidor',2]]),N=['початок','середина','кінець'],C=['#e8336d','#2f8fe6','#2fa84f'];let k=0;
  const now=el('div','now');p.appendChild(now);const tr=el('div','trainset');p.appendChild(tr);
  tr.innerHTML=N.map((t,i)=>`<div class="wagon" role="button" style="left:${290+i*350}px;background:${C[i]}"><div class="load"></div><div class="dots">${[0,1,2].map(j=>`<i class="${j===i?'f':''}"></i>`).join('')}</div>${t}</div><i class="link" style="left:${590+i*350}px;width:60px"></i>`).join('')+`<img class="loco" src="${I('lokomotyv')}" alt="паровоз">`;
  const show=()=>{now.innerHTML='';const c=pic(Q[k][0]);now.appendChild(c);anim(c,'jelly');};show();
  $$('.wagon',tr).forEach((w,i)=>w.onclick=()=>{if(k>=Q.length)return;const [n,pos]=Q[k];if(i!==pos)return nope(w);k++;now.innerHTML='';
    const f=el('img');f.src=I(n);f.alt=W[n];sfx.ding();
    const from=el('div');from.style.cssText='position:absolute;left:960px;top:330px';p.appendChild(from);flyTo(from,$('.load',w),n,250,()=>{$('.load',w).appendChild(f);yes(w)});from.remove();
    if(k<Q.length)setTimeout(()=>alive()&&show(),750);else setTimeout(()=>{if(!alive())return;sfx.choo();tr.animate([{transform:'translateX(0)'},{transform:'translateX(-30px)',offset:.15},{transform:'translateX(2300px)'}],{duration:3200,easing:'cubic-bezier(.6,0,.9,.5)',fill:'forwards'});done(s);},1100);});}});

/* 10 — catch */
game({id:'catch',bg:'garden',task:'Нагодуй Рика словами зі звуком Р',sub:'лови тільки ті картинки, де чуєш Р',hero:'hero_eat',hx:800,hy:700,hw:310,say:'Ням-ням!',
 build(p,s,alive){const R=['ryba','hrusha','pyrih','tort','syr','morkva','pomidor','vynohrad','ohirok','harbuz','morozyvo','tsukerka'],X=['kit','miach','sontse','yabluko','lymon','banan','slon','zhaba','sova','knyha','lozhka','shapka'];
  const sc=el('div','score');sc.style.cssText='left:1340px;top:170px';sc.innerHTML='<i>⭐</i>'.repeat(8);p.appendChild(sc);let n=0,lane=0;const hero=$('.hero',s);
  const t=setInterval(()=>{if(!alive())return clearInterval(t);if(!active(s)||s.dataset.done)return;
    const isR=Math.random()<.58,name=(isR?R:X)[Math.floor(Math.random()*12)],f=el('div','fall',`<img src="${I(name)}" alt="${W[name]}">`);
    lane=(lane+1+Math.floor(Math.random()*3))%6;f.style.left=(170+lane*275+rnd(-40,40))+'px';f.onanimationend=e=>{if(e.animationName==='fall')f.remove()};
    f.onclick=()=>{if(!isR){f.classList.add('bad');sfx.no();return;}const [x,y]=center(f),[hx,hy]=center(hero);word(f,name);sfx.ding();f.style.pointerEvents='none';f.style.animation='none';f.style.left=(x-75)+'px';f.style.top=(y-75)+'px';
      f.animate([{transform:'scale(1)'},{transform:`translate(${hx-x}px,${hy-y-40}px) scale(.15) rotate(300deg)`}],{duration:600,easing:'cubic-bezier(.5,0,.8,.6)'}).onfinish=()=>{f.remove();anim(hero,'roar')};
      const st=$$('i',sc)[n];if(st)st.classList.add('on');if(++n===8){$$('.fall',p).forEach(e=>e!==f&&e.remove());setTimeout(()=>done(s),700);}};
    p.appendChild(f);},1150);}});

/* 11 — what is missing */
game({id:'missing',bg:'room',task:'Чого не стало?',sub:'запам\'ятай картинки, а потім назви ту, що зникла',hero:'hero_look',hx:50,hy:540,hw:340,say:'Не підглядай!',
 build(p,s,alive){const L=['parasolka','korova','soroka','hrusha','rukavychka'];let rounds=0,pool=shuffle([0,1,2,3,4]);const him=$('.hero img',s);him.src=I('hero_look');
  const row=el('div','row5 paper in');p.appendChild(row);const cs=L.map(n=>{const c=pic(n);row.appendChild(c);return c});const cov=el('div','cover','Не підглядай!');row.appendChild(cov);
  const b=el('button','btn sm','Запам\'ятав ▶');b.style.cssText='position:absolute;left:880px;top:700px';p.appendChild(b);
  cs.forEach((c,i)=>c.onclick=()=>{if(!c.classList.contains('hid')){sfx.ding();anim($('img',c),'jelly');c.classList.add('named');return;}
    c.classList.remove('hid');c.classList.add('named');anim($('img',c),'jelly');yes(c);if(++rounds===3)return done(s);b.textContent='Ще раз ▶';b.hidden=false;});
  b.onclick=()=>{b.hidden=true;cs.forEach(c=>c.classList.remove('named'));cov.classList.add('on');him.src=I('hero_hide');sfx.flip();
    setTimeout(()=>{if(!alive())return;cs[pool.pop()].classList.add('hid');},700);
    setTimeout(()=>{if(!alive())return;cov.classList.remove('on');him.src=I('hero_look');sfx.flip();},1900);};}});

/* 12 — one / many */
game({id:'many',bg:'meadow',task:'Один — багато',sub:'назви один предмет, натисни — і назви багато',
 build(p,s){const L=[['raketa','ракети'],['robot','роботи'],['korona','корони'],['hrusha','груші'],['traktor','трактори'],['troianda','троянди']];const seen=new Set();
  L.forEach(([n,pl],i)=>{const c=el('div','many paper in',`<div class="trio">${`<img src="${I(n)}" alt="">`.repeat(3)}</div><span class="tag">${tagR(W[n])}</span>`);
    c.style.cssText=`left:${255+(i%3)*480}px;top:${185+Math.floor(i/3)*372}px;animation-delay:${.25+i*.1}s`;c.setAttribute('role','button');
    c.onclick=()=>{const m=c.classList.toggle('multi'),t=$('.tag',c);t.innerHTML=tagR(m?pl:W[n]);anim(t,'jelly');m?sfx.ding():sfx.flip();if(m){const [x,y]=center(c);burst(x,y,10);seen.add(n);if(seen.size===L.length)setTimeout(()=>done(s),600);}};p.appendChild(c);});}});

/* 13 — build a word from syllables */
game({id:'build',bg:'school',task:'Склади слово зі складів',sub:'натискай склади по порядку',hero:'hero_think',hx:40,hy:600,hw:340,say:'Який склад перший?',
 build(p,s,alive){const L=[['ryba',['РИ','БА']],['raketa',['РА','КЕ','ТА']],['korona',['КО','РО','НА']],['baraban',['БА','РА','БАН']]];const bd=el('div','board in');p.appendChild(bd);
  const show=k=>{const [n,sy]=L[k];let nx=0;bd.innerHTML=`<span class="step">${k+1} / ${L.length}</span><img class="big" src="${I(n)}" alt=""><div class="slots">${sy.map(()=>'<i></i>').join('')}</div><div class="tiles"></div>`;
    let order=shuffle(sy);if(order.join()===sy.join())order.reverse();const sl=$$('.slots i',bd);anim($('.big',bd),'jelly');
    order.forEach(t=>{const b=el('button','',t);b.onclick=()=>{if(t!==sy[nx])return nope(b);b.classList.add('used');sl[nx].textContent=t;sl[nx].className='f'+(/Р/.test(t)?' r':'');sfx.ding();
      if(++nx===sy.length){yes($('.big',bd));word($('.big',bd),n);setTimeout(()=>{if(!alive())return;k+1<L.length?show(k+1):done(s)},1700);}};$('.tiles',bd).appendChild(b);});};show(0);}});

/* 14 — riddles */
game({id:'riddles',bg:'school',task:'Відгадай загадку',sub:'прочитаємо разом — і обери відгадку',hero:'hero_think',hx:40,hy:600,hw:340,say:'Хм-м, що це?',
 build(p,s,alive){const L=[['Смугастий, як матрац, а схожий на коня.','zebra',['korova','zhyraf','soroka']],['Сидить дівчина в темниці, а коса на вулиці.','morkva',['pomidor','ohirok','harbuz']],
   ['Літає до зірок, а не птах.','raketa',['soroka','parasolka','zirka']],['Має ріжки, а не корова, носить хатку, а не черепаха.','ravlyk',['cherepakha','rak','krokodyl']]];const bd=el('div','board in');p.appendChild(bd);
  const show=k=>{const [q,ans,others]=L[k];bd.innerHTML=`<span class="step">${k+1} / ${L.length}</span><div class="chalk">${q}</div><div class="opts"></div>`;const o=$('.opts',bd);
    shuffle([ans,...others]).forEach(n=>{const c=pic(n);c.onclick=()=>{if(n!==ans)return nope(c);if(o.classList.contains('solved'))return;c.classList.add('right');o.classList.add('solved');anim($('img',c),'jelly');yes(c);
      setTimeout(()=>{if(!alive())return;k+1<L.length?show(k+1):done(s)},1900);};o.appendChild(c);});};show(0);}});

/* 15 — tic tac toe */
game({id:'ttt',bg:'fair',task:'Хрестики-нулики',sub:'назви слово — і став свій знак',
 build(p,s,alive,o){const L=shuffle(['derevo','sertse','ohirok','zhyraf','krokodyl','cherepakha','morozyvo','tsukerka','cherevyk']),B=Array(9).fill(''),LN=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];let turn='x',over=false;
  p.innerHTML=`<div class="turn paper" style="top:300px"><b style="color:var(--berry)">✕</b>Рик</div><div class="turn paper" style="top:480px"><b style="color:var(--sky)">○</b>Друг</div><div class="ttt"></div><div class="msg"></div>`;
  const tu=$$('.turn',p),g=$('.ttt',p),msg=$('.msg',p);const mark=()=>{tu[0].classList.toggle('on',turn==='x'&&!over);tu[1].classList.toggle('on',turn==='o'&&!over)};mark();
  const nb=el('button','btn sm','Нова гра');nb.style.cssText='position:absolute;left:1440px;top:640px';nb.onclick=()=>{const d=s.dataset.done;build(o);if(d){s.dataset.done=1;ui();}};p.appendChild(nb);
  L.forEach((n,i)=>{const c=el('div','cell paper in',`<img src="${I(n)}" alt="${W[n]}">`);c.style.animationDelay=`${.2+i*.06}s`;c.setAttribute('role','button');
    c.onclick=()=>{if(over||B[i])return;B[i]=turn;c.classList.add(turn);c.appendChild(el('b','',turn==='x'?'✕':'○'));word(c,n);sfx.ding();
      const w=LN.find(l=>l.every(j=>B[j]===turn));if(w){over=true;w.forEach(j=>g.children[j].classList.add('win'));msg.textContent=(turn==='x'?'Переміг Рик!':'Переміг Друг!');mark();done(s);}
      else if(B.every(Boolean)){over=true;msg.textContent='Нічия! Молодці!';mark();done(s);}else{turn=turn==='x'?'o':'x';mark();}};g.appendChild(c);});}});

/* 16 — rhymes */
game({id:'rhymes',bg:'stage',task:'Чистомовки',sub:'натисни «Ритм» і повторюй разом із Риком',hero:'hero_sing',hx:60,hy:560,hw:340,say:'Ра-ра-ра!',
 build(p,s,alive){const L=[['Ра-ра-ра','у Рика гра.','hero_jump'],['Ро-ро-ро','нове відро.','vidro'],['Ру-ру-ру','моркву беру.','morkva'],['Ри-ри-ри','жовті сири.','syr']];const heard=new Set();let k=0,busy=false;
  const v=el('div','verse paper in');p.appendChild(v);const ct=el('div','ctrl',`<button class="btn sm">▶ Ритм</button><button class="btn sm">Далі →</button>`);p.appendChild(ct);const [pl,nx]=$$('button',ct);
  const sp=t=>t.split(' ').map(w=>`<span>${tagR(w)}</span>`).join('');
  const show=()=>{const [a,b,im]=L[k];v.innerHTML=`<img src="${I(im)}" alt=""><p><em>${a.split('-').map((x,i,r)=>`<span style="margin-right:0">${tagR(x)}${i<r.length-1?'-':''}</span>`).join('')}</em>${sp(b)}</p><span class="step" style="color:var(--ink)">${k+1} / ${L.length}</span>`;anim($('img',v),'jelly')};show();
  pl.onclick=()=>{if(busy)return;busy=true;const ws=$$('p span',v),im=$('img',v);ws.forEach((w,i)=>setTimeout(()=>{if(!alive())return;ws.forEach(x=>x.classList.remove('hot'));w.classList.add('hot');sfx.beat(i);anim(im,'jelly');},i*520));
    setTimeout(()=>{if(!alive())return;ws.forEach(x=>x.classList.remove('hot'));busy=false;heard.add(k);if(heard.size===L.length)done(s);},ws.length*520+200);};
  nx.onclick=()=>{if(busy)return;k=(k+1)%L.length;sfx.flip();show();};}});

