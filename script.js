'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const nav=$('#nav'),menu=$('#menu');
menu?.addEventListener('click',()=>{let opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));menu.textContent=opened?'✕':'☰'});
$$('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu.textContent='☰'}));
$('#year').textContent=new Date().getFullYear();
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window){const obs=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}}),{threshold:.07});$$('.reveal').forEach(el=>obs.observe(el))}else $$('.reveal').forEach(el=>el.classList.add('visible'));
const sound=$('#sound');let audioCtx=null,soundOn=false,lastKey=0;
function tone(freq=500,duration=.06,vol=.015,type='sine'){
 if(!soundOn)return;
 try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(vol,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration)}catch(e){}
}
sound?.addEventListener('click',async()=>{
 soundOn=!soundOn;sound.setAttribute('aria-pressed',String(soundOn));sound.textContent=soundOn?'♫ SOUND ON':'♫ SOUND OFF';
 if(soundOn){try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();await audioCtx.resume()}catch(e){};
  tone(520,.18,.055,'triangle');setTimeout(()=>tone(780,.24,.045,'sine'),130);setTimeout(()=>tone(1040,.3,.03,'sine'),290);
 }
});
// Gentle UI sounds on intentional interactions; no sounds when muted.
document.querySelectorAll('.btn,.contact-card,.resume-nav,nav a').forEach(el=>el.addEventListener('click',()=>tone(720,.075,.022,'triangle')));
// A soft flyover cue on the homepage, approximately once per animation cycle.
function flyoverCue(){if(!soundOn||reduce||document.hidden||!$('#home')||$('#home').getBoundingClientRect().bottom<0)return;
 for(let i=0;i<7;i++)setTimeout(()=>tone(115+i*13,.17,.012,'sawtooth'),i*135);
}
setInterval(flyoverCue,27000);

const phrases=['Computer Information Systems','Python • SQL • FastAPI','Data Analytics & Cybersecurity','Leadership • Operations • Technology'];let pi=0,ci=0,back=false;
function type(){const el=$('#typed');if(!el)return;const phrase=phrases[pi];el.textContent=phrase.slice(0,ci);if(!back&&ci<phrase.length){ci++;if(Date.now()-lastKey>55){tone(420+Math.random()*250,.025,.007,'triangle');lastKey=Date.now()}setTimeout(type,85)}else if(!back){back=true;setTimeout(type,1800)}else if(ci>0){ci--;setTimeout(type,32)}else{back=false;pi=(pi+1)%phrases.length;setTimeout(type,330)}}
if(!reduce)type();
const lines=['> initializing portfolio...','> loading skills: Python, SQL, FastAPI','> verifying projects: 3 found','> experience: leadership + operations','> systems ready.'];let li=0;
function terminal(){const el=$('#terminal');if(!el)return;el.textContent=lines.slice(0,li+1).join('\n');if(soundOn)tone(390+li*60,.055,.014,'triangle');li=(li+1)%lines.length;if(li===0)el.textContent=lines.join('\n');if(!reduce)setTimeout(terminal,2400)}terminal();
let busy=false;function updateScroll(){if(busy)return;busy=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?scrollY/max*100:0)+'%';const sections=$$('main section[id]');let current='home';sections.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.45)current=s.id});$$('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));busy=false})}addEventListener('scroll',updateScroll,{passive:true});updateScroll();
// Tilt only small panels; never move section artwork or clickable links away from the pointer.
if(!reduce&&matchMedia('(pointer:fine)').matches){$$('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`});el.addEventListener('pointerleave',()=>{el.style.transform=''})})}
