/**
 * Figma-to-Angular MCP Pipeline V2 Documentation
 * Focus: Pattern Recognition & Semantic Extraction
 */

class FigmaAngularMcpPipelineV2 extends HTMLElement {
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
        font-display: block;
        src: url(https://fonts.gstatic.com/s/materialiconsoutlined/v109/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUce.woff2) format('woff2');
      }

      .material-icons-outlined, .icon {
        font-family: 'Material Icons Outlined' !important;
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
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
        width: 280px;
        flex-shrink: 0;
        background: rgba(255, 255, 255, 0.03);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px 16px;
        overflow-y: auto;
      }

      .sidebar-title {
        font-size: 14px;
        font-weight: 600;
        color: #60a5fa;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .doc-sidebar nav {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .nav-section {
        margin-bottom: 16px;
      }

      .nav-section-title {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #64748b;
        margin-bottom: 8px;
        padding-left: 12px;
      }

      .doc-sidebar a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 13px;
        color: #94a3b8;
        text-decoration: none;
        transition: all 0.2s ease;
      }

      .doc-sidebar a:hover {
        background: rgba(59, 130, 246, 0.1);
        color: #fff;
      }

      .doc-sidebar a.active {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
      }

      .nav-icon {
        font-size: 18px;
      }

      .nav-badge {
        margin-left: auto;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 600;
      }

      .badge-new {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
      }

      .badge-v2 {
        background: rgba(168, 85, 247, 0.2);
        color: #a855f7;
      }

      /* Main Content */
      .doc-content {
        flex: 1;
        padding: 32px 48px;
        overflow-y: auto;
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%);
      }

      .doc-content h1 {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 8px;
        background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .doc-content h2 {
        font-size: 22px;
        font-weight: 600;
        margin: 48px 0 20px;
        color: #f1f5f9;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .doc-content h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 28px 0 12px;
        color: #e2e8f0;
      }

      .doc-content p {
        font-size: 14px;
        line-height: 1.7;
        color: #94a3b8;
        margin: 0 0 16px;
      }

      .lead {
        font-size: 16px;
        color: #cbd5e1;
        margin-bottom: 32px;
      }

      /* Icons - override base size for specific contexts */
      .icon {
        font-size: 20px;
        vertical-align: middle;
      }

      /* Problem Box */
      .problem-box {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
      }

      .problem-box h3 {
        color: #f87171;
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .problem-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .problem-list li {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        font-size: 14px;
        color: #cbd5e1;
      }

      .problem-list li:last-child {
        border-bottom: none;
      }

      .problem-list .icon {
        color: #f87171;
        font-size: 18px;
        margin-top: 2px;
      }

      /* Solution Box */
      .solution-box {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
      }

      .solution-box h3 {
        color: #4ade80;
        margin-top: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .solution-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .solution-list li {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        font-size: 14px;
        color: #cbd5e1;
      }

      .solution-list li:last-child {
        border-bottom: none;
      }

      .solution-list .icon {
        color: #4ade80;
        font-size: 18px;
        margin-top: 2px;
      }

      /* Comparison */
      .comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin: 32px 0;
      }

      .comparison-side {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        overflow: hidden;
      }

      .comparison-header {
        padding: 12px 16px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .comparison-header.bad {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }

      .comparison-header.good {
        background: rgba(34, 197, 94, 0.15);
        color: #4ade80;
      }

      .comparison-content {
        padding: 16px;
      }

      /* Code Blocks */
      pre {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 16px;
        overflow-x: auto;
        font-size: 12px;
        line-height: 1.6;
        margin: 16px 0;
      }

      code {
        color: #e2e8f0;
      }

      .code-comment { color: #64748b; }
      .code-tag { color: #f472b6; }
      .code-attr { color: #60a5fa; }
      .code-string { color: #4ade80; }
      .code-keyword { color: #c084fc; }

      /* Pipeline Diagram */
      .pipeline {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 32px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        margin: 32px 0;
        overflow-x: auto;
      }

      .pipeline-stage {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        min-width: 140px;
      }

      .pipeline-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
      }

      .pipeline-icon.figma { background: linear-gradient(135deg, #f24e1e, #ff7262); }
      .pipeline-icon.mcp { background: linear-gradient(135deg, #8b5cf6, #a855f7); }
      .pipeline-icon.angular { background: linear-gradient(135deg, #dd0031, #c3002f); }

      .pipeline-label {
        font-size: 12px;
        font-weight: 500;
        color: #94a3b8;
        text-align: center;
      }

      .pipeline-arrow {
        font-size: 24px;
        color: #475569;
      }

      /* MCP Layers */
      .mcp-layers {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 32px 0;
      }

      .mcp-layer {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 12px;
      }

      .mcp-layer-number {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #8b5cf6, #a855f7);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 700;
        color: white;
        flex-shrink: 0;
      }

      .mcp-layer-content {
        flex: 1;
      }

      .mcp-layer-title {
        font-size: 15px;
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 4px;
      }

      .mcp-layer-desc {
        font-size: 13px;
        color: #94a3b8;
      }

      /* Pattern Card */
      .pattern-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin: 24px 0;
      }

      .pattern-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
      }

      .pattern-card h4 {
        font-size: 14px;
        font-weight: 600;
        color: #e2e8f0;
        margin: 0 0 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pattern-card p {
        font-size: 13px;
        color: #94a3b8;
        margin: 0;
      }

      /* Feature List */
      .feature-list {
        list-style: none;
        padding: 0;
        margin: 24px 0;
      }

      .feature-list li {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #cbd5e1;
      }

      .feature-list .icon {
        color: #60a5fa;
        font-size: 20px;
        margin-top: 2px;
      }

      /* Info Box */
      .info-box {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 24px 0;
        display: flex;
        gap: 16px;
      }

      .info-box .icon {
        color: #60a5fa;
        font-size: 24px;
        flex-shrink: 0;
      }

      .info-box p {
        margin: 0;
        color: #cbd5e1;
      }

      /* Section Divider */
      .section-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        margin: 48px 0;
      }
    `;
  }

  getSidebar() {
    return `
      <div class="sidebar-title">MCP Pipeline V2</div>
      <nav>
        <div class="nav-section">
          <div class="nav-section-title">Übersicht</div>
          <a href="#intro" class="active">
            <span class="icon nav-icon">home</span>
            Einführung
          </a>
          <a href="#problem">
            <span class="icon nav-icon">warning</span>
            Das Problem
          </a>
          <a href="#solution">
            <span class="icon nav-icon">lightbulb</span>
            Die Lösung
            <span class="nav-badge badge-v2">V2</span>
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">MCP Server Architektur</div>
          <a href="#layer-1">
            <span class="icon nav-icon">search</span>
            Pattern Recognition
            <span class="nav-badge badge-new">Neu</span>
          </a>
          <a href="#layer-2">
            <span class="icon nav-icon">data_object</span>
            Semantic Extraction
          </a>
          <a href="#layer-3">
            <span class="icon nav-icon">widgets</span>
            Component Mapping
          </a>
          <a href="#layer-4">
            <span class="icon nav-icon">cleaning_services</span>
            Structure Cleanup
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Patterns</div>
          <a href="#patterns">
            <span class="icon nav-icon">grid_view</span>
            UI Patterns
          </a>
          <a href="#config">
            <span class="icon nav-icon">settings</span>
            Konfiguration
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Ergebnis</div>
          <a href="#output">
            <span class="icon nav-icon">code</span>
            Angular Output
          </a>
        </div>
      </nav>
    `;
  }

  getContent() {
    return `
      <section id="intro">
        <h1>Figma-to-Angular Pipeline V2</h1>
        <p class="lead">
          Vom visuellen Chaos zur semantischen Struktur. Der MCP-Server als intelligente Zwischenschicht,
          die nicht nur übersetzt, sondern <strong>versteht</strong>.
        </p>

        <div class="pipeline">
          <div class="pipeline-stage">
            <div class="pipeline-icon figma">
              <span class="icon">palette</span>
            </div>
            <span class="pipeline-label">Figma Export<br><small>(chaotisch)</small></span>
          </div>
          <span class="pipeline-arrow">→</span>
          <div class="pipeline-stage">
            <div class="pipeline-icon mcp">
              <span class="icon">psychology</span>
            </div>
            <span class="pipeline-label">MCP Server<br><small>(Pattern Recognition)</small></span>
          </div>
          <span class="pipeline-arrow">→</span>
          <div class="pipeline-stage">
            <div class="pipeline-icon angular">
              <span class="icon">code</span>
            </div>
            <span class="pipeline-label">Angular App<br><small>(clean components)</small></span>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="problem">
        <h2><span class="icon" style="color: #f87171;">warning</span> Das Kernproblem</h2>

        <p>Figma Export (auch mit Figma Make) liefert <strong>visuelles Markup</strong>, keine semantische Struktur.
        Was für Menschen gleich aussieht, ist im Code völlig unterschiedlich implementiert.</p>

        <div class="problem-box">
          <h3><span class="icon">error</span> Typische Probleme im Figma Export</h3>
          <ul class="problem-list">
            <li>
              <span class="icon">close</span>
              <div>
                <strong>Inkonsistente Strukturen</strong><br>
                4 identisch aussehende Cards = 4 verschiedene HTML-Strukturen
              </div>
            </li>
            <li>
              <span class="icon">close</span>
              <div>
                <strong>Wrapper-Hölle</strong><br>
                5-7 verschachtelte Divs für eine einfache Card
              </div>
            </li>
            <li>
              <span class="icon">close</span>
              <div>
                <strong>Keine semantischen Klassen</strong><br>
                .frame-123, .group-456 statt .feature-card, .nav-item
              </div>
            </li>
            <li>
              <span class="icon">close</span>
              <div>
                <strong>Fehlende Component-Grenzen</strong><br>
                Wo endet die Card? Wo beginnt der Container?
              </div>
            </li>
          </ul>
        </div>

        <h3>Beispiel: 4 Feature Cards im Figma Export</h3>

        <div class="comparison">
          <div class="comparison-side">
            <div class="comparison-header bad">
              <span class="icon">close</span> Figma Export (Realität)
            </div>
            <div class="comparison-content">
              <pre><code><span class="code-comment">&lt;!-- Card 1 --&gt;</span>
<span class="code-tag">&lt;div</span> <span class="code-attr">class=</span><span class="code-string">"frame-892"</span><span class="code-tag">&gt;</span>
  <span class="code-tag">&lt;div</span> <span class="code-attr">class=</span><span class="code-string">"group-234"</span><span class="code-tag">&gt;</span>
    <span class="code-tag">&lt;div</span> <span class="code-attr">class=</span><span class="code-string">"frame-893"</span><span class="code-tag">&gt;</span>
      <span class="code-tag">&lt;div</span> <span class="code-attr">class=</span><span class="code-string">"rectangle-12"</span><span class="code-tag">&gt;</span>
        <span class="code-tag">&lt;img</span> .../&gt;
      <span class="code-tag">&lt;/div&gt;</span>
      <span class="code-tag">&lt;div</span> <span class="code-attr">class=</span><span class="code-string">"text-wrapper-45"</span><span class="code-tag">&gt;</span>
        Speed
      <span class="code-tag">&lt;/div&gt;</span>
    <span class="code-tag">&lt;/div&gt;</span>
  <span class="code-tag">&lt;/div&gt;</span>
<span class="code-tag">&lt;/div&gt;</span>

<span class="code-comment">&lt;!-- Card 2 - komplett andere Struktur! --&gt;</span>
<span class="code-tag">&lt;div</span> <span class="code-attr">class=</span><span class="code-string">"auto-layout-78"</span><span class="code-tag">&gt;</span>
  <span class="code-tag">&lt;span</span> <span class="code-attr">class=</span><span class="code-string">"icon-instance"</span><span class="code-tag">&gt;</span>...<span class="code-tag">&lt;/span&gt;</span>
  <span class="code-tag">&lt;p</span> <span class="code-attr">class=</span><span class="code-string">"security-title"</span><span class="code-tag">&gt;</span>Security<span class="code-tag">&lt;/p&gt;</span>
<span class="code-tag">&lt;/div&gt;</span></code></pre>
            </div>
          </div>

          <div class="comparison-side">
            <div class="comparison-header good">
              <span class="icon">check</span> Nach MCP V2 Processing
            </div>
            <div class="comparison-content">
              <pre><code><span class="code-comment">&lt;!-- Erkannt: 4x FeatureCard Pattern --&gt;</span>
<span class="code-tag">&lt;app-feature-card</span>
  <span class="code-attr">[icon]=</span><span class="code-string">"'speed'"</span>
  <span class="code-attr">[title]=</span><span class="code-string">"'Speed'"</span>
  <span class="code-attr">[description]=</span><span class="code-string">"'Fast processing'"</span>
<span class="code-tag">/&gt;</span>

<span class="code-tag">&lt;app-feature-card</span>
  <span class="code-attr">[icon]=</span><span class="code-string">"'security'"</span>
  <span class="code-attr">[title]=</span><span class="code-string">"'Security'"</span>
  <span class="code-attr">[description]=</span><span class="code-string">"'Enterprise grade'"</span>
<span class="code-tag">/&gt;</span>

<span class="code-comment">&lt;!-- Gleiche Component, konsistent --&gt;</span></code></pre>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="solution">
        <h2><span class="icon" style="color: #4ade80;">lightbulb</span> Die V2 Lösung</h2>

        <p>Der MCP-Server wird zum <strong>Semantic Layer</strong> - er analysiert, normalisiert und mappt
        visuelle Patterns auf wiederverwendbare Components.</p>

        <div class="solution-box">
          <h3><span class="icon">check_circle</span> Was V2 anders macht</h3>
          <ul class="solution-list">
            <li>
              <span class="icon">check</span>
              <div>
                <strong>Pattern Recognition</strong><br>
                Erkennt: "Das sind 4 visuell identische Cards" trotz unterschiedlichem Markup
              </div>
            </li>
            <li>
              <span class="icon">check</span>
              <div>
                <strong>Semantic Extraction</strong><br>
                Extrahiert: Title, Description, Icon, Link - unabhängig von der HTML-Struktur
              </div>
            </li>
            <li>
              <span class="icon">check</span>
              <div>
                <strong>Component Mapping</strong><br>
                Mappt erkannte Patterns auf vordefinierte Angular Components
              </div>
            </li>
            <li>
              <span class="icon">check</span>
              <div>
                <strong>Structure Normalization</strong><br>
                Entfernt unnötige Wrapper, flacht Hierarchien ab
              </div>
            </li>
          </ul>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="layer-1">
        <h2><span class="icon" style="color: #a855f7;">search</span> Layer 1: Pattern Recognition</h2>

        <p>Der erste Schritt analysiert den Figma Export und identifiziert wiederkehrende visuelle Patterns -
        unabhängig davon, wie sie im HTML strukturiert sind.</p>

        <div class="mcp-layers">
          <div class="mcp-layer">
            <div class="mcp-layer-number">1a</div>
            <div class="mcp-layer-content">
              <div class="mcp-layer-title">Visual Similarity Analysis</div>
              <div class="mcp-layer-desc">Vergleicht Elemente nach visuellen Eigenschaften: Größe, Position, Abstände, Farben</div>
            </div>
          </div>
          <div class="mcp-layer">
            <div class="mcp-layer-number">1b</div>
            <div class="mcp-layer-content">
              <div class="mcp-layer-title">Repetition Detection</div>
              <div class="mcp-layer-desc">Findet Gruppen von ähnlichen Elementen (z.B. 4 Cards in einer Row)</div>
            </div>
          </div>
          <div class="mcp-layer">
            <div class="mcp-layer-number">1c</div>
            <div class="mcp-layer-content">
              <div class="mcp-layer-title">Pattern Classification</div>
              <div class="mcp-layer-desc">Ordnet erkannte Patterns bekannten UI-Typen zu (Card, List, Nav, etc.)</div>
            </div>
          </div>
        </div>

        <h3>Erkennungs-Algorithmus</h3>
        <pre><code><span class="code-keyword">interface</span> PatternMatch {
  type: <span class="code-string">'card'</span> | <span class="code-string">'list-item'</span> | <span class="code-string">'nav-item'</span> | <span class="code-string">'form-field'</span>;
  confidence: number;  <span class="code-comment">// 0-1</span>
  elements: HTMLElement[];
  extractedData: Record&lt;string, any&gt;;
}

<span class="code-keyword">function</span> detectPatterns(container: Element): PatternMatch[] {
  <span class="code-comment">// 1. Finde alle "Blätter" (Elemente ohne tiefe Kinder)</span>
  <span class="code-keyword">const</span> leaves = findLeafElements(container);

  <span class="code-comment">// 2. Gruppiere nach visueller Ähnlichkeit</span>
  <span class="code-keyword">const</span> groups = groupBySimilarity(leaves, {
    sizeThreshold: 0.1,    <span class="code-comment">// 10% Größenabweichung erlaubt</span>
    positionPattern: true,  <span class="code-comment">// Gleichmäßige Abstände?</span>
  });

  <span class="code-comment">// 3. Klassifiziere jede Gruppe</span>
  <span class="code-keyword">return</span> groups.map(classifyPattern);
}</code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="layer-2">
        <h2><span class="icon" style="color: #60a5fa;">data_object</span> Layer 2: Semantic Extraction</h2>

        <p>Nach der Pattern-Erkennung werden die semantischen Inhalte extrahiert -
        unabhängig von der konkreten HTML-Struktur.</p>

        <div class="info-box">
          <span class="icon">info</span>
          <p>
            <strong>Das Ziel:</strong> Aus beliebig verschachteltem Markup die eigentlichen Daten extrahieren.
            Eine Card hat einen Titel, eine Beschreibung, ein Icon - egal wie viele Wrapper drumherum sind.
          </p>
        </div>

        <h3>Extraktions-Regeln pro Pattern</h3>
        <pre><code><span class="code-keyword">const</span> extractors: Record&lt;PatternType, Extractor&gt; = {
  card: {
    title: [
      <span class="code-string">'h1, h2, h3, h4'</span>,
      <span class="code-string">'[class*="title"], [class*="heading"]'</span>,
      <span class="code-string">':scope > div:first-child'</span>  <span class="code-comment">// Fallback: erstes Kind</span>
    ],
    description: [
      <span class="code-string">'p, [class*="desc"], [class*="text"]'</span>
    ],
    icon: [
      <span class="code-string">'svg, img, [class*="icon"]'</span>,
      <span class="code-string">'span.material-icons'</span>
    ],
    link: [
      <span class="code-string">'a[href]'</span>,
      <span class="code-string">'[data-href], [onclick]'</span>
    ]
  },
  <span class="code-comment">// ... weitere Patterns</span>
};</code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="layer-3">
        <h2><span class="icon" style="color: #f59e0b;">widgets</span> Layer 3: Component Mapping</h2>

        <p>Erkannte Patterns werden auf vordefinierte Angular Components gemappt.
        Das Mapping ist konfigurierbar und erweiterbar.</p>

        <div class="pattern-grid">
          <div class="pattern-card">
            <h4><span class="icon" style="color: #60a5fa;">dashboard</span> Card Pattern</h4>
            <p>→ <code>&lt;app-card&gt;</code> mit Varianten: feature, pricing, team, testimonial</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon" style="color: #4ade80;">list</span> List Pattern</h4>
            <p>→ <code>&lt;app-list-item&gt;</code> für Navigation, Features, Specs</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon" style="color: #f59e0b;">input</span> Form Pattern</h4>
            <p>→ <code>&lt;app-form-field&gt;</code> mit Validierung aus Specs</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon" style="color: #a855f7;">menu</span> Navigation Pattern</h4>
            <p>→ <code>&lt;app-nav&gt;</code> mit Routing-Integration</p>
          </div>
        </div>

        <h3>Mapping-Konfiguration</h3>
        <pre><code><span class="code-comment">// pattern-mapping.config.ts</span>
<span class="code-keyword">export const</span> patternMapping = {
  card: {
    component: <span class="code-string">'CardComponent'</span>,
    variants: {
      <span class="code-string">'has-icon'</span>: <span class="code-string">'FeatureCardComponent'</span>,
      <span class="code-string">'has-price'</span>: <span class="code-string">'PricingCardComponent'</span>,
      <span class="code-string">'has-avatar'</span>: <span class="code-string">'TeamCardComponent'</span>,
    },
    props: {
      title: <span class="code-string">'title'</span>,
      description: <span class="code-string">'description'</span>,
      icon: <span class="code-string">'iconName'</span>,
    }
  }
};</code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="layer-4">
        <h2><span class="icon" style="color: #22d3ee;">cleaning_services</span> Layer 4: Structure Cleanup</h2>

        <p>Der finale Schritt entfernt unnötige Wrapper und normalisiert die Struktur für sauberen Angular Output.</p>

        <ul class="feature-list">
          <li>
            <span class="icon">layers_clear</span>
            <div>
              <strong>Wrapper-Elimination</strong><br>
              Entfernt Divs die nur ein Kind haben und keine eigenen Styles tragen
            </div>
          </li>
          <li>
            <span class="icon">compress</span>
            <div>
              <strong>Hierarchy Flattening</strong><br>
              Reduziert Verschachtelungstiefe wo möglich (max 3 Level)
            </div>
          </li>
          <li>
            <span class="icon">label</span>
            <div>
              <strong>Class Normalization</strong><br>
              Ersetzt .frame-123 durch semantische Klassen wie .feature-section
            </div>
          </li>
          <li>
            <span class="icon">sort</span>
            <div>
              <strong>Order Normalization</strong><br>
              Sortiert Elemente nach logischer Reihenfolge (Header vor Content vor Footer)
            </div>
          </li>
        </ul>
      </section>

      <div class="section-divider"></div>

      <section id="patterns">
        <h2><span class="icon" style="color: #60a5fa;">grid_view</span> Unterstützte UI Patterns</h2>

        <p>Diese Patterns werden automatisch erkannt und auf Components gemappt:</p>

        <div class="pattern-grid">
          <div class="pattern-card">
            <h4><span class="icon">view_agenda</span> Hero Section</h4>
            <p>Headline, Subline, CTA Buttons, Background Image</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon">dashboard</span> Feature Grid</h4>
            <p>2-4 Spalten von Feature Cards mit Icons</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon">payments</span> Pricing Table</h4>
            <p>Pricing Cards mit Features-Liste</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon">groups</span> Team Section</h4>
            <p>Personen-Cards mit Avatar, Name, Rolle</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon">format_quote</span> Testimonials</h4>
            <p>Zitate mit Autor und Company</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon">contact_mail</span> Contact Form</h4>
            <p>Formular-Felder mit Labels und Validation</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon">menu</span> Navigation</h4>
            <p>Header Nav, Sidebar, Footer Links</p>
          </div>
          <div class="pattern-card">
            <h4><span class="icon">help_outline</span> FAQ Accordion</h4>
            <p>Frage-Antwort Paare, erweiterbar</p>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="config">
        <h2><span class="icon" style="color: #94a3b8;">settings</span> Konfiguration</h2>

        <p>Das Pattern-Mapping ist vollständig konfigurierbar über eine zentrale Config-Datei:</p>

        <pre><code><span class="code-comment">// mcp-pipeline.config.yaml</span>
<span class="code-keyword">patterns:</span>
  <span class="code-keyword">card:</span>
    <span class="code-keyword">detection:</span>
      <span class="code-keyword">minSimilarity:</span> <span class="code-string">0.85</span>
      <span class="code-keyword">minGroupSize:</span> <span class="code-string">2</span>
    <span class="code-keyword">extraction:</span>
      <span class="code-keyword">title:</span>
        <span class="code-keyword">selectors:</span> [<span class="code-string">'h1-h4'</span>, <span class="code-string">'[class*=title]'</span>]
        <span class="code-keyword">required:</span> <span class="code-string">true</span>
      <span class="code-keyword">description:</span>
        <span class="code-keyword">selectors:</span> [<span class="code-string">'p'</span>, <span class="code-string">'[class*=desc]'</span>]
        <span class="code-keyword">required:</span> <span class="code-string">false</span>
    <span class="code-keyword">mapping:</span>
      <span class="code-keyword">component:</span> <span class="code-string">'CardComponent'</span>
      <span class="code-keyword">module:</span> <span class="code-string">'@app/shared/components'</span>

<span class="code-keyword">cleanup:</span>
  <span class="code-keyword">maxNestingDepth:</span> <span class="code-string">3</span>
  <span class="code-keyword">removeEmptyWrappers:</span> <span class="code-string">true</span>
  <span class="code-keyword">normalizeClassNames:</span> <span class="code-string">true</span></code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="output">
        <h2><span class="icon" style="color: #4ade80;">code</span> Angular Output</h2>

        <p>Das Endergebnis: Saubere, wiederverwendbare Angular Components statt Copy-Paste Markup.</p>

        <div class="comparison">
          <div class="comparison-side">
            <div class="comparison-header bad">
              <span class="icon">close</span> Ohne MCP V2
            </div>
            <div class="comparison-content">
              <pre><code><span class="code-comment">&lt;!-- 200+ Zeilen Spaghetti-HTML --&gt;</span>
<span class="code-comment">&lt;!-- Keine Wiederverwendbarkeit --&gt;</span>
<span class="code-comment">&lt;!-- Inkonsistente Styles --&gt;</span>
<span class="code-comment">&lt;!-- Keine Typisierung --&gt;</span></code></pre>
            </div>
          </div>

          <div class="comparison-side">
            <div class="comparison-header good">
              <span class="icon">check</span> Mit MCP V2
            </div>
            <div class="comparison-content">
              <pre><code><span class="code-tag">&lt;app-hero</span>
  <span class="code-attr">[headline]=</span><span class="code-string">"'Build faster'"</span>
  <span class="code-attr">[subline]=</span><span class="code-string">"'Ship with confidence'"</span>
  <span class="code-attr">[ctaText]=</span><span class="code-string">"'Get Started'"</span>
  <span class="code-attr">(ctaClick)=</span><span class="code-string">"onGetStarted()"</span>
<span class="code-tag">/&gt;</span>

<span class="code-tag">&lt;app-feature-grid&gt;</span>
  <span class="code-tag">&lt;app-feature-card</span>
    <span class="code-attr">*ngFor=</span><span class="code-string">"let f of features"</span>
    <span class="code-attr">[data]=</span><span class="code-string">"f"</span>
  <span class="code-tag">/&gt;</span>
<span class="code-tag">&lt;/app-feature-grid&gt;</span></code></pre>
            </div>
          </div>
        </div>

        <div class="info-box">
          <span class="icon">rocket_launch</span>
          <p>
            <strong>Das Ergebnis:</strong> Von Figma zu Production-Ready Angular in Minuten statt Tagen.
            Konsistente Components, typisiert, testbar, wartbar.
          </p>
        </div>
      </section>
    `;
  }
}

customElements.define('figma-angular-mcp-pipeline-v2', FigmaAngularMcpPipelineV2);
