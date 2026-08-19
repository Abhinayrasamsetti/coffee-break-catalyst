/* ============================================================
   COFFEE BREAK CATALYST
   ARCHITECTURE DIAGRAM BUILDER
   Complete interaction engine
   ============================================================ */

"use strict";

/* ============================================================
   STATE
   ============================================================ */

const state = {
  name: "Untitled architecture",

  nodes: [],
  edges: [],
  stickyNotes: [],
  comments: [],
  pins: [],

  selected: new Set(),

  tool: "select",

  connectorType: "straight",
  connectorStyle: "solid",

  connectSource: null,

  drawing: null,
  dragging: null,
  resizing: null,
  marquee: null,

  zoom: 1,

  clipboard: null,

  history: [],
  future: [],

  grid: true,
  snap: true,

  id: 1
};

/* ============================================================
   DOM
   ============================================================ */

const $ = id => document.getElementById(id);

const canvas = $("canvas");
const canvasInner = $("canvasInner");
const nodesLayer = $("nodes");
const edgesSvg = $("edges");

function uid(prefix = "item") {
  return `${prefix}-${Date.now().toString(36)}-${state.id++}`;
}

/* ============================================================
   COMPONENT DEFINITIONS
   ============================================================ */

const COMPONENTS = {

  "azure-service": {
    icon: "☁️",
    label: "Azure Service",
    shape: "rounded"
  },

  "aws-service": {
    icon: "☁",
    label: "AWS Service",
    shape: "rounded"
  },

  "gcp-service": {
    icon: "☁",
    label: "GCP Service",
    shape: "rounded"
  },

  "cloud": {
    icon: "☁️",
    label: "Cloud",
    shape: "rounded"
  },

  "virtual-machine": {
    icon: "🖥️",
    label: "Virtual Machine",
    shape: "rounded"
  },

  "vm": {
    icon: "🖥️",
    label: "Virtual Machine",
    shape: "rounded"
  },

  "server": {
    icon: "▣",
    label: "Server",
    shape: "rounded"
  },

  "container": {
    icon: "📦",
    label: "Container",
    shape: "rounded"
  },

  "kubernetes": {
    icon: "☸️",
    label: "Kubernetes",
    shape: "hexagon"
  },

  "aks": {
    icon: "☸️",
    label: "AKS Cluster",
    shape: "hexagon"
  },

  "docker": {
    icon: "🐳",
    label: "Docker",
    shape: "rounded"
  },

  "api-gateway": {
    icon: "↔️",
    label: "API Gateway",
    shape: "rounded"
  },

  "api": {
    icon: "↔️",
    label: "API Gateway",
    shape: "rounded"
  },

  "load-balancer": {
    icon: "⚖️",
    label: "Load Balancer",
    shape: "rounded"
  },

  "firewall": {
    icon: "🔥",
    label: "Firewall",
    shape: "rounded"
  },

  "internet": {
    icon: "🌐",
    label: "Internet",
    shape: "circle"
  },

  "network": {
    icon: "🔗",
    label: "Network",
    shape: "rounded"
  },

  "vnet": {
    icon: "▦",
    label: "Virtual Network",
    shape: "rounded"
  },

  "router": {
    icon: "⇄",
    label: "Router",
    shape: "rounded"
  },

  "switch": {
    icon: "⇆",
    label: "Network Switch",
    shape: "rounded"
  },

  "database": {
    icon: "🗄️",
    label: "Database",
    shape: "database"
  },

  "storage": {
    icon: "💾",
    label: "Storage",
    shape: "rounded"
  },

  "sql": {
    icon: "🗄️",
    label: "SQL Database",
    shape: "database"
  },

  "nosql": {
    icon: "◫",
    label: "NoSQL Database",
    shape: "database"
  },

  "cache": {
    icon: "▥",
    label: "Cache",
    shape: "rounded"
  },

  "queue": {
    icon: "▤",
    label: "Message Queue",
    shape: "rounded"
  },

  "eventbus": {
    icon: "⚡",
    label: "Event Bus",
    shape: "rounded"
  },

  "backup": {
    icon: "◫",
    label: "Backup",
    shape: "rounded"
  },

  "identity": {
    icon: "🔐",
    label: "Identity Provider",
    shape: "rounded"
  },

  "security": {
    icon: "🛡️",
    label: "Security Control",
    shape: "rounded"
  },

  "siem": {
    icon: "◉",
    label: "SIEM",
    shape: "rounded"
  },

  "servicenow": {
    icon: "◉",
    label: "ServiceNow",
    shape: "rounded"
  },

  "monitoring": {
    icon: "◌",
    label: "Monitoring",
    shape: "rounded"
  },

  "logging": {
    icon: "≡",
    label: "Logging",
    shape: "rounded"
  },

  "alert": {
    icon: "⚠️",
    label: "Alert",
    shape: "rounded"
  },

  "ticket": {
    icon: "🎫",
    label: "Ticket",
    shape: "rounded"
  },

  "github": {
    icon: "●",
    label: "GitHub",
    shape: "rounded"
  },

  "pipeline": {
    icon: "▶",
    label: "CI/CD Pipeline",
    shape: "rounded"
  },

  "build": {
    icon: "⚙",
    label: "Build",
    shape: "rounded"
  },

  "deploy": {
    icon: "🚀",
    label: "Deployment",
    shape: "rounded"
  },

  "registry": {
    icon: "▣",
    label: "Container Registry",
    shape: "rounded"
  },

  "ai": {
    icon: "✦",
    label: "AI Service",
    shape: "rounded"
  },

  "llm": {
    icon: "✦",
    label: "LLM",
    shape: "rounded"
  },

  "agent": {
    icon: "✧",
    label: "AI Agent",
    shape: "rounded"
  },

  "vector": {
    icon: "◈",
    label: "Vector Database",
    shape: "database"
  },

  "rag": {
    icon: "✦",
    label: "RAG System",
    shape: "rounded"
  },

  "rectangle": {
    icon: "□",
    label: "Rectangle",
    shape: "rectangle"
  },

  "rounded": {
    icon: "▢",
    label: "Rounded Rectangle",
    shape: "rounded"
  },

  "circle": {
    icon: "○",
    label: "Circle",
    shape: "circle"
  },

  "diamond": {
    icon: "◇",
    label: "Decision",
    shape: "diamond"
  },

  "hexagon": {
    icon: "⬡",
    label: "Hexagon",
    shape: "hexagon"
  },

  "document": {
    icon: "▱",
    label: "Document",
    shape: "document"
  },

  "zone": {
    icon: "▧",
    label: "Security Zone",
    shape: "zone"
  }
};

/* ============================================================
   UTILITY
   ============================================================ */

function componentInfo(type) {
  return COMPONENTS[type] || {
    icon: "◇",
    label: type || "Component",
    shape: "rounded"
  };
}

function nodeById(id) {
  return state.nodes.find(n => n.id === id);
}

function edgeById(id) {
  return state.edges.find(e => e.id === id);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function snapValue(v) {
  if (!state.snap) return v;
  return Math.round(v / 10) * 10;
}

function canvasPoint(event) {

  const rect = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left + canvas.scrollLeft) / state.zoom,
    y: (event.clientY - rect.top + canvas.scrollTop) / state.zoom
  };
}

function downloadFile(filename, content, type) {

  const blob = new Blob([content], { type });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();

  a.remove();

  URL.revokeObjectURL(url);
}

