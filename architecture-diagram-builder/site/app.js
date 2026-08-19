(() => {
"use strict";

/* ---------- library ---------- */
const CATALOG = [
  ["cloud","☁","Cloud"],["azure","◆","Microsoft Azure"],["aws","■","AWS"],["gcp","●","Google Cloud"],
  ["region","◎","Cloud Region"],["az","▦","Availability Zone"],["vm","▣","Virtual Machine"],["server","▣","Server"],
  ["container","⬡","Container"],["aks","✥","AKS Cluster"],["kubernetes","✤","Kubernetes"],["docker","◈","Docker"],
  ["function","ƒ","Serverless Function"],["app","▣","Application"],["microservice","◇","Microservice"],["internet","◎","Internet"],
  ["api","⇄","API Gateway"],["gateway","↔","Gateway"],["loadbalancer","⚖","Load Balancer"],["firewall","▤","Firewall"],
  ["waf","◫","Web Application Firewall"],["vpn","⌁","VPN Gateway"],["dns","⌁","DNS"],["cdn","◉","CDN"],
  ["database","▤","Database"],["sql","▥","SQL Database"],["nosql","▧","NoSQL Database"],["storage","▱","Object Storage"],
  ["cache","▤","Cache"],["queue","⇉","Message Queue"],["eventbus","⚡","Event Bus"],["stream","≋","Event Stream"],
  ["servicenow","◉","ServiceNow"],["monitoring","◌","Monitoring"],["logs","≋","Log Analytics"],["siem","◉","SIEM"],
  ["identity","🔑","Identity Provider"],["keyvault","◆","Secrets / Key Vault"],["policy","▤","Policy"],["user","●","User"],
  ["mobile","▯","Mobile App"],["desktop","▣","Desktop App"],["network","⌁","Network"],["subnet","□","Subnet"],
  ["router","↔","Router"],["switch","⇄","Switch"],["storageacct","▱","Storage Account"],["vector","◈","Vector DB"],
  ["llm","✦","LLM / AI Model"],["rag","⌁","RAG Service"],["agent","✦","AI Agent"],["zone","▧","Security Zone"]
];
const $ = id => document.getElementById(id);
const canvas=$("canvas"), inner=$("canvasInner"), nodesEl=$("nodes"), edgesEl=$("edges");
const uid=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const esc=s=>String(s??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const libName=t=>(CATALOG.find(x=>x[0]===t)||["","◇",t])[2];
const libIcon=t=>(CATALOG.find(x=>x[0]===t)||["","◇",t])[1];

let model={version:4,name:"Untitled architecture",items:[],edges:[]};
let selected=new Set(), selectedEdge=null, tool="select", connector="straight", lineStyle="solid";
let drawing=null, drag=null, edgeDrag=null, zoom=1, impact=false, undoStack=[], redoStack=[];

/* ---------- history ---------- */
function snap(){return JSON.stringify(model)}
function commit(){undoStack.push(snap());if(undoStack.length>80)undoStack.shift();redoStack=[]}
function undo(){if(!undoStack.length)return;redoStack.push(snap());model=JSON.parse(undoStack.pop());selected.clear();selectedEdge=null;render();status("Undo")}
function redo(){if(!redoStack.length)return;undoStack.push(snap());model=JSON.parse(redoStack.pop());selected.clear();selectedEdge=null;render();status("Redo")}
function status(s){$("status").textContent=s}
function getItem(id){return model.items.find(n=>n.id===id)}
function getEdge(id){return model.edges.find(e=>e.id===id)}
function centerOf(n){return[n.x+n.width/2,n.y+n.height/2]}

/* ---------- coordinates ---------- */
function canvasPoint(clientX,clientY){
 const r=canvas.getBoundingClientRect();
 return [(clientX-r.left+canvas.scrollLeft)/zoom,(clientY-r.top+canvas.scrollTop)/zoom];
}
function portPoint(n,p){
 const [cx,cy]=centerOf(n);
 return p==="top"?[cx,n.y]:p==="right"?[n.x+n.width,cy]:p==="bottom"?[cx,n.y+n.height]:[n.x,cy];
}
function nearestPort(n,x,y){
 let best="right",d=Infinity;
 ["top","right","bottom","left"].forEach(p=>{
   const q=portPoint(n,p),dd=(q[0]-x)**2+(q[1]-y)**2;
   if(dd<d){d=dd;best=p}
 });
 return best;
}
function objectAt(clientX,clientY){
 const el=document.elementFromPoint(clientX,clientY)?.closest(".node");
 return el?getItem(el.dataset.id):null;
}

/* ---------- items ---------- */
function addItem(kind,x,y,o={}){
 const n={
   id:uid(),kind,x,y,width:o.width||150,height:o.height||76,z:o.z||10,
   label:o.label||"Item",type:o.type||"app",environment:o.environment||"Production",
   owner:o.owner||"",description:o.description||"",rotation:o.rotation||0,
   fill:o.fill||"#ffffff",stroke:o.stroke||"#64748b",text:o.text||"",src:o.src||"",
   shape:o.shape||null
 };
 if(kind==="node") n.label=o.label||libName(n.type);
 if(kind==="shape"){n.width=o.width||170;n.height=o.height||100;n.shape=o.shape||"rectangle";n.label=o.label||n.shape[0].toUpperCase()+n.shape.slice(1)}
 if(kind==="image"){n.width=o.width||240;n.height=o.height||170}
 if(kind==="sticky"){n.width=180;n.height=150;n.text=o.text||"Double-click to edit"}
 if(kind==="comment"){n.width=220;n.height=90;n.text=o.text||"Comment"}
 if(kind==="pin"){n.width=28;n.height=28;n.label="📌"}
 if(kind==="text"){n.width=240;n.height=45;n.text=o.text||"Double-click to edit"}
 model.items.push(n);selected.clear();selected.add(n.id);selectedEdge=null;render();return n;
}

/* ---------- rendering ---------- */
function markerDefs(){
 return `<defs>
 <marker id="m-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker>
 <marker id="m-circle" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6"><circle cx="5" cy="5" r="3" fill="context-stroke"/></marker>
 <marker id="m-diamond" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7"><path d="M5 0L10 5L5 10L0 5z" fill="context-stroke"/></marker>
 </defs>`;
}
function markerAttr(e,which){
 const v=e[which+"Marker"]||"none";
 return v==="none"?"":` marker-${which}="url(#m-${v})"`;
}
function smoothPath(points){
  if(!points || points.length < 2) return "";
  if(points.length === 2){
    return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;
  }

  // Catmull-Rom -> cubic Bézier conversion.
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for(let i=0;i<points.length-1;i++){
    const p0 = points[i-1] || points[i];
    const p1 = points[i];
    const p2 = points[i+1];
    const p3 = points[i+2] || p2;

    const c1x = p1[0] + (p2[0]-p0[0]) / 6;
    const c1y = p1[1] + (p2[1]-p0[1]) / 6;
    const c2x = p2[0] - (p3[0]-p1[0]) / 6;
    const c2y = p2[1] - (p3[1]-p1[1]) / 6;

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function normalizeFreeformPoints(points){
  if(!points || !points.length) return [];
  const out=[points[0]];
  for(let i=1;i<points.length;i++){
    const a=out[out.length-1], b=points[i];
    if(Math.hypot(b[0]-a[0],b[1]-a[1]) >= 3) out.push(b);
  }
  return out;
}

function edgePath(e){
  const a=getItem(e.from), b=getItem(e.to);

  // Standalone free-form/draw paths do not require attached nodes.
  if(e.type==="freeform" && e.points?.length){
    return smoothPath(normalizeFreeformPoints(e.points));
  }

  if(!a || !b) return "";

  const [x1,y1]=portPoint(a,e.fromPort||"right");
  const [x2,y2]=portPoint(b,e.toPort||"left");

  if(e.type==="curved"){
    const c=e.controls?.length===2
      ? e.controls
      : [[x1+(x2-x1)*.35,y1],[x1+(x2-x1)*.65,y2]];
    return `M ${x1} ${y1} C ${c[0][0]} ${c[0][1]}, ${c[1][0]} ${c[1][1]}, ${x2} ${y2}`;
  }

  if(e.type==="wavy"){
    const steps=Math.max(18,Math.min(80,Math.round(Math.hypot(x2-x1,y2-y1)/18)));
    const dx=(x2-x1)/steps, dy=(y2-y1)/steps;
    const len=Math.hypot(x2-x1,y2-y1)||1;
    const nx=-dy/len*12, ny=dx/len*12;
    let d=`M ${x1} ${y1}`;
    for(let i=1;i<=steps;i++){
      const t=i/steps;
      const s=Math.sin(t*Math.PI*(e.waves||3)*2)*(i===steps?0:1);
      d+=` L ${x1+dx*i+nx*s} ${y1+dy*i+ny*s}`;
    }
    return d;
  }

  if(e.type==="elbow"){
    const mx=e.midX??(x1+x2)/2;
    return `M ${x1} ${y1} L ${mx} ${y1} L ${mx} ${y2} L ${x2} ${y2}`;
  }

  return `M ${x1} ${y1} L ${x2} ${y2}`;
}
function edgeLabelPos(e){
 const a=getItem(e.from),b=getItem(e.to);if(!a||!b)return[0,0];
 const [x1,y1]=portPoint(a,e.fromPort||"right"),[x2,y2]=portPoint(b,e.toPort||"left");
 return[(x1+x2)/2,(y1+y2)/2-8];
}
function renderEdges(){
 edgesEl.innerHTML=markerDefs();
 const impacted=impact&&selected.size?new Set(downstream([...selected][0])):new Set();
 model.edges.forEach(e=>{
   const d=edgePath(e),sel=selectedEdge===e.id||selected.has(e.from)&&selected.has(e.to);
   const cls=`edge ${sel?"selected ":""}${impacted.has(e.to)?"impact ":""}`;
   const dash=e.style==="dashed"?"stroke-dasharray:8 5;":e.style==="dotted"?"stroke-dasharray:2 5;":"";
   const common=`data-edge-id="${e.id}" d="${d}" stroke="${e.color||"#52627a"}" stroke-width="${e.width||2}" style="${dash}"${markerAttr(e,"start")}${markerAttr(e,"end")}`;
   edgesEl.insertAdjacentHTML("beforeend",`<path class="edge-hit" data-edge-id="${e.id}" d="${d}" fill="none" stroke="transparent" stroke-width="14" pointer-events="stroke"></path><path class="${cls}" ${common}></path>`);
   if(e.label){const [x,y]=edgeLabelPos(e);edgesEl.insertAdjacentHTML("beforeend",`<text class="edge-label" x="${x}" y="${y}">${esc(e.label)}</text>`)}
   if(selectedEdge===e.id){
     if(e.type==="curved"&&e.controls?.length===2)e.controls.forEach((p,i)=>edgesEl.insertAdjacentHTML("beforeend",`<circle class="edge-control" data-edge-control="${e.id}" data-index="${i}" cx="${p[0]}" cy="${p[1]}" r="5"></circle>`));
     if(e.type==="freeform"&&e.points?.length){
       const pts=e.points;
       // Show only a small number of handles so a free-form stroke never looks dotted.
       const maxHandles=10;
       const step=Math.max(1,Math.ceil((pts.length-2)/maxHandles));
       for(let i=1;i<pts.length-1;i+=step){
         const p=pts[i];
         edgesEl.insertAdjacentHTML("beforeend",
           `<circle class="edge-control" data-edge-control="${e.id}" data-index="${i}" cx="${p[0]}" cy="${p[1]}" r="5"></circle>`);
       }
     }
     if(e.type==="elbow"){const a=getItem(e.from),b=getItem(e.to);if(a&&b)edgesEl.insertAdjacentHTML("beforeend",`<circle class="edge-control" data-edge-mid="${e.id}" cx="${e.midX??((portPoint(a,e.fromPort||"right")[0]+portPoint(b,e.toPort||"left")[0])/2)}" cy="${((portPoint(a,e.fromPort||"right")[1]+portPoint(b,e.toPort||"left")[1])/2)}" r="5"></circle>`)}
   }
 });
 if(drawing?.points?.length){
   const s=drawing.source;
   let d;
   if(s)d=`M ${portPoint(s,drawing.sourcePort)[0]} ${portPoint(s,drawing.sourcePort)[1]} `+drawing.points.map(p=>`L ${p[0]} ${p[1]}`).join(" ");
   else d=drawing.points.map((p,i)=>`${i?"L":"M"} ${p[0]} ${p[1]}`).join(" ");
   edgesEl.insertAdjacentHTML("beforeend",`<path class="edge selected" d="${d}" stroke="${lineColor()}" stroke-width="${lineWidth()}" marker-end="url(#m-arrow)"></path>`);
 }
}
function renderItem(n){
 const el=document.createElement("div");
 const selectedNow=selected.has(n.id);
 el.dataset.id=n.id;el.style.left=n.x+"px";el.style.top=n.y+"px";el.style.width=n.width+"px";el.style.height=n.height+"px";el.style.zIndex=n.z;
 el.style.transform=`rotate(${n.rotation||0}deg)`;
 el.style.background=n.fill||"#fff";el.style.borderColor=n.stroke||"#64748b";
 if(n.kind==="shape"){
   el.className=`node shape-node shape-${n.shape} ${selectedNow?"selected":""}`;
   el.innerHTML=`<span class="shape-label">${esc(n.label)}</span>`;
 }else if(n.kind==="image"){
   el.className=`node image-node ${selectedNow?"selected":""}`;
   el.innerHTML=`<img src="${esc(n.src)}" alt="${esc(n.label)}"><span class="shape-label image-caption">${esc(n.label)}</span>`;
 }else if(n.kind==="sticky"){
   el.className=`sticky-note ${selectedNow?"selected":""}`;
   el.innerHTML=`<textarea>${esc(n.text)}</textarea>`;
 }else if(n.kind==="comment"){
   el.className=`comment-node ${selectedNow?"selected":""}`;
   el.innerHTML=`<strong>Comment</strong><div>${esc(n.text)}</div>`;
 }else if(n.kind==="pin"){
   el.className=`pin-node ${selectedNow?"selected":""}`;el.textContent="📌";
 }else if(n.kind==="text"){
   el.className=`node text-node ${selectedNow?"selected":""}`;el.innerHTML=`<div>${esc(n.text)}</div>`;
 }else{
   el.className=`node ${selectedNow?"selected":""}`;
   el.innerHTML=`<div class="node-content"><span class="node-icon">${libIcon(n.type)}</span><span class="node-type">${esc(libName(n.type))}</span><span class="node-title">${esc(n.label)}</span><span class="node-meta">${esc(n.environment)}${n.owner?" · "+esc(n.owner):""}</span></div>`;
 }
 if(["node","shape","image","text"].includes(n.kind)){
   ["top","right","bottom","left"].forEach(p=>{
     const q=document.createElement("span");q.className=`connection-port ${p}`;q.dataset.port=p;el.appendChild(q)
   });
 }
 ["nw","ne","sw","se"].forEach(p=>{const h=document.createElement("span");h.className=`resize-handle ${p}`;h.dataset.resize=p;el.appendChild(h)});
 el.addEventListener("pointerdown",onItemPointerDown);
 el.addEventListener("dblclick",()=>editItem(n));
 if(n.kind==="sticky")el.querySelector("textarea").addEventListener("input",ev=>n.text=ev.target.value);
 nodesEl.appendChild(el);
}
function renderInspector(){
 const n=selected.size===1?getItem([...selected][0]):null;
 $("inspectorEmpty").hidden=!!n||!!selectedEdge;
 $("inspector").hidden=!n;
 $("edgeInspector").hidden=!selectedEdge;
 if(n){
   $("nodeLabel").value=n.label||n.text||"";
   $("nodeType").value=n.kind==="node"?libName(n.type):n.kind==="shape"?`Shape: ${n.shape}`:n.kind;
   $("nodeEnvironment").value=n.environment||"Production";$("nodeOwner").value=n.owner||"";
   $("nodeDescription").value=n.description||"";$("nodeWidth").value=Math.round(n.width);$("nodeHeight").value=Math.round(n.height);
   $("nodeRotation").value=n.rotation||0;$("nodeFill").value=n.fill?.startsWith("#")?n.fill:"#ffffff";$("nodeStroke").value=n.stroke?.startsWith("#")?n.stroke:"#64748b";
 }
 if(selectedEdge){
   const e=getEdge(selectedEdge);
   if(e){$("edgeLabelInspector").value=e.label||"";$("edgeStyleInspector").value=e.style||"solid";$("edgeWidthInspector").value=e.width||2;$("edgeColorInspector").value=e.color||"#52627a";
      $("lineStyle").value=e.style||"solid";$("lineWidth").value=e.width||2;$("lineColor").value=e.color||"#52627a";$("edgeLabel").value=e.label||"";}
 }
}
function render(){
 $("diagramName").value=model.name;
 nodesEl.innerHTML="";
 model.items.slice().sort((a,b)=>(a.z||10)-(b.z||10)).forEach(renderItem);
 renderEdges();renderInspector();
 $("canvasEmpty").style.display=model.items.length?"none":"block";
 renderImpact();updateZoom();
}

/* ---------- selection / manipulation ---------- */
function clearSelection(){selected.clear();selectedEdge=null}
function selectItem(id,multi=false){if(!multi)selected.clear();selected.add(id);selectedEdge=null;render()}
function onItemPointerDown(ev){
 if(ev.button!==0)return;
 ev.stopPropagation();
 const n=getItem(ev.currentTarget.dataset.id);
 if(ev.target.dataset.resize){startResize(ev,n,ev.target.dataset.resize);return}
 if(ev.target.dataset.port && tool==="connector"){beginConnector(ev,n,ev.target.dataset.port);return}
 if(tool==="connector"){
   beginConnector(ev,n,nearestPort(n,...canvasPoint(ev.clientX,ev.clientY)));
   return;
 }
 if(tool==="pan")return;
 selectItem(n.id,ev.shiftKey||ev.ctrlKey||ev.metaKey);
 commit();
 drag={ids:[...selected],startX:ev.clientX,startY:ev.clientY,orig:new Map([...selected].map(id=>{const q=getItem(id);return[id,[q.x,q.y]]}))};
 ev.currentTarget.setPointerCapture?.(ev.pointerId);
}
function startResize(ev,n,corner){
 ev.stopPropagation();commit();
 drag={resize:true,id:n.id,corner,startX:ev.clientX,startY:ev.clientY,orig:[n.x,n.y,n.width,n.height]}
}
function moveDrag(ev){
 if(!drag)return;
 const dx=(ev.clientX-drag.startX)/zoom,dy=(ev.clientY-drag.startY)/zoom;
 if(drag.resize){
   const n=getItem(drag.id),[x,y,w,h]=drag.orig;
   if(drag.corner.includes("e"))n.width=Math.max(25,w+dx);
   if(drag.corner.includes("s"))n.height=Math.max(25,h+dy);
   if(drag.corner.includes("w")){n.x=x+dx;n.width=Math.max(25,w-dx)}
   if(drag.corner.includes("n")){n.y=y+dy;n.height=Math.max(25,h-dy)}
 }else drag.ids.forEach(id=>{const n=getItem(id),o=drag.orig.get(id);n.x=Math.max(0,o[0]+dx);n.y=Math.max(0,o[1]+dy)});
 render()
}
function editItem(n){
 const value=prompt("Edit label / text:",n.kind==="sticky"||n.kind==="text"?n.text:n.label);
 if(value===null)return;commit();
 if(n.kind==="sticky"||n.kind==="text")n.text=value;else n.label=value;
 render();status("Item updated.")
}

/* ---------- connectors ---------- */
function beginConnector(ev,n,port){
 tool="connector";
 setTool("connector");
 const p=portPoint(n,port);
 drawing={
   mode:"connector",
   source:n,
   sourcePort:port,
   points:[p],
   pointerId:ev.pointerId
 };
 selected.clear();
 selected.add(n.id);
 selectedEdge=null;
 ev.currentTarget?.setPointerCapture?.(ev.pointerId);
 status(`Connecting from ${n.label||n.kind}. Drag to another object and release.`);
}

function beginFreeDraw(ev, mode="draw"){
 const p=canvasPoint(ev.clientX,ev.clientY);
 drawing={
   mode,
   source:null,
   sourcePort:null,
   points:[p],
   pointerId:ev.pointerId
 };
 canvas.setPointerCapture?.(ev.pointerId);
 status(mode==="draw"
   ? "Draw: drag across the canvas, then release."
   : "Free-form connector: drag the path, then release.");
}
function finishDrawing(ev){
  if(!drawing) return;

  const currentPoint=canvasPoint(ev.clientX,ev.clientY);
  if(drawing.points.length===0 ||
     Math.hypot(
       currentPoint[0]-drawing.points[drawing.points.length-1][0],
       currentPoint[1]-drawing.points[drawing.points.length-1][1]
     ) > 1){
    drawing.points.push(currentPoint);
  }

  const pts=normalizeFreeformPoints(drawing.points);
  const hit=objectAt(ev.clientX,ev.clientY);

  // Connector mode: if it started on a node and ended over another node,
  // create a real edge and snap its final point to the target port.
  if(drawing.mode==="connector" && drawing.source && hit && hit.id!==drawing.source.id){
    commit();

    const p=currentPoint;
    const toPort=nearestPort(hit,p[0],p[1]);
    const targetPoint=portPoint(hit,toPort);

    let pathPoints=pts.slice();
    if(pathPoints.length<2){
      pathPoints=[portPoint(drawing.source,drawing.sourcePort),targetPoint];
    }else{
      pathPoints[0]=portPoint(drawing.source,drawing.sourcePort);
      pathPoints[pathPoints.length-1]=targetPoint;
    }

    const e={
      id:uid(),
      from:drawing.source.id,
      to:hit.id,
      fromPort:drawing.sourcePort,
      toPort,
      type:connector,
      style:lineStyle,
      width:lineWidth(),
      color:lineColor(),
      startMarker:startMarker(),
      endMarker:endMarker(),
      label:$("edgeLabel").value.trim(),
      waves:3
    };

    if(e.type==="curved"){
      const a=pathPoints[0], b=pathPoints[pathPoints.length-1];
      e.controls=[
        [a[0]+(b[0]-a[0])*.35,a[1]],
        [a[0]+(b[0]-a[0])*.65,b[1]]
      ];
    }

    if(e.type==="elbow"){
      const a=pathPoints[0], b=pathPoints[pathPoints.length-1];
      e.midX=(a[0]+b[0])/2;
    }

    if(e.type==="freeform"){
      e.points=pathPoints;
    }

    model.edges.push(e);
    selected.clear();
    selectedEdge=e.id;
    drawing=null;
    try{canvas.releasePointerCapture?.(ev.pointerId)}catch{}
    render();
    status("Connector created. Select it to edit style and shape.");
    return;
  }

  // Draw/free-form mode: create a standalone smooth path.
  if(drawing.mode==="draw" && pts.length>=2){
    commit();

    const e={
      id:uid(),
      from:null,
      to:null,
      fromPort:null,
      toPort:null,
      type:"freeform",
      style:lineStyle,
      width:lineWidth(),
      color:lineColor(),
      startMarker:startMarker(),
      endMarker:endMarker(),
      label:"",
      points:pts
    };

    model.edges.push(e);
    selectedEdge=e.id;
    drawing=null;
    try{canvas.releasePointerCapture?.(ev.pointerId)}catch{}
    render();
    status("Free-form drawing created. Select it to edit.");
    return;
  }

  drawing=null;
  try{canvas.releasePointerCapture?.(ev.pointerId)}catch{}
  renderEdges();
}
function lineWidth(){return Math.max(1,Math.min(12,+$("lineWidth").value||2))}
function lineColor(){return $("lineColor").value||"#52627a"}
function startMarker(){return $("startMarker").value||"none"}
function endMarker(){return $("endMarker").value||"arrow"}
function onEdgePointerDown(ev){
 ev.stopPropagation();
 const id=ev.target.dataset.edgeId;
 if(!id)return;
 selectedEdge=id;selected.clear();render();status("Arrow selected. Drag visible control points to reshape it.")
}
function onEdgeControlDown(ev){
 ev.stopPropagation();
 const id=ev.target.dataset.edgeControl||ev.target.dataset.edgeMid;
 const e=getEdge(id);if(!e)return;
 commit();
 if(ev.target.dataset.edgeControl)edgeDrag={id,index:+ev.target.dataset.index};
 else edgeDrag={id,mid:true};
}
function moveEdgeControl(ev){
 if(!edgeDrag)return;
 const e=getEdge(edgeDrag.id);if(!e)return;
 const p=canvasPoint(ev.clientX,ev.clientY);
 if(edgeDrag.mid)e.midX=p[0];
 else if(e.type==="curved")e.controls[edgeDrag.index]=p;
 else if(e.type==="freeform")e.points[edgeDrag.index]=p;
 render()
}
edgesEl.addEventListener("pointerdown",ev=>{
 if(ev.target.classList.contains("edge-control")){onEdgeControlDown(ev);return}
 if(ev.target.classList.contains("edge")||ev.target.classList.contains("edge-hit"))onEdgePointerDown(ev)
});
document.addEventListener("pointermove",ev=>{
 if(drawing){
   if(drawing.pointerId!=null && ev.pointerId!==drawing.pointerId) return;
   const p=canvasPoint(ev.clientX,ev.clientY);
   const last=drawing.points[drawing.points.length-1];
   if(!last || Math.hypot(p[0]-last[0],p[1]-last[1])>2.5){
     drawing.points.push(p);
     renderEdges();
   }
   return;
 }
 if(edgeDrag){moveEdgeControl(ev);return}
 if(drag)moveDrag(ev)
});
document.addEventListener("pointerup",ev=>{
 if(drawing){finishDrawing(ev);return}
 drag=null;edgeDrag=null
});

/* ---------- canvas tools ---------- */
canvas.addEventListener("pointerdown",ev=>{
 if(ev.button!==0)return;
 if(ev.target.closest(".node")||ev.target.closest(".edge"))return;
 if(tool==="connector"){
   status("Connect: start on a component or its port, then drag to another component.");
   return;
 }
 if(tool==="draw"){beginFreeDraw(ev,"draw");return}
 const p=canvasPoint(ev.clientX,ev.clientY);
 if(tool==="text"){commit();addItem("text",p[0],p[1]);setTool("select");return}
 if(tool==="sticky"){commit();addItem("sticky",p[0],p[1]);setTool("select");return}
 if(tool==="comment"){commit();addItem("comment",p[0],p[1]);setTool("select");return}
 if(tool==="pin"){commit();addItem("pin",p[0],p[1]);setTool("select");return}
 if(tool==="pan"){
   const sx=ev.clientX,sy=ev.clientY,sl=canvas.scrollLeft,st=canvas.scrollTop;
   const move=e=>{canvas.scrollLeft=sl-(e.clientX-sx);canvas.scrollTop=st-(e.clientY-sy)};
   const up=()=>{document.removeEventListener("pointermove",move);document.removeEventListener("pointerup",up)};
   document.addEventListener("pointermove",move);document.addEventListener("pointerup",up);return
 }
 clearSelection();render()
});

/* ---------- library ---------- */
function renderPalette(filter=""){
 const q=filter.trim().toLowerCase();
 $("palette").innerHTML=CATALOG.filter(x=>!q||x[2].toLowerCase().includes(q)||x[0].includes(q)).map(([t,i,n])=>
 `<button class="palette-item" draggable="true" data-type="${t}"><span class="palette-icon">${i}</span><span class="palette-label">${n}</span></button>`).join("");
 document.querySelectorAll(".palette-item").forEach(b=>{
   b.addEventListener("click",()=>{
     const r=canvas.getBoundingClientRect(),p=canvasPoint(r.left+canvas.clientWidth/2,r.top+canvas.clientHeight/2);
     commit();addItem("node",p[0]-75,p[1]-38,{type:b.dataset.type,label:libName(b.dataset.type)});status(`${libName(b.dataset.type)} added.`)
   });
   b.addEventListener("dragstart",e=>{e.dataTransfer.effectAllowed="copy";e.dataTransfer.setData("application/x-architecture-type",b.dataset.type);e.dataTransfer.setData("text/plain",b.dataset.type)})
 })
}
$("componentSearch").addEventListener("input",e=>renderPalette(e.target.value));
canvas.addEventListener("dragover",e=>{e.preventDefault();canvas.classList.add("drop-target")});
canvas.addEventListener("dragleave",()=>canvas.classList.remove("drop-target"));
canvas.addEventListener("drop",e=>{
 e.preventDefault();canvas.classList.remove("drop-target");
 const type=e.dataTransfer.getData("application/x-architecture-type")||e.dataTransfer.getData("text/plain");
 if(!type)return;
 const p=canvasPoint(e.clientX,e.clientY);commit();addItem("node",p[0]-75,p[1]-38,{type,label:libName(type)});status(`${libName(type)} added.`)
});

/* ---------- shapes / images ---------- */
document.querySelectorAll("[data-shape]").forEach(b=>b.addEventListener("click",()=>{
 const r=canvas.getBoundingClientRect(),p=canvasPoint(r.left+canvas.clientWidth/2,r.top+canvas.clientHeight/2);
 commit();addItem("shape",p[0]-85,p[1]-50,{shape:b.dataset.shape,label:b.textContent});status(`${b.textContent} shape added.`)
}));
$("imageInput").addEventListener("change",ev=>{
 const f=ev.target.files?.[0];if(!f)return;
 const reader=new FileReader();reader.onload=()=>{
   const p=canvasPoint(canvas.getBoundingClientRect().left+canvas.clientWidth/2,canvas.getBoundingClientRect().top+canvas.clientHeight/2);
   commit();addItem("image",p[0]-120,p[1]-85,{label:f.name,src:reader.result});status("Image inserted as a connectable node.")
 };reader.readAsDataURL(f);ev.target.value=""
});
canvas.addEventListener("paste",ev=>{
 const files=[...(ev.clipboardData?.files||[])].filter(f=>f.type.startsWith("image/"));
 if(files.length){files.forEach(f=>{const r=new FileReader();r.onload=()=>{
   const p=canvasPoint(canvas.getBoundingClientRect().left+100,canvas.getBoundingClientRect().top+100);
   commit();addItem("image",p[0],p[1],{label:f.name||"Pasted image",src:r.result})
 };r.readAsDataURL(f)});ev.preventDefault();return}
});

/* ---------- toolbar ---------- */
function setTool(t){
 tool=t;
 document.querySelectorAll("[data-tool]").forEach(b=>b.classList.toggle("active",b.dataset.tool===t));
 status(t==="connector"?"Connect: drag from a port and release on another object.":t==="draw"?"Draw: free-form line on the canvas.":`${t[0].toUpperCase()+t.slice(1)} tool selected.`)
}
document.querySelectorAll("[data-tool]").forEach(b=>b.addEventListener("click",()=>{
 if(b.dataset.tool==="image"){$("imageInput").click();return}
 setTool(b.dataset.tool)
}));
document.querySelectorAll("[data-connector]").forEach(b=>b.addEventListener("click",()=>{
 connector=b.dataset.connector;
 document.querySelectorAll("[data-connector]").forEach(x=>x.classList.toggle("active",x.dataset.connector===connector));
 setTool("connector");
 status(`${connector} arrow selected. Drag from a port to another component.`)
}));
$("connectMode").onclick=()=>setTool("connector");
$("lineStyle").addEventListener("change",()=>{if(selectedEdge)applyEdgeStyle()});
$("lineWidth").addEventListener("change",()=>{if(selectedEdge)applyEdgeStyle()});
$("lineColor").addEventListener("change",()=>{if(selectedEdge)applyEdgeStyle()});
$("edgeLabel").addEventListener("change",()=>{if(selectedEdge)applyEdgeStyle()});
$("applyEdgeStyle").onclick=applyEdgeStyle;
function applyEdgeStyle(){
 if(!selectedEdge){status("Select an arrow first.");return}
 const e=getEdge(selectedEdge);if(!e)return;commit();
 e.style=$("lineStyle").value;e.width=lineWidth();e.color=lineColor();e.startMarker=startMarker();e.endMarker=endMarker();e.label=$("edgeLabel").value.trim();
 render();status("Arrow style applied.")
}
$("edgeStyleInspector").addEventListener("change",()=>{if(!selectedEdge)return;$("lineStyle").value=$("edgeStyleInspector").value;applyEdgeStyle()});
$("edgeWidthInspector").addEventListener("change",()=>{if(!selectedEdge)return;$("lineWidth").value=$("edgeWidthInspector").value;applyEdgeStyle()});
$("edgeColorInspector").addEventListener("change",()=>{if(!selectedEdge)return;$("lineColor").value=$("edgeColorInspector").value;applyEdgeStyle()});
$("edgeLabelInspector").addEventListener("change",()=>{if(!selectedEdge)return;$("edgeLabel").value=$("edgeLabelInspector").value;applyEdgeStyle()});

/* ---------- impact ---------- */
function downstream(start){
 const out=[],seen=new Set(),q=[start];
 while(q.length){const id=q.shift();model.edges.filter(e=>e.from===id).forEach(e=>{if(e.to&&!seen.has(e.to)){seen.add(e.to);out.push(e.to);q.push(e.to)}})}
 return out
}
function renderImpact(){
 if(!impact||selected.size!==1){$("impactResults").innerHTML='<p class="hint">Turn Impact on and select one component.</p>';return}
 const ids=downstream([...selected][0]);
 $("impactResults").innerHTML=ids.length?ids.map(id=>{const n=getItem(id);return`<div class="finding">${esc(n?.label||n?.kind)} is downstream.</div>`}).join(""):'<div class="finding ok">No downstream dependencies.</div>';
}
$("impactMode").onclick=()=>{impact=!impact;$("impactMode").classList.toggle("active",impact);render();status(impact?"Impact mode enabled. Select a source component.":"Impact mode disabled.")};

/* ---------- validation / layout ---------- */
$("validateDiagram").onclick=()=>{
 const findings=[];
 model.items.filter(n=>["node","shape","image"].includes(n.kind)).forEach(n=>{
   const connected=model.edges.some(e=>e.from===n.id||e.to===n.id);
   if(!connected)findings.push(`${n.label||n.kind}: no connections mapped.`);
 });
 const invalid=model.edges.filter(e=>e.from&&!getItem(e.from)||e.to&&!getItem(e.to));
 invalid.forEach(()=>findings.push("One connector references a missing object."));
 $("validationResults").innerHTML=findings.length?findings.map(x=>`<div class="finding warning">${esc(x)}</div>`).join(""):'<div class="finding ok">No basic architecture gaps found.</div>';
 status(findings.length?`${findings.length} validation finding(s).`:"Validation passed.")
};
$("autoLayout").onclick=()=>{
 const arr=model.items.filter(n=>["node","shape","image"].includes(n.kind));if(!arr.length)return;
 commit();arr.forEach((n,i)=>{n.x=60+(i%5)*220;n.y=70+Math.floor(i/5)*150});render();status("Components arranged.")
};

/* ---------- inspector ---------- */
["nodeLabel","nodeEnvironment","nodeOwner","nodeDescription","nodeWidth","nodeHeight","nodeRotation","nodeFill","nodeStroke"].forEach(id=>{
 $(id).addEventListener("change",()=>{
   if(selected.size!==1)return;const n=getItem([...selected][0]);if(!n)return;commit();
   if(id==="nodeLabel")n.label=$(id).value;
   else if(id==="nodeEnvironment")n.environment=$(id).value;
   else if(id==="nodeOwner")n.owner=$(id).value;
   else if(id==="nodeDescription")n.description=$(id).value;
   else if(id==="nodeWidth")n.width=Math.max(20,+$(id).value||20);
   else if(id==="nodeHeight")n.height=Math.max(20,+$(id).value||20);
   else if(id==="nodeRotation")n.rotation=+$("nodeRotation").value||0;
   else if(id==="nodeFill")n.fill=$(id).value;
   else if(id==="nodeStroke")n.stroke=$(id).value;
   render()
 })
});
$("editTextButton").onclick=()=>{if(selected.size===1)editItem(getItem([...selected][0]))};

/* ---------- delete / duplicate / keyboard ---------- */
function deleteSelected(){
 if(selectedEdge){commit();model.edges=model.edges.filter(e=>e.id!==selectedEdge);selectedEdge=null;render();status("Arrow deleted.");return}
 if(!selected.size)return;commit();const ids=new Set(selected);model.items=model.items.filter(n=>!ids.has(n.id));model.edges=model.edges.filter(e=>!ids.has(e.from)&&!ids.has(e.to));clearSelection();render();status("Selected items deleted.")
}
function duplicateSelected(){
 if(!selected.size)return;commit();const ids=[...selected],map=new Map(),copies=[];
 ids.forEach(id=>{const n=getItem(id),c=JSON.parse(JSON.stringify(n));c.id=uid();c.x+=30;c.y+=30;map.set(id,c.id);model.items.push(c);copies.push(c)});
 model.edges.filter(e=>e.from&&e.to&&ids.includes(e.from)&&ids.includes(e.to)).forEach(e=>model.edges.push({...JSON.parse(JSON.stringify(e)),id:uid(),from:map.get(e.from),to:map.get(e.to)}));
 selected.clear();copies.forEach(n=>selected.add(n.id));selectedEdge=null;render();status("Duplicated.")
}
$("deleteSelected").onclick=deleteSelected;$("duplicateSelected").onclick=duplicateSelected;
$("undoBtn").onclick=undo;$("redoBtn").onclick=redo;
document.addEventListener("keydown",ev=>{
 if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==="z"){ev.preventDefault();undo()}
 else if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==="y"){ev.preventDefault();redo()}
 else if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==="d"){ev.preventDefault();duplicateSelected()}
 else if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==="a"){ev.preventDefault();selected.clear();selectedEdge=null;model.items.forEach(n=>selected.add(n.id));render()}
 else if(ev.key==="Delete"||ev.key==="Backspace"){if(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA")return;ev.preventDefault();deleteSelected()}
});

/* ---------- templates ---------- */
function loadTemplate(type){
 commit();model={version:4,name:type==="aiops"?"AIOps Control Center":type==="aks"?"AKS Application Platform":"Azure Landing Zone",items:[],edges:[]};
 const add=(t,x,y,label)=>addItem("node",x,y,{type:t,label});
 const a=[];
 if(type==="aiops")a.push(add("monitoring",40,180,"Monitoring Sources"),add("monitoring",260,70,"Azure Monitor"),add("servicenow",260,300,"ServiceNow"),add("agent",510,180,"AIOps Control Center"),add("database",780,70,"Incident Store"),add("aks",780,300,"AKS Agents"));
 if(type==="aks")a.push(add("user",40,190,"Users"),add("gateway",250,190,"Application Gateway"),add("aks",470,190,"AKS Cluster"),add("app",720,80,"Orders API"),add("sql",720,320,"PostgreSQL"),add("monitoring",470,430,"Azure Monitor"));
 if(type==="landing")a.push(add("identity",50,120,"Entra ID"),add("firewall",280,120,"Azure Firewall"),add("app",520,120,"Shared Services"),add("storage",780,120,"Storage Account"),add("logs",520,350,"Log Analytics"));
 for(let i=0;i<a.length-1;i++)model.edges.push({id:uid(),from:a[i].id,to:a[i+1].id,fromPort:"right",toPort:"left",type:"straight",style:"solid",width:2,color:"#52627a",startMarker:"none",endMarker:"arrow",label:""});
 clearSelection();render();status("Template loaded.")
}
document.querySelectorAll("[data-template]").forEach(b=>b.addEventListener("click",()=>loadTemplate(b.dataset.template)));

/* ---------- zoom ---------- */
function updateZoom(){inner.style.transform=`scale(${zoom})`;$("zoomLevel").textContent=Math.round(zoom*100)+"%"}
function setZoom(v){zoom=Math.max(.25,Math.min(2.5,v));updateZoom()}
$("zoomIn").onclick=()=>setZoom(zoom+.1);$("zoomOut").onclick=()=>setZoom(zoom-.1);$("zoomReset").onclick=()=>setZoom(1);
$("fitView").onclick=()=>{
 const vis=model.items.filter(n=>["node","shape","image","sticky","comment","text","pin"].includes(n.kind));if(!vis.length)return;
 const minX=Math.min(...vis.map(n=>n.x)),minY=Math.min(...vis.map(n=>n.y)),maxX=Math.max(...vis.map(n=>n.x+n.width)),maxY=Math.max(...vis.map(n=>n.y+n.height));
 const sx=(canvas.clientWidth-80)/(maxX-minX+80),sy=(canvas.clientHeight-80)/(maxY-minY+80);setZoom(Math.max(.25,Math.min(1.5,Math.min(sx,sy))));canvas.scrollLeft=Math.max(0,minX*zoom-30);canvas.scrollTop=Math.max(0,minY*zoom-30)
};

/* ---------- persistence / exports ---------- */
function download(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
$("diagramName").addEventListener("input",e=>model.name=e.target.value);
$("newDiagram").onclick=()=>{if(confirm("Start a new blank diagram?")){commit();model={version:4,name:"Untitled architecture",items:[],edges:[]};clearSelection();render();status("New diagram created.")}};
$("saveDiagram").onclick=()=>download(new Blob([JSON.stringify(model,null,2)],{type:"application/json"}),`${(model.name||"architecture").replace(/[^\w-]+/g,"-")}.arch`);
$("loadDiagram").onclick=()=>{
 const i=document.createElement("input");i.type="file";i.accept=".arch,.json,application/json";i.onchange=async()=>{
   const f=i.files?.[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!x.items||!x.edges)throw Error("Invalid architecture file");commit();model=x;clearSelection();render();status("Architecture loaded.")}catch(err){status("Load failed: "+err.message)}
 };i.click()
};
$("exportJson").onclick=()=>download(new Blob([JSON.stringify(model,null,2)],{type:"application/json"}),"architecture.json");
$("importJson").addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!x.items||!x.edges)throw Error("Invalid JSON");commit();model=x;clearSelection();render();status("JSON imported.")}catch(err){status("Import failed: "+err.message)}e.target.value=""});

