
(()=>{'use strict';const root=document.querySelector('.oneops-hero');if(!root)return;const stage=root.querySelector('.oh-stage'),svg=root.querySelector('.oh-scene'),defs=svg.querySelector('defs'),arch=svg.querySelector('.oh-architecture'),labels=svg.querySelector('.oh-labels'),panel=root.querySelector('.oh-panel');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const ns='http://www.w3.org/2000/svg';const E=(tag,attrs={},parent)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(parent)parent.append(n);return n};const A=(n,attrs)=>{for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v)};const T=(p,x,y,str,attrs={})=>{const n=E('text',{x,y,...attrs},p);n.textContent=str;return n};const path=(p,d,attrs={})=>E('path',{d,...attrs},p);
const icons={shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',layers:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',activity:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',chart:'<path d="M4 20V10m5 10V4m6 16v-8m5 8V7M2 20h20"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-8l1-7Z"/>',coins:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 4 16 4 16 0V5M4 9c0 4 16 4 16 0M4 13v5c0 4 16 4 16 0v-5"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'};const icon=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[k]}</svg>`;
const LAYER_DATA = {
      'layer-control': {
        badge: 'LAYER 01',
        title: 'Control Layer: In-Flight Guardrails',
        overview: {
          body: 'Enforces RBAC access policies, automated model allowlists, token budget hard caps, and real-time PII redaction before requests touch Amazon Bedrock.',
          metrics: [
            { val: '0 ms', lbl: 'Proxy Latency' },
            { val: '100%', lbl: 'Zero Retention' },
            { val: '<15 min', lbl: 'AWS Deployment' }
          ]
        },
        telemetry: {
          body: 'Active budget envelopes prevent end-of-month cloud billing surprises by throttling or routing rogue autonomous agent loops.',
          metrics: [
            { val: '14 Blk/hr', lbl: 'Prompt Injections' },
            { val: '100%', lbl: 'Budget Cap Enforced' },
            { val: '99.99%', lbl: 'Proxy Reliability' }
          ]
        },
        policies: {
          body: 'Automated in-line PII sanitization (SSN, credit cards, confidential internal tokens) with zero enterprise payload retention.',
          metrics: [
            { val: 'AES-256', lbl: 'In-Flight Encryption' },
            { val: 'AWS IAM', lbl: 'Role Delegation' },
            { val: 'SOC 2', lbl: 'Compliance Ready' }
          ]
        }
      },

      'layer-optimize': {
        badge: 'LAYER 02',
        title: 'Optimize Layer: 5 Savings Levers',
        overview: {
          body: 'Intelligently routes prompts to right-sized models, executes automatic prompt caching, applies semantic compression, and runs asynchronous batch inference to save up to 60% on Bedrock costs.',
          metrics: [
            { val: 'Up to 60%', lbl: 'Cost Reduction' },
            { val: '4.2x', lbl: 'Cache Speedup' },
            { val: '0 Loss', lbl: 'Output Quality' }
          ]
        },
        telemetry: {
          body: 'Continuous model routing directs simple classification tasks to Haiku/Llama-8B while preserving Claude 3.5 Sonnet for deep reasoning.',
          metrics: [
            { val: '$62,840', lbl: 'Saved This Month' },
            { val: '79.2%', lbl: 'Semantic Cache Hit' },
            { val: '1.8x', lbl: 'Throughput Multiplier' }
          ]
        },
        policies: {
          body: 'Automatic batching shifts non-interactive workloads into Bedrock 50% discount batch inference windows automatically.',
          metrics: [
            { val: '50% Disc', lbl: 'Batch Savings' },
            { val: 'Smart SLA', lbl: 'Latency Guarantees' },
            { val: 'Auto-Fallback', lbl: 'Zero Outages' }
          ]
        }
      },

      'layer-observe': {
        badge: 'LAYER 03',
        title: 'Observe Layer: Real-Time Telemetry & Traces',
        overview: {
          body: 'Captures distributed traces for every request, tracks token throughput across models, and streams live spend attribution directly to CloudWatch, Datadog, or your OpenTelemetry collector.',
          metrics: [
            { val: '100%', lbl: 'Request Capture' },
            { val: 'OTel & AWS', lbl: 'Native Export' },
            { val: 'P99 < 8ms', lbl: 'Telemetry Overhead' }
          ]
        },
        telemetry: {
          body: 'Full token streaming transparency: breakdown of input prompt tokens, output completion tokens, cached tokens, and unit cost per call.',
          metrics: [
            { val: '14.2k/min', lbl: 'Current Invocations' },
            { val: '12 ms', lbl: 'P99 Latency' },
            { val: '18 Squads', lbl: 'Tracked in Real-Time' }
          ]
        },
        policies: {
          body: 'Zero-payload-logging guarantee: only telemetry metadata, latency stamps, and token counts leave the private VPC.',
          metrics: [
            { val: 'Zero Ret', lbl: 'Prompt Body Kept' },
            { val: 'ISO 27001', lbl: 'Audit Grade' },
            { val: 'CloudWatch', lbl: 'Direct Streaming' }
          ]
        }
      },

      'layer-report': {
        badge: 'LAYER 04',
        title: 'Report Layer: Audit Vault & Chargeback',
        overview: {
          body: 'Generates granular cost allocation reports by engineering squad, project, and autonomous agent. Produces immutable compliance audit logs for EU AI Act, SOC 2, and internal governance.',
          metrics: [
            { val: '1-Click', lbl: 'Chargeback CSV' },
            { val: 'SOC 2 / ISO', lbl: 'Audit Ready' },
            { val: 'Zero Drift', lbl: 'Budget Proof' }
          ]
        },
        telemetry: {
          body: 'Weekly FinOps Flywheel attribution calculates exact unit economics per feature, autonomous agent, and internal department.',
          metrics: [
            { val: '100% Attrib', lbl: 'Cost Tagging' },
            { val: 'Daily Sync', lbl: 'AWS Cost Explorer' },
            { val: 'Weekly', lbl: 'Automated Flywheel' }
          ]
        },
        policies: {
          body: 'Immutable cryptographic audit trails for enterprise AI governance, supporting EU AI Act Article 12 compliance out of the box.',
          metrics: [
            { val: 'WORM Vault', lbl: 'Tamper Evident' },
            { val: 'EU AI Act', lbl: 'Compliance Mapping' },
            { val: 'FinOps Org', lbl: 'Certified Standards' }
          ]
        }
      },

      'layer-bedrock': {
        badge: 'FOUNDATION',
        title: 'Amazon Bedrock: Native Enterprise Substrate',
        overview: {
          body: 'Plugs natively into your existing AWS infrastructure and VPC. Uses standard AWS IAM role delegation and standard AWS SDK endpoints. Adds governance and FinOps without changing a single line of backend code.',
          metrics: [
            { val: 'Native', lbl: 'AWS Bedrock' },
            { val: 'Zero', lbl: 'Code Refactoring' },
            { val: '99.99%', lbl: 'SLA Uptime' }
          ]
        },
        telemetry: {
          body: 'Direct PrivateLink connectivity to Claude 3.5, Llama 3, Amazon Titan, and Mistral foundation model endpoints with zero egress cost.',
          metrics: [
            { val: 'Direct AWS', lbl: 'PrivateLink VPC' },
            { val: '0 Egress', lbl: 'Cross-Cloud Fees' },
            { val: 'Cross-Region', lbl: 'Native Failover' }
          ]
        },
        policies: {
          body: 'All foundational AWS guarantees, data encryption via AWS KMS, and enterprise privacy commitments remain 100% intact.',
          metrics: [
            { val: 'AWS KMS', lbl: 'Customer-Managed Keys' },
            { val: 'IAM Roles', lbl: 'Least Privilege' },
            { val: 'Replaces 0', lbl: 'AWS Stack Changes' }
          ]
        }
      }
    };
const data=[{name:'Control',sub:'What’s allowed',color:'#ff644d',icon:'shield',y:326,key:'layer-control'},{name:'Optimize',sub:'Five savings levers',color:'#a29aff',icon:'layers',y:250,key:'layer-optimize'},{name:'Observe',sub:'Every request',color:'#48caff',icon:'activity',y:174,key:'layer-observe'},{name:'Report',sub:'Proof for others',color:'#ff905c',icon:'chart',y:98,key:'layer-report'},{name:'Amazon Bedrock',sub:'Native foundation',color:'#ffac58',icon:'bedrock',y:0,key:'layer-bedrock'}];
icons.bedrock='<path d="M4 16l8 5 8-5M4 12l8 5 8-5M4 8l8-5 8 5-8 5Z"/>';
let selected=-1,hover=-1,activeSpec='overview';let pointer={x:0,y:0},smooth={x:0,y:0},scroll=0,visible=true;let yaw=.78,tilt=.43,clock=0;const tabs=root.querySelector('.oh-tabs');const buttons=data.map((d,i)=>{const b=document.createElement('button');b.type='button';b.className='oh-tab';b.style.setProperty('--layer-color',d.color);b.innerHTML=icon(d.icon)+d.name;b.addEventListener('click',()=>select(i));b.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')select(i)});b.addEventListener('focus',()=>select(i));tabs.append(b);return b});
const specButtons=[...panel.querySelectorAll('[data-spec]')];
function updateSpec(initial=false){const d=data[selected],info=LAYER_DATA[d.key],detail=info[activeSpec];panel.style.setProperty('--active-color',d.color);panel.querySelector('h2').textContent=info.title;panel.querySelector('.oh-panel-head p').textContent=detail.body;const metrics=panel.querySelector('.oh-metrics');metrics.replaceChildren(...detail.metrics.map(m=>{const item=document.createElement('div');item.className='oh-stat';const val=document.createElement('strong'),lbl=document.createElement('small');val.textContent=m.val;lbl.textContent=m.lbl;item.append(val,lbl);return item}));panel.querySelector('.oh-metric-note').hidden=activeSpec!=='telemetry';specButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.spec===activeSpec)));if(!initial&&!reduced){panel.classList.remove('oh-change');void panel.offsetWidth;panel.classList.add('oh-change')}}
function select(i,initial=false){if(selected===i&&!initial)return;selected=i;hover=-1;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));updateSpec(initial);if(reduced)render(0)}
specButtons.forEach(b=>b.addEventListener('click',()=>{activeSpec=b.dataset.spec;updateSpec()}));
function project(x,y,z){const c=Math.cos(yaw),s=Math.sin(yaw);return[345+x*c-z*s,492+(x*s+z*c)*tilt-y]};const fmt=p=>p.map(v=>v.toFixed(2)).join(',');const poly=pts=>'M'+pts.map(fmt).join('L')+'Z';const line=pts=>'M'+pts.map(fmt).join('L');const matrix=(y)=>{const p=project(0,y,0),x=project(1,y,0),z=project(0,y,1);return `matrix(${x[0]-p[0]} ${x[1]-p[1]} ${z[0]-p[0]} ${z[1]-p[1]} ${p[0]} ${p[1]})`};
function bindLayer(n,i){n.setAttribute('role','button');n.setAttribute('tabindex','0');n.setAttribute('aria-label',`Explore ${data[i].name} layer`);n.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')select(i)});n.addEventListener('focus',()=>select(i));n.addEventListener('click',()=>select(i));n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i)}})}
function makePlate(parent,d,i){const g=E('g',{class:i>=0?'oh-layer':''},parent);if(i>=0)bindLayer(g,i);const glow=E('path',{fill:d.color,opacity:.1,filter:'url(#oh-soft)'},g),left=E('path',{class:'oh-side',fill:d.color,'fill-opacity':.21,stroke:d.color,'stroke-opacity':.46,'stroke-width':.8},g),right=E('path',{class:'oh-side',fill:d.color,'fill-opacity':.13,stroke:d.color,'stroke-opacity':.55,'stroke-width':.8},g),face=E('path',{class:'oh-face',fill:i<0?'url(#oh-base)':d.color,'fill-opacity':i<0?1:.12,stroke:d.color,'stroke-width':1.3},g),surface=E('g',{},g),r=i<0?157:123;const grid=E('g',{stroke:d.color,'stroke-opacity':.23,'stroke-width':.8,fill:'none'},surface);for(let k=-r+20;k<r;k+=30){path(grid,`M${k} ${-r}V${r}`);path(grid,`M${-r} ${k}H${r}`)}for(let j=0;j<3;j++)E('rect',{x:-r+12+j*19,y:-r+12+j*19,width:2*(r-12-j*19),height:2*(r-12-j*19),rx:3,fill:'none',stroke:d.color,'stroke-opacity':.36,'stroke-width':1},surface);E('circle',{cx:0,cy:0,r:27,fill:'url(#oh-core)',opacity:.65},surface);E('circle',{cx:0,cy:0,r:4,fill:'#fff0dc',filter:'url(#oh-glow)'},surface);
if(i>=0){const chart=E('g',{stroke:d.color,fill:'none','stroke-width':2,'stroke-linecap':'round'},surface);if(i===0){path(chart,'M-42 0L0 -42 42 0 0 42Z M-18 0L0 18 18 0');}else if(i===2){path(chart,'M-95 43L-72 30 -58 50 -40 4 -18 32 0 14 21 40 38 -12 60 29 85 8 97 26',{'stroke-width':3,filter:'url(#oh-glow)'});}else{for(let k=0;k<9;k++)E('rect',{x:-90+k*13,y:32-(12+((k*17+i*8)%39)),width:7,height:12+((k*17+i*8)%39),fill:d.color,'fill-opacity':.65,stroke:'none'},chart);E('circle',{cx:60,cy:-15,r:23,'stroke-opacity':.8},chart);E('circle',{cx:60,cy:-15,r:12,'stroke-opacity':.5},chart)}}return {g,glow,left,right,face,surface,r,d,i};}
const base=makePlate(arch,data[4],-1);base.g.classList.add('oh-layer');bindLayer(base.g,4);const baseName=E('g',{},base.g);const baseNameShadow=E('path',{fill:'none',stroke:'#ff8757','stroke-width':2.5,filter:'url(#oh-glow)'},baseName);const baseText=T(baseName,0,0,'Amazon Bedrock',{fill:'#f5f6ff','font-size':19,'font-weight':700,'text-anchor':'middle'});const baseSub=T(baseName,0,0,'FOUNDATION MODEL SERVICE',{fill:'#9cabc4','font-size':8,'letter-spacing':2,'text-anchor':'middle'});
const beams=E('g',{'pointer-events':'none'},arch);const beamLines=Array.from({length:5},(_,i)=>E('path',{fill:'none',stroke:i===0?'#ffb786':'#90aaff','stroke-width':i===0?1.5:.7,'stroke-opacity':i===0?.7:.32},beams));const beamDots=Array.from({length:9},(_,i)=>E('circle',{r:i%3===0?3:1.7,fill:i%2?'#8cdaff':'#ffc59b',filter:'url(#oh-glow)'},beams));const plates=[];for(let i=3;i>=0;i--)plates[i]=makePlate(arch,data[i],i);
const cube=E('g',{},arch);const cage=Array.from({length:12},()=>E('path',{fill:'none',stroke:'#ff9774','stroke-opacity':.5,'stroke-width':.8},cube));const cubeFaces=Array.from({length:6},()=>E('path',{stroke:'#ffd4ca','stroke-width':.6,'stroke-opacity':.5},cube));const cubeGlow=E('circle',{r:50,fill:'#ff5c32',opacity:.13,filter:'url(#oh-soft)'},cube);cube.prepend(cubeGlow);const cubeDot=E('circle',{r:3,fill:'#ffddaf',filter:'url(#oh-glow)'},cube);
const callouts=data.map((d,i)=>{const g=E('g',{class:'oh-callout'},labels);bindLayer(g,i);const connector=path(g,'',{fill:'none',stroke:d.color,'stroke-width':1.2,'stroke-opacity':.75});const dot=E('circle',{r:3,fill:d.color,filter:'url(#oh-glow)'},g);const box=E('g',{},g);const rect=E('rect',{class:'oh-call-bg',x:0,y:0,width:190,height:52,rx:11,fill:'#111824','fill-opacity':.92,stroke:d.color,'stroke-opacity':.35},box);const ig=E('g',{transform:'translate(13 14)',stroke:d.color,fill:'none','stroke-width':1.6,'stroke-linecap':'round','stroke-linejoin':'round',filter:'url(#oh-glow)'},box);ig.innerHTML=icons[d.icon];T(box,49,22,d.name,{fill:'#f6f4fa','font-size':i===4?14:16,'font-weight':700});T(box,49,39,d.sub,{fill:'#a7aec0','font-size':11});return {g,connector,dot,box,rect}});
function renderPlate(p,y){const r=p.r,depth=p.i<0?36:15;const pts=[project(-r,y,-r),project(r,y,-r),project(r,y,r),project(-r,y,r)],bot=[project(-r,y-depth,-r),project(r,y-depth,-r),project(r,y-depth,r),project(-r,y-depth,r)];A(p.face,{d:poly(pts)});A(p.glow,{d:poly(pts)});A(p.left,{d:poly([pts[2],pts[3],bot[3],bot[2]])});A(p.right,{d:poly([pts[1],pts[2],bot[2],bot[1]])});A(p.surface,{transform:matrix(y)});if(p.i>=0){const on=selected===p.i;A(p.face,{'fill-opacity':on?.34:.14,'stroke-width':on?2.1:1.2,filter:on?'url(#oh-glow)':'none'});A(p.glow,{opacity:on?.36:.11});A(p.left,{'fill-opacity':on?.43:.21});A(p.right,{'fill-opacity':on?.28:.13});p.g.setAttribute('aria-pressed',String(selected===p.i));}else{const on=selected===4;A(p.face,{fill:on?p.d.color:'url(#oh-base)','fill-opacity':on?.30:1,'stroke-width':on?2.5:1.3,filter:on?'url(#oh-glow)':'none'});A(p.glow,{opacity:on?.38:.08});A(p.left,{'fill-opacity':on?.50:.17});A(p.right,{'fill-opacity':on?.35:.12});p.g.setAttribute('aria-pressed',String(on));}return {pts,bot};}
function render(t){clock=reduced?0:t;const time=clock/1000;smooth.x+=(pointer.x-smooth.x)*.065;smooth.y+=(pointer.y-smooth.y)*.065;yaw=.78+smooth.x*.17;tilt=.43+smooth.y*.075;const separation=1+scroll*.15;const bob=reduced?0:Math.sin(time*1.35)*4;const baseGeom=renderPlate(base,0);A(baseNameShadow,{d:line([baseGeom.bot[3],baseGeom.bot[2],baseGeom.bot[1]]),stroke:selected===4?'#ffc66e':'#ff8757','stroke-width':selected===4?3.5:1.8,opacity:selected===4?1:.6});A(baseText,{x:345,y:558});A(baseSub,{x:345,y:573});const yy=data.map((d,i)=>d.y*separation+bob+Math.sin(time*1.2+i*.8)*2);const cy=415+scroll*35+bob;beamLines.forEach((n,i)=>{const x=[0,-100,100,0,0][i],z=[0,0,0,-100,100][i];A(n,{d:line([project(x,5,z),project(x,cy,z)])})});beamDots.forEach((n,i)=>{const v=(i/9+time*.22)%1;const p=project(i%3===0?0:i%3===1?65:-65,10+v*cy,i%2?50:-50);A(n,{cx:p[0],cy:p[1],opacity:.4+.6*Math.sin(v*Math.PI)})});plates.forEach((p,i)=>renderPlate(p,yy[i]));
const angle=time*.27;function verts(size,center,rot){return [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]].map(([x,y,z])=>{const a=x*size,b=z*size;return project(a*Math.cos(rot)-b*Math.sin(rot),center+y*size,b*Math.cos(rot)+a*Math.sin(rot))})}const cv=verts(55,cy,0);const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];edges.forEach(([a,b],i)=>A(cage[i],{d:line([cv[a],cv[b]])}));const v=verts(27,cy,angle);const f=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];const colors=['#753135','#d9a9b7','#bf3d34','#ff7855','#bc4e46','#f29b84'];const sorted=f.map((ids,i)=>({ids,i,depth:ids.reduce((sum,j)=>sum+v[j][1],0)/4})).sort((a,b)=>a.depth-b.depth);sorted.forEach((o,i)=>A(cubeFaces[i],{d:poly(o.ids.map(j=>v[j])),fill:colors[o.i]}));const cp=project(0,cy,0);A(cubeGlow,{cx:cp[0],cy:cp[1]});A(cubeDot,{cx:cv[4][0],cy:cv[4][1]});
callouts.forEach((o,i)=>{const p=i===4?project(157,0,-85):project(123,yy[i],-80);const x=600,y=153+i*81;A(o.box,{transform:`translate(${x} ${y})`});A(o.connector,{d:line([p,[x-20,y+26],[x,y+26]])});A(o.dot,{cx:x-3,cy:y+26});const on=selected===i;A(o.rect,{'stroke-opacity':on?1:.35,fill:on?'#251e29':'#111824','stroke-width':on?1.6:1});o.g.setAttribute('aria-pressed',String(selected===i))});}

