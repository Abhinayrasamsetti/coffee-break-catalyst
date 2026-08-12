# Architecture Diagram Builder

A fully browser-based enterprise architecture diagram editor. Drag Azure, Kubernetes, ServiceNow, application, infrastructure, data, and security components onto a canvas; connect data flows; validate common gaps; inspect dependency impact; and export the finished design.

## What it includes

- Component palette with Azure, AKS, VM, API, application, database, ServiceNow, monitoring, identity, storage, Internet, and security-zone components.
- Drag and reposition components; connect them with labelled directional data flows.
- Built-in AIOps Control Center, AKS Application Platform, and Azure Landing Zone templates.
- Component metadata: environment, owner, and description.
- Architecture checks for external workloads missing identity boundaries, applications without monitoring, and databases without a backup/storage dependency.
- Downstream blast-radius view, simple auto-layout, local browser save/load, and JSON, SVG, and PNG export.

## How to run it locally

No application installation, cloud account, API key, or backend is required.

1. Open the `architecture-diagram-builder/site` folder in VS Code.
2. Install the **Live Server** extension in VS Code, if you do not already have it.
3. Right-click `index.html` and select **Open with Live Server**.
4. Start with a template, or drag a component from the left palette to the canvas.

You can also open `index.html` directly in a modern browser. Live Server is recommended because it better matches the GitHub Pages environment.

## Beginner workflow

1. Select **AIOps control center** under Templates.
2. Click a component and update its name, environment, owner, and description in Inspector.
3. Select **Connect components**, click the source, then click the destination. Enter a data-flow label first if needed.
4. Select **Validate** to identify common missing controls. These are advisory checks, not an architecture approval.
5. Select **Impact mode**, then choose a component to show downstream dependencies.
6. Select **Save locally** while working. This saves only in that browser on that device.
7. Select **Export JSON** for a portable/editable diagram, **Export SVG** for vector documentation, or **Export PNG** for presentations.

## Input and data safety

- This app never sends diagram information to a server.
- Browser saves use `localStorage`; clear browser data and the local save may disappear.
- Use **Export JSON** as the durable copy. Do not commit diagrams containing client, credential, IP, or production-sensitive information to a public repository.
- Imported JSON must be a diagram previously exported by this app.

## Host on GitHub Pages

The repository includes a GitHub Actions workflow that deploys the static app. After it is merged to the default branch:

1. Open your GitHub repository → **Settings** → **Pages**.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Push a change to the default branch or run the **Deploy Architecture Diagram Builder** workflow from the Actions tab.
4. GitHub will display the deployed URL, typically `https://abhinayrasamsetti.github.io/coffee-break-catalyst/`.

GitHub Pages provides static hosting only. The app intentionally has no multi-user collaboration, login, real ServiceNow/Azure integration, server-side persistence, or credential storage.
