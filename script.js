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
function tone(freq=500,duration=.06,vol=.06,type='sine'){
 if(!soundOn)return;
 try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(Math.min(vol*2.4,.16),audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration)}catch(e){}
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
 for(let i=0;i<7;i++)setTimeout(()=>tone(115+i*13,.22,.024,'sawtooth'),i*135);
}
setInterval(flyoverCue,27000);

const phrases=['Computer Information Systems','Python • SQL • FastAPI','Data Analytics & Cybersecurity','Leadership • Operations • Technology'];let pi=0,ci=0,back=false;
function type(){const el=$('#typed');if(!el)return;const phrase=phrases[pi];el.textContent=phrase.slice(0,ci);if(!back&&ci<phrase.length){ci++;if(Date.now()-lastKey>55){tone(420+Math.random()*250,.038,.021,'triangle');lastKey=Date.now()}setTimeout(type,85)}else if(!back){back=true;setTimeout(type,1800)}else if(ci>0){ci--;setTimeout(type,32)}else{back=false;pi=(pi+1)%phrases.length;setTimeout(type,330)}}
if(!reduce)type();
const lines=['> initializing portfolio...','> loading skills: Python, SQL, FastAPI','> verifying projects: 3 found','> experience: leadership + operations','> systems ready.'];let li=0;
function terminal(){const el=$('#terminal');if(!el)return;el.textContent=lines.slice(0,li+1).join('\n');if(soundOn)tone(390+li*60,.085,.028,'triangle');li=(li+1)%lines.length;if(li===0)el.textContent=lines.join('\n');if(!reduce)setTimeout(terminal,2400)}terminal();
let busy=false;function updateScroll(){if(busy)return;busy=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?scrollY/max*100:0)+'%';const sections=$$('main section[id]');let current='home';sections.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.45)current=s.id});$$('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));busy=false})}addEventListener('scroll',updateScroll,{passive:true});updateScroll();
// Tilt only small panels; never move section artwork or clickable links away from the pointer.
if(!reduce&&matchMedia('(pointer:fine)').matches){$$('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`});el.addEventListener('pointerleave',()=>{el.style.transform=''})})}

// Optional, restrained section-specific audio. All cues require SOUND ON first.
let lastSceneSound = 0;
function sceneCue(id){
  if(!soundOn || reduce || document.hidden || Date.now()-lastSceneSound<6500)return;
  lastSceneSound=Date.now();
  const notes={about:[280,420],portfolio:[420,620],skills:[580,760],education:[350,520],experience:[240,360],development:[510,720],contact:[660,880]};
  const pair=notes[id];if(!pair)return;
  tone(pair[0],.14,.035,'triangle');
  setTimeout(()=>{if(soundOn)tone(pair[1],.16,.03,'sine')},130);
}
if('IntersectionObserver' in window){
  const sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting)sceneCue(entry.target.id);
  }),{threshold:.45});
  document.querySelectorAll('main section[id]:not(#home)').forEach(s=>sceneObserver.observe(s));
}
let lastHoverTone=0;
document.querySelectorAll('.project,.skill,.education-card,.career,.roadmap-card').forEach(card=>{
  card.addEventListener('pointerenter',()=>{
    if(!soundOn || Date.now()-lastHoverTone<1800)return;
    lastHoverTone=Date.now();tone(590,.065,.017,'sine');
  });
});

// Clear, opt-in audio feedback for visible interactive elements. No autoplay.
let lastMotionAudio=0;
function interactiveCue(kind){
 if(!soundOn || document.hidden || Date.now()-lastMotionAudio<400)return;
 lastMotionAudio=Date.now();
 if(kind==='project'){tone(340,.14,.085,'triangle');setTimeout(()=>tone(570,.15,.07,'sine'),110)}
 else if(kind==='skill'){tone(650,.09,.065,'square');setTimeout(()=>tone(840,.1,.045,'sine'),90)}
 else if(kind==='contact'){tone(550,.16,.075,'sine');setTimeout(()=>tone(880,.22,.06,'sine'),140)}
 else tone(460,.11,.07,'triangle');
}
document.querySelectorAll('.project').forEach(el=>el.addEventListener('click',()=>interactiveCue('project')));
document.querySelectorAll('.skill').forEach(el=>el.addEventListener('click',()=>interactiveCue('skill')));
document.querySelectorAll('.education-card,.career,.roadmap-card').forEach(el=>el.addEventListener('click',()=>interactiveCue('other')));
document.querySelectorAll('.contact-card').forEach(el=>el.addEventListener('pointerenter',()=>interactiveCue('contact')));
// An explicit sound test, activated by clicking the SOUND ON control a second time would mute,
// so instead allow Shift+click while sound is on to play an audible demo.
sound?.addEventListener('pointerdown',e=>{if(e.shiftKey&&soundOn){tone(450,.22,.1,'triangle');setTimeout(()=>tone(670,.22,.09,'triangle'),240)}});
