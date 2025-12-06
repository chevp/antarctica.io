/**
 * Figma-to-Angular MCP Pipeline Documentation
 * Self-contained Web Component
 */

class FigmaAngularMcpPipeline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupNavigation();
  }

  setupNavigation() {
    this.shadowRoot.querySelectorAll('nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = this.shadowRoot.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="doc-container">
        <aside class="doc-sidebar">
          ${this.getSidebar()}
        </aside>
        <main class="doc-content">
          ${this.getContent()}
        </main>
      </div>
    `;
  }

  getStyles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

      @font-face {
        font-family: 'Material Icons Outlined';
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/materialiconsoutlined/v109/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUce.woff2) format('woff2');
      }

      :host {
        display: block;
        width: 100%;
        height: 100%;
        font-family: 'Inter', sans-serif;
        color: #e2e8f0;
      }

      * { box-sizing: border-box; }
      code, pre { font-family: 'JetBrains Mono', monospace; }

      .doc-container {
        display: flex;
        height: 100%;
        background: transparent;
      }

      /* Sidebar */
      .doc-sidebar {
        width: 260px;
        flex-shrink: 0;
        background: rgba(255, 255, 255, 0.03);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px 0 0 12px;
        padding: 16px;
        overflow-y: auto;
      }

      .doc-sidebar nav {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .doc-sidebar a {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 13px;
        color: #94a3b8;
        text-decoration: none;
        border-left: 2px solid transparent;
        transition: all 0.2s ease;
      }

      .doc-sidebar a:hover {
        background: rgba(59, 130, 246, 0.1);
        border-left-color: #3b82f6;
        color: #fff;
      }

      .nav-section {
        padding: 20px 12px 8px 12px;
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .nav-icon {
        font-size: 18px;
      }

      .nav-badge {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
      }

      /* Main Content */
      .doc-content {
        flex: 1;
        padding: 32px;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 0 12px 12px 0;
      }

      section {
        margin-bottom: 48px;
        scroll-margin-top: 24px;
      }

      h2 {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        margin: 0 0 20px 0;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        margin: 0 0 12px 0;
      }

      h4 {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        margin: 16px 0 8px 0;
      }

      p {
        color: #94a3b8;
        line-height: 1.7;
        margin: 0 0 16px 0;
        font-size: 14px;
      }

      /* Cards */
      .card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .card-small {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
      }

      /* Code blocks */
      .code-block {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        overflow-x: auto;
        font-size: 13px;
        line-height: 1.6;
        margin: 16px 0;
      }

      .code-block pre {
        margin: 0;
        color: #cbd5e1;
      }

      /* Gradient text */
      .gradient-blue {
        background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .gradient-purple {
        background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .gradient-green {
        background: linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .gradient-orange {
        background: linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Icons */
      .icon {
        font-family: 'Material Icons Outlined';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        display: inline-block;
        vertical-align: middle;
      }

      .icon-box {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      }

      .icon-box .icon {
        font-size: 20px;
        color: inherit;
      }

      .icon-box-lg {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }

      .icon-box-lg .icon {
        font-size: 28px;
        color: #fff;
      }

      /* Pipeline visualization */
      .pipeline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 32px;
      }

      .pipeline-stage {
        flex: 1;
        text-align: center;
      }

      .pipeline-arrow {
        width: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #475569;
      }

      .pipeline-arrow svg {
        width: 32px;
        height: 16px;
      }

      /* Colors */
      .bg-blue { background: rgba(59, 130, 246, 0.2); }
      .bg-purple { background: rgba(168, 85, 247, 0.2); }
      .bg-green { background: rgba(34, 197, 94, 0.2); }
      .bg-orange { background: rgba(249, 115, 22, 0.2); }

      .bg-blue-solid { background: linear-gradient(135deg, #3b82f6, #2563eb); }
      .bg-purple-solid { background: linear-gradient(135deg, #a855f7, #7c3aed); }
      .bg-green-solid { background: linear-gradient(135deg, #22c55e, #16a34a); }
      .bg-orange-solid { background: linear-gradient(135deg, #f97316, #ea580c); }

      .text-blue { color: #60a5fa; }
      .text-purple { color: #a78bfa; }
      .text-green { color: #4ade80; }
      .text-orange { color: #fb923c; }
      .text-red { color: #f87171; }
      .text-slate { color: #94a3b8; }
      .text-white { color: #fff; }

      .border-blue { border-color: rgba(59, 130, 246, 0.3); }
      .border-purple { border-color: rgba(168, 85, 247, 0.3); }
      .border-green { border-color: rgba(34, 197, 94, 0.3); }
      .border-orange { border-color: rgba(249, 115, 22, 0.3); }

      /* Utilities */
      .flex { display: flex; }
      .items-center { align-items: center; }
      .items-start { align-items: flex-start; }
      .gap-2 { gap: 8px; }
      .gap-3 { gap: 12px; }
      .gap-4 { gap: 16px; }
      .mb-2 { margin-bottom: 8px; }
      .mb-4 { margin-bottom: 16px; }
      .mb-6 { margin-bottom: 24px; }
      .mt-4 { margin-top: 16px; }
      .text-sm { font-size: 13px; }
      .text-xs { font-size: 12px; }
      .font-medium { font-weight: 500; }
      .font-semibold { font-weight: 600; }

      /* List styles */
      .check-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .check-list li {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #cbd5e1;
      }

      .check-list .icon {
        font-size: 18px;
        margin-top: 2px;
      }

      /* Tool cards */
      .tool-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
      }

      .tool-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }

      .tool-name {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        font-size: 14px;
      }

      /* Step cards */
      .step-card {
        display: flex;
        gap: 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 16px;
      }

      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #fff;
        flex-shrink: 0;
      }

      .step-content {
        flex: 1;
      }

      .step-content h3 {
        margin-bottom: 8px;
      }

      .step-content p {
        margin-bottom: 12px;
      }

      /* Flow animation */
      @keyframes dash {
        to { stroke-dashoffset: -12; }
      }

      .flow-line {
        stroke-dasharray: 8 4;
        animation: dash 1s linear infinite;
      }
    `;
  }

  getSidebar() {
    return `
      <nav>
        <a href="#overview">
          <span class="icon nav-icon">home</span>
          Übersicht
        </a>
        <a href="#problem">
          <span class="icon nav-icon">warning</span>
          Problemstellung
        </a>
        <a href="#architecture">
          <span class="icon nav-icon">architecture</span>
          Architektur
        </a>

        <div class="nav-section">Pipeline Stufen</div>

        <a href="#stage-1">
          <span class="nav-badge bg-purple text-purple">1</span>
          Figma Export
        </a>
        <a href="#stage-2">
          <span class="nav-badge bg-blue text-blue">2</span>
          MCP Server
        </a>
        <a href="#stage-3">
          <span class="nav-badge bg-green text-green">3</span>
          Business Context
        </a>
        <a href="#stage-4">
          <span class="nav-badge bg-orange text-orange">4</span>
          Angular Generation
        </a>

        <div class="nav-section">Spezifikationen</div>

        <a href="#mcp-server">
          <span class="icon nav-icon">dns</span>
          MCP Server API
        </a>
        <a href="#rest-api">
          <span class="icon nav-icon">api</span>
          REST API Binding
        </a>
        <a href="#implementation">
          <span class="icon nav-icon">code</span>
          Implementierung
        </a>
      </nav>
    `;
  }

  getContent() {
    return `
      <!-- Overview -->
      <section id="overview">
        <div class="card">
          <h2 class="gradient-blue">Figma Make to Production Angular</h2>
          <p style="font-size: 16px; margin-bottom: 24px;">
            Diese Pipeline transformiert Figma-Prototypen (via Figma Make Export) in produktionsreife Angular-Applikationen,
            indem ein MCP-Server den Business-Kontext aus Markdown-Spezifikationen mit REST-API-Definitionen verbindet.
          </p>

          <div class="card-grid">
            <div class="card-small border-purple">
              <div class="icon-box bg-purple text-purple">
                <span class="icon">design_services</span>
              </div>
              <h3>Design-First</h3>
              <p class="text-sm text-slate">Figma-Prototypen als Single Source of Truth für UI</p>
            </div>
            <div class="card-small border-blue">
              <div class="icon-box bg-blue text-blue">
                <span class="icon">hub</span>
              </div>
              <h3>MCP-Orchestriert</h3>
              <p class="text-sm text-slate">Claude verbindet Design mit Business-Logik</p>
            </div>
            <div class="card-small border-green">
              <div class="icon-box bg-green text-green">
                <span class="icon">rocket_launch</span>
              </div>
              <h3>Production-Ready</h3>
              <p class="text-sm text-slate">Direkt deploybare Angular-Apps</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Problem Statement -->
      <section id="problem">
        <h2>
          <span class="icon text-orange">warning</span>
          Die Lücke zwischen Design und Production
        </h2>

        <div class="card border-orange" style="border-color: rgba(249, 115, 22, 0.3);">
          <h3 class="text-orange mb-4">Aktuelle Herausforderungen</h3>
          <ul class="check-list">
            <li>
              <span class="icon text-red">close</span>
              <div>
                <strong class="text-white">Figma Make generiert nur statisches HTML/CSS</strong><br>
                <span class="text-slate">Keine Interaktivität, keine Datenbindung, kein State Management</span>
              </div>
            </li>
            <li>
              <span class="icon text-red">close</span>
              <div>
                <strong class="text-white">Business-Logik muss manuell implementiert werden</strong><br>
                <span class="text-slate">API-Calls, Validierung, Workflows - alles von Hand</span>
              </div>
            </li>
            <li>
              <span class="icon text-red">close</span>
              <div>
                <strong class="text-white">Kontext geht bei der Übertragung verloren</strong><br>
                <span class="text-slate">Designer-Intent wird nicht in Code übersetzt</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="card border-green" style="border-color: rgba(34, 197, 94, 0.3);">
          <h3 class="text-green mb-4">Die Lösung: MCP-basierte Pipeline</h3>
          <ul class="check-list">
            <li>
              <span class="icon text-green">check</span>
              <div>
                <strong class="text-white">Automatische Komponenten-Erkennung</strong><br>
                <span class="text-slate">MCP-Server analysiert Figma-Export und identifiziert UI-Patterns</span>
              </div>
            </li>
            <li>
              <span class="icon text-green">check</span>
              <div>
                <strong class="text-white">Business Context aus Markdown</strong><br>
                <span class="text-slate">Dutzende Markdown-Dateien definieren Use Cases, APIs, Validierungen</span>
              </div>
            </li>
            <li>
              <span class="icon text-green">check</span>
              <div>
                <strong class="text-white">REST API Auto-Binding</strong><br>
                <span class="text-slate">Services werden automatisch aus OpenAPI/Swagger generiert</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Architecture -->
      <section id="architecture">
        <h2>
          <span class="icon text-blue">architecture</span>
          Pipeline-Architektur
        </h2>

        <div class="card">
          <div class="pipeline">
            <div class="pipeline-stage">
              <div class="icon-box-lg bg-purple-solid" style="margin: 0 auto 12px auto;">
                <span class="icon">palette</span>
              </div>
              <h4 class="text-white">Figma</h4>
              <p class="text-xs text-slate">Design Export</p>
            </div>

            <div class="pipeline-arrow">
              <svg viewBox="0 0 32 16">
                <path d="M0 8 L24 8 M20 4 L24 8 L20 12" stroke="currentColor" fill="none" stroke-width="2" class="flow-line"/>
              </svg>
            </div>

            <div class="pipeline-stage">
              <div class="icon-box-lg bg-blue-solid" style="margin: 0 auto 12px auto;">
                <span class="icon">hub</span>
              </div>
              <h4 class="text-white">MCP Server</h4>
              <p class="text-xs text-slate">Orchestrierung</p>
            </div>

            <div class="pipeline-arrow">
              <svg viewBox="0 0 32 16">
                <path d="M0 8 L24 8 M20 4 L24 8 L20 12" stroke="currentColor" fill="none" stroke-width="2" class="flow-line"/>
              </svg>
            </div>

            <div class="pipeline-stage">
              <div class="icon-box-lg bg-green-solid" style="margin: 0 auto 12px auto;">
                <span class="icon">description</span>
              </div>
              <h4 class="text-white">Context</h4>
              <p class="text-xs text-slate">Markdown Specs</p>
            </div>

            <div class="pipeline-arrow">
              <svg viewBox="0 0 32 16">
                <path d="M0 8 L24 8 M20 4 L24 8 L20 12" stroke="currentColor" fill="none" stroke-width="2" class="flow-line"/>
              </svg>
            </div>

            <div class="pipeline-stage">
              <div class="icon-box-lg bg-orange-solid" style="margin: 0 auto 12px auto;">
                <span class="icon">web</span>
              </div>
              <h4 class="text-white">Angular</h4>
              <p class="text-xs text-slate">Production App</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center;">
              <p class="text-purple font-medium text-sm">HTML/CSS/Assets</p>
              <p class="text-xs text-slate">Figma Make Output</p>
            </div>
            <div style="text-align: center;">
              <p class="text-blue font-medium text-sm">Component AST</p>
              <p class="text-xs text-slate">Parsed Structure</p>
            </div>
            <div style="text-align: center;">
              <p class="text-green font-medium text-sm">Use Case Binding</p>
              <p class="text-xs text-slate">API + Logic</p>
            </div>
            <div style="text-align: center;">
              <p class="text-orange font-medium text-sm">Full Angular</p>
              <p class="text-xs text-slate">Components + Services</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stage 1: Figma Export -->
      <section id="stage-1">
        <h2>
          <span class="nav-badge bg-purple text-purple" style="width: 32px; height: 32px; font-size: 14px;">1</span>
          <span class="gradient-purple">Figma Make Export</span>
        </h2>

        <div class="card border-purple">
          <p>
            Figma Make exportiert Design-Prototypen als statisches HTML/CSS. Der MCP-Server analysiert diese Struktur
            und extrahiert Komponenten-Hierarchien, Styles und Asset-Referenzen.
          </p>

          <h4>Erwartete Export-Struktur:</h4>
          <div class="code-block">
            <pre><span class="text-slate">figma-export/</span>
├── <span class="text-purple">index.html</span>          <span class="text-slate"># Main entry point</span>
├── <span class="text-blue">styles/</span>
│   ├── global.css       <span class="text-slate"># Design tokens, variables</span>
│   └── components.css   <span class="text-slate"># Component styles</span>
├── <span class="text-green">assets/</span>
│   ├── images/          <span class="text-slate"># Exported images</span>
│   ├── icons/           <span class="text-slate"># SVG icons</span>
│   └── fonts/           <span class="text-slate"># Custom fonts</span>
└── <span class="text-orange">pages/</span>
    ├── dashboard.html   <span class="text-slate"># Individual pages</span>
    ├── login.html
    └── settings.html</pre>
          </div>

          <h4>Figma Component Naming Convention:</h4>
          <p class="text-sm text-slate mb-4">
            Figma-Komponenten sollten mit speziellen Prefixen benannt werden, um die automatische Erkennung zu ermöglichen:
          </p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div class="card-small">
              <code class="text-purple">@form/</code>
              <p class="text-xs text-slate mt-2">Formular-Elemente mit Validierung</p>
            </div>
            <div class="card-small">
              <code class="text-blue">@data/</code>
              <p class="text-xs text-slate mt-2">Daten-gebundene Komponenten</p>
            </div>
            <div class="card-small">
              <code class="text-green">@action/</code>
              <p class="text-xs text-slate mt-2">Buttons mit API-Calls</p>
            </div>
            <div class="card-small">
              <code class="text-orange">@nav/</code>
              <p class="text-xs text-slate mt-2">Navigation/Routing</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stage 2: MCP Server -->
      <section id="stage-2">
        <h2>
          <span class="nav-badge bg-blue text-blue" style="width: 32px; height: 32px; font-size: 14px;">2</span>
          <span class="gradient-blue">MCP Server Orchestrierung</span>
        </h2>

        <div class="card border-blue">
          <p>
            Der MCP-Server ist das Herzstück der Pipeline. Er verbindet Claude mit dem Figma-Export,
            den Business-Spezifikationen und der Code-Generierung.
          </p>

          <h4 class="mb-4">MCP Server Capabilities:</h4>

          <div class="tool-card">
            <div class="tool-header">
              <span class="icon text-blue">search</span>
              <span class="tool-name text-blue">analyze_figma_export</span>
            </div>
            <p class="text-sm text-slate mb-2">Parst den Figma-Export und erstellt einen Component AST</p>
            <div class="code-block" style="margin: 0;">
              <pre>{ "path": "figma-export/", "extractStyles": true, "identifyPatterns": true }</pre>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-header">
              <span class="icon text-green">link</span>
              <span class="tool-name text-green">bind_business_context</span>
            </div>
            <p class="text-sm text-slate mb-2">Verbindet UI-Komponenten mit Business-Use-Cases aus Markdown</p>
            <div class="code-block" style="margin: 0;">
              <pre>{ "component": "LoginForm", "useCase": "user-authentication.md", "apiBinding": "POST /api/auth/login" }</pre>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-header">
              <span class="icon text-orange">code</span>
              <span class="tool-name text-orange">generate_angular_component</span>
            </div>
            <p class="text-sm text-slate mb-2">Generiert production-ready Angular-Komponenten mit Services</p>
            <div class="code-block" style="margin: 0;">
              <pre>{ "component": "LoginForm", "outputPath": "src/app/features/auth/", "standalone": true }</pre>
            </div>
          </div>

          <div class="tool-card">
            <div class="tool-header">
              <span class="icon text-purple">api</span>
              <span class="tool-name text-purple">generate_api_service</span>
            </div>
            <p class="text-sm text-slate mb-2">Erstellt typisierte Angular HTTP Services aus OpenAPI Spec</p>
            <div class="code-block" style="margin: 0;">
              <pre>{ "openApiSpec": "specs/api.yaml", "outputPath": "src/app/core/services/" }</pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Stage 3: Business Context -->
      <section id="stage-3">
        <h2>
          <span class="nav-badge bg-green text-green" style="width: 32px; height: 32px; font-size: 14px;">3</span>
          <span class="gradient-green">Business Context Spezifikation</span>
        </h2>

        <div class="card border-green">
          <p>
            Der Business-Kontext wird in dutzenden Markdown-Dateien spezifiziert. Jede Datei beschreibt
            einen Use Case, eine API, Validierungsregeln oder Workflow-Definitionen.
          </p>

          <h4>Ordnerstruktur der Spezifikationen:</h4>
          <div class="code-block">
            <pre><span class="text-slate">specs/</span>
├── <span class="text-green">use-cases/</span>              <span class="text-slate"># Business Use Cases</span>
│   ├── user-authentication.md
│   ├── product-catalog.md
│   ├── shopping-cart.md
│   └── ...                  <span class="text-slate"># (20+ Dateien)</span>
├── <span class="text-blue">api/</span>                     <span class="text-slate"># REST API Definitionen</span>
│   ├── openapi.yaml
│   └── endpoints/
├── <span class="text-purple">validation/</span>              <span class="text-slate"># Validierungsregeln</span>
│   ├── form-rules.md
│   └── error-messages.md
└── <span class="text-orange">workflows/</span>               <span class="text-slate"># Prozess-Definitionen</span>
    ├── registration-flow.md
    └── payment-flow.md</pre>
          </div>
        </div>
      </section>

      <!-- Stage 4: Angular Generation -->
      <section id="stage-4">
        <h2>
          <span class="nav-badge bg-orange text-orange" style="width: 32px; height: 32px; font-size: 14px;">4</span>
          <span class="gradient-orange">Angular App Generierung</span>
        </h2>

        <div class="card border-orange">
          <p>
            Der MCP-Server generiert eine vollständige Angular-Applikation mit allen notwendigen Komponenten,
            Services, Guards und Konfigurationen.
          </p>

          <h4>Generierte Angular-Struktur:</h4>
          <div class="code-block">
            <pre><span class="text-slate">angular-app/src/app/</span>
├── <span class="text-blue">core/</span>
│   ├── services/
│   │   ├── auth.service.ts    <span class="text-slate"># Generated from API spec</span>
│   │   └── product.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── models/
│       └── user.model.ts
├── <span class="text-green">features/</span>
│   ├── auth/
│   │   └── login/
│   │       ├── login.component.ts
│   │       ├── login.component.html  <span class="text-slate"># From Figma</span>
│   │       └── login.component.scss  <span class="text-slate"># From Figma</span>
│   └── dashboard/
└── <span class="text-purple">shared/</span>
    └── components/</pre>
          </div>
        </div>
      </section>

      <!-- MCP Server Implementation -->
      <section id="mcp-server">
        <h2>
          <span class="icon text-blue">dns</span>
          MCP Server Implementierung
        </h2>

        <div class="card border-blue">
          <h4>Server Konfiguration (package.json)</h4>
          <div class="code-block">
            <pre>{
  <span class="text-blue">"name"</span>: <span class="text-green">"figma-angular-mcp"</span>,
  <span class="text-blue">"version"</span>: <span class="text-green">"1.0.0"</span>,
  <span class="text-blue">"type"</span>: <span class="text-green">"module"</span>,
  <span class="text-blue">"dependencies"</span>: {
    <span class="text-blue">"@modelcontextprotocol/sdk"</span>: <span class="text-green">"^1.0.0"</span>,
    <span class="text-blue">"cheerio"</span>: <span class="text-green">"^1.0.0"</span>,
    <span class="text-blue">"gray-matter"</span>: <span class="text-green">"^4.0.3"</span>,
    <span class="text-blue">"yaml"</span>: <span class="text-green">"^2.3.0"</span>
  }
}</pre>
          </div>
        </div>
      </section>

      <!-- REST API Binding -->
      <section id="rest-api">
        <h2>
          <span class="icon text-purple">api</span>
          REST API Binding
        </h2>

        <div class="card border-purple">
          <p>
            Die REST API wird über OpenAPI/Swagger spezifiziert. Der MCP-Server generiert daraus
            typisierte Angular Services mit allen Endpoints, Models und Error Handling.
          </p>

          <h4>OpenAPI Beispiel:</h4>
          <div class="code-block">
            <pre><span class="text-purple">openapi:</span> <span class="text-green">'3.0.3'</span>
<span class="text-purple">paths:</span>
  <span class="text-blue">/auth/login:</span>
    <span class="text-purple">post:</span>
      <span class="text-purple">operationId:</span> <span class="text-green">login</span>
      <span class="text-purple">requestBody:</span>
        <span class="text-purple">content:</span>
          <span class="text-purple">application/json:</span>
            <span class="text-purple">schema:</span>
              <span class="text-purple">$ref:</span> <span class="text-green">'#/components/schemas/LoginRequest'</span>
      <span class="text-purple">responses:</span>
        <span class="text-green">'200':</span>
          <span class="text-purple">description:</span> <span class="text-green">'Successful login'</span></pre>
          </div>
        </div>
      </section>

      <!-- Implementation Steps -->
      <section id="implementation">
        <h2>
          <span class="icon text-blue">code</span>
          Schritt-für-Schritt Implementierung
        </h2>

        <div class="step-card">
          <div class="step-number bg-purple-solid">1</div>
          <div class="step-content">
            <h3>Figma Design vorbereiten</h3>
            <p class="text-slate">
              Komponenten in Figma mit speziellen Prefixen benennen (@form/, @data/, @action/, @nav/).
              Export via Figma Make als HTML/CSS.
            </p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number bg-green-solid">2</div>
          <div class="step-content">
            <h3>Business Specs erstellen</h3>
            <p class="text-slate">
              Markdown-Dateien für jeden Use Case anlegen. API-Bindings, Validierungen
              und State-Transitions definieren.
            </p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number bg-blue-solid">3</div>
          <div class="step-content">
            <h3>MCP Server konfigurieren</h3>
            <p class="text-slate">
              MCP-Server in Claude Desktop oder Claude Code registrieren.
            </p>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number bg-orange-solid">4</div>
          <div class="step-content">
            <h3>Pipeline ausführen</h3>
            <p class="text-slate">
              Claude mit dem MCP-Server die Transformation durchführen lassen.
            </p>
          </div>
        </div>
      </section>

      <!-- Summary -->
      <section id="summary" style="padding-bottom: 32px;">
        <div class="card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1));">
          <h2>
            <span class="icon text-blue">lightbulb</span>
            Zusammenfassung
          </h2>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div>
              <h4 class="mb-4">Was diese Pipeline ermöglicht:</h4>
              <ul class="check-list">
                <li><span class="icon text-green">check_circle</span> Design-to-Code ohne manuelle Übertragung</li>
                <li><span class="icon text-green">check_circle</span> Business-Logik aus strukturierten Markdown-Specs</li>
                <li><span class="icon text-green">check_circle</span> Typisierte Services aus OpenAPI-Definitionen</li>
                <li><span class="icon text-green">check_circle</span> Production-ready Angular mit Best Practices</li>
              </ul>
            </div>
            <div>
              <h4 class="mb-4">Voraussetzungen:</h4>
              <ul class="check-list">
                <li><span class="icon text-blue">arrow_right</span> Figma Design mit benannten Komponenten</li>
                <li><span class="icon text-blue">arrow_right</span> Vollständige Business-Spezifikationen (Markdown)</li>
                <li><span class="icon text-blue">arrow_right</span> OpenAPI/Swagger API-Definition</li>
                <li><span class="icon text-blue">arrow_right</span> MCP-fähiger Claude Client</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

// Register the custom element
if (!customElements.get('figma-angular-mcp-pipeline')) {
  customElements.define('figma-angular-mcp-pipeline', FigmaAngularMcpPipeline);
}

export default FigmaAngularMcpPipeline;
