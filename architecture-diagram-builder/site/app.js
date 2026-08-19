(() => {
"use strict";

const CATALOG = [
  ["cloud","☁️","Cloud"],
  ["aks","☸️","AKS Cluster"],
  ["vm","🖥️","Virtual Machine"],
  ["api","⇄","API Gateway"],
  ["app","▣","Application"],
  ["database","▤","Database"],
  ["servicenow","◉","ServiceNow"],
  ["monitoring","◌","Monitoring"],
  ["identity","🔐","Identity"],
  ["storage","▱","Storage"],
  ["internet","◎","Internet"],
  ["queue","⇉","Message Queue"],
  ["eventbus","⚡","Event Bus"],
  ["function","ƒ","Function"],
  ["container","▦","Container"],
  ["firewall","🛡️","Firewall"],
  ["loadbalancer","⚖️","Load Balancer"],
  ["gateway","↔","Gateway"],
  ["user","👤","User"],
  ["mobile","📱","Mobile App"],
  ["server","🗄️","Server"],
  ["keyvault","🔑","Key Vault"],
  ["logs","≋","Log Analytics"],
  ["vector","◈","Vector DB"],
  ["zone","▧","Security Zone"]
];

const $ = id => document.getElementById(id);
const canvas = $("canvas"), inner = $("canvasInner"), nodesEl = $("nodes"), edgesEl = $("edges");
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const esc = s => String(s ?? "").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const iconFor = t => (CATALOG.find(x=>x[0]===t)||["","◇"])[1];
const nameFor = t => (CATALOG.find(x=>x[0]===t)||["","",t])[2];

let model = {version:2,name:"Untitled architecture",items:[],edges:[]};
let selected = new Set(), tool="select", connector="straight", lineStyle="solid";
let connectSource=null, drag=null, drawing=null, zoom=1, undoStack=[], redoStack=[], impact=false;

function snapshot(){ return JSON.stringify(model); }
function commit(){
  undoStack.push(snapshot()); if(undoStack.length>60) undoStack.shift(); redoStack=[];
}
function restore(s){ model=JSON.parse(s); selected.clear(); render(); }
function setStatus(s){ $("status").textContent=s; }
function item(id){ return model.items.find(x=>x.id===id); }
function isVisual(x){ return x && ["node","image","sticky","comment","pin","text"].includes(x.kind); }

function addItem(kind,x,y,opts={}){
  const o={id:uid(),kind,x,y,width:opts.width||150,height:opts.height||76,label:opts.label||"Item",
    type:opts.type||"rectangle",environment:opts.environment||"Production",owner:opts.owner||"",
    description:opts.description||"",rotation:opts.rotation||0,fill:opts.fill||"#ffffff",stroke:opts.stroke||"#64748b",
    text:opts.text||"",src:opts.src||"",z:opts.z||10};
  if(kind==="node"){o.label=opts.label||nameFor(opts.type||"app");o.type=opts.type||"app";}
  if(kind==="sticky"){o.width=180;o.height=150;o.text=opts.text||"Sticky note";}
  if(kind==="comment"){o.width=220;o.height=90;o.text=opts.text||"Comment";}
  if(kind==="pin"){o.width=28;o.height=28;o.label="📌";}
  if(kind==="text"){o.width=220;o.height=45;o.text=opts.text||"Text";}
  if(kind==="image"){o.width=220;o.height=160;}
  model.items.push(o); selected.clear(); selected.add(o.id); render(); return o;
}

function portPoint(n,port){
  const cx=n.x+n.width/2,cy=n.y+n.height/2;
  if(port==="top") return [cx,n.y];
  if(port==="right") return [n.x+n.width,cy];
  if(port==="bottom") return [cx,n.y+n.height];
  return [n.x,cy];
}
function nearestPort(n,x,y){
  const ps=["top","right","bottom","left"];
  let best="right",bd=Infinity;
  ps.forEach(p=>{const [a,b]=portPoint(n,p),d=(a-x)**2+(b-y)**2;if(d<bd){bd=d;best=p;}});
  return best;
}
function pathFor(e){
  const a=item(e.from),b=item(e.to); if(!a||!b)return "";
  const [x1,y1]=portPoint(a,e.fromPort||"right"),[x2,y2]=portPoint(b,e.toPort||"left");
  if(e.type==="elbow"){const mx=(x1+x2)/2;return `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`;}
  if(e.type==="curved"){const dx=Math.max(50,Math.abs(x2-x1)*.45);return `M ${x1} ${y1} C ${x1+dx} ${y1}, ${x2-dx} ${y2}, ${x2} ${y2}`;}
  if(e.type==="wavy"){const steps=12,dx=(x2-x1)/steps,dy=(y2-y1)/steps;let d=`M ${x1} ${y1}`;for(let i=1;i<=steps;i++){const x=x1+dx*i,y=y1+dy*i+Math.sin(i*Math.PI)*10*((i%2)?1:-1);d+=` L ${x} ${y}`;}return d;}
  if(e.type==="freeform" && e.points?.length){return e.points.map((p,i)=>`${i?"L":"M"} ${p[0]} ${p[1]}`).join(" ");}
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}
function markerDefs(){
 return `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>`;
}

function renderEdges(){
 edgesEl.setAttribute("viewBox","0 0 3000 2000");
 const impacts=impact&&selected.size?[...downstream([...selected][0])]:[];
 edgesEl.innerHTML=markerDefs()+model.edges.map(e=>{
   const active=selected.has(e.from)||impacts.includes(e.to);
   const dash=e.style==="dashed"?"dashed":e.style==="dotted"?"dotted":"";
   return `<path class="edge ${active?"selected":""} ${dash}" data-id="${e.id}" d="${pathFor(e)}" marker-end="url(#arrow)"></path>`+
     (e.label?`<text class="edge-label" x="${labelX(e)}" y="${labelY(e)}">${esc(e.label)}</text>`:"");
 }).join("");
}
function labelX(e){const a=item(e.from),b=item(e.to);return a&&b?(a.x+a.width+b.x)/2:0}
function labelY(e){const a=item(e.from),b=item(e.to);return a&&b?(a.y+a.height/2+b.y+b.height/2)/2-7:0}

function renderItem(n){
 const el=document.createElement("div");
 el.dataset.id=n.id; el.className=`node ${n.kind==="image"?"image-node":""} ${n.type||""} ${selected.has(n.id)?"selected":""} ${n.kind==="text"?"text-node":""}`;
 el.style.left=n.x+"px";el.style.top=n.y+"px";el.style.width=n.width+"px";el.style.height=n.height+"px";el.style.zIndex=n.z||10;
 el.style.transform=`rotate(${n.rotation||0}deg)`;el.style.background=n.fill;el.style.borderColor=n.stroke;
 if(n.kind==="image") el.innerHTML=`<img src="${esc(n.src)}" alt="${esc(n.label)}">`;
 else if(n.kind==="sticky") el.className="sticky-note "+(selected.has(n.id)?"selected":""),el.innerHTML=`<textarea>${esc(n.text)}</textarea>`;
 else if(n.kind==="comment") el.className="comment-node "+(selected.has(n.id)?"selected":""),el.innerHTML=`<strong>Comment</strong><div>${esc(n.text)}</div>`;
 else if(n.kind==="pin") el.className="pin-node "+(selected.has(n.id)?"selected":""),el.textContent="📌";
 else if(n.kind==="text") el.innerHTML=`<div class="node-content">${esc(n.text)}</div>`;
 else el.innerHTML=`<div class="node-content"><span class="node-icon">${iconFor(n.type)}</span><span class="node-type">${esc(nameFor(n.type))}</span><span class="node-title">${esc(n.label)}</span><span class="node-meta">${esc(n.environment)}${n.owner?" · "+esc(n.owner):""}</span></div>`;
 if(["node","image","shape"].includes(n.kind)||n.kind==="text"){
   ["top","right","bottom","left"].forEach(p=>{const q=document.createElement("span");q.className=`connection-port ${p}`;q.dataset.port=p;el.append(q);});
 }
 ["nw","ne","sw","se"].forEach(p=>{const h=document.createElement("span");h.className=`resize-handle ${p}`;h.dataset.resize=p;el.append(h);});
 el.addEventListener("pointerdown",onItemDown); el.addEventListener("click",e=>e.stopPropagation());
 if(n.kind==="sticky") el.querySelector("textarea").addEventListener("input",e=>{n.text=e.target.value});
 nodesEl.append(el);
}

function render(){
 $("diagramName").value=model.name;
 nodesEl.innerHTML="";
 model.items.slice().sort((a,b)=>(a.z||10)-(b.z||10)).forEach(renderItem);
 renderEdges();
 $("canvasEmpty").style.display=model.items.length?"none":"block";
 $("inspectorEmpty").hidden=selected.size>0; $("inspector").hidden=selected.size!==1;
 if(selected.size===1) renderInspector(item([...selected][0]));
 $("impactResults").innerHTML=selected.size&&impact?downstream([...selected][0]).map(id=>item(id)).filter(Boolean).map(n=>`<div class="finding">${esc(n.label||n.text||n.kind)} is downstream.</div>`).join("")||'<div class="finding ok">No downstream dependencies.</div>':'<p class="hint">Enable Impact and select a component.</p>';
 updateZoomUI();
}

function renderInspector(n){
 $("nodeLabel").value=n.label||"";
 $("nodeType").value=n.kind==="node"?nameFor(n.type):n.kind;
 $("nodeEnvironment").value=n.environment||"Production";
 $("nodeOwner").value=n.owner||"";
 $("nodeDescription").value=n.description||"";
 $("nodeWidth").value=Math.round(n.width);
 $("nodeHeight").value=Math.round(n.height);
 $("nodeRotation").value=n.rotation||0;
 $("nodeFill").value=n.fill?.startsWith("#")?n.fill:"#ffffff";
 $("nodeStroke").value=n.stroke?.startsWith("#")?n.stroke:"#64748b";
}

function updateSelectedFromInspector(){
 if(selected.size!==1)return;const n=item([...selected][0]);if(!n)return;
 n.label=$("nodeLabel").value;n.environment=$("nodeEnvironment").value;n.owner=$("nodeOwner").value;n.description=$("nodeDescription").value;
 n.width=Math.max(30,+$("nodeWidth").value||30);n.height=Math.max(30,+$("nodeHeight").value||30);n.rotation=+$("nodeRotation").value||0;n.fill=$("nodeFill").value;n.stroke=$("nodeStroke").value;render();
}

function selectOnly(id,add=false){if(!add)selected.clear();if(id)selected.add(id);render();}

function onItemDown(e){
 if(e.button!==0)return;
 const el=e.currentTarget,n=item(el.dataset.id);
 if(e.target.dataset.resize){startResize(e,n,e.target.dataset.resize);return;}
 if(e.target.dataset.port && tool==="connector"){startConnector(e,n,e.target.dataset.port);return;}
 if(tool==="connector"){startConnector(e,n,nearestPort(n,e.clientX,n.y));return;}
 if(tool==="pan")return;
 selectOnly(n.id,e.shiftKey||e.ctrlKey);
 commit();
 const r=canvas.getBoundingClientRect();
 drag={ids:[...selected],startX:e.clientX,startY:e.clientY,orig:new Map([...selected].map(id=>{const q=item(id);return[id,[q.x,q.y]];}))};
 el.setPointerCapture?.(e.pointerId);
}

function startResize(e,n,corner){
 e.stopPropagation();commit();const r=canvas.getBoundingClientRect();drag={resize:true,id:n.id,corner,startX:e.clientX,startY:e.clientY,orig:[n.x,n.y,n.width,n.height]};
}
window.addEventListener("pointermove",e=>{
 if(drawing){drawing.points.push([e.clientX-canvas.getBoundingClientRect().left+canvas.scrollLeft,e.clientY-canvas.getBoundingClientRect().top+canvas.scrollTop]);drawPreview();return;}
 if(!drag)return;
 if(drag.resize){const n=item(drag.id),dx=(e.clientX-drag.startX)/zoom,dy=(e.clientY-drag.startY)/zoom,[x,y,w,h]=drag.orig;
  if(drag.corner.includes("e"))n.width=Math.max(30,w+dx);if(drag.corner.includes("s"))n.height=Math.max(30,h+dy);
  if(drag.corner.includes("w")){n.x=x+dx;n.width=Math.max(30,w-dx)}if(drag.corner.includes("n")){n.y=y+dy;n.height=Math.max(30,h-dy)}
 }else{const dx=(e.clientX-drag.startX)/zoom,dy=(e.clientY-drag.startY)/zoom;drag.ids.forEach(id=>{const n=item(id),o=drag.orig.get(id);n.x=Math.max(0,o[0]+dx);n.y=Math.max(0,o[1]+dy);});}
 render();
});
window.addEventListener("pointerup",()=>{if(drawing)return;drag=null;});

function startConnector(e,n,port){
 e.stopPropagation();tool="connector";connectSource={id:n.id,port};setStatus("Drag to another component to create an arrow.");drawing={connector:true,source:n,sourcePort:port,points:[]};
}
function finishConnector(target,x,y){
 if(!drawing)return;
 const s=drawing.source;if(target&&target.id!==s.id){
   commit();const toPort=nearestPort(target,x,y);
   model.edges.push({id:uid(),from:s.id,to:target.id,fromPort:drawing.sourcePort,toPort,type:connector,style:lineStyle,label:$("edgeLabel").value.trim()});
   setStatus("Arrow created.");render();
 }else if(drawing.points.length>1){
   commit();model.edges.push({id:uid(),from:s.id,to:s.id,fromPort:drawing.sourcePort,toPort:"right",type:"freeform",style:lineStyle,points:drawing.points,label:""});
 }
 drawing=null;connectSource=null;render();
}
function drawPreview(){
 renderEdges();
 if(!drawing)return;
 const s=drawing.source,[x1,y1]=portPoint(s,drawing.sourcePort),p=drawing.points.at(-1);
 if(!p)return;
 edgesEl.insertAdjacentHTML("beforeend",`<path class="edge selected" d="M ${x1} ${y1} L ${p[0]} ${p[1]}"></path>`);
}
canvas.addEventListener("pointermove",e=>{if(drawing)drawPreview();});
canvas.addEventListener("pointerup",e=>{if(drawing){const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest(".node");finishConnector(hit?item(hit.dataset.id):null,e.clientX,e.clientY);}});
canvas.addEventListener("pointerdown",e=>{
 if(e.target===canvas||e.target===inner){
   if(tool==="connector"||tool==="freehand"){drawing={connector:true,source:null,points:[]};return;}
   if(tool==="text"){const r=canvas.getBoundingClientRect();commit();addItem("text",(e.clientX-r.left+canvas.scrollLeft)/zoom,(e.clientY-r.top+canvas.scrollTop)/zoom,{text:"Double-click to edit"});tool="select";setTool("select");return;}
   if(tool==="sticky"){const r=canvas.getBoundingClientRect();commit();addItem("sticky",(e.clientX-r.left+canvas.scrollLeft)/zoom,(e.clientY-r.top+canvas.scrollTop)/zoom);tool="select";setTool("select");return;}
   if(tool==="comment"){const r=canvas.getBoundingClientRect();commit();addItem("comment",(e.clientX-r.left+canvas.scrollLeft)/zoom,(e.clientY-r.top+canvas.scrollTop)/zoom);tool="select";setTool("select");return;}
   if(tool==="pin"){const r=canvas.getBoundingClientRect();commit();addItem("pin",(e.clientX-r.left+canvas.scrollLeft)/zoom,(e.clientY-r.top+canvas.scrollTop)/zoom);tool="select";setTool("select");return;}
   selected.clear();render();
 }
});

function setTool(t){tool=t;document.querySelectorAll("[data-tool]").forEach(b=>b.classList.toggle("active",b.dataset.tool===t));setStatus(t==="connector"?"Click/drag from a port to another component.":t==="freehand"?"Draw free-form lines on the canvas.":`${t} tool selected.`);}
document.querySelectorAll("[data-tool]").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.tool==="image")$("imageInput").click();else setTool(b.dataset.tool);}));
document.querySelectorAll("[data-connector]").forEach(b=>b.addEventListener("click",()=>{connector=b.dataset.connector;document.querySelectorAll("[data-connector]").forEach(x=>x.classList.toggle("active",x===b));setTool("connector");}));
$("lineStyle").addEventListener("change",e=>lineStyle=e.target.value);