const canvas=root.querySelector('.oh-back'),ctx=canvas.getContext('2d');const isLight=()=>document.documentElement.dataset.theme==='light';let W=0,H=0,dpr=1;const stars=Array.from({length:100},(_,i)=>({x:((i*79.123)%100)/100,y:((i*47.731)%100)/100,r:.5+(i%4)*.24,phase:i*1.72}));function resize(){const b=root.getBoundingClientRect();W=b.width;H=b.height;dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(reduced)drawBackground(0)}function drawBackground(t){const s=t/1000;ctx.clearRect(0,0,W,H);for(const p of stars){ctx.fillStyle=`rgba(${isLight()?'122,92,110':'163,190,237'},${.12+(Math.sin(s*.8+p.phase)+1)*.15})`;ctx.beginPath();ctx.arc(p.x*W,p.y*H,p.r,0,7);ctx.fill()}const rows=18,cols=Math.min(105,Math.ceil(W/13));for(let j=0;j<rows;j++){const dep=j/rows;for(let k=0;k<cols;k++){const x=k/(cols-1)*W;const wave=Math.sin(k*.14+s*.5+dep*4)*24+Math.sin(k*.075-s*.34+dep*5)*20;const y=H-5-dep*120+wave*(.65+dep*.3);const edge=Math.pow(Math.abs(x/W-.5)*2,.65);ctx.fillStyle=k<cols/2?`rgba(${isLight()?'194,59,46':'255,104,70'},${edge*(1-dep)*.48})`:`rgba(${isLight()?'122,92,110':'100,155,255'},${edge*(1-dep)*.5})`;ctx.fillRect(x,y,1.2,1.2)}}}
function updateScroll(){const rect=root.getBoundingClientRect();scroll=Math.min(1,Math.max(0,-rect.top/Math.max(1,rect.height*.7)));if(reduced)scroll=0}stage.addEventListener('pointermove',e=>{if(reduced||e.pointerType==='touch')return;const b=stage.getBoundingClientRect();pointer.x=(e.clientX-b.left)/b.width*2-1;pointer.y=(e.clientY-b.top)/b.height*2-1});stage.addEventListener('pointerleave',()=>{pointer={x:0,y:0};hover=-1});window.addEventListener('scroll',updateScroll,{passive:true});new ResizeObserver(resize).observe(root);new IntersectionObserver(([entry])=>{visible=entry.isIntersecting},{rootMargin:'80px'}).observe(root);select(0,true);resize();updateScroll();let last=0;function frame(t){if(visible&&!document.hidden&&t-last>25){render(t);drawBackground(t);last=t}requestAnimationFrame(frame)}function syncHeroTheme(){svg.setAttribute('viewBox',isLight()?'-12 -48 824 720':'0 0 800 660');svg.querySelector('#oh-glow feGaussianBlur').setAttribute('stdDeviation',isLight()?'2.5':'6');svg.querySelector('#oh-soft feGaussianBlur').setAttribute('stdDeviation',isLight()?'12':'18');if(reduced){render(0);drawBackground(0)}}
new MutationObserver(syncHeroTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});syncHeroTheme();if(!reduced)requestAnimationFrame(frame);

})();
