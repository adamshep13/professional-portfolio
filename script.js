'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const nav=$('#nav'),menu=$('#menu');
menu?.addEventListener('click',()=>{let opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));menu.textContent=opened?'✕':'☰'});
$$('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu.textContent='☰'}));
$('#year').textContent=new Date().getFullYear();
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window){const obs=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}}),{threshold:.07});$$('.reveal').forEach(el=>obs.observe(el))}else $$('.reveal').forEach(el=>el.classList.add('visible'));
const sound=$('#sound');
let audioCtx=null,soundOn=false,activeSection='home';
const activeVoices=new Set();
function getAudio(){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}
function stopSceneAudio(){for(const node of activeVoices){try{node.stop()}catch(e){}}activeVoices.clear()}
function tone(freq=500,duration=.1,vol=.045,type='sine'){
 if(!soundOn||document.hidden)return;
 try{const ctx=getAudio(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(Math.max(.001,vol),ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);osc.connect(gain);gain.connect(ctx.destination);activeVoices.add(osc);osc.onended=()=>activeVoices.delete(osc);osc.start();osc.stop(ctx.currentTime+duration)}catch(e){}
}
// One-shot aircraft noise, filtered and faded, synchronized to a visible flight cycle.
function flyoverCue(){
 if(!soundOn||reduce||document.hidden||activeSection!=='home')return;
 try{const ctx=getAudio(),duration=2.1,buffer=ctx.createBuffer(1,Math.floor(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.28;const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(210,ctx.currentTime);filter.frequency.linearRampToValueAtTime(650,ctx.currentTime+.8);filter.frequency.linearRampToValueAtTime(180,ctx.currentTime+duration);gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.linearRampToValueAtTime(.16,ctx.currentTime+.5);gain.gain.linearRampToValueAtTime(.0001,ctx.currentTime+duration);src.connect(filter);filter.connect(gain);gain.connect(ctx.destination);activeVoices.add(src);src.onended=()=>activeVoices.delete(src);src.start();src.stop(ctx.currentTime+duration)}catch(e){}
}
const plane=$('.plane');plane?.addEventListener('animationiteration',flyoverCue);
function sectionCue(id){if(!soundOn||document.hidden)return;
 const melodies={about:[280,410],portfolio:[360,570,730],skills:[600,810],education:[420,560],experience:[210,320],development:[460,660,780],contact:[680,920]};
 const notes=melodies[id];if(!notes)return;notes.forEach((n,i)=>setTimeout(()=>{if(soundOn&&activeSection===id)tone(n,.16,.07,'triangle')},i*135));
}
function setActiveSection(id){if(id===activeSection)return;stopSceneAudio();activeSection=id;sectionCue(id)}
sound?.addEventListener('click',()=>{soundOn=!soundOn;sound.setAttribute('aria-pressed',String(soundOn));sound.textContent=soundOn?'♫ SOUND ON':'♫ SOUND OFF';if(soundOn){getAudio();tone(560,.18,.07,'triangle');setTimeout(()=>tone(780,.2,.07,'sine'),160)}else stopSceneAudio()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSceneAudio()});
document.querySelectorAll('.btn,.contact-card,.resume-nav,nav a').forEach(el=>el.addEventListener('click',()=>tone(760,.085,.04,'triangle')));
const phrases=['Computer Information Systems','Python • SQL • FastAPI','Data Analytics & Cybersecurity','Leadership • Operations • Technology'];let pi=0,ci=0,back=false,lastKey=0;
function type(){const el=$('#typed');if(!el)return;const phrase=phrases[pi];el.textContent=phrase.slice(0,ci);if(!back&&ci<phrase.length){ci++;if(Date.now()-lastKey>55){if(activeSection==='home')tone(420+Math.random()*250,.045,.04,'triangle');lastKey=Date.now()}setTimeout(type,85)}else if(!back){back=true;setTimeout(type,1800)}else if(ci>0){ci--;setTimeout(type,32)}else{back=false;pi=(pi+1)%phrases.length;setTimeout(type,330)}}
if(!reduce)type();
const lines=['> initializing portfolio...','> loading skills: Python, SQL, FastAPI','> verifying projects: 3 found','> experience: leadership + operations','> systems ready.'];let li=0;
function terminal(){const el=$('#terminal');if(!el)return;el.textContent=lines.slice(0,li+1).join('\n');if(activeSection==='home')tone(390+li*60,.085,.025,'triangle');li=(li+1)%lines.length;if(li===0)el.textContent=lines.join('\n');if(!reduce)setTimeout(terminal,2400)}terminal();
let busy=false;function updateScroll(){if(busy)return;busy=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?scrollY/max*100:0)+'%';const sections=$$('main section[id]');let current='home';sections.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.45)current=s.id});$$('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));setActiveSection(current);busy=false})}addEventListener('scroll',updateScroll,{passive:true});updateScroll();
// Tilt only small panels; never move section artwork or clickable links away from the pointer.
if(!reduce&&matchMedia('(pointer:fine)').matches){$$('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`});el.addEventListener('pointerleave',()=>{el.style.transform=''})})}

// Brief tactile cues on interaction, never continuous sounds on other sections.
let lastInteraction=0;
function interactiveCue(kind){if(!soundOn||document.hidden||Date.now()-lastInteraction<550)return;lastInteraction=Date.now();const map={project:[400,590],skill:[640,840],contact:[560,850],other:[430,630]};(map[kind]||map.other).forEach((n,i)=>setTimeout(()=>tone(n,.12,.055,'triangle'),i*115))}
document.querySelectorAll('.project').forEach(el=>el.addEventListener('pointerenter',()=>interactiveCue('project')));
document.querySelectorAll('.skill').forEach(el=>el.addEventListener('pointerenter',()=>interactiveCue('skill')));
document.querySelectorAll('.education-card,.career,.roadmap-card,.contact-card').forEach(el=>el.addEventListener('pointerenter',()=>interactiveCue('other')));