function makePalette(){
 $("palette").innerHTML=CATALOG.map(([t,i,n])=>`<button class="palette-item" draggable="true" data-type="${t}"><span class="palette-icon">${i}</span><span class="palette-label">${n}</span></button>`).join("");
 document.querySelectorAll(".palette-item").forEach(b=>b.addEventListener("dragstart",e=>e.dataTransfer.setData("type",b.dataset.type)));
}
canvas.addEventListener("dragover",e=>{e.preventDefault();canvas.classList.add("drop-target")});
canvas.addEventListener("dragleave",()=>canvas.classList.remove("drop-target"));
canvas.addEventListener("drop",e=>{e.preventDefault();canvas.classList.remove("drop-target");const t=e.dataTransfer.getData("type");if(!t)return;const r=canvas.getBoundingClientRect();commit();addItem("node",(e.clientX-r.left+canvas.scrollLeft)/zoom,(e.clientY-r.top+canvas.scrollTop)/zoom,{type:t,label:nameFor(t)});setStatus(`${nameFor(t)} added.`);});

document.querySelectorAll("[data-shape]").forEach(b=>b.addEventListener("click",()=>{const r=canvas.getBoundingClientRect();commit();addItem("node",(canvas.scrollLeft+canvas.clientWidth/2-75)/zoom,(canvas.scrollTop+canvas.clientHeight/2-38)/zoom,{type:"app",label:b.textContent,type:b.dataset.shape});}));
$("imageInput").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{commit();addItem("image",(canvas.scrollLeft+canvas.clientWidth/2-110)/zoom,(canvas.scrollTop+canvas.clientHeight/2-80)/zoom,{label:f.name,src:reader.result});};reader.readAsDataURL(f);e.target.value="";});