function status(message) {

  const el = $("status");

  if (el) {
    el.textContent = message;
  }
}

/* ============================================================
   HISTORY
   ============================================================ */

function snapshot() {

  return JSON.stringify({
    name: state.name,
    nodes: state.nodes,
    edges: state.edges,
    stickyNotes: state.stickyNotes,
    comments: state.comments,
    pins: state.pins
  });
}

function pushHistory() {

  state.history.push(snapshot());

  if (state.history.length > 50) {
    state.history.shift();
  }

  state.future.length = 0;
}

function restoreSnapshot(data) {

  const parsed = JSON.parse(data);

  state.name = parsed.name || "Untitled architecture";

  state.nodes = parsed.nodes || [];
  state.edges = parsed.edges || [];

  state.stickyNotes = parsed.stickyNotes || [];
  state.comments = parsed.comments || [];
  state.pins = parsed.pins || [];

  clearSelection();

  render();
}

function undo() {

  if (!state.history.length) return;

  state.future.push(snapshot());

  const previous = state.history.pop();

  restoreSnapshot(previous);

  status("Undo");
}

function redo() {

  if (!state.future.length) return;

  state.history.push(snapshot());

  const next = state.future.pop();

  restoreSnapshot(next);

  status("Redo");
}

/* ============================================================
   SELECTION
   ============================================================ */

function clearSelection() {

  state.selected.clear();

  state.connectSource = null;
}

function selectOnly(id) {

  state.selected.clear();

  if (id) {
    state.selected.add(id);
  }

  render();
}

function toggleSelection(id) {

  if (state.selected.has(id)) {
    state.selected.delete(id);
  } else {
    state.selected.add(id);
  }

  render();
}

function selectedNodes() {

  return state.nodes.filter(n =>
    state.selected.has(n.id)
  );
}

/* ============================================================
   NODE CREATION
   ============================================================ */

function createNode(type, x, y, extra = {}) {

  const info = componentInfo(type);

  return {
    id: uid("node"),

    type,

    label: extra.label || info.label,

    icon: info.icon,

    shape: extra.shape || info.shape,

    x: snapValue(x),
    y: snapValue(y),

    width: extra.width || 150,
    height: extra.height || 76,

    environment: extra.environment || "Production",

    owner: extra.owner || "",

    description: extra.description || "",

    image: extra.image || null,

    imageName: extra.imageName || "",

    zIndex: state.nodes.length
  };
}

function addNode(type, x, y, extra = {}) {

  pushHistory();

  const node = createNode(type, x, y, extra);

  state.nodes.push(node);

  state.selected.clear();

  state.selected.add(node.id);

  render();

  status(`${componentInfo(type).label} added`);

  return node;
}

/* ============================================================
   IMAGE NODE
   ============================================================ */

function addImage(file, x, y) {

  if (!file || !file.type.startsWith("image/")) {

    status("Please select a PNG, JPG, JPEG, GIF, SVG or WEBP image");

    return;
  }

  const reader = new FileReader();

  reader.onload = () => {

    pushHistory();

    const node = createNode(
      "image",
      x,
      y,
      {
        label: file.name,
        width: 220,
        height: 150,
        image: reader.result,
        imageName: file.name
      }
    );

    node.shape = "image";

    state.nodes.push(node);

    state.selected.clear();

    state.selected.add(node.id);

    render();

    status(`Image "${file.name}" added`);
  };

  reader.readAsDataURL(file);
}

/* ============================================================
   NODE RENDERING
   ============================================================ */

function renderNodes() {

  if (!nodesLayer) return;

  nodesLayer.innerHTML = "";

  [...state.nodes]
    .sort((a, b) => a.zIndex - b.zIndex)
    .forEach(node => {

      const el = document.createElement("div");

      const selected =
        state.selected.has(node.id);

      el.className =
        `node ${selected ? "selected" : ""} ` +
        `${node.shape === "zone" ? "zone" : ""} ` +
        `${node.image ? "image-node" : ""}`;

      el.dataset.id = node.id;

      el.style.left = `${node.x}px`;
      el.style.top = `${node.y}px`;

      el.style.width = `${node.width}px`;
      el.style.height = `${node.height}px`;

      if (node.image) {

        el.innerHTML = `
          <img
            src="${node.image}"
            alt="${node.label}"
            draggable="false"
          />

          <div class="node-image-label">
            ${node.label}
          </div>
        `;

      } else {

        el.innerHTML = `
          <span class="node-icon">
            ${node.icon}
          </span>

          <span class="node-type">
            ${node.type}
          </span>

          <span class="node-title">
            ${node.label}
          </span>

          <span class="node-meta">
            ${node.environment || ""}
          </span>
        `;
      }

      /* CONNECTION PORTS */

      ["top", "right", "bottom", "left"].forEach(side => {

        const port = document.createElement("span");

        port.className =
          `connection-port ${side}`;

        port.dataset.port = side;

        port.dataset.nodeId = node.id;

        el.appendChild(port);
      });

      /* RESIZE HANDLES */

      ["nw", "ne", "sw", "se"].forEach(handle => {

        const h = document.createElement("span");

        h.className =
          `resize-handle ${handle}`;

        h.dataset.resize = handle;

        el.appendChild(h);
      });

      nodesLayer.appendChild(el);
    });
}

/* ============================================================
   CONNECTION GEOMETRY
   ============================================================ */

function center(node) {

  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2
  };
}

function portPoint(node, port) {

  const c = center(node);

  switch (port) {

    case "top":
      return {
        x: c.x,
        y: node.y
      };

    case "right":
      return {
        x: node.x + node.width,
        y: c.y
      };

    case "bottom":
      return {
        x: c.x,
        y: node.y + node.height
      };

    case "left":
      return {
        x: node.x,
        y: c.y
      };

    default:
      return c;
  }
}

function nearestPort(nodeA, nodeB) {

  const a = center(nodeA);
  const b = center(nodeB);

  const dx = b.x - a.x;
  const dy = b.y - a.y;

  if (Math.abs(dx) > Math.abs(dy)) {

    return {
      from: dx >= 0 ? "right" : "left",
      to: dx >= 0 ? "left" : "right"
    };

  }

  return {
    from: dy >= 0 ? "bottom" : "top",
    to: dy >= 0 ? "top" : "bottom"
  };
}

/* ============================================================
   EDGE PATHS
   ============================================================ */

