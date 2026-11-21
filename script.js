'use strict';
const nav=document.querySelector('#nav');const toggle=document.querySelector('.nav-toggle');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕':'☰'});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.textContent='☰'}));
document.querySelector('#year').textContent=new Date().getFullYear();
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const phrases=['Computer Information Systems','Python • SQL • FastAPI','Data Analytics & Cybersecurity','Leadership • Operations • Technology'];const typed=document.querySelector('#typed');if(typed&&!reduced){let pi=0,ci=0,back=false;function type(){const p=phrases[pi];typed.textContent=p.slice(0,ci);if(!back&&ci<p.length){ci++;setTimeout(type,75)}else if(!back){back=true;setTimeout(type,1800)}else if(ci>0){ci--;setTimeout(type,35)}else{back=false;pi=(pi+1)%phrases.length;setTimeout(type,350)}}type()}
const progress=document.querySelector('#progress');let ticking=false;window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';ticking=false})},{passive:true});
const canvas=document.querySelector('#network');if(canvas&&!reduced){const ctx=canvas.getContext('2d');let width=0,height=0,points=[];function resize(){width=canvas.width=innerWidth; height=canvas.height=innerHeight;const count=Math.min(55,Math.floor(width*height/23000));points=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28}))}resize();window.addEventListener('resize',resize,{passive:true});let frame=0;function draw(){frame++;ctx.clearRect(0,0,width,height);for(let i=0;i<points.length;i++){const p=points[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>width)p.vx*=-1;if(p.y<0||p.y>height)p.vy*=-1;ctx.fillStyle='rgba(57,255,158,.34)';ctx.fillRect(p.x,p.y,2,2);for(let j=i+1;j<points.length;j++){const q=points[j];const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<135){ctx.strokeStyle=`rgba(39,169,255,${(1-d/135)*.13})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}}requestAnimationFrame(draw)}draw();document.addEventListener('visibilitychange',()=>{if(document.hidden)ctx.clearRect(0,0,width,height)})}

// Gentle depth effect on section art; disabled for reduced-motion preferences.
if (!reduced) {
  const artPanels = [...document.querySelectorAll('.section-art')];
  let artScheduled = false;
  const updateArt = () => {
    for (const art of artPanels) {
      const rect = art.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) continue;
      const offset = Math.max(-38, Math.min(38, (innerHeight / 2 - rect.top - rect.height / 2) * .055));
      art.style.backgroundPositionY = `calc(35% + ${offset}px)`;
    }
    artScheduled = false;
  };
  addEventListener('scroll', () => {
    if (!artScheduled) { artScheduled = true; requestAnimationFrame(updateArt); }
  }, { passive: true });
  updateArt();
}