canvas.addEventListener("paste",e=>{
 const files=[...(e.clipboardData?.files||[])].filter(f=>f.type.startsWith("image/"));
 if(files.length){files.forEach(f=>{const r=new FileReader();r.onload=()=>{commit();addItem("image",(canvas.scrollLeft+80)/zoom,(canvas.scrollTop+80)/zoom,{label:f.name,src:r.result});};r.readAsDataURL(f);});e.preventDefault();return;}
 const txt=e.clipboardData?.getData("text/plain");if(txt){commit();addItem("text",(canvas.scrollLeft+80)/zoom,(canvas.scrollTop+80)/zoom,{text:txt});}
});

document.addEventListener("keydown",e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="a"){e.preventDefault();selected.clear();model.items.forEach(n=>selected.add(n.id));render();}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();undo();}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault();redo();}
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="d"){e.preventDefault();duplicateSelected();}
 if(e.key==="Delete"||e.key==="Backspace"){if(selected.size){e.preventDefault();deleteSelected();}}
});

function deleteSelected(){if(!selected.size)return;commit();const ids=new Set(selected);model.items=model.items.filter(n=>!ids.has(n.id));model.edges=model.edges.filter(e=>!ids.has(e.from)&&!ids.has(e.to));selected.clear();render();setStatus("Selected items deleted.")}
function duplicateSelected(){if(!selected.size)return;commit();const ids=[...selected],map=new Map();ids.forEach(id=>{const n=item(id),c=JSON.parse(JSON.stringify(n));c.id=uid();c.x+=25;c.y+=25;map.set(id,c.id);model.items.push(c)});model.edges.filter(e=>ids.includes(e.from)&&ids.includes(e.to)).forEach(e=>model.edges.push({...e,id:uid(),from:map.get(e.from),to:map.get(e.to)}));selected.clear();model.items.slice(-ids.length).forEach(n=>selected.add(n.id));render();}
$("deleteSelected").onclick=deleteSelected;$("duplicateSelected").onclick=duplicateSelected;$("duplicateFloat").onclick=duplicateSelected;$("deleteFloat").onclick=deleteSelected;
$("bringFront").onclick=()=>{if(!selected.size)return;commit();const max=Math.max(0,...model.items.map(n=>n.z||10));selected.forEach(id=>item(id).z=max+1);render()};
$("sendBack").onclick=()=>{if(!selected.size)return;commit();selected.forEach(id=>item(id).z=1);render()};