function exportSvgString(){
 const parts=[`<svg xmlns="http://www.w3.org/2000/svg" width="3200" height="2200" viewBox="0 0 3200 2200">`,`<rect width="100%" height="100%" fill="#eef3fa"/>`];
 model.edges.forEach(e=>{const d=edgePath(e);if(!d)return;parts.push(`<path d="${d}" fill="none" stroke="${e.color||"#52627a"}" stroke-width="${e.width||2}" ${e.style==="dashed"?'stroke-dasharray="8 5"':e.style==="dotted"?'stroke-dasharray="2 5"':""}/>`);});
 model.items.forEach(n=>{
   if(n.kind==="image")parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="8" fill="#fff" stroke="${n.stroke||"#64748b"}"/>`);
   else if(n.kind==="shape")parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="${n.shape==="ellipse"?n.height/2:10}" fill="${n.fill||"#fff"}" stroke="${n.stroke||"#64748b"}"/>`);
   else if(n.kind==="node")parts.push(`<rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="8" fill="${n.fill||"#fff"}" stroke="${n.stroke||"#64748b"}"/><text x="${n.x+10}" y="${n.y+35}" font-family="Arial" font-size="16" font-weight="700">${esc(n.label)}</text>`);
   else if(n.kind==="text")parts.push(`<text x="${n.x}" y="${n.y+24}" font-family="Arial" font-size="16">${esc(n.text)}</text>`);
 });
 return parts.join("")+"</svg>"
}
$("exportSvg").onclick=()=>download(new Blob([exportSvgString()],{type:"image/svg+xml"}),"architecture.svg");
$("exportPng").onclick=()=>{
 const svg=exportSvgString(),img=new Image();
 img.onload=()=>{const c=document.createElement("canvas");c.width=3200;c.height=2200;const ctx=c.getContext("2d");ctx.drawImage(img,0,0);c.toBlob(b=>download(b,"architecture.png"),"image/png")};
 img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)
};

/* ---------- init ---------- */
renderPalette();
render();
status("Ready. Drag or click components. Use Connect for real node-to-node arrows.");
})();