function straightPath(a, b) {

  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

function curvedPath(a, b) {

  const dx = b.x - a.x;

  const bend = Math.max(80, Math.abs(dx) * 0.5);

  return `
    M ${a.x} ${a.y}
    C ${a.x + bend} ${a.y},
      ${b.x - bend} ${b.y},
      ${b.x} ${b.y}
  `;
}

function elbowPath(a, b) {

  const midX = (a.x + b.x) / 2;

  return `
    M ${a.x} ${a.y}
    L ${midX} ${a.y}
    L ${midX} ${b.y}
    L ${b.x} ${b.y}
  `;
}

function wavyPath(a, b) {

  const dx = b.x - a.x;
  const dy = b.y - a.y;

  const length =
    Math.sqrt(dx * dx + dy * dy);

  const nx = -dy / Math.max(length, 1);
  const ny = dx / Math.max(length, 1);

  const amplitude = 15;

  const segments = 8;

  let path =
    `M ${a.x} ${a.y}`;

  for (let i = 1; i <= segments; i++) {

    const t = i / segments;

    const x =
      a.x + dx * t +
      nx *
      Math.sin(t * Math.PI * 4) *
      amplitude;

    const y =
      a.y + dy * t +
      ny *
      Math.sin(t * Math.PI * 4) *
      amplitude;

    path += ` L ${x} ${y}`;
  }

  return path;
}

/* ============================================================
   FREE FORM PATH
   ============================================================ */

function freePath(points) {

  if (!points || points.length < 2) {
    return "";
  }

  let d =
    `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {

    const p = points[i];

    d +=
      ` L ${p.x} ${p.y}`;
  }

  return d;
}

/* ============================================================
   EDGE RENDERING
   ============================================================ */

function renderEdges() {

  if (!edgesSvg) return;

  edgesSvg.innerHTML = `
    <defs>

      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
      >
        <path
          d="M 0 0 L 10 5 L 0 10 z"
          fill="#64748b"
        />
      </marker>

      <marker
        id="arrowSelected"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path
          d="M 0 0 L 10 5 L 0 10 z"
          fill="#2764f0"
        />
      </marker>

    </defs>
  `;

  state.edges.forEach(edge => {

    let pathData = "";

    if (edge.freeform) {

      pathData =
        freePath(edge.points);

    } else {

      const from = nodeById(edge.from);

      const to = nodeById(edge.to);

      if (!from || !to) return;

      const ports =
        edge.fromPort && edge.toPort
          ? {
              from: edge.fromPort,
              to: edge.toPort
            }
          : nearestPort(from, to);

      const a =
        portPoint(from, ports.from);

      const b =
        portPoint(to, ports.to);

      switch (edge.type) {

        case "elbow":
          pathData =
            elbowPath(a, b);
          break;

        case "curved":
          pathData =
            curvedPath(a, b);
          break;

        case "wavy":
          pathData =
            wavyPath(a, b);
          break;

        default:
          pathData =
            straightPath(a, b);
      }
    }

    const path =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

    path.setAttribute(
      "d",
      pathData
    );

    path.classList.add("edge");

    if (state.selected.has(edge.id)) {
      path.classList.add("selected");
    }

    if (edge.style === "dashed") {
      path.classList.add("dashed");
    }

    if (edge.style === "dotted") {
      path.classList.add("dotted");
    }

    path.style.pointerEvents = "stroke";

    path.style.cursor = "pointer";

    if (edge.arrow !== false) {

      path.setAttribute(
        "marker-end",
        state.selected.has(edge.id)
          ? "url(#arrowSelected)"
          : "url(#arrow)"
      );
    }

    path.addEventListener(
      "pointerdown",
      event => {

        event.stopPropagation();

        if (state.tool === "select") {

          clearSelection();

          state.selected.add(edge.id);

          render();
        }
      }
    );

    edgesSvg.appendChild(path);

    /* LABEL */

    if (edge.label) {

      const text =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );

      text.classList.add("edge-label");

      text.textContent =
        edge.label;

      let x = 0;
      let y = 0;

      if (edge.freeform) {

        const p =
          edge.points[
            Math.floor(
              edge.points.length / 2
            )
          ];

        x = p.x;
        y = p.y;

      } else {

        const from = nodeById(edge.from);
        const to = nodeById(edge.to);

        if (from && to) {

          const a = center(from);
          const b = center(to);

          x = (a.x + b.x) / 2;
          y = (a.y + b.y) / 2;
        }
      }

      text.setAttribute("x", x);
      text.setAttribute("y", y - 8);

      edgesSvg.appendChild(text);
    }
  });
}

/* ============================================================
   RENDER ALL
   ============================================================ */

function render() {

  renderEdges();

  renderNodes();

  renderStickyNotes();

  renderComments();

  renderPins();

  renderInspector();

  updateZoom();
}

/* ============================================================
   NODE POINTER EVENTS
   ============================================================ */

function startNodePointer(event) {

  if (event.target.closest(".connection-port")) {
    return;
  }

  if (event.target.closest(".resize-handle")) {

    startResize(event);

    return;
  }

  const el =
    event.currentTarget;

  const id =
    el.dataset.id;

  const node =
    nodeById(id);

  if (!node) return;

  if (state.tool === "connect") {

    if (!state.connectSource) {

      state.connectSource = id;

      state.selected.clear();

      state.selected.add(id);

      render();

      status(
        "Select the destination component"
      );

    } else if (
      state.connectSource !== id
    ) {

      createEdge(
        state.connectSource,
        id
      );

      state.connectSource = null;
    }

    return;
  }

  if (state.tool !== "select") {
    return;
  }

  if (event.shiftKey) {

    toggleSelection(id);

  } else if (!state.selected.has(id)) {

    selectOnly(id);
  }

  event.preventDefault();

  const point =
    canvasPoint(event);

  state.dragging = {

    nodeIds:
      [...state.selected]
        .filter(id =>
          nodeById(id)
        ),

    startX: point.x,

    startY: point.y,

    positions:
      [...state.selected]
        .map(id => {

          const n =
            nodeById(id);

          return n
            ? {
                id,
                x: n.x,
                y: n.y
              }
            : null;
        })
        .filter(Boolean)
  };

  pushHistory();

  el.setPointerCapture?.(
    event.pointerId
  );
}

/* ============================================================
   NODE MOVE
   ============================================================ */

document.addEventListener(
  "pointermove",
  event => {

    if (!state.dragging) return;

    const point =
      canvasPoint(event);

    const dx =
      point.x -
      state.dragging.startX;

    const dy =
      point.y -
      state.dragging.startY;

    state.dragging.positions
      .forEach(original => {

        const node =
          nodeById(original.id);

        if (!node) return;

        node.x =
          snapValue(
            original.x + dx
          );

        node.y =
          snapValue(
            original.y + dy
          );
      });

    render();
  }
);

document.addEventListener(
  "pointerup",
  () => {

    if (state.dragging) {

      state.dragging = null;

      status("Moved");
    }
  }
);

/* ============================================================
   RESIZE
   ============================================================ */

function startResize(event) {

  const handle =
    event.target.dataset.resize;

  const el =
    event.currentTarget.closest(
      ".node"
    );

  if (!el) return;

  const node =
    nodeById(
      el.dataset.id
    );

  if (!node) return;

  const point =
    canvasPoint(event);

  pushHistory();

  state.resizing = {

    node,

    handle,

    startX: point.x,

    startY: point.y,

    x: node.x,

    y: node.y,

    width: node.width,

    height: node.height
  };

  event.stopPropagation();

  event.preventDefault();
}

document.addEventListener(
  "pointermove",
  event => {

    if (!state.resizing) return;

    const r =
      state.resizing;

    const p =
      canvasPoint(event);

    const dx =
      p.x - r.startX;

    const dy =
      p.y - r.startY;

    let x = r.x;
    let y = r.y;

    let width = r.width;
    let height = r.height;

    if (
      r.handle.includes("e")
    ) {
      width =
        Math.max(
          60,
          r.width + dx
        );
    }

    if (
      r.handle.includes("s")
    ) {
      height =
        Math.max(
          40,
          r.height + dy
        );
    }

    if (
      r.handle.includes("w")
    ) {

      width =
        Math.max(
          60,
          r.width - dx
        );

      x =
        r.x + dx;
    }

    if (
      r.handle.includes("n")
    ) {

      height =
        Math.max(
          40,
          r.height - dy
        );

      y =
        r.y + dy;
    }

    r.node.x = snapValue(x);
    r.node.y = snapValue(y);

    r.node.width = width;
    r.node.height = height;

    render();
  }
);

document.addEventListener(
  "pointerup",
  () => {

    if (state.resizing) {

      state.resizing = null;

      status("Resized");
    }
  }
);

/* ============================================================
   CONNECTION PORT EVENTS
   ============================================================ */

document.addEventListener(
  "pointerdown",
  event => {

    const port =
      event.target.closest(
        ".connection-port"
      );

    if (!port) return;

    const nodeId =
      port.dataset.nodeId;

    const side =
      port.dataset.port;

    if (
      state.tool !== "connect"
    ) {

      state.tool = "connect";

      updateToolButtons();
    }

    if (!state.connectSource) {

      state.connectSource = {
        id: nodeId,
        port: side
      };

      status(
        "Drag to another connection point"
      );

      beginPortDrag(
        event,
        nodeId,
        side
      );
    }

    event.stopPropagation();
  }
);

/* ============================================================
   PORT DRAG CONNECTION
   ============================================================ */

function beginPortDrag(
  event,
  sourceId,
  sourcePort
) {

  const points = [];

  const start =
    canvasPoint(event);

  points.push(start);

  const move = e => {

    const p =
      canvasPoint(e);

    points.push(p);

    drawTemporaryConnection(
      points
    );
  };

  const up = e => {

    document.removeEventListener(
      "pointermove",
      move
    );

    document.removeEventListener(
      "pointerup",
      up
    );

    removeTemporaryConnection();

    const target =
      document.elementFromPoint(
        e.clientX,
        e.clientY
      );

    const port =
      target?.closest(
        ".connection-port"
      );

    if (port) {

      const targetId =
        port.dataset.nodeId;

      const targetPort =
        port.dataset.port;

      if (
        targetId &&
        targetId !== sourceId
      ) {

        createEdge(
          sourceId,
          targetId,
          sourcePort,
          targetPort
        );
      }
    }

    state.connectSource = null;
  };

  document.addEventListener(
    "pointermove",
    move
  );

  document.addEventListener(
    "pointerup",
    up
  );
}

function drawTemporaryConnection(
  points
) {

  removeTemporaryConnection();

  if (!edgesSvg) return;

  const path =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

  path.id =
    "temporary-connection";

  path.classList.add(
    "edge",
    "highlight"
  );

  path.setAttribute(
    "d",
    freePath(points)
  );

  edgesSvg.appendChild(path);
}

function removeTemporaryConnection() {

  document
    .getElementById(
      "temporary-connection"
    )
    ?.remove();
}

/* ============================================================
   CREATE EDGE
   ============================================================ */

function createEdge(
  from,
  to,
  fromPort = null,
  toPort = null
) {

  pushHistory();

  const edge = {

    id: uid("edge"),

    from,
    to,

    fromPort,
    toPort,

    type:
      state.connectorType,

    style:
      state.connectorStyle,

    arrow: true,

    label: ""
  };

  state.edges.push(edge);

  state.selected.clear();

  state.selected.add(edge.id);

  render();

  status(
    `${state.connectorType} connector created`
  );
}

/* ============================================================
   FREE-FORM / WAVY DRAWING
   ============================================================ */

function beginDrawing(event) {

  if (
    state.tool !== "freeform" &&
    state.tool !== "wavy"
  ) {
    return;
  }

  const point =
    canvasPoint(event);

  state.drawing = {

    type:
      state.tool,

    points: [
      point
    ]
  };

  drawTemporaryConnection(
    state.drawing.points
  );

  event.preventDefault();
}

document.addEventListener(
  "pointermove",
  event => {

    if (!state.drawing) return;

    const point =
      canvasPoint(event);

    state.drawing.points.push(
      point
    );

    drawTemporaryConnection(
      state.drawing.points
    );
  }
);

document.addEventListener(
  "pointerup",
  () => {

    if (!state.drawing) return;

    const drawing =
      state.drawing;

    state.drawing = null;

    removeTemporaryConnection();

    if (
      drawing.points.length < 3
    ) {
      return;
    }

    pushHistory();

    state.edges.push({

      id: uid("edge"),

      freeform: true,

      points:
        drawing.points,

      type:
        drawing.type,

      style:
        state.connectorStyle,

      arrow: true,

      label: ""
    });

    render();

    status(
      `${drawing.type} arrow created`
    );
  }
);

/* ============================================================
   STICKY NOTES
   ============================================================ */

function renderStickyNotes() {

  document
    .querySelectorAll(
      ".sticky-note"
    )
    .forEach(el => el.remove());

  state.stickyNotes.forEach(note => {

    const el =
      document.createElement(
        "div"
      );

    el.className =
      "sticky-note";

    el.style.left =
      `${note.x}px`;

    el.style.top =
      `${note.y}px`;

    el.dataset.id =
      note.id;

    el.innerHTML = `
      <textarea>${note.text || "Double-click to edit"}</textarea>
    `;

    const textarea =
      el.querySelector(
        "textarea"
      );

    textarea.addEventListener(
      "input",
      () => {

        note.text =
          textarea.value;
      }
    );

    el.addEventListener(
      "pointerdown",
      event => {

        if (
          event.target === textarea
        ) {
          return;
        }

        selectOnly(
          note.id
        );
      }
    );

    canvasInner?.appendChild(
      el
    );
  });
}

function addStickyNote(x, y) {

  pushHistory();

  state.stickyNotes.push({

    id: uid("sticky"),

    x,
    y,

    text:
      "Double-click to edit"
  });

  render();

  status("Sticky note added");
}

/* ============================================================
   COMMENTS
   ============================================================ */

function renderComments() {

  document
    .querySelectorAll(
      ".comment-node"
    )
    .forEach(el => el.remove());

  state.comments.forEach(comment => {

    const el =
      document.createElement(
        "div"
      );

    el.className =
      "comment-node";

    el.style.left =
      `${comment.x}px`;

    el.style.top =
      `${comment.y}px`;

    el.dataset.id =
      comment.id;

    el.innerHTML = `
      <div class="comment-author">
        ${comment.author || "You"}
      </div>

      <div>
        ${comment.text || "Comment"}
      </div>
    `;

    el.addEventListener(
      "dblclick",
      () => {

        const text =
          prompt(
            "Comment:",
            comment.text || ""
          );

        if (
          text !== null
        ) {

          pushHistory();

          comment.text =
            text;

          render();
        }
      }
    );

    canvasInner?.appendChild(
      el
    );
  });
}

function addComment(x, y) {

  const text =
    prompt(
      "Enter comment:"
    );

  if (
    text === null
  ) {
    return;
  }

  pushHistory();

  state.comments.push({

    id: uid("comment"),

    x,
    y,

    author: "You",

    text
  });

  render();

  status("Comment added");
}

/* ============================================================
   PINS
   ============================================================ */

function renderPins() {

  document
    .querySelectorAll(
      ".pin-node"
    )
    .forEach(el => el.remove());

  state.pins.forEach(pin => {

    const el =
      document.createElement(
        "div"
      );

    el.className =
      "pin-node";

    el.style.left =
      `${pin.x}px`;

    el.style.top =
      `${pin.y}px`;

    el.textContent =
      "📌";

    canvasInner?.appendChild(
      el
    );
  });
}

function addPin(x, y) {

  pushHistory();

  state.pins.push({

    id: uid("pin"),

    x,
    y
  });

  render();

  status("Pin added");
}

/* ============================================================
   TOOLS
   ============================================================ */

function activateTool(tool) {

  state.tool =
    tool;

  state.connectSource =
    null;

  updateToolButtons();

  status(
    `${tool} tool`
  );
}

function updateToolButtons() {

  document
    .querySelectorAll(
      "[data-tool]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.tool ===
          state.tool
      );
    });
}

/* ============================================================
   TOOLBAR EVENTS
   ============================================================ */

document.addEventListener(
  "click",
  event => {

    const tool =
      event.target.closest(
        "[data-tool]"
      );

    if (tool) {

      activateTool(
        tool.dataset.tool
      );

      return;
    }

    const connector =
      event.target.closest(
        "[data-connector]"
      );

    if (connector) {

      state.connectorType =
        connector.dataset.connector;

      if (
        state.connectorType ===
        "free-form"
      ) {

        activateTool(
          "freeform"
        );

      } else if (
        state.connectorType ===
        "wavy"
      ) {

        activateTool(
          "wavy"
        );

      } else {

        activateTool(
          "connect"
        );
      }

      status(
        `${state.connectorType} connector selected`
      );

      return;
    }

    const style =
      event.target.closest(
        "[data-edge-style]"
      );

    if (style) {

      state.connectorStyle =
        style.dataset.edgeStyle;

      status(
        `${state.connectorStyle} connector style`
      );

      return;
    }
  }
);

/* ============================================================
   CANVAS CLICK
   ============================================================ */

canvas?.addEventListener(
  "pointerdown",
  event => {

    if (
      event.target.closest(
        ".node"
      )
    ) {
      return;
    }

    if (
      event.target.closest(
        ".sticky-note"
      )
    ) {
      return;
    }

    if (
      event.target.closest(
        ".comment-node"
      )
    ) {
      return;
    }

    if (
      event.target.closest(
        ".pin-node"
      )
    ) {
      return;
    }

    const point =
      canvasPoint(event);

    switch (state.tool) {

      case "sticky":

        addStickyNote(
          point.x,
          point.y
        );

        return;

      case "comment":

        addComment(
          point.x,
          point.y
        );

        return;

      case "pin":

        addPin(
          point.x,
          point.y
        );

        return;

      case "freeform":
      case "wavy":

        beginDrawing(event);

        return;

      case "select":

        clearSelection();

        render();

        break;

      case "pan":

        beginPan(event);

        break;
    }
  }
);

/* ============================================================
   PAN
   ============================================================ */

let panState = null;

function beginPan(event) {

  panState = {

    x: event.clientX,

    y: event.clientY,

    scrollLeft:
      canvas.scrollLeft,

    scrollTop:
      canvas.scrollTop
  };

  canvas.style.cursor =
    "grabbing";
}

document.addEventListener(
  "pointermove",
  event => {

    if (!panState) return;

    canvas.scrollLeft =
      panState.scrollLeft -
      (
        event.clientX -
        panState.x
      );

    canvas.scrollTop =
      panState.scrollTop -
      (
        event.clientY -
        panState.y
      );
  }
);

document.addEventListener(
  "pointerup",
  () => {

    if (panState) {

      panState = null;

      canvas.style.cursor =
        "";
    }
  }
);

/* ============================================================
   PALETTE DRAG/DROP
   ============================================================ */

document.addEventListener(
  "dragstart",
  event => {

    const item =
      event.target.closest(
        ".palette-item"
      );

    if (!item) return;

    event.dataTransfer.effectAllowed =
      "copy";

    event.dataTransfer.setData(
      "application/x-component",
      item.dataset.type
    );
  }
);

canvas?.addEventListener(
  "dragover",
  event => {

    event.preventDefault();

    canvas.classList.add(
      "drop-target"
    );
  }
);

canvas?.addEventListener(
  "dragleave",
  () => {

    canvas.classList.remove(
      "drop-target"
    );
  }
);

canvas?.addEventListener(
  "drop",
  event => {

    event.preventDefault();

    canvas.classList.remove(
      "drop-target"
    );

    const type =
      event.dataTransfer.getData(
        "application/x-component"
      );

    if (type) {

      const point =
        canvasPoint(event);

      addNode(
        type,
        point.x,
        point.y
      );

      return;
    }

    const files =
      [...event.dataTransfer.files];

    const image =
      files.find(
        file =>
          file.type.startsWith(
            "image/"
          )
      );

    if (image) {

      const point =
        canvasPoint(event);

      addImage(
        image,
        point.x,
        point.y
      );
    }
  }
);

/* ============================================================
   CLICK PALETTE
   ============================================================ */

document.addEventListener(
  "click",
  event => {

    const item =
      event.target.closest(
        ".palette-item"
      );

    if (!item) return;

    if (
      state.tool !== "select"
    ) {
      activateTool(
        "select"
      );
    }

    const rect =
      canvas.getBoundingClientRect();

    const x =
      (
        canvas.scrollLeft +
        rect.width / 2
      ) / state.zoom;

    const y =
      (
        canvas.scrollTop +
        rect.height / 2
      ) / state.zoom;

    addNode(
      item.dataset.type,
      x - 75,
      y - 38
    );
  }
);

/* ============================================================
   IMAGE INSERT
   ============================================================ */

function openImagePicker() {

  const input =
    document.createElement(
      "input"
    );

  input.type =
    "file";

  input.accept =
    "image/*";

  input.onchange =
    () => {

      const file =
        input.files?.[0];

      if (!file) return;

      const rect =
        canvas.getBoundingClientRect();

      addImage(
        file,
        (
          canvas.scrollLeft +
          rect.width / 2
        ) / state.zoom - 110,
        (
          canvas.scrollTop +
          rect.height / 2
        ) / state.zoom - 75
      );
    };

  input.click();
}

/* ============================================================
   CLIPBOARD IMAGE PASTE
   ============================================================ */

document.addEventListener(
  "paste",
  event => {

    const items =
      [...(
        event.clipboardData?.items ||
        []
      )];

    const imageItem =
      items.find(
        item =>
          item.type.startsWith(
            "image/"
          )
      );

    if (!imageItem) return;

    const file =
      imageItem.getAsFile();

    if (!file) return;

    const rect =
      canvas.getBoundingClientRect();

    addImage(
      file,
      (
        canvas.scrollLeft +
        rect.width / 2
      ) / state.zoom - 110,
      (
        canvas.scrollTop +
        rect.height / 2
      ) / state.zoom - 75
    );

    status(
      "Image pasted from clipboard"
    );
  }
);

/* ============================================================
   KEYBOARD
   ============================================================ */

document.addEventListener(
  "keydown",
  event => {

    const target =
      event.target;

    const editing =
      target.matches(
        "input, textarea, select"
      );

    if (
      editing &&
      event.key !== "Escape"
    ) {
      return;
    }

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "z"
    ) {

      event.preventDefault();

      undo();

      return;
    }

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "y"
    ) {

      event.preventDefault();

      redo();

      return;
    }

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "c"
    ) {

      copySelection();

      return;
    }

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "v"
    ) {

      pasteSelection();

      return;
    }

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "d"
    ) {

      event.preventDefault();

      duplicateSelection();

      return;
    }

    if (
      event.key === "Delete" ||
      event.key === "Backspace"
    ) {

      deleteSelection();

      return;
    }

    if (event.key === "Escape") {

      state.tool =
        "select";

      state.connectSource =
        null;

      state.drawing =
        null;

      removeTemporaryConnection();

      updateToolButtons();

      return;
    }

    switch (
      event.key.toLowerCase()
    ) {

      case "v":
        activateTool("select");
        break;

      case "h":
        activateTool("pan");
        break;

      case "t":
        activateTool("text");
        break;

      case "s":
        activateTool("sticky");
        break;

      case "c":
        activateTool("comment");
        break;

      case "p":
        activateTool("pin");
        break;
    }

    if (
      event.key === "ArrowUp"
    ) {
      moveSelection(
        0,
        event.shiftKey ? -10 : -1
      );
    }

    if (
      event.key === "ArrowDown"
    ) {
      moveSelection(
        0,
        event.shiftKey ? 10 : 1
      );
    }

    if (
      event.key === "ArrowLeft"
    ) {
      moveSelection(
        event.shiftKey ? -10 : -1,
        0
      );
    }

    if (
      event.key === "ArrowRight"
    ) {
      moveSelection(
        event.shiftKey ? 10 : 1,
        0
      );
    }
  }
);

/* ============================================================
   MOVE SELECTION
   ============================================================ */

function moveSelection(dx, dy) {

  const nodes =
    selectedNodes();

  if (!nodes.length) return;

  pushHistory();

  nodes.forEach(node => {

    node.x += dx;
    node.y += dy;
  });

  render();
}

/* ============================================================
   DELETE
   ============================================================ */

function deleteSelection() {

  if (!state.selected.size) {
    return;
  }

  pushHistory();

  state.nodes =
    state.nodes.filter(
      node =>
        !state.selected.has(
          node.id
        )
    );

  state.edges =
    state.edges.filter(
      edge =>
        !state.selected.has(
          edge.id
        ) &&
        !(
          state.selected.has(
            edge.from
          ) ||
          state.selected.has(
            edge.to
          )
        )
    );

  state.selected.clear();

  render();

  status("Deleted");
}

/* ============================================================
   COPY / PASTE
   ============================================================ */

function copySelection() {

  const nodes =
    selectedNodes();

  if (!nodes.length) return;

  state.clipboard =
    JSON.parse(
      JSON.stringify(nodes)
    );

  status(
    `${nodes.length} component(s) copied`
  );
}

function pasteSelection() {

  if (
    !state.clipboard?.length
  ) {
    return;
  }

  pushHistory();

  state.selected.clear();

  state.clipboard.forEach(
    original => {

      const node =
        JSON.parse(
          JSON.stringify(
            original
          )
        );

      node.id =
        uid("node");

      node.x += 30;
      node.y += 30;

      state.nodes.push(node);

      state.selected.add(
        node.id
      );
    }
  );

  render();

  status("Pasted");
}

function duplicateSelection() {

  copySelection();

  pasteSelection();
}

/* ============================================================
   GROUP / UNGROUP
   ============================================================ */

function groupSelection() {

  const nodes =
    selectedNodes();

  if (
    nodes.length < 2
  ) {
    status(
      "Select at least two objects"
    );

    return;
  }

  pushHistory();

  const minX =
    Math.min(
      ...nodes.map(
        n => n.x
      )
    );

  const minY =
    Math.min(
      ...nodes.map(
        n => n.y
      )
    );

  const maxX =
    Math.max(
      ...nodes.map(
        n =>
          n.x + n.width
      )
    );

  const maxY =
    Math.max(
      ...nodes.map(
        n =>
          n.y + n.height
      )
    );

  const group =
    createNode(
      "zone",
      minX - 20,
      minY - 20,
      {
        label: "Group",
        width:
          maxX -
          minX +
          40,
        height:
          maxY -
          minY +
          40
      }
    );

  group.zIndex =
    Math.min(
      ...nodes.map(
        n => n.zIndex
      )
    ) - 1;

  state.nodes.push(
    group
  );

  render();

  status("Grouped");
}

function ungroupSelection() {

  const zones =
    selectedNodes()
      .filter(
        n =>
          n.shape === "zone"
      );

  if (!zones.length) {

    status(
      "Select a group"
    );

    return;
  }

  pushHistory();

  state.nodes =
    state.nodes.filter(
      n =>
        !zones.includes(n)
    );

  state.selected.clear();

  render();

  status("Ungrouped");
}

/* ============================================================
   Z ORDER
   ============================================================ */

function bringForward() {

  const nodes =
    selectedNodes();

  if (!nodes.length) return;

  pushHistory();

  const max =
    Math.max(
      ...state.nodes.map(
        n => n.zIndex
      )
    );

  nodes.forEach(
    (node, index) => {
      node.zIndex =
        max + index + 1;
    }
  );

  render();
}

function sendBackward() {

  const nodes =
    selectedNodes();

  if (!nodes.length) return;

  pushHistory();

  nodes.forEach(
    (node, index) => {
      node.zIndex =
        index;
    }
  );

  render();
}

/* ============================================================
   DOUBLE CLICK EDIT
   ============================================================ */

function editNodeLabel(event) {

  const nodeEl =
    event.currentTarget;

  const node =
    nodeById(
      nodeEl.dataset.id
    );

  if (!node) return;

  const value =
    prompt(
      "Component name:",
      node.label
    );

  if (
    value === null
  ) {
    return;
  }

  pushHistory();

  node.label =
    value.trim() ||
    node.label;

  render();
}

/* ============================================================
   INSPECTOR
   ============================================================ */

function renderInspector() {

  const inspector =
    document.querySelector(
      ".inspector-panel"
    );

  if (!inspector) return;

  const node =
    selectedNodes()[0];

  if (!node) return;

  const name =
    inspector.querySelector(
      "#componentName"
    );

  if (name) {
    name.value =
      node.label || "";
  }

  const environment =
    inspector.querySelector(
      "#componentEnvironment"
    );

  if (environment) {
    environment.value =
      node.environment ||
      "Production";
  }

  const owner =
    inspector.querySelector(
      "#componentOwner"
    );

  if (owner) {
    owner.value =
      node.owner || "";
  }

  const description =
    inspector.querySelector(
      "#componentDescription"
    );

  if (description) {
    description.value =
      node.description || "";
  }
}

/* ============================================================
   INSPECTOR INPUTS
   ============================================================ */

document.addEventListener(
  "input",
  event => {

    const node =
      selectedNodes()[0];

    if (!node) return;

    if (
      event.target.id ===
      "componentName"
    ) {

      node.label =
        event.target.value;

      renderNodes();
    }

    if (
      event.target.id ===
      "componentEnvironment"
    ) {

      node.environment =
        event.target.value;

      renderNodes();
    }

    if (
      event.target.id ===
      "componentOwner"
    ) {

      node.owner =
        event.target.value;

      renderNodes();
    }

    if (
      event.target.id ===
      "componentDescription"
    ) {

      node.description =
        event.target.value;
    }
  }
);

/* ============================================================
   ZOOM
   ============================================================ */

function setZoom(value) {

  state.zoom =
    clamp(
      value,
      0.25,
      2.5
    );

  if (canvasInner) {

    canvasInner.style.transform =
      `scale(${state.zoom})`;

    canvasInner.style.transformOrigin =
      "0 0";
  }

  updateZoom();
}

function updateZoom() {

  const text =
    document.querySelector(
      ".zoom-level"
    );

  if (text) {

    text.textContent =
      `${Math.round(
        state.zoom * 100
      )}%`;
  }
}

/* ============================================================
   ZOOM BUTTONS
   ============================================================ */

document.addEventListener(
  "click",
  event => {

    if (
      event.target.closest(
        "#zoomIn"
      )
    ) {

      setZoom(
        state.zoom + 0.1
      );
    }

    if (
      event.target.closest(
        "#zoomOut"
      )
    ) {

      setZoom(
        state.zoom - 0.1
      );
    }

    if (
      event.target.closest(
        "#zoomReset"
      )
    ) {

      setZoom(1);
    }

    if (
      event.target.closest(
        "#zoomFit"
      )
    ) {

      fitCanvas();
    }
  }
);

/* ============================================================
   FIT
   ============================================================ */

function fitCanvas() {

  if (!state.nodes.length) {

    setZoom(1);

    return;
  }

  const minX =
    Math.min(
      ...state.nodes.map(
        n => n.x
      )
    );

  const minY =
    Math.min(
      ...state.nodes.map(
        n => n.y
      )
    );

  const maxX =
    Math.max(
      ...state.nodes.map(
        n =>
          n.x + n.width
      )
    );

  const maxY =
    Math.max(
      ...state.nodes.map(
        n =>
          n.y + n.height
      )
    );

  const width =
    maxX - minX + 100;

  const height =
    maxY - minY + 100;

  const availableWidth =
    canvas.clientWidth;

  const availableHeight =
    canvas.clientHeight;

  const scale =
    Math.min(
      availableWidth / width,
      availableHeight / height
    );

  setZoom(
    clamp(
      scale,
      0.25,
      1
    )
  );

  canvas.scrollLeft =
    Math.max(
      0,
      minX * state.zoom - 50
    );

  canvas.scrollTop =
    Math.max(
      0,
      minY * state.zoom - 50
    );
}

/* ============================================================
   GRID / SNAP
   ============================================================ */

document.addEventListener(
  "click",
  event => {

    const grid =
      event.target.closest(
        "#gridToggle"
      );

    if (grid) {

      state.grid =
        !state.grid;

      canvas.classList.toggle(
        "grid-disabled",
        !state.grid
      );

      return;
    }

    const snap =
      event.target.closest(
        "#snapToggle"
      );

    if (snap) {

      state.snap =
        !state.snap;

      snap.classList.toggle(
        "active",
        state.snap
      );
    }
  }
);

/* ============================================================
   SAVE LOCAL
   ============================================================ */

function serialize() {

  return JSON.stringify(
    {
      name: state.name,

      version: "2.0",

      nodes:
        state.nodes,

      edges:
        state.edges,

      stickyNotes:
        state.stickyNotes,

      comments:
        state.comments,

      pins:
        state.pins
    },
    null,
    2
  );
}

function saveLocal() {

  localStorage.setItem(
    "cbc-architecture-diagram",
    serialize()
  );

  status(
    "Diagram saved locally"
  );
}

function loadLocal() {

  const data =
    localStorage.getItem(
      "cbc-architecture-diagram"
    );

  if (!data) {

    status(
      "No local diagram found"
    );

    return;
  }

  restoreSnapshot(
    data
  );

  status(
    "Local diagram loaded"
  );
}

/* ============================================================
   .ARCH
   ============================================================ */

function saveArch() {

  const data =
    serialize();

  downloadFile(
    `${state.name || "architecture"}.arch`,
    data,
    "application/json"
  );

  status(
    "Architecture saved"
  );
}

function importFile(
  file,
  callback
) {

  const reader =
    new FileReader();

  reader.onload =
    () => {

      try {

        const parsed =
          JSON.parse(
            reader.result
          );

        callback(parsed);

      } catch {

        alert(
          "Invalid architecture file."
        );
      }
    };

  reader.readAsText(file);
}

function loadArchFile(file) {

  importFile(
    file,
    data => {

      state.name =
        data.name ||
        "Untitled architecture";

      state.nodes =
        data.nodes || [];

      state.edges =
        data.edges || [];

      state.stickyNotes =
        data.stickyNotes || [];

      state.comments =
        data.comments || [];

      state.pins =
        data.pins || [];

      clearSelection();

      render();

      status(
        "Architecture loaded"
      );
    }
  );
}

/* ============================================================
   JSON EXPORT
   ============================================================ */

function exportJSON() {

  downloadFile(
    "architecture.json",
    serialize(),
    "application/json"
  );

  status(
    "JSON exported"
  );
}

/* ============================================================
   SVG EXPORT
   ============================================================ */

function exportSVG() {

  const width =
    3000;

  const height =
    2000;

  let svg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
>

<rect
  width="100%"
  height="100%"
  fill="#eef2f8"
/>
`;

  /* EDGES */

  state.edges.forEach(
    edge => {

      let d = "";

      if (
        edge.freeform
      ) {

        d =
          freePath(
            edge.points
          );

      } else {

        const from =
          nodeById(edge.from);

        const to =
          nodeById(edge.to);

        if (!from || !to)
          return;

        const ports =
          nearestPort(
            from,
            to
          );

        const a =
          portPoint(
            from,
            ports.from
          );

        const b =
          portPoint(
            to,
            ports.to
          );

        if (
          edge.type ===
          "curved"
        ) {

          d =
            curvedPath(
              a,
              b
            );

        } else if (
          edge.type ===
          "elbow"
        ) {

          d =
            elbowPath(
              a,
              b
            );

        } else if (
          edge.type ===
          "wavy"
        ) {

          d =
            wavyPath(
              a,
              b
            );

        } else {

          d =
            straightPath(
              a,
              b
            );
        }
      }

      svg += `
<path
  d="${d}"
  fill="none"
  stroke="#64748b"
  stroke-width="2"
  ${
    edge.style ===
    "dashed"
      ? `stroke-dasharray="8 5"`
      : ""
  }
  ${
    edge.style ===
    "dotted"
      ? `stroke-dasharray="2 5"`
      : ""
  }
/>
`;
    }
  );

  /* NODES */

  state.nodes.forEach(
    node => {

      if (node.image) {

        svg += `
<image
  href="${node.image}"
  x="${node.x}"
  y="${node.y}"
  width="${node.width}"
  height="${node.height}"
  preserveAspectRatio="xMidYMid meet"
/>
`;

        return;
      }

      svg += `
<rect
  x="${node.x}"
  y="${node.y}"
  width="${node.width}"
  height="${node.height}"
  rx="8"
  fill="white"
  stroke="#b9c4d7"
  stroke-width="2"
/>

<text
  x="${node.x + 10}"
  y="${node.y + 28}"
  font-family="Arial"
  font-size="14"
  font-weight="700"
  fill="#172033"
>
${escapeXml(node.label)}
</text>
`;
    }
  );

  svg += `
</svg>
`;

  downloadFile(
    "architecture.svg",
    svg,
    "image/svg+xml"
  );

  status(
    "SVG exported"
  );
}

function escapeXml(value) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&apos;"
    );
}