function downstream(start){const out=new Set(),q=[start];while(q.length){const s=q.shift();model.edges.filter(e=>e.from===s).forEach(e=>{if(!out.has(e.to)){out.add(e.to);q.push(e.to)}})}return [...out]}
$("impactMode").onclick=()=>{impact=!impact;$("impactMode").classList.toggle("active",impact);render();};
$("connectMode").onclick=()=>setTool("connector");
$("autoLayout").onclick=()=>{commit();model.items.filter(n=>n.kind==="node").forEach((n,i)=>{n.x=50+(i%5)*220;n.y=80+Math.floor(i/5)*140});render();setStatus("Components arranged.");};
$("validateDiagram").onclick=()=>{const f=[];model.items.filter(n=>n.kind==="node").forEach(n=>{const connected=model.edges.some(e=>e.from===n.id||e.to===n.id);if(!connected)f.push(`${n.label}: no connections mapped.`)});$("validationResults").innerHTML=f.length?f.map(x=>`<div class="finding warning">${esc(x)}</div>`).join(""):'<div class="finding ok">No basic connectivity gaps found.</div>';};
$("diagramName").oninput=e=>model.name=e.target.value;
["nodeLabel","nodeEnvironment","nodeOwner","nodeDescription","nodeWidth","nodeHeight","nodeRotation","nodeFill","nodeStroke"].forEach(id=>$(id).addEventListener("input",updateSelectedFromInspector));

