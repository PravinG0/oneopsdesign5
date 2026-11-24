
(() => { const root=document.querySelector('.oneops-faq'); const triggers=[...root.querySelectorAll('.faq-trigger')];const nodes=[...root.querySelectorAll('.orbit-node')];const links=[...root.querySelectorAll('[data-faq-link]')]; let active=0;
function select(index, allowClose=false){active=allowClose&&active===index?-1:index;triggers.forEach((button,i)=>{const open=i===active;button.setAttribute('aria-expanded',String(open));button.closest('.ofaq-item').classList.toggle('is-active',open);document.getElementById(button.getAttribute('aria-controls')).inert=!open});nodes.forEach(node=>{const on=Number(node.dataset.index)===active;node.classList.toggle('is-active',on);node.setAttribute('aria-pressed',String(on))});links.forEach(link=>link.classList.toggle('is-active',Number(link.dataset.faqLink)===active));}
triggers.forEach((button,i)=>{button.addEventListener('click',()=>select(i,true));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown')next=(i+1)%triggers.length;else if(event.key==='ArrowUp')next=(i+triggers.length-1)%triggers.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=triggers.length-1;else return;event.preventDefault();triggers[next].focus()})});nodes.forEach(node=>node.addEventListener('click',()=>select(Number(node.dataset.index))));
select(0);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!reduced.matches){document.documentElement.classList.add('js');const targets=[...root.querySelectorAll('.reveal'),...root.querySelectorAll('.ofaq-item')];root.querySelectorAll('.ofaq-item').forEach((item,i)=>{item.classList.add('reveal');item.style.setProperty('--delay',`${i*65}ms`)});const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target)}})},{threshold:.08});targets.forEach(t=>io.observe(t));}
})();