/* ============================================================
   PNG EXPORT
   ============================================================ */

function exportPNG() {

  const svg =
    document.querySelector(
      "#edges"
    );

  if (!svg) return;

  const clone =
    svg.cloneNode(true);

  clone.setAttribute(
    "xmlns",
    "http://www.w3.org/2000/svg"
  );

  const serializer =
    new XMLSerializer();

  const source =
    serializer.serializeToString(
      clone
    );

  const blob =
    new Blob(
      [source],
      {
        type:
          "image/svg+xml"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const img =
    new Image();

  img.onload =
    () => {

      const canvasOut =
        document.createElement(
          "canvas"
        );

      canvasOut.width =
        3000;

      canvasOut.height =
        2000;

      const ctx =
        canvasOut.getContext(
          "2d"
        );

      ctx.fillStyle =
        "#eef2f8";

      ctx.fillRect(
        0,
        0,
        canvasOut.width,
        canvasOut.height
      );

      ctx.drawImage(
        img,
        0,
        0
      );

      canvasOut.toBlob(
        png => {

          const pngUrl =
            URL.createObjectURL(
              png
            );

          const a =
            document.createElement(
              "a"
            );

          a.href =
            pngUrl;

          a.download =
            "architecture.png";

          a.click();

          URL.revokeObjectURL(
            pngUrl
          );
        },
        "image/png"
      );

      URL.revokeObjectURL(
        url
      );
    };

  img.src =
    url;
}

/* ============================================================
   NEW DIAGRAM
   ============================================================ */

function newDiagram() {

  if (
    state.nodes.length &&
    !confirm(
      "Create a new diagram?"
    )
  ) {
    return;
  }

  state.name =
    "Untitled architecture";

  state.nodes =
    [];

  state.edges =
    [];

  state.stickyNotes =
    [];

  state.comments =
    [];

  state.pins =
    [];

  state.selected.clear();

  state.history.length =
    0;

  state.future.length =
    0;

  render();

  status(
    "New diagram created"
  );
}

/* ============================================================
   AUTO LAYOUT
   ============================================================ */

function autoLayout() {

  if (
    state.nodes.length < 2
  ) {

    status(
      "Add more components first"
    );

    return;
  }

  pushHistory();

  const columns =
    Math.ceil(
      Math.sqrt(
        state.nodes.length
      )
    );

  const gapX = 220;
  const gapY = 140;

  state.nodes.forEach(
    (node, index) => {

      const col =
        index % columns;

      const row =
        Math.floor(
          index / columns
        );

      node.x =
        100 +
        col * gapX;

      node.y =
        100 +
        row * gapY;
    }
  );

  render();

  status(
    "Automatic layout applied"
  );
}

/* ============================================================
   VALIDATION
   ============================================================ */

function validateDiagram() {

  const findings = [];

  state.nodes.forEach(
    node => {

      const incoming =
        state.edges.filter(
          e =>
            e.to === node.id
        ).length;

      const outgoing =
        state.edges.filter(
          e =>
            e.from === node.id
        ).length;

      if (
        incoming === 0 &&
        outgoing === 0
      ) {

        findings.push(
          `${node.label} has no connections`
        );
      }
    }
  );

  if (!findings.length) {

    alert(
      "✓ Architecture validation passed."
    );

  } else {

    alert(
      "Architecture findings:\n\n" +
      findings.join("\n")
    );
  }

  status(
    "Validation complete"
  );
}

/* ============================================================
   IMPACT
   ============================================================ */

function impactAnalysis() {

  const node =
    selectedNodes()[0];

  if (!node) {

    status(
      "Select a component first"
    );

    return;
  }

  const affected =
    new Set();

  function walk(id) {

    state.edges
      .filter(
        edge =>
          edge.from === id
      )
      .forEach(
        edge => {

          if (
            affected.has(
              edge.to
            )
          ) {
            return;
          }

          affected.add(
            edge.to
          );

          walk(
            edge.to
          );
        }
      );
  }

  walk(node.id);

  alert(
    `Impact analysis for "${node.label}"\n\n` +
    `Affected components: ${affected.size}`
  );

  state.selected =
    new Set([
      node.id,
      ...affected
    ]);

  render();
}

/* ============================================================
   BUTTON BINDINGS
   ============================================================ */

function bind(id, fn) {

  const el = $(id);

  if (!el) return;

  el.addEventListener(
    "click",
    fn
  );
}

bind(
  "newDiagram",
  newDiagram
);

bind(
  "saveArch",
  saveArch
);

bind(
  "saveDiagram",
  saveLocal
);

bind(
  "exportJson",
  exportJSON
);

bind(
  "exportSvg",
  exportSVG
);

bind(
  "exportPng",
  exportPNG
);

bind(
  "autoLayout",
  autoLayout
);

bind(
  "validateDiagram",
  validateDiagram
);

bind(
  "impactMode",
  impactAnalysis
);

bind(
  "groupButton",
  groupSelection
);

bind(
  "ungroupButton",
  ungroupSelection
);

bind(
  "copyButton",
  copySelection
);

bind(
  "pasteButton",
  pasteSelection
);

bind(
  "duplicateButton",
  duplicateSelection
);

bind(
  "deleteButton",
  deleteSelection
);

bind(
  "bringForward",
  bringForward
);

bind(
  "sendBackward",
  sendBackward
);

bind(
  "undoButton",
  undo
);

bind(
  "redoButton",
  redo
);

/* ============================================================
   FILE INPUTS
   ============================================================ */

$("loadDiagram")
  ?.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];

      if (file) {

        loadArchFile(file);
      }

      event.target.value =
        "";
    }
  );