function download(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function saveArch(){download(new Blob([JSON.stringify(model,null,2)],{type:"application/json"}),`${(model.name||"architecture").replace(/[^\w-]+/g,"-")}.arch`);setStatus("Portable .arch file created.");}
function loadFile(){const i=document.createElement("input");i.type="file";i.accept=".arch,.json,application/json";i.onchange=async()=>{const f=i.files[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!x.items||!x.edges)throw Error("Invalid .arch file");commit();model=x;selected.clear();render();setStatus("Architecture loaded.");}catch(err){setStatus("Load failed: "+err.message)}};i.click()}
$("saveDiagram").onclick=saveArch;$("loadDiagram").onclick=loadFile;
$("exportJson").onclick=()=>download(new Blob([JSON.stringify(model,null,2)],{type:"application/json"}),"architecture.json");
$("importJson").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!x.items||!x.edges)throw Error("Invalid JSON");commit();model=x;selected.clear();render();}catch(err){setStatus("Import failed: "+err.message)}e.target.value=""};
$("newDiagram").onclick=()=>{if(confirm("Start a new blank diagram?")){commit();model={version:2,name:"Untitled architecture",items:[],edges:[]};selected.clear();render();}};
function svgExport(){const s=new XMLSerializer().serializeToString(edgesEl);return `<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="2000">${s}</svg>`}
$("exportSvg").onclick=()=>download(new Blob([svgExport()],{type:"image/svg+xml"}),"architecture.svg");
$("exportPng").onclick=()=>{const svg=svgExport(),img=new Image();img.onload=()=>{const c=document.createElement("canvas");c.width=3000;c.height=2000;const ctx=c.getContext("2d");ctx.fillStyle="#eef2f8";ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0);c.toBlob(b=>download(b,"architecture.png"),"image/png")};img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)};