(()=>{
 const root=document.querySelector('.oneops-faq'), visual=root.querySelector('.visual'), svg=visual.querySelector('.diagram');
 const ns='http://www.w3.org/2000/svg', scene=svg.firstElementChild, cube=svg.querySelector('.cube-tilt'), float=svg.querySelector('.cube-float');
 const faces=[...float.querySelectorAll('path')], links=[...svg.querySelectorAll('[data-faq-link]')], nodes=[...visual.querySelectorAll('.orbit-node')];
 const planes=[...svg.querySelectorAll('.plane')], note=visual.querySelector('.motion-counter'), hud=visual.querySelector('.motion-hud-title');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const make=(tag,attrs,parent)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));parent.appendChild(el);return el};
 const set=(el,attrs)=>Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
 const mix=(a,b,t)=>a+(b-a)*t, clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
 const items=[{x:300,y:57,ex:300,ey:185,label:'Bedrock'},{x:540,y:213,ex:418,ey:263,label:'AWS connection'},{x:60,y:213,ex:182,ey:263,label:'Savings levers'},{x:505,y:451,ex:380,ey:365,label:'Budget controls'},{x:102,y:451,ex:220,ey:365,label:'Data privacy'}];
 // Two thin technical rings and a segmented moving arc, all solid strokes.
 const rings=make('g',{'fill':'none','pointer-events':'none'},scene);scene.insertBefore(rings,scene.firstChild);
 const ring=make('ellipse',{cx:300,cy:304,rx:262,ry:254,stroke:'var(--plum)','stroke-width':.7,'stroke-dasharray':'1 10',opacity:.7},rings);
 const arc=make('ellipse',{cx:300,cy:330,rx:228,ry:67,stroke:'var(--coral)','stroke-width':1.5,'stroke-dasharray':'58 1100','stroke-linecap':'round',opacity:.7},rings);
 const ticks=make('g',{stroke:'var(--plum)','stroke-width':1,opacity:.65},rings);
 for(let i=0;i<48;i++){let a=i*Math.PI/24;make('line',{x1:300+Math.cos(a)*267,y1:304+Math.sin(a)*259,x2:300+Math.cos(a)*(i%4===0?274:270),y2:304+Math.sin(a)*(i%4===0?266:262)},ticks)}
 const packetLayer=make('g',{},scene);scene.insertBefore(packetLayer,cube);
 const packets=items.map((it,i)=>Array.from({length:3},(_,j)=>make('rect',{width:j===0?8:5,height:j===0?8:5,rx:1.2,fill:j===0?'var(--cream)':'var(--coral)',opacity:0,class:'motion-packet'},packetLayer)));
 const satellites=Array.from({length:12},(_,i)=>make('circle',{r:i%4===0?3.8:1.7,fill:i%4===0?'var(--coral)':'var(--plum)',opacity:.65, class:'motion-orbit-particle'},packetLayer));
 const rippleLayer=make('g',{fill:'none',stroke:'var(--coral)','stroke-width':1},scene);scene.insertBefore(rippleLayer,cube);
 const waves=Array.from({length:3},()=>make('path',{d:'M300 424 450 475 300 529 150 475Z',opacity:0,class:'motion-ripple'},rippleLayer));
 let pointer={x:0,y:0}, smooth={x:0,y:0}, progress=0, scroll=0, start=null, last=null, raf=0, visible=true, selected=0, eventTime=-3, t=0;
 const current=()=>nodes.find(n=>n.classList.contains('is-active'))?.dataset.index??'-1';
 function selection(){let next=Number(current());if(next===selected)return;selected=next;eventTime=t;if(note)note.textContent=selected<0?'— / 05':`${String(selected+1).padStart(2,'0')} / 05`;if(hud)hud.textContent=selected<0?'Explore architecture':items[selected].label; if(reduce.matches)draw(0,true)}
 const mo=new MutationObserver(selection);nodes.forEach(n=>mo.observe(n,{attributes:true,attributeFilter:['class']}));
 visual.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduce.matches)return;const r=visual.getBoundingClientRect();pointer.x=clamp((e.clientX-r.left)/r.width*2-1,-1,1);pointer.y=clamp((e.clientY-r.top)/r.height*2-1,-1,1)});
 visual.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0});
 function draw(dt,staticMode=false){
  const r=root.getBoundingClientRect();const vh=window.innerHeight; const target=clamp((vh/2-(r.top+r.height/2))/(vh/2+r.height/2),-1,1);
  const damping=1-Math.exp(-dt*7);scroll=staticMode?0:mix(scroll,target,damping);smooth.x=staticMode?0:mix(smooth.x,pointer.x,damping);smooth.y=staticMode?0:mix(smooth.y,pointer.y,damping);
  const entrance=staticMode?1:clamp(t/1.25,0,1); const ease=1-Math.pow(1-entrance,3);
  const age=t-eventTime;const burst=staticMode?0:Math.max(0,Math.sin(clamp(age/1.05,0,1)*Math.PI))*Math.exp(-Math.max(age,0)*.9);
  const idle=staticMode?0:Math.sin(t*1.45); const x=staticMode?0:smooth.x*12;const y=staticMode?0:idle*9+scroll*19+smooth.y*8;
  const roll=staticMode?0:smooth.x*5+scroll*8; const scale=.86+.14*ease+burst*.035;
  cube.setAttribute('transform',`translate(${x} ${y}) translate(300 280) rotate(${roll}) scale(${scale}) translate(-300 -280)`);
  const gap=staticMode?0:(1-ease)*17+burst*5+Math.abs(scroll)*2.8;
  faces[0].setAttribute('transform',`translate(0 ${gap})`);faces[1].setAttribute('transform',`translate(${-gap*.65} ${-gap*.28})`);faces[2].setAttribute('transform',`translate(${gap*.65} ${-gap*.28})`);
  planes.forEach((p,i)=>p.setAttribute('transform',`translate(${x*(.3-i*.1)} ${staticMode?0:(1-ease)*(i+1)*15+Math.sin(t*1.35-i*.7)*3+scroll*(i+1)*5+burst*(i+1)*3})`));
  arc.setAttribute('stroke-dashoffset',staticMode?0:-t*46);ring.setAttribute('stroke-dashoffset',staticMode?0:t*8);
  satellites.forEach((p,i)=>{const inner=i>=7;const a=(staticMode?0:t*(inner?-.49:.23))+i*Math.PI*2/(inner?5:7);set(p,{cx:300+Math.cos(a)*(inner?228:250),cy:(inner?330:304)+Math.sin(a)*(inner?67:242),opacity:staticMode?.6:.25+.65*(.5+.5*Math.sin(t*1.7+i))})});
  nodes.forEach(node=>{const i=+node.dataset.index,it=items[i]; const phase=i*1.2;const dx=staticMode?0:Math.sin(t*.9+phase)*4+smooth.x*(i===0?2:5);const dy=staticMode?0:Math.cos(t*1.1+phase)*5+scroll*8;const nx=it.x+dx,ny=it.y+dy;
   node.style.left=`${nx/6}%`;node.style.top=`${ny/6.2}%`;
   const endX=it.ex+x,endY=it.ey+y; const link=links.find(l=>+l.dataset.faqLink===i);const mx=(nx+endX)/2+(i===0?0:(i===1||i===3?12:-12)),my=(ny+endY)/2;
   link.setAttribute('d',`M${nx} ${ny} Q${mx} ${my} ${endX} ${endY}`);
   packets[i].forEach((p,j)=>{let u=((t*(selected===i?.66:.29)+j*.19+i*.17)%1+1)%1;let px=(1-u)**2*nx+2*(1-u)*u*mx+u*u*endX,py=(1-u)**2*ny+2*(1-u)*u*my+u*u*endY;let size=j===0?8:5;set(p,{x:px-size/2,y:py-size/2,transform:`rotate(45 ${px} ${py})`,opacity:staticMode?0:selected===i?Math.sin(u*Math.PI)*.95:(j===0?.25*Math.sin(u*Math.PI):0)})});
  });
  waves.forEach((wave,i)=>{const age2=age-i*.16;const u=clamp(age2/.95,0,1);const sc=.55+u*.8;set(wave,{transform:`translate(300 475) scale(${sc}) translate(-300 -475)`,opacity:staticMode||age2<0||age2>.95?0:(1-u)*.65})});
 }
 function frame(now){raf=0;if(!visible||reduce.matches||document.hidden)return;const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;t+=dt;draw(dt);raf=requestAnimationFrame(frame)}
 function sync(){if(raf){cancelAnimationFrame(raf);raf=0}last=null;if(reduce.matches){draw(0,true);return}if(visible&&!document.hidden)raf=requestAnimationFrame(frame)}
 if('IntersectionObserver'in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{rootMargin:'80px'}).observe(visual)}
 document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);sync();
})();
