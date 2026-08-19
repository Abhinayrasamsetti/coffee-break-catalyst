/* =========================================================
   ARCHITECTURE DIAGRAM BUILDER
   Expanded Miro / draw.io style editor
   ========================================================= */

'use strict';

/* =========================================================
   COMPONENT LIBRARY
   ========================================================= */

const catalog = [
  /* Cloud */
  ['cloud', '☁️', 'Cloud'],
  ['azure', '🔷', 'Microsoft Azure'],
  ['aws', '🟧', 'AWS'],
  ['gcp', '🔵', 'Google Cloud'],
  ['region', '🌐', 'Cloud Region'],
  ['availability-zone', '▦', 'Availability Zone'],

  /* Compute */
  ['vm', '🖥️', 'Virtual Machine'],
  ['server', '▣', 'Server'],
  ['container', '⬡', 'Container'],
  ['aks', '☸️', 'AKS Cluster'],
  ['kubernetes', '☸', 'Kubernetes'],
  ['docker', '🐳', 'Docker'],
  ['function', 'ƒ', 'Serverless Function'],
  ['app', '▣', 'Application'],
  ['microservice', '◈', 'Microservice'],

  /* Networking */
  ['internet', '◎', 'Internet'],
  ['router', '⇄', 'Router'],
  ['switch', '⇆', 'Network Switch'],
  ['firewall', '🛡️', 'Firewall'],
  ['gateway', '⇥', 'Gateway'],
  ['api', '⇄', 'API Gateway'],
  ['load-balancer', '⚖', 'Load Balancer'],
  ['vpn', '🔒', 'VPN'],
  ['proxy', '↔', 'Proxy'],
  ['dns', 'DNS', 'DNS'],
  ['cdn', '◉', 'CDN'],
  ['network', '▱', 'Network'],

  /* Data */
  ['database', '▤', 'Database'],
  ['sql', '▤', 'SQL Database'],
  ['nosql', '◫', 'NoSQL Database'],
  ['cache', '▥', 'Cache'],
  ['storage', '▱', 'Object Storage'],
  ['queue', '▤', 'Message Queue'],
  ['eventbus', '⚡', 'Event Bus'],
  ['stream', '≋', 'Event Stream'],
  ['backup', '◫', 'Backup'],

  /* Security */
  ['identity', '🔐', 'Identity Provider'],
  ['user', '👤', 'User'],
  ['users', '👥', 'Users'],
  ['key', '🔑', 'Key / Secret'],
  ['certificate', '▣', 'Certificate'],
  ['security', '🛡', 'Security Control'],
  ['siem', '◉', 'SIEM'],
  ['soc', '◉', 'SOC'],
  ['zone', '▧', 'Security Zone'],

  /* Enterprise */
  ['servicenow', '◉', 'ServiceNow'],
  ['monitoring', '◌', 'Monitoring'],
  ['logging', '≡', 'Logging'],
  ['alert', '⚠', 'Alert'],
  ['ticket', '🎫', 'Ticket'],
  ['user-service', '◎', 'User Service'],
  ['sso', '🔐', 'SSO'],

  /* DevOps */
  ['github', '●', 'GitHub'],
  ['git', '◆', 'Git Repository'],
  ['pipeline', '▶', 'CI/CD Pipeline'],
  ['build', '⚙', 'Build'],
  ['deploy', '🚀', 'Deployment'],
  ['artifact', '□', 'Artifact'],
  ['registry', '▣', 'Container Registry'],

  /* AI */
  ['ai', '✦', 'AI Service'],
  ['llm', '✦', 'LLM'],
  ['agent', '✧', 'AI Agent'],
  ['vector', '◈', 'Vector Database'],
  ['rag', '✦', 'RAG System'],

  /* Generic shapes */
  ['rectangle', '□', 'Rectangle'],
  ['rounded', '▢', 'Rounded Rectangle'],
  ['circle', '○', 'Circle'],
  ['diamond', '◇', 'Decision'],
  ['hexagon', '⬡', 'Hexagon'],
  ['document', '▱', 'Document'],
  ['note', '📝', 'Note'],
  ['group', '▧', 'Group']
];

/* =========================================================
   APPLICATION STATE
   ========================================================= */

let model = {
  name: 'Untitled architecture',
  version: '1.0',
  nodes: [],
  edges: [],
  comments: [],
  pins: [],
  stickyNotes: [],
  drawings: []
};

let selectedIds = new Set();

let selectedId = null;

let connectSourceId = null;

let connectMode = false;

let impactMode = false;

let dragState = null;

let resizeState = null;

let drawingState = null;

let selectionState = null;

let clipboardData = null;

let zoom = 1;

let currentEdgeType = 'straight';

let currentArrowStart = false;

let currentArrowEnd = true;

let currentEdgeStyle = 'solid';

let idCounter = 0;

/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = id => document.getElementById(id);

const canvas = $('canvas');

const nodesEl = $('nodes');

const edgesEl = $('edges');