function undo(){if(!undoStack.length)return;redoStack.push(snapshot());restore(undoStack.pop());setStatus("Undo.");}
function redo(){if(!redoStack.length)return;undoStack.push(snapshot());restore(redoStack.pop());setStatus("Redo.");}
$("undoBtn").onclick=undo;$("redoBtn").onclick=redo;

function updateZoomUI(){const s=Math.round(zoom*100)+"%";$("zoomLevel").textContent=s;$("zoomLevel2").textContent=s;inner.style.transform=`scale(${zoom})`;inner.style.transformOrigin="0 0";}
function setZoom(z){zoom=Math.max(.25,Math.min(2.5,z));updateZoomUI();}
["zoomIn","zoomIn2"].forEach(id=>$(id).onclick=()=>setZoom(zoom+.1));["zoomOut","zoomOut2"].forEach(id=>$(id).onclick=()=>setZoom(zoom-.1));$("zoomReset").onclick=()=>setZoom(1);

document.querySelectorAll(".template-button").forEach(b=>b.onclick=()=>loadTemplate(b.dataset.template));
function loadTemplate(type){
 commit();model={version:2,name:type==="aiops"?"AIOps Control Center":type==="aks"?"AKS Application Platform":"Azure Landing Zone",items:[],edges:[]};
 const add=(t,x,y,label)=>addItem("node",x,y,{type:t,label});
 const a=[];
 if(type==="aiops"){a.push(add("internet",40,220,"Monitoring Sources"),add("monitoring",260,100,"Azure Monitor"),add("servicenow",260,330,"ServiceNow"),add("app",500,210,"AIOps Control Center"),add("database",760,110,"Incident Store"),add("aks",760,330,"AKS Agents"));}
 else if(type==="aks"){a.push(add("user",40,220,"Users"),add("gateway",250,220,"Application Gateway"),add("aks",470,220,"AKS Cluster"),add("app",700,120,"Orders API"),add("database",700,330,"PostgreSQL"),add("monitoring",470,430,"Azure Monitor"));}
 else{a.push(add("identity",50,120,"Entra ID"),add("firewall",280,120,"Azure Firewall"),add("app",510,120,"Shared Services"),add("storage",750,120,"Storage"),add("monitoring",510,340,"Log Analytics"));}
 for(let i=0;i<a.length-1;i++)model.edges.push({id:uid(),from:a[i].id,to:a[i+1].id,fromPort:"right",toPort:"left",type:"straight",style:"solid",label:""});
 selected.clear();render();setStatus("Template loaded.");
}

makePalette();render();setStatus("Ready. Drag components, choose Arrow, or use the tools.");
})();