$("importJson")
  ?.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];

      if (file) {

        importFile(
          file,
          data => {

            state.name =
              data.name ||
              "Untitled architecture";

            state.nodes =
              data.nodes || [];

            state.edges =
              data.edges || [];

            state.stickyNotes =
              data.stickyNotes || [];

            state.comments =
              data.comments || [];

            state.pins =
              data.pins || [];

            clearSelection();

            render();

            status(
              "JSON imported"
            );
          }
        );
      }

      event.target.value =
        "";
    }
  );

/* ============================================================
   IMAGE BUTTON
   ============================================================ */

bind(
  "insertImage",
  openImagePicker
);

/* ============================================================
   DIAGRAM NAME
   ============================================================ */

$("diagramName")
  ?.addEventListener(
    "input",
    event => {

      state.name =
        event.target.value;
    }
  );

/* ============================================================
   SEARCH
   ============================================================ */

$("librarySearch")
  ?.addEventListener(
    "input",
    event => {

      const query =
        event.target.value
          .toLowerCase()
          .trim();

      document
        .querySelectorAll(
          ".palette-item"
        )
        .forEach(item => {

          const text =
            item.textContent
              .toLowerCase();

          item.style.display =
            !query ||
            text.includes(query)
              ? ""
              : "none";
        });
    }
  );

/* ============================================================
   RIGHT CLICK
   ============================================================ */

canvas?.addEventListener(
  "contextmenu",
  event => {

    event.preventDefault();

    const node =
      event.target.closest(
        ".node"
      );

    if (node) {

      selectOnly(
        node.dataset.id
      );

      deleteSelection();
    }
  }
);

/* ============================================================
   INITIALIZE
   ============================================================ */

function initialize() {

  state.tool =
    "select";

  state.connectorType =
    "straight";

  state.connectorStyle =
    "solid";

  render();

  updateToolButtons();

  status(
    "Architecture Diagram Builder ready"
  );
}

initialize();