const uid = prefix =>
  `${prefix || 'id'}-${Date.now().toString(36)}-${(++idCounter).toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;

function safeElement(id) {
  return $(id);
}

/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function setStatus(text) {
  const status = $('status');

  if (status) {
    status.textContent = text;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>'"]/g,
    char =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      })[char]
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function catalogItem(type) {
  return catalog.find(item => item[0] === type);
}

function iconFor(type) {
  return catalogItem(type)?.[1] || '◇';
}

function typeName(type) {
  return catalogItem(type)?.[2] || type || 'Component';
}

function nodeById(id) {
  return model.nodes.find(node => node.id === id);
}

function edgeById(id) {
  return model.edges.find(edge => edge.id === id);
}

function emptyVisible() {
  const empty = $('canvasEmpty');

  if (empty) {
    empty.hidden = model.nodes.length > 0;
  }
}

function ensureModel() {
  if (!model || typeof model !== 'object') {
    model = {
      name: 'Untitled architecture',
      version: '1.0',
      nodes: [],
      edges: [],
      comments: [],
      pins: [],
      stickyNotes: [],
      drawings: []
    };
  }

  model.nodes ||= [];
  model.edges ||= [];
  model.comments ||= [];
  model.pins ||= [];
  model.stickyNotes ||= [];
  model.drawings ||= [];
}

/* =========================================================
   NODE CREATION
   ========================================================= */

function createNode(type, x = 100, y = 100, options = {}) {
  const zone = type === 'zone' || type === 'group';

  const node = {
    id: uid('node'),

    type,

    label: options.label || typeName(type),

    x,

    y,

    width:
      options.width ||
      (zone ? 300 : type === 'circle' ? 100 : 150),

    height:
      options.height ||
      (zone ? 190 : type === 'circle' ? 100 : 76),

    environment: options.environment || 'Production',

    owner: options.owner || '',

    description: options.description || '',

    shape:
      options.shape ||
      getShapeForType(type),

    image:
      options.image || null,

    imageName:
      options.imageName || '',

    imageMime:
      options.imageMime || '',

    rotation:
      options.rotation || 0,

    zIndex:
      options.zIndex ?? model.nodes.length,

    locked:
      Boolean(options.locked),

    fill:
      options.fill || '',

    stroke:
      options.stroke || '',

    textColor:
      options.textColor || ''
  };

  model.nodes.push(node);

  return node;
}

function getShapeForType(type) {
  if (
    [
      'circle',
      'user',
      'users',
      'internet'
    ].includes(type)
  ) {
    return 'circle';
  }

  if (
    [
      'diamond'
    ].includes(type)
  ) {
    return 'diamond';
  }

  if (
    [
      'hexagon',
      'kubernetes',
      'aks'
    ].includes(type)
  ) {
    return 'hexagon';
  }

  if (
    [
      'document'
    ].includes(type)
  ) {
    return 'document';
  }

  return 'rounded';
}

function addNode(type, x = 100, y = 100, options = {}) {
  const node = createNode(type, x, y, options);

  clearSelection();

  selectSingle(node.id);

  render();

  return node;
}

/* =========================================================
   NODE HTML
   ========================================================= */

function nodeShapeClass(node) {
  return `shape-${node.shape || 'rounded'}`;
}

function nodeInnerHtml(node) {
  const image = node.image;

  if (image) {
    return `
      <div class="image-content">
        <img
          src="${escapeHtml(image)}"
          alt="${escapeHtml(node.label)}"
          draggable="false"
        />
        <span class="node-title image-title">
          ${escapeHtml(node.label)}
        </span>
      </div>
    `;
  }

  return `
    <span class="node-icon">${iconFor(node.type)}</span>
    <span class="node-type">${escapeHtml(typeName(node.type))}</span>
    <span class="node-title">${escapeHtml(node.label)}</span>
    ${
      node.environment || node.owner
        ? `<span class="node-meta">
            ${escapeHtml(node.environment || '')}
            ${
              node.owner
                ? ` · ${escapeHtml(node.owner)}`
                : ''
            }
          </span>`
        : ''
    }
  `;
}

/* =========================================================
   CONNECTION PORTS
   ========================================================= */

function connectionPortsHtml(node) {
  return `
    <span
      class="connection-port top"
      data-port="top"
      data-node-id="${node.id}"
    ></span>

    <span
      class="connection-port right"
      data-port="right"
      data-node-id="${node.id}"
    ></span>

    <span
      class="connection-port bottom"
      data-port="bottom"
      data-node-id="${node.id}"
    ></span>

    <span
      class="connection-port left"
      data-port="left"
      data-node-id="${node.id}"
    ></span>
  `;
}

function resizeHandlesHtml() {
  return `
    <span class="resize-handle nw" data-resize="nw"></span>
    <span class="resize-handle ne" data-resize="ne"></span>
    <span class="resize-handle sw" data-resize="sw"></span>
    <span class="resize-handle se" data-resize="se"></span>
  `;
}

/* =========================================================
   RENDER
   ========================================================= */

function render() {
  ensureModel();

  const nameInput = $('diagramName');

  if (nameInput) {
    nameInput.value = model.name;
  }

  if (!nodesEl) {
    return;
  }

  nodesEl.innerHTML = '';

  const sortedNodes = [...model.nodes].sort(
    (a, b) =>
      (a.zIndex ?? 0) -
      (b.zIndex ?? 0)
  );

  sortedNodes.forEach(node => {
    const element = document.createElement('article');

    const selected =
      selectedIds.has(node.id);

    const isImage =
      Boolean(node.image);

    element.className =
      `node ${nodeShapeClass(node)} ` +
      `${node.type === 'zone' ? 'zone' : ''} ` +
      `${isImage ? 'image-node' : ''} ` +
      `${selected ? 'selected' : ''} ` +
      `${impactMode && selectedId && downstream(selectedId).has(node.id) ? 'impact' : ''}`;

    element.dataset.id = node.id;

    element.style.left = `${node.x}px`;

    element.style.top = `${node.y}px`;

    element.style.width = `${node.width}px`;

    element.style.height = `${node.height}px`;

    element.style.transform =
      `rotate(${node.rotation || 0}deg)`;

    if (node.fill) {
      element.style.background = node.fill;
    }

    if (node.stroke) {
      element.style.borderColor = node.stroke;
    }

    element.innerHTML =
      nodeInnerHtml(node) +
      connectionPortsHtml(node) +
      resizeHandlesHtml();

    element.addEventListener(
      'pointerdown',
      startNodePointer
    );

    element.addEventListener(
      'click',
      selectNode
    );

    element.addEventListener(
      'dblclick',
      editNodeLabel
    );

    nodesEl.appendChild(element);
  });

  renderEdges();

  renderStickyNotes();

  renderComments();

  renderPins();

  renderInspector();

  emptyVisible();

  updateZoomDisplay();
}

/* =========================================================
   EDGES
   ========================================================= */

function renderEdges() {
  if (!edgesEl || !canvas) {
    return;
  }

  const width =
    Math.max(
      canvas.clientWidth,
      3000
    );

  const height =
    Math.max(
      canvas.clientHeight,
      2000
    );

  edgesEl.setAttribute(
    'viewBox',
    `0 0 ${width} ${height}`
  );

  const defs = `
    <defs>

      <marker
        id="arrow-end"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path
          d="M 0 0 L 10 5 L 0 10 z"
          fill="currentColor"
        />
      </marker>

      <marker
        id="arrow-start"
        viewBox="0 0 10 10"
        refX="1"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
      >
        <path
          d="M 10 0 L 0 5 L 10 10 z"
          fill="currentColor"
        />
      </marker>

    </defs>
  `;

  const impacted =
    impactMode && selectedId
      ? downstream(selectedId)
      : new Set();

  const svg = model.edges
    .map(edge => {
      const from =
        nodeById(edge.from);

      const to =
        nodeById(edge.to);

      if (!from || !to) {
        return '';
      }

      const points =
        calculateConnectionPoints(
          from,
          to,
          edge.fromPort,
          edge.toPort
        );

      const selected =
        selectedIds.has(
          `edge:${edge.id}`
        );

      const active =
        impacted.has(to.id) ||
        edge.from === selectedId;

      const path =
        buildEdgePath(
          points.x1,
          points.y1,
          points.x2,
          points.y2,
          edge.type || 'straight'
        );

      const markerStart =
        edge.arrowStart
          ? 'url(#arrow-start)'
          : 'none';

      const markerEnd =
        edge.arrowEnd !== false
          ? 'url(#arrow-end)'
          : 'none';

      const classes = [
        'edge',
        edge.type || 'straight',
        edge.style || 'solid',
        selected ? 'selected' : '',
        active ? 'highlight' : ''
      ]
        .filter(Boolean)
        .join(' ');

      const label =
        edge.label
          ? `
            <text
              class="edge-label ${selected ? 'selected' : ''}"
              x="${(points.x1 + points.x2) / 2}"
              y="${(points.y1 + points.y2) / 2 - 7}"
            >
              ${escapeHtml(edge.label)}
            </text>
          `
          : '';

      return `
        <path
          class="${classes}"
          data-edge-id="${edge.id}"
          d="${path}"
          marker-start="${markerStart}"
          marker-end="${markerEnd}"
          style="color:${edge.color || '#64748b'}"
        />

        ${label}
      `;
    })
    .join('');

  edgesEl.innerHTML =
    defs + svg;

  edgesEl
    .querySelectorAll('.edge')
    .forEach(edgeElement => {
      edgeElement.addEventListener(
        'click',
        event => {
          event.stopPropagation();

          const id =
            edgeElement.dataset.edgeId;

          clearSelection();

          selectedIds.add(
            `edge:${id}`
          );

          renderInspector();
        }
      );
    });
}

/* =========================================================
   CONNECTION GEOMETRY
   ========================================================= */

function calculateConnectionPoints(
  from,
  to,
  fromPort,
  toPort
) {
  const centerFrom = {
    x: from.x + from.width / 2,
    y: from.y + from.height / 2
  };

  const centerTo = {
    x: to.x + to.width / 2,
    y: to.y + to.height / 2
  };

  const startPort =
    fromPort ||
    chooseBestPort(
      from,
      centerTo
    );

  const endPort =
    toPort ||
    chooseBestPort(
      to,
      centerFrom
    );

  return {
    x1: portPoint(
      from,
      startPort
    ).x,

    y1: portPoint(
      from,
      startPort
    ).y,

    x2: portPoint(
      to,
      endPort
    ).x,

    y2: portPoint(
      to,
      endPort
    ).y
  };
}

function chooseBestPort(
  node,
  target
) {
  const centerX =
    node.x + node.width / 2;

  const centerY =
    node.y + node.height / 2;

  const dx =
    target.x - centerX;

  const dy =
    target.y - centerY;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0
      ? 'right'
      : 'left';
  }

  return dy >= 0
    ? 'bottom'
    : 'top';
}

function portPoint(node, port) {
  switch (port) {
    case 'top':
      return {
        x: node.x + node.width / 2,
        y: node.y
      };

    case 'right':
      return {
        x: node.x + node.width,
        y: node.y + node.height / 2
      };

    case 'bottom':
      return {
        x: node.x + node.width / 2,
        y: node.y + node.height
      };

    case 'left':
      return {
        x: node.x,
        y: node.y + node.height / 2
      };

    default:
      return {
        x: node.x + node.width,
        y: node.y + node.height / 2
      };
  }
}

/* =========================================================
   EDGE PATHS
   ========================================================= */

function buildEdgePath(
  x1,
  y1,
  x2,
  y2,
  type
) {
  switch (type) {
    case 'curved':
      return buildCurvedPath(
        x1,
        y1,
        x2,
        y2
      );

    case 'bezier':
      return buildBezierPath(
        x1,
        y1,
        x2,
        y2
      );

    case 'wavy':
      return buildWavyPath(
        x1,
        y1,
        x2,
        y2
      );

    case 'orthogonal':
      return buildOrthogonalPath(
        x1,
        y1,
        x2,
        y2
      );

    default:
      return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
}

function buildCurvedPath(
  x1,
  y1,
  x2,
  y2
) {
  const dx =
    Math.max(
      50,
      Math.abs(x2 - x1) * 0.45
    );

  return `
    M ${x1} ${y1}
    C ${x1 + dx} ${y1},
      ${x2 - dx} ${y2},
      ${x2} ${y2}
  `;
}

function buildBezierPath(
  x1,
  y1,
  x2,
  y2
) {
  const dx =
    (x2 - x1) * 0.35;

  const dy =
    (y2 - y1) * 0.25;

  return `
    M ${x1} ${y1}
    C ${x1 + dx} ${y1 + dy},
      ${x2 - dx} ${y2 - dy},
      ${x2} ${y2}
  `;
}

function buildOrthogonalPath(
  x1,
  y1,
  x2,
  y2
) {
  const midX =
    (x1 + x2) / 2;

  return `
    M ${x1} ${y1}
    L ${midX} ${y1}
    L ${midX} ${y2}
    L ${x2} ${y2}
  `;
}

function buildWavyPath(
  x1,
  y1,
  x2,
  y2
) {
  const dx =
    x2 - x1;

  const dy =
    y2 - y1;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );

  const segments =
    Math.max(
      4,
      Math.floor(distance / 45)
    );

  const amplitude =
    Math.min(
      18,
      Math.max(
        8,
        distance / 30
      )
    );

  let path =
    `M ${x1} ${y1}`;

  for (
    let i = 1;
    i <= segments;
    i++
  ) {
    const t =
      i / segments;

    const px =
      x1 + dx * t;

    const py =
      y1 + dy * t;

    const previousT =
      (i - 1) / segments;

    const previousX =
      x1 + dx * previousT;

    const previousY =
      y1 + dy * previousT;

    const nx =
      -dy / distance;

    const ny =
      dx / distance;

    const sign =
      i % 2 === 0
        ? 1
        : -1;

    const cx =
      (previousX + px) / 2 +
      nx * amplitude * sign;

    const cy =
      (previousY + py) / 2 +
      ny * amplitude * sign;

    path += `
      Q ${cx} ${cy}
        ${px} ${py}
    `;
  }

  return path;
}

/* =========================================================
   NODE POINTER / DRAGGING
   ========================================================= */

function startNodePointer(event) {
  if (event.button !== 0) {
    return;
  }

  const element =
    event.currentTarget;

  const node =
    nodeById(
      element.dataset.id
    );

  if (!node || node.locked) {
    return;
  }

  if (
    event.target.closest(
      '.connection-port'
    )
  ) {
    return;
  }

  if (
    event.target.closest(
      '.resize-handle'
    )
  ) {
    startResize(
      event,
      node
    );

    return;
  }

  const multi =
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey;

  if (!selectedIds.has(node.id)) {
    if (multi) {
      selectedIds.add(node.id);
    } else {
      clearSelection();
      selectedIds.add(node.id);
    }

    selectedId =
      node.id;
  }

  renderInspector();

  const rect =
    canvas.getBoundingClientRect();

  const pointer =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  dragState = {
    ids: [...selectedIds].filter(
      id => !id.startsWith('edge:')
    ),

    startPointer: pointer,

    original: new Map(
      [...selectedIds]
        .filter(
          id => !id.startsWith('edge:')
        )
        .map(id => {
          const item =
            nodeById(id);

          return [
            id,
            {
              x: item.x,
              y: item.y
            }
          ];
        })
    )
  };

  element.setPointerCapture?.(
    event.pointerId
  );

  event.stopPropagation();
}

window.addEventListener(
  'pointermove',
  event => {
    if (dragState) {
      dragSelectedNodes(event);
    }

    if (resizeState) {
      resizeSelectedNode(event);
    }

    if (drawingState) {
      continueDrawing(event);
    }

    if (selectionState) {
      continueSelection(event);
    }
  }
);

window.addEventListener(
  'pointerup',
  event => {
    if (dragState) {
      dragState = null;

      render();
    }

    if (resizeState) {
      resizeState = null;

      render();
    }

    if (drawingState) {
      finishDrawing(event);
    }

    if (selectionState) {
      finishSelection(event);
    }
  }
);

function dragSelectedNodes(event) {
  const pointer =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  const dx =
    pointer.x -
    dragState.startPointer.x;

  const dy =
    pointer.y -
    dragState.startPointer.y;

  dragState.ids.forEach(id => {
    const node =
      nodeById(id);

    const original =
      dragState.original.get(id);

    if (!node || !original) {
      return;
    }

    node.x =
      Math.max(
        0,
        original.x + dx
      );

    node.y =
      Math.max(
        0,
        original.y + dy
      );
  });

  render();
}

/* =========================================================
   RESIZING
   ========================================================= */

function startResize(event, node) {
  event.stopPropagation();

  const handle =
    event.target.dataset.resize;

  resizeState = {
    id: node.id,

    handle,

    startPointer:
      canvasPoint(
        event.clientX,
        event.clientY
      ),

    original: {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height
    }
  };
}

function resizeSelectedNode(event) {
  const node =
    nodeById(
      resizeState.id
    );

  if (!node) {
    return;
  }

  const pointer =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  const dx =
    pointer.x -
    resizeState.startPointer.x;

  const dy =
    pointer.y -
    resizeState.startPointer.y;

  const original =
    resizeState.original;

  const minWidth = 45;

  const minHeight = 35;

  switch (
    resizeState.handle
  ) {
    case 'se':
      node.width =
        Math.max(
          minWidth,
          original.width + dx
        );

      node.height =
        Math.max(
          minHeight,
          original.height + dy
        );

      break;

    case 'sw':
      node.width =
        Math.max(
          minWidth,
          original.width - dx
        );

      node.height =
        Math.max(
          minHeight,
          original.height + dy
        );

      node.x =
        original.x +
        dx;

      break;

    case 'ne':
      node.width =
        Math.max(
          minWidth,
          original.width + dx
        );

      node.height =
        Math.max(
          minHeight,
          original.height - dy
        );

      node.y =
        original.y +
        dy;

      break;

    case 'nw':
      node.width =
        Math.max(
          minWidth,
          original.width - dx
        );

      node.height =
        Math.max(
          minHeight,
          original.height - dy
        );

      node.x =
        original.x +
        dx;

      node.y =
        original.y +
        dy;

      break;
  }

  render();
}

/* =========================================================
   NODE SELECTION
   ========================================================= */

function selectNode(event) {
  event.stopPropagation();

  const id =
    event.currentTarget.dataset.id;

  const multi =
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey;

  if (connectMode) {
    handleConnectSelection(id);

    return;
  }

  if (multi) {
    if (selectedIds.has(id)) {
      selectedIds.delete(id);
    } else {
      selectedIds.add(id);
    }

    selectedId = id;
  } else {
    clearSelection();

    selectedIds.add(id);

    selectedId = id;
  }

  render();

  if (impactMode) {
    showImpact(id);
  }
}

function selectSingle(id) {
  clearSelection();

  selectedIds.add(id);

  selectedId = id;
}

function clearSelection() {
  selectedIds.clear();

  selectedId = null;
}

function selectAll() {
  selectedIds = new Set(
    model.nodes.map(
      node => node.id
    )
  );

  selectedId =
    model.nodes[0]?.id ||
    null;

  render();

  setStatus(
    `${selectedIds.size} item(s) selected.`
  );
}

/* =========================================================
   CONNECT MODE
   ========================================================= */

function handleConnectSelection(id) {
  if (!connectSourceId) {
    connectSourceId = id;

    selectedId = id;

    selectSingle(id);

    setStatus(
      'Now select the destination component.'
    );

    render();

    return;
  }

  if (
    connectSourceId === id
  ) {
    return;
  }

  const source =
    nodeById(
      connectSourceId
    );

  const target =
    nodeById(id);

  if (!source || !target) {
    return;
  }

  const label =
    safeElement(
      'edgeLabel'
    )?.value.trim() ||
    '';

  const edge = {
    id: uid('edge'),

    from: source.id,

    to: target.id,

    label,

    type: currentEdgeType,

    style: currentEdgeStyle,

    arrowStart:
      currentArrowStart,

    arrowEnd:
      currentArrowEnd,

    fromPort:
      chooseBestPort(
        source,
        {
          x:
            target.x +
            target.width / 2,

          y:
            target.y +
            target.height / 2
        }
      ),

    toPort:
      chooseBestPort(
        target,
        {
          x:
            source.x +
            source.width / 2,

          y:
            source.y +
            source.height / 2
        }
      )
  };

  const exists =
    model.edges.some(
      e =>
        e.from === edge.from &&
        e.to === edge.to
    );

  if (!exists) {
    model.edges.push(edge);

    setStatus(
      'Connection created.'
    );
  } else {
    setStatus(
      'That connection already exists.'
    );
  }

  connectSourceId = null;

  render();
}

/* =========================================================
   IMPACT ANALYSIS
   ========================================================= */

function downstream(start) {
  const found =
    new Set();

  const queue = [start];

  while (queue.length) {
    const source =
      queue.shift();

    model.edges
      .filter(
        edge =>
          edge.from === source
      )
      .forEach(edge => {
        if (!found.has(edge.to)) {
          found.add(edge.to);

          queue.push(edge.to);
        }
      });
  }

  return found;
}

function showImpact(id) {
  const container =
    $('impactResults');

  if (!container) {
    return;
  }

  const impacts =
    [...downstream(id)]
      .map(nodeById)
      .filter(Boolean);

  container.innerHTML =
    impacts.length
      ? impacts
          .map(
            node =>
              `<div class="finding">
                <strong>
                  ${escapeHtml(node.label)}
                </strong>
                <br>
                ${escapeHtml(
                  typeName(node.type)
                )}
                is downstream.
              </div>`
          )
          .join('')
      : `
        <div class="finding ok">
          No downstream dependencies are mapped.
        </div>
      `;
}

/* =========================================================
   INSPECTOR
   ========================================================= */

function renderInspector() {
  const node =
    nodeById(
      selectedId
    );

  const inspector =
    $('inspector');

  const empty =
    $('inspectorEmpty');

  if (!inspector || !empty) {
    return;
  }

  inspector.hidden =
    !node;

  empty.hidden =
    Boolean(node);

  if (!node) {
    return;
  }

  const fields = {
    nodeLabel: node.label,
    nodeEnvironment:
      node.environment,
    nodeOwner:
      node.owner,
    nodeDescription:
      node.description
  };

  Object.entries(fields)
    .forEach(
      ([id, value]) => {
        const element =
          $(id);

        if (element) {
          element.value =
            value || '';
        }
      }
    );

  const type =
    $('nodeType');

  if (type) {
    type.value =
      typeName(node.type);
  }

  if (impactMode) {
    showImpact(node.id);
  }
}

/* =========================================================
   INSPECTOR UPDATE
   ========================================================= */

function updateSelected() {
  const node =
    nodeById(
      selectedId
    );

  if (!node) {
    return;
  }

  node.label =
    $('nodeLabel')?.value ||
    node.label;

  node.environment =
    $('nodeEnvironment')?.value ||
    node.environment;

  node.owner =
    $('nodeOwner')?.value ||
    '';

  node.description =
    $('nodeDescription')?.value ||
    '';

  render();
}

[
  'nodeLabel',
  'nodeEnvironment',
  'nodeOwner',
  'nodeDescription'
].forEach(id => {
  const element =
    $(id);

  if (element) {
    element.addEventListener(
      'input',
      updateSelected
    );
  }
});

/* =========================================================
   DOUBLE CLICK LABEL EDIT
   ========================================================= */

function editNodeLabel(event) {
  event.stopPropagation();

  const node =
    nodeById(
      event.currentTarget.dataset.id
    );

  if (!node) {
    return;
  }

  const label =
    prompt(
      'Component name:',
      node.label
    );

  if (
    label !== null &&
    label.trim()
  ) {
    node.label =
      label.trim();

    render();

    setStatus(
      'Component renamed.'
    );
  }
}

/* =========================================================
   VALIDATION
   ========================================================= */

function validate() {
  const findings = [];

  const connected =
    (
      id,
      type
    ) =>
      model.edges.some(
        edge =>
          edge.from === id &&
          nodeById(edge.to)
            ?.type === type
      ) ||
      model.edges.some(
        edge =>
          edge.to === id &&
          nodeById(edge.from)
            ?.type === type
      );

  model.nodes.forEach(node => {
    if (
      [
        'app',
        'api',
        'vm',
        'aks',
        'microservice',
        'container'
      ].includes(node.type) &&
      !connected(
        node.id,
        'monitoring'
      )
    ) {
      findings.push({
        level: 'warning',

        text:
          `${node.label}: no monitoring component is connected.`
      });
    }

    if (
      [
        'database',
        'sql',
        'nosql'
      ].includes(node.type) &&
      !model.edges.some(
        edge =>
          edge.from === node.id &&
          [
            'storage',
            'backup',
            'cloud'
          ].includes(
            nodeById(
              edge.to
            )?.type
          )
      )
    ) {
      findings.push({
        level: 'warning',

        text:
          `${node.label}: no backup/storage dependency is mapped.`
      });
    }

    if (
      [
        'app',
        'api',
        'vm'
      ].includes(node.type) &&
      node.environment ===
        'External' &&
      !connected(
        node.id,
        'identity'
      )
    ) {
      findings.push({
        level: 'critical',

        text:
          `${node.label}: external-facing workload has no identity/security boundary mapped.`
      });
    }
  });

  const container =
    $('validationResults');

  if (container) {
    container.innerHTML =
      findings.length
        ? findings
            .map(
              finding =>
                `<div class="finding ${finding.level}">
                  ${escapeHtml(
                    finding.text
                  )}
                </div>`
            )
            .join('')
        : `
          <div class="finding ok">
            No checks failed. Review the diagram manually before implementation.
          </div>
        `;
  }

  setStatus(
    `Validation complete: ${findings.length} potential gap(s).`
  );
}

/* =========================================================
   AUTO LAYOUT
   ========================================================= */

function autoLayout() {
  const regular =
    model.nodes.filter(
      node =>
        node.type !== 'zone'
    );

  const columns = 4;

  regular.forEach(
    (node, index) => {
      node.x =
        50 +
        (index % columns) *
          210;

      node.y =
        70 +
        Math.floor(
          index / columns
        ) *
          145;
    }
  );

  render();

  setStatus(
    'Components arranged in a simple grid.'
  );
}

/* =========================================================
   TEMPLATES
   ========================================================= */

function template(name) {
  model = {
    name:
      name === 'aiops'
        ? 'AIOps Control Center'
        : name === 'aks'
          ? 'AKS Application Platform'
          : 'Azure Landing Zone',

    version: '1.0',

    nodes: [],

    edges: [],

    comments: [],

    pins: [],

    stickyNotes: [],

    drawings: []
  };

  const add = (
    type,
    x,
    y,
    label,
    environment = 'Production'
  ) =>
    createNode(
      type,
      x,
      y,
      {
        label,
        environment
      }
    );

  if (name === 'aiops') {
    const internet =
      add(
        'internet',
        35,
        220,
        'Monitoring sources',
        'External'
      );

    const monitor =
      add(
        'monitoring',
        220,
        110,
        'Azure Monitor'
      );

    const serviceNow =
      add(
        'servicenow',
        220,
        330,
        'ServiceNow ITSM'
      );

    const app =
      add(
        'app',
        450,
        215,
        'AIOps Control Center'
      );

    const database =
      add(
        'database',
        670,
        120,
        'Incident store'
      );

    const aks =
      add(
        'aks',
        670,
        330,
        'AKS agents'
      );

    const zone =
      add(
        'zone',
        400,
        55,
        'Azure production zone'
      );

    addEdges([
      [
        internet,
        monitor,
        'Alerts'
      ],
      [
        internet,
        serviceNow,
        'Incidents'
      ],
      [
        monitor,
        app,
        'Events'
      ],
      [
        serviceNow,
        app,
        'REST / OAuth 2.0'
      ],
      [
        app,
        database,
        'Store'
      ],
      [
        app,
        aks,
        'Runbooks'
      ]
    ]);
  }

  else if (name === 'aks') {
    const users =
      add(
        'internet',
        25,
        215,
        'Users',
        'External'
      );

    const gateway =
      add(
        'api',
        210,
        210,
        'Application Gateway'
      );

    const aks =
      add(
        'aks',
        425,
        210,
        'AKS cluster'
      );

    const app =
      add(
        'app',
        635,
        130,
        'Orders API'
      );

    const database =
      add(
        'database',
        635,
        320,
        'PostgreSQL'
      );

    const monitor =
      add(
        'monitoring',
        425,
        420,
        'Azure Monitor'
      );

    add(
      'zone',
      370,
      55,
      'Azure workload zone'
    );

    addEdges([
      [
        users,
        gateway,
        'HTTPS'
      ],
      [
        gateway,
        aks,
        'Ingress'
      ],
      [
        aks,
        app,
        'Service'
      ],
      [
        app,
        database,
        'TLS'
      ],
      [
        aks,
        monitor,
        'Metrics'
      ],
      [
        database,
        monitor,
        'Backup status'
      ]
    ]);
  }

  else {
    const identity =
      add(
        'identity',
        45,
        100,
        'Microsoft Entra ID'
      );

    const firewall =
      add(
        'firewall',
        260,
        100,
        'Azure Firewall'
      );

    const app =
      add(
        'app',
        490,
        100,
        'Shared services'
      );

    const storage =
      add(
        'storage',
        710,
        100,
        'Storage account'
      );

    const monitor =
      add(
        'monitoring',
        490,
        320,
        'Log Analytics'
      );

    add(
      'zone',
      220,
      40,
      'Hub network'
    );

    addEdges([
      [
        identity,
        app,
        'OAuth'
      ],
      [
        firewall,
        app,
        'Inspect'
      ],
      [
        app,
        storage,
        'Private endpoint'
      ],
      [
        app,
        monitor,
        'Logs'
      ]
    ]);
  }

  clearSelection();

  render();

  setStatus(
    `${model.name} template loaded.`
  );
}

function addEdges(list) {
  list.forEach(
    ([from, to, label]) => {
      model.edges.push({
        id: uid('edge'),

        from: from.id,

        to: to.id,

        label,

        type: 'straight',

        style: 'solid',

        arrowStart: false,

        arrowEnd: true
      });
    }
  );
}

/* =========================================================
   NEW DIAGRAM
   ========================================================= */

function newDiagram() {
  if (
    !confirm(
      'Start a new blank diagram?'
    )
  ) {
    return;
  }

  model = {
    name:
      'Untitled architecture',

    version: '1.0',

    nodes: [],

    edges: [],

    comments: [],

    pins: [],

    stickyNotes: [],

    drawings: []
  };

  clearSelection();

  render();

  setStatus(
    'New blank diagram created.'
  );
}

/* =========================================================
   SERIALIZATION
   ========================================================= */

function exportData() {
  ensureModel();

  return JSON.stringify(
    {
      ...model,

      metadata: {
        application:
          'Architecture Diagram Builder',

        version: '1.0',

        exportedAt:
          new Date().toISOString()
      }
    },
    null,
    2
  );
}

/* =========================================================
   DOWNLOAD
   ========================================================= */

function download(
  blob,
  filename
) {
  const url =
    URL.createObjectURL(
      blob
    );

  const anchor =
    document.createElement(
      'a'
    );

  anchor.href = url;

  anchor.download =
    filename;

  document.body.appendChild(
    anchor
  );

  anchor.click();

  anchor.remove();

  setTimeout(
    () =>
      URL.revokeObjectURL(
        url
      ),
    1000
  );
}

/* =========================================================
   .ARCH FILE
   ========================================================= */

function saveArchFile() {
  const blob =
    new Blob(
      [
        exportData()
      ],
      {
        type:
          'application/x-architecture'
      }
    );

  const filename =
    `${sanitizeFilename(
      model.name ||
        'architecture'
    )}.arch`;

  download(
    blob,
    filename
  );

  setStatus(
    `${filename} saved.`
  );
}

function sanitizeFilename(name) {
  return String(name)
    .trim()
    .replace(
      /[<>:"/\\|?*]+/g,
      '-'
    )
    .replace(
      /\s+/g,
      '-'
    )
    .slice(
      0,
      100
    ) ||
    'architecture';
}

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveLocally() {
  try {
    localStorage.setItem(
      'coffee-break-architecture',
      exportData()
    );

    setStatus(
      'Diagram saved in this browser.'
    );
  } catch (error) {
    setStatus(
      `Local save failed: ${error.message}`
    );
  }
}

function loadLocally() {
  const saved =
    localStorage.getItem(
      'coffee-break-architecture'
    );

  if (!saved) {
    setStatus(
      'No locally saved diagram found.'
    );

    return;
  }

  try {
    model =
      JSON.parse(saved);

    ensureModel();

    clearSelection();

    render();

    setStatus(
      'Local diagram loaded.'
    );
  } catch (error) {
    setStatus(
      `Load failed: ${error.message}`
    );
  }
}

/* =========================================================
   IMPORT .ARCH / JSON
   ========================================================= */

async function importDiagramFile(
  file
) {
  if (!file) {
    return;
  }

  try {
    const text =
      await file.text();

    const parsed =
      JSON.parse(text);

    if (
      !Array.isArray(
        parsed.nodes
      ) ||
      !Array.isArray(
        parsed.edges
      )
    ) {
      throw new Error(
        'Invalid architecture file.'
      );
    }

    model = {
      name:
        parsed.name ||
        'Imported architecture',

      version:
        parsed.version ||
        '1.0',

      nodes:
        parsed.nodes || [],

      edges:
        parsed.edges || [],

      comments:
        parsed.comments || [],

      pins:
        parsed.pins || [],

      stickyNotes:
        parsed.stickyNotes || [],

      drawings:
        parsed.drawings || []
    };

    ensureModel();

    clearSelection();

    render();

    setStatus(
      'Architecture file imported successfully.'
    );
  } catch (error) {
    setStatus(
      `Import failed: ${error.message}`
    );
  }
}

/* =========================================================
   IMAGE HANDLING
   ========================================================= */

function fileToDataUrl(file) {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload =
        () =>
          resolve(
            reader.result
          );

      reader.onerror =
        reject;

      reader.readAsDataURL(
        file
      );
    }
  );
}

async function insertImageFile(
  file,
  x,
  y
) {
  if (
    !file ||
    !file.type.startsWith(
      'image/'
    )
  ) {
    return;
  }

  try {
    const dataUrl =
      await fileToDataUrl(
        file
      );

    const image =
      new Image();

    image.onload = () => {
      const maxWidth = 300;

      const scale =
        image.width >
        maxWidth
          ? maxWidth /
            image.width
          : 1;

      const width =
        Math.max(
          50,
          image.width * scale
        );

      const height =
        Math.max(
          50,
          image.height * scale
        );

      const node =
        createNode(
          'image',
          x,
          y,
          {
            label:
              file.name ||
              'Image',

            width,

            height,

            image:
              dataUrl,

            imageName:
              file.name,

            imageMime:
              file.type,

            shape:
              'rounded'
          }
        );

      clearSelection();

      selectSingle(
        node.id
      );

      render();

      setStatus(
        `${file.name || 'Image'} inserted as a connectable node.`
      );
    };

    image.src =
      dataUrl;
  } catch (error) {
    setStatus(
      `Image import failed: ${error.message}`
    );
  }
}

/* =========================================================
   CLIPBOARD IMAGE PASTE
   ========================================================= */

async function handleClipboardPaste(
  event
) {
  const items =
    event.clipboardData?.items;

  if (!items) {
    return;
  }

  for (
    const item of items
  ) {
    if (
      item.type.startsWith(
        'image/'
      )
    ) {
      event.preventDefault();

      const file =
        item.getAsFile();

      if (!file) {
        return;
      }

      const center =
        canvasPoint(
          canvas.clientWidth /
            2 +
            canvas.getBoundingClientRect()
              .left,

          canvas.clientHeight /
            2 +
            canvas.getBoundingClientRect()
              .top
        );

      await insertImageFile(
        file,
        center.x - 100,
        center.y - 75
      );

      return;
    }
  }
}

/* =========================================================
   COPY / PASTE ITEMS
   ========================================================= */

function copySelection() {
  const nodes =
    model.nodes.filter(
      node =>
        selectedIds.has(
          node.id
        )
    );

  const edges =
    model.edges.filter(
      edge =>
        selectedIds.has(
          edge.from
        ) &&
        selectedIds.has(
          edge.to
        )
    );

  if (
    !nodes.length &&
    !edges.length
  ) {
    return;
  }

  clipboardData = {
    nodes:
      JSON.parse(
        JSON.stringify(
          nodes
        )
      ),

    edges:
      JSON.parse(
        JSON.stringify(
          edges
        )
      )
  };

  setStatus(
    `${nodes.length} item(s) copied.`
  );
}

function pasteSelection() {
  if (
    !clipboardData ||
    !clipboardData.nodes?.length
  ) {
    return;
  }

  const idMap =
    new Map();

  const offset = 35;

  const newNodes =
    clipboardData.nodes.map(
      oldNode => {
        const copy =
          JSON.parse(
            JSON.stringify(
              oldNode
            )
          );

        const newId =
          uid('node');

        idMap.set(
          oldNode.id,
          newId
        );

        copy.id =
          newId;

        copy.x += offset;

        copy.y += offset;

        copy.zIndex =
          model.nodes.length;

        return copy;
      }
    );

  const newEdges =
    clipboardData.edges
      .map(
        oldEdge => {
          if (
            !idMap.has(
              oldEdge.from
            ) ||
            !idMap.has(
              oldEdge.to
            )
          ) {
            return null;
          }

          const copy =
            JSON.parse(
              JSON.stringify(
                oldEdge
              )
            );

          copy.id =
            uid('edge');

          copy.from =
            idMap.get(
              oldEdge.from
            );

          copy.to =
            idMap.get(
              oldEdge.to
            );

          return copy;
        }
      )
      .filter(Boolean);

  model.nodes.push(
    ...newNodes
  );

  model.edges.push(
    ...newEdges
  );

  selectedIds =
    new Set(
      newNodes.map(
        node =>
          node.id
      )
    );

  selectedId =
    newNodes[0]?.id ||
    null;

  render();

  setStatus(
    `${newNodes.length} item(s) pasted.`
  );
}

/* =========================================================
   DELETE
   ========================================================= */

function deleteSelected() {
  if (
    !selectedIds.size
  ) {
    return;
  }

  const nodeIds =
    new Set(
      [...selectedIds]
        .filter(
          id =>
            !id.startsWith(
              'edge:'
            )
        )
    );

  const edgeIds =
    new Set(
      [...selectedIds]
        .filter(
          id =>
            id.startsWith(
              'edge:'
            )
        )
        .map(
          id =>
            id.slice(
              5
            )
        )
    );

  model.nodes =
    model.nodes.filter(
      node =>
        !nodeIds.has(
          node.id
        )
    );

  model.edges =
    model.edges.filter(
      edge =>
        !nodeIds.has(
          edge.from
        ) &&
        !nodeIds.has(
          edge.to
        ) &&
        !edgeIds.has(
          edge.id
        )
    );

  model.comments =
    model.comments.filter(
      comment =>
        !nodeIds.has(
          comment.nodeId
        )
    );

  model.pins =
    model.pins.filter(
      pin =>
        !nodeIds.has(
          pin.nodeId
        )
    );

  clearSelection();

  render();

  setStatus(
    'Selected items deleted.'
  );
}

/* =========================================================
   STICKY NOTES
   ========================================================= */

function createStickyNote(
  x,
  y,
  text = 'Double-click to edit'
) {
  const note = {
    id: uid('sticky'),

    x,

    y,

    width: 180,

    height: 150,

    text
  };

  model.stickyNotes.push(
    note
  );

  render();

  setStatus(
    'Sticky note added.'
  );

  return note;
}

function renderStickyNotes() {
  if (!nodesEl) {
    return;
  }

  model.stickyNotes.forEach(
    note => {
      const element =
        document.createElement(
          'div'
        );

      element.className =
        'sticky-note';

      element.dataset.id =
        note.id;

      element.style.left =
        `${note.x}px`;

      element.style.top =
        `${note.y}px`;

      element.style.width =
        `${note.width}px`;

      element.style.height =
        `${note.height}px`;

      element.innerHTML = `
        <textarea>${escapeHtml(
          note.text
        )}</textarea>

        ${resizeHandlesHtml()}
      `;

      element
        .querySelector(
          'textarea'
        )
        .addEventListener(
          'input',
          event => {
            note.text =
              event.target.value;
          }
        );

      element.addEventListener(
        'dblclick',
        event =>
          event.stopPropagation()
      );

      element.addEventListener(
        'pointerdown',
        event => {
          if (
            event.target.tagName ===
            'TEXTAREA'
          ) {
            return;
          }

          startGenericDrag(
            event,
            note
          );
        }
      );

      nodesEl.appendChild(
        element
      );
    }
  );
}

/* =========================================================
   COMMENTS
   ========================================================= */

function createComment(
  x,
  y,
  text = 'Comment'
) {
  const comment = {
    id: uid('comment'),

    x,

    y,

    text,

    author: 'You'
  };

  model.comments.push(
    comment
  );

  render();

  setStatus(
    'Comment added.'
  );

  return comment;
}

function renderComments() {
  if (!nodesEl) {
    return;
  }

  model.comments.forEach(
    comment => {
      const element =
        document.createElement(
          'div'
        );

      element.className =
        'comment-node';

      element.dataset.id =
        comment.id;

      element.style.left =
        `${comment.x}px`;

      element.style.top =
        `${comment.y}px`;

      element.innerHTML = `
        <div class="comment-author">
          ${escapeHtml(
            comment.author
          )}
        </div>

        <div>
          ${escapeHtml(
            comment.text
          )}
        </div>
      `;

      element.addEventListener(
        'dblclick',
        () => {
          const text =
            prompt(
              'Comment:',
              comment.text
            );

          if (
            text !== null
          ) {
            comment.text =
              text;

            render();
          }
        }
      );

      element.addEventListener(
        'pointerdown',
        event =>
          startGenericDrag(
            event,
            comment
          )
      );

      nodesEl.appendChild(
        element
      );
    }
  );
}

/* =========================================================
   PINS
   ========================================================= */

function createPin(
  x,
  y
) {
  const pin = {
    id: uid('pin'),

    x,

    y,

    text: ''
  };

  model.pins.push(
    pin
  );

  render();

  setStatus(
    'Pin added.'
  );

  return pin;
}

function renderPins() {
  if (!nodesEl) {
    return;
  }

  model.pins.forEach(
    pin => {
      const element =
        document.createElement(
          'div'
        );

      element.className =
        'pin-node';

      element.dataset.id =
        pin.id;

      element.style.left =
        `${pin.x}px`;

      element.style.top =
        `${pin.y}px`;

      element.textContent =
        '📌';

      element.title =
        pin.text ||
        'Pin';

      element.addEventListener(
        'dblclick',
        () => {
          const text =
            prompt(
              'Pin note:',
              pin.text
            );

          if (
            text !== null
          ) {
            pin.text =
              text;

            render();
          }
        }
      );

      element.addEventListener(
        'pointerdown',
        event =>
          startGenericDrag(
            event,
            pin
          )
      );

      nodesEl.appendChild(
        element
      );
    }
  );
}

/* =========================================================
   GENERIC DRAG
   ========================================================= */

function startGenericDrag(
  event,
  item
) {
  if (
    event.button !== 0
  ) {
    return;
  }

  const pointer =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  dragState = {
    generic: true,

    item,

    startPointer: pointer,

    original: {
      x: item.x,

      y: item.y
    }
  };

  const move =
    moveGenericDrag;

  const up =
    endGenericDrag;

  window.addEventListener(
    'pointermove',
    move
  );

  window.addEventListener(
    'pointerup',
    up,
    {
      once: true
    }
  );

  event.stopPropagation();
}

function moveGenericDrag(
  event
) {
  if (
    !dragState?.generic
  ) {
    return;
  }

  const pointer =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  const dx =
    pointer.x -
    dragState.startPointer.x;

  const dy =
    pointer.y -
    dragState.startPointer.y;

  dragState.item.x =
    dragState.original.x +
    dx;

  dragState.item.y =
    dragState.original.y +
    dy;

  render();
}

function endGenericDrag() {
  window.removeEventListener(
    'pointermove',
    moveGenericDrag
  );

  dragState = null;
}

/* =========================================================
   FREEHAND DRAWING
   ========================================================= */

function startFreehandDrawing(
  event
) {
  if (
    event.button !== 0
  ) {
    return;
  }

  const point =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  drawingState = {
    points: [
      point
    ]
  };
}

function continueDrawing(
  event
) {
  if (!drawingState) {
    return;
  }

  const point =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  drawingState.points.push(
    point
  );

  renderTemporaryDrawing();
}

function finishDrawing() {
  if (!drawingState) {
    return;
  }

  if (
    drawingState.points.length >
    2
  ) {
    model.drawings.push({
      id: uid('drawing'),

      type: 'freehand',

      points:
        drawingState.points
    });
  }

  drawingState = null;

  render();
}

function renderTemporaryDrawing() {
  /* Drawing preview can be added
     to the SVG layer in the next
     editor iteration. */
}

/* =========================================================
   MULTI-SELECTION RECTANGLE
   ========================================================= */

function startSelection(
  event
) {
  if (
    event.button !== 0
  ) {
    return;
  }

  if (
    event.target !== canvas
  ) {
    return;
  }

  const start =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  selectionState = {
    start,

    current:
      start
  };

  createSelectionBox();
}

function continueSelection(
  event
) {
  if (!selectionState) {
    return;
  }

  selectionState.current =
    canvasPoint(
      event.clientX,
      event.clientY
    );

  updateSelectionBox();
}

function finishSelection() {
  if (!selectionState) {
    return;
  }

  const rect =
    selectionRect(
      selectionState.start,
      selectionState.current
    );

  clearSelection();

  model.nodes.forEach(
    node => {
      const intersects =
        node.x <
          rect.x +
            rect.width &&
        node.x +
            node.width >
          rect.x &&
        node.y <
          rect.y +
            rect.height &&
        node.y +
            node.height >
          rect.y;

      if (intersects) {
        selectedIds.add(
          node.id
        );
      }
    }
  );

  selectedId =
    [...selectedIds][0] ||
    null;

  removeSelectionBox();

  selectionState = null;

  render();
}

function selectionRect(
  a,
  b
) {
  return {
    x: Math.min(
      a.x,
      b.x
    ),

    y: Math.min(
      a.y,
      b.y
    ),

    width:
      Math.abs(
        b.x - a.x
      ),

    height:
      Math.abs(
        b.y - a.y
      )
  };
}

function createSelectionBox() {
  removeSelectionBox();

  const box =
    document.createElement(
      'div'
    );

  box.id =
    'selectionBox';

  box.className =
    'selection-box';

  canvas.appendChild(
    box
  );
}

function updateSelectionBox() {
  const box =
    $('selectionBox');

  if (!box) {
    return;
  }

  const rect =
    selectionRect(
      selectionState.start,
      selectionState.current
    );

  box.style.left =
    `${rect.x}px`;

  box.style.top =
    `${rect.y}px`;

  box.style.width =
    `${rect.width}px`;

  box.style.height =
    `${rect.height}px`;
}

function removeSelectionBox() {
  $('selectionBox')
    ?.remove();
}

/* =========================================================
   CANVAS COORDINATES
   ========================================================= */

function canvasPoint(
  clientX,
  clientY
) {
  const rect =
    canvas.getBoundingClientRect();

  return {
    x:
      (clientX -
        rect.left +
        canvas.scrollLeft) /
      zoom,

    y:
      (clientY -
        rect.top +
        canvas.scrollTop) /
      zoom
  };
}

/* =========================================================
   ZOOM
   ========================================================= */

function setZoom(value) {
  zoom =
    clamp(
      value,
      0.25,
      2.5
    );

  if (nodesEl) {
    nodesEl.style.transform =
      `scale(${zoom})`;

    nodesEl.style.transformOrigin =
      'top left';
  }

  if (edgesEl) {
    edgesEl.style.transform =
      `scale(${zoom})`;

    edgesEl.style.transformOrigin =
      'top left';
  }

  updateZoomDisplay();
}

function updateZoomDisplay() {
  const level =
    $('zoomLevel');

  if (level) {
    level.textContent =
      `${Math.round(
        zoom * 100
      )}%`;
  }
}

function zoomIn() {
  setZoom(
    zoom + 0.1
  );
}

function zoomOut() {
  setZoom(
    zoom - 0.1
  );
}

function resetZoom() {
  setZoom(1);
}

/* =========================================================
   SVG EXPORT
   ========================================================= */

function exportSvgString() {
  const width =
    Math.max(
      canvas.clientWidth,
      1200
    );

  const height =
    Math.max(
      canvas.clientHeight,
      800
    );

  const lines =
    model.edges
      .map(edge => {
        const from =
          nodeById(
            edge.from
          );

        const to =
          nodeById(
            edge.to
          );

        if (!from || !to) {
          return '';
        }

        const points =
          calculateConnectionPoints(
            from,
            to,
            edge.fromPort,
            edge.toPort
          );

        const path =
          buildEdgePath(
            points.x1,
            points.y1,
            points.x2,
            points.y2,
            edge.type ||
              'straight'
          );

        return `
          <path
            d="${path}"
            fill="none"
            stroke="#64748b"
            stroke-width="2"
            marker-end="url(#a)"
          />

          ${
            edge.label
              ? `
                <text
                  x="${
                    (points.x1 +
                      points.x2) /
                    2
                  }"
                  y="${
                    (points.y1 +
                      points.y2) /
                      2 -
                    6
                  }"
                  font-size="11"
                  fill="#334155"
                >
                  ${escapeHtml(
                    edge.label
                  )}
                </text>
              `
              : ''
          }
        `;
      })
      .join('');

  const boxes =
    model.nodes
      .map(node => {
        if (node.image) {
          return `
            <g>
              <rect
                x="${node.x}"
                y="${node.y}"
                width="${node.width}"
                height="${node.height}"
                rx="8"
                fill="#ffffff"
                stroke="#64748b"
                stroke-width="2"
              />

              <image
                href="${escapeHtml(
                  node.image
                )}"
                x="${node.x}"
                y="${node.y}"
                width="${node.width}"
                height="${node.height}"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          `;
        }

        return `
          <g>
            <rect
              x="${node.x}"
              y="${node.y}"
              width="${node.width}"
              height="${node.height}"
              rx="8"
              fill="${
                node.type ===
                'zone'
                  ? '#dbeafe'
                  : '#ffffff'
              }"
              stroke="#64748b"
              stroke-width="2"
            />

            <text
              x="${node.x + 10}"
              y="${node.y + 24}"
              font-size="15"
            >
              ${escapeHtml(
                node.label
              )}
            </text>

            <text
              x="${node.x + 10}"
              y="${node.y + 46}"
              font-size="11"
              fill="#475569"
            >
              ${escapeHtml(
                typeName(
                  node.type
                )
              )}
            </text>
          </g>
        `;
      })
      .join('');

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >

      <defs>

        <marker
          id="a"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path
            d="M0 0L10 5L0 10z"
            fill="#64748b"
          />
        </marker>

      </defs>

      <rect
        width="100%"
        height="100%"
        fill="#f1f5f9"
      />

      ${lines}

      ${boxes}

    </svg>
  `;
}

/* =========================================================
   PNG EXPORT
   ========================================================= */

function exportPng() {
  const image =
    new Image();

  const svg =
    exportSvgString();

  image.onload =
    () => {
      const output =
        document.createElement(
          'canvas'
        );

      output.width =
        canvas.clientWidth *
        2;

      output.height =
        canvas.clientHeight *
        2;

      const ctx =
        output.getContext(
          '2d'
        );

      ctx.scale(
        2,
        2
      );

      ctx.drawImage(
        image,
        0,
        0
      );

      output.toBlob(
        blob =>
          download(
            blob,
            'architecture-diagram.png'
          ),
        'image/png'
      );
    };

  image.src =
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svg
    )}`;
}

/* =========================================================
   DRAG/DROP COMPONENT PALETTE
   ========================================================= */

function initializePalette() {
  const palette =
    $('palette');

  if (!palette) {
    return;
  }

  palette.innerHTML =
    catalog
      .map(
        ([type, icon, label]) =>
          `
          <button
            class="palette-item"
            draggable="true"
            data-type="${type}"
          >
            <span class="palette-icon">
              ${icon}
            </span>

            <span class="palette-label">
              ${escapeHtml(
                label
              )}
            </span>
          </button>
        `
      )
      .join('');

  palette
    .querySelectorAll(
      '.palette-item'
    )
    .forEach(
      element => {
        element.addEventListener(
          'dragstart',
          event => {
            event.dataTransfer.setData(
              'component-type',
              element.dataset.type
            );
          }
        );
      }
    );
}

/* =========================================================
   CANVAS DRAG/DROP
   ========================================================= */

function initializeCanvasDrop() {
  if (!canvas) {
    return;
  }

  canvas.addEventListener(
    'dragover',
    event => {
      event.preventDefault();

      canvas.classList.add(
        'drop-target'
      );
    }
  );

  canvas.addEventListener(
    'dragleave',
    () => {
      canvas.classList.remove(
        'drop-target'
      );
    }
  );

  canvas.addEventListener(
    'drop',
    async event => {
      event.preventDefault();

      canvas.classList.remove(
        'drop-target'
      );

      const files =
        [...(
          event.dataTransfer
            ?.files || []
        )];

      const point =
        canvasPoint(
          event.clientX,
          event.clientY
        );

      const imageFile =
        files.find(
          file =>
            file.type.startsWith(
              'image/'
            )
        );

      if (imageFile) {
        await insertImageFile(
          imageFile,
          point.x,
          point.y
        );

        return;
      }

      const type =
        event.dataTransfer.getData(
          'component-type'
        );

      if (!type) {
        return;
      }

      addNode(
        type,
        Math.max(
          0,
          point.x - 75
        ),
        Math.max(
          0,
          point.y - 38
        )
      );

      setStatus(
        `${typeName(type)} added.`
      );
    }
  );
}

/* =========================================================
   LOCAL FILE IMAGE INPUT
   ========================================================= */

function createImageInput() {
  const input =
    document.createElement(
      'input'
    );

  input.type =
    'file';

  input.accept =
    'image/*';

  input.style.display =
    'none';

  document.body.appendChild(
    input
  );

  input.addEventListener(
    'change',
    async () => {
      const file =
        input.files?.[0];

      if (!file) {
        return;
      }

      const point =
        canvasPoint(
          canvas.clientWidth / 2 +
            canvas.getBoundingClientRect()
              .left,

          canvas.clientHeight / 2 +
            canvas.getBoundingClientRect()
              .top
        );

      await insertImageFile(
        file,
        point.x - 100,
        point.y - 75
      );

      input.value =
        '';
    }
  );

  return input;
}

let imageInput;

/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
  'keydown',
  event => {
    const target =
      event.target;

    const typing =
      target instanceof
        HTMLInputElement ||
      target instanceof
        HTMLTextAreaElement ||
      target instanceof
        HTMLSelectElement;

    const modifier =
      event.ctrlKey ||
      event.metaKey;

    /* Ctrl + A */

    if (
      modifier &&
      event.key.toLowerCase() ===
        'a'
    ) {
      if (
        !typing ||
        target ===
          $('diagramName')
      ) {
        event.preventDefault();

        selectAll();
      }

      return;
    }

    /* Ctrl + C */

    if (
      modifier &&
      event.key.toLowerCase() ===
        'c'
    ) {
      if (!typing) {
        event.preventDefault();

        copySelection();
      }

      return;
    }

    /* Ctrl + V */

    if (
      modifier &&
      event.key.toLowerCase() ===
        'v'
    ) {
      if (!typing) {
        event.preventDefault();

        pasteSelection();
      }

      return;
    }

    /* Delete */

    if (
      [
        'Delete',
        'Backspace'
      ].includes(
        event.key
      ) &&
      !typing
    ) {
      event.preventDefault();

      deleteSelected();

      return;
    }

    /* Escape */

    if (
      event.key ===
      'Escape'
    ) {
      connectMode =
        false;

      connectSourceId =
        null;

      removeSelectionBox();

      selectionState =
        null;

      setStatus(
        'Operation cancelled.'
      );

      render();

      return;
    }

    /* Zoom */

    if (
      modifier &&
      (
        event.key ===
          '+' ||
        event.key ===
          '='
      )
    ) {
      event.preventDefault();

      zoomIn();

      return;
    }

    if (
      modifier &&
      event.key ===
        '-'
    ) {
      event.preventDefault();

      zoomOut();

      return;
    }

    if (
      modifier &&
      event.key ===
        '0'
    ) {
      event.preventDefault();

      resetZoom();

      return;
    }
  }
);

/* =========================================================
   CLIPBOARD
   ========================================================= */

document.addEventListener(
  'paste',
  handleClipboardPaste
);

/* =========================================================
   CANVAS CLICK
   ========================================================= */

if (canvas) {
  canvas.addEventListener(
    'pointerdown',
    event => {
      if (
        event.target !==
        canvas
      ) {
        return;
      }

      if (
        event.button !== 0
      ) {
        return;
      }

      if (
        event.shiftKey
      ) {
        startSelection(
          event
        );

        return;
      }

      if (
        !connectMode
      ) {
        clearSelection();

        render();
      }
    }
  );
}

/* =========================================================
   BUTTONS
   ========================================================= */

$('newDiagram')
  ?.addEventListener(
    'click',
    newDiagram
  );

$('saveDiagram')
  ?.addEventListener(
    'click',
    saveLocally
  );

$('loadDiagram')
  ?.addEventListener(
    'click',
    loadLocally
  );

$('exportJson')
  ?.addEventListener(
    'click',
    () =>
      download(
        new Blob(
          [exportData()],
          {
            type:
              'application/json'
          }
        ),
        'architecture-diagram.json'
      )
  );

$('exportSvg')
  ?.addEventListener(
    'click',
    () =>
      download(
        new Blob(
          [
            exportSvgString()
          ],
          {
            type:
              'image/svg+xml'
          }
        ),
        'architecture-diagram.svg'
      )
  );

$('exportPng')
  ?.addEventListener(
    'click',
    exportPng
  );

$('importJson')
  ?.addEventListener(
    'change',
    async event => {
      await importDiagramFile(
        event.target.files?.[0]
      );

      event.target.value =
        '';
    }
  );

$('deleteSelected')
  ?.addEventListener(
    'click',
    deleteSelected
  );

$('validateDiagram')
  ?.addEventListener(
    'click',
    validate
  );

$('autoLayout')
  ?.addEventListener(
    'click',
    autoLayout
  );

/* =========================================================
   CONNECT MODE BUTTON
   ========================================================= */

$('connectMode')
  ?.addEventListener(
    'click',
    () => {
      connectMode =
        !connectMode;

      connectSourceId =
        null;

      $('connectMode')
        .setAttribute(
          'aria-pressed',
          connectMode
        );

      setStatus(
        connectMode
          ? 'Select a source component, then its destination.'
          : 'Connection mode turned off.'
      );

      render();
    }
  );

/* =========================================================
   IMPACT MODE
   ========================================================= */

$('impactMode')
  ?.addEventListener(
    'click',
    () => {
      impactMode =
        !impactMode;

      $('impactMode')
        .setAttribute(
          'aria-pressed',
          impactMode
        );

      render();

      setStatus(
        impactMode
          ? 'Select a component to highlight downstream impact.'
          : 'Impact mode turned off.'
      );
    }
  );

/* =========================================================
   DIAGRAM NAME
   ========================================================= */

$('diagramName')
  ?.addEventListener(
    'input',
    event => {
      model.name =
        event.target.value;
    }
  );

/* =========================================================
   TEMPLATE BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    '.template-button'
  )
  .forEach(
    button => {
      button.addEventListener(
        'click',
        () =>
          template(
            button.dataset.template
          )
      );
    }
  );

/* =========================================================
   OPTIONAL EXTENDED BUTTONS
   ========================================================= */

function bindOptionalButton(
  id,
  callback
) {
  $(id)?.addEventListener(
    'click',
    callback
  );
}

bindOptionalButton(
  'saveArch',
  saveArchFile
);

bindOptionalButton(
  'openImage',
  () => imageInput?.click()
);

bindOptionalButton(
  'addSticky',
  () => {
    const point =
      canvasPoint(
        canvas.clientWidth / 2 +
          canvas.getBoundingClientRect()
            .left,

        canvas.clientHeight / 2 +
          canvas.getBoundingClientRect()
            .top
      );

    createStickyNote(
      point.x - 90,
      point.y - 75
    );
  }
);

bindOptionalButton(
  'addComment',
  () => {
    const point =
      canvasPoint(
        canvas.clientWidth / 2 +
          canvas.getBoundingClientRect()
            .left,

        canvas.clientHeight / 2 +
          canvas.getBoundingClientRect()
            .top
      );

    createComment(
      point.x,
      point.y
    );
  }
);

bindOptionalButton(
  'addPin',
  () => {
    const point =
      canvasPoint(
        canvas.clientWidth / 2 +
          canvas.getBoundingClientRect()
            .left,

        canvas.clientHeight / 2 +
          canvas.getBoundingClientRect()
            .top
      );

    createPin(
      point.x,
      point.y
    );
  }
);

bindOptionalButton(
  'zoomIn',
  zoomIn
);

bindOptionalButton(
  'zoomOut',
  zoomOut
);

bindOptionalButton(
  'resetZoom',
  resetZoom
);

bindOptionalButton(
  'saveArchFile',
  saveArchFile
);

/* =========================================================
   EDGE TOOL BUTTONS
   ========================================================= */

document
  .querySelectorAll(
    '[data-edge-type]'
  )
  .forEach(
    button => {
      button.addEventListener(
        'click',
        () => {
          currentEdgeType =
            button.dataset.edgeType;

          setStatus(
            `Connector type: ${currentEdgeType}.`
          );
        }
      );
    }
  );

document
  .querySelectorAll(
    '[data-edge-style]'
  )
  .forEach(
    button => {
      button.addEventListener(
        'click',
        () => {
          currentEdgeStyle =
            button.dataset.edgeStyle;

          setStatus(
            `Connector style: ${currentEdgeStyle}.`
          );
        }
      );
    }
  );

/* =========================================================
   IMAGE INPUT
   ========================================================= */

imageInput =
  createImageInput();

/* =========================================================
   INITIALIZATION
   ========================================================= */

initializePalette();

initializeCanvasDrop();

ensureModel();

/*
  Start with the original AIOps template,
  preserving the behavior of the previous version.
*/

template('aiops');

setZoom(1);

setStatus(
  'Ready. Create, connect, annotate and export your architecture.'
);
