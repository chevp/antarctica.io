/**
 * Figma-to-Angular MCP Pipeline V3 Documentation
 * Focus: MCP Server Architecture Deep-Dive
 */

class FigmaAngularMcpPipelineV3 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupNavigation();
    this.setupTabs();
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
        // Update active state
        this.shadowRoot.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  setupTabs() {
    this.shadowRoot.querySelectorAll('.tab-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const tab = e.target.closest('.tab-btn');
        if (!tab) return;

        const container = tab.closest('.tabs');
        const tabId = tab.dataset.tab;

        container.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        container.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
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
        width: 300px;
        flex-shrink: 0;
        background: rgba(255, 255, 255, 0.03);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px 16px;
        overflow-y: auto;
      }

      .sidebar-title {
        font-size: 14px;
        font-weight: 600;
        color: #a855f7;
        margin-bottom: 8px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .sidebar-subtitle {
        font-size: 11px;
        color: #64748b;
        margin-bottom: 16px;
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
        background: rgba(168, 85, 247, 0.1);
        color: #fff;
      }

      .doc-sidebar a.active {
        background: rgba(168, 85, 247, 0.15);
        color: #a855f7;
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

      .badge-new { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
      .badge-v3 { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
      .badge-core { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }

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
        background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
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

      .doc-content h4 {
        font-size: 14px;
        font-weight: 600;
        margin: 20px 0 8px;
        color: #cbd5e1;
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

      /* Icons */
      .icon {
        font-size: 20px;
        vertical-align: middle;
      }

      /* Architecture Diagram */
      .architecture-diagram {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 16px;
        padding: 32px;
        margin: 32px 0;
      }

      .arch-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-bottom: 24px;
      }

      .arch-row:last-child { margin-bottom: 0; }

      .arch-box {
        padding: 16px 24px;
        border-radius: 12px;
        text-align: center;
        min-width: 140px;
      }

      .arch-box.figma {
        background: linear-gradient(135deg, rgba(242, 78, 30, 0.2), rgba(255, 114, 98, 0.1));
        border: 1px solid rgba(242, 78, 30, 0.4);
      }

      .arch-box.mcp {
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.1));
        border: 1px solid rgba(168, 85, 247, 0.4);
        min-width: 500px;
      }

      .arch-box.angular {
        background: linear-gradient(135deg, rgba(221, 0, 49, 0.2), rgba(195, 0, 47, 0.1));
        border: 1px solid rgba(221, 0, 49, 0.4);
      }

      .arch-box-title {
        font-size: 14px;
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 4px;
      }

      .arch-box-subtitle {
        font-size: 11px;
        color: #94a3b8;
      }

      .arch-arrow {
        font-size: 24px;
        color: #475569;
      }

      .arch-arrow.vertical {
        transform: rotate(90deg);
        margin: 8px 0;
      }

      /* MCP Server Layers */
      .mcp-internal {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-top: 16px;
      }

      .mcp-layer-box {
        background: rgba(168, 85, 247, 0.1);
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 8px;
        padding: 12px;
        text-align: center;
      }

      .mcp-layer-box .icon {
        font-size: 24px;
        color: #a855f7;
        margin-bottom: 8px;
      }

      .mcp-layer-box-title {
        font-size: 11px;
        font-weight: 600;
        color: #e2e8f0;
      }

      /* Directory Structure */
      .directory-tree {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px 24px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        margin: 24px 0;
      }

      .dir-line {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        color: #94a3b8;
      }

      .dir-line .icon {
        font-size: 16px;
      }

      .dir-line.folder .icon { color: #60a5fa; }
      .dir-line.file .icon { color: #4ade80; }
      .dir-line.config .icon { color: #f59e0b; }
      .dir-line.proto .icon { color: #a855f7; }

      .dir-indent-1 { padding-left: 20px; }
      .dir-indent-2 { padding-left: 40px; }
      .dir-indent-3 { padding-left: 60px; }

      .dir-comment {
        color: #64748b;
        margin-left: auto;
        font-size: 11px;
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

      code { color: #e2e8f0; }

      .code-comment { color: #64748b; }
      .code-tag { color: #f472b6; }
      .code-attr { color: #60a5fa; }
      .code-string { color: #4ade80; }
      .code-keyword { color: #c084fc; }
      .code-type { color: #22d3ee; }
      .code-number { color: #f59e0b; }
      .code-function { color: #fbbf24; }

      /* Tabs */
      .tabs {
        margin: 24px 0;
      }

      .tab-header {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 16px;
      }

      .tab-btn {
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 500;
        color: #64748b;
        background: none;
        border: none;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        transition: all 0.2s;
      }

      .tab-btn:hover { color: #94a3b8; }

      .tab-btn.active {
        color: #a855f7;
        border-bottom-color: #a855f7;
      }

      .tab-content {
        display: none;
      }

      .tab-content.active {
        display: block;
      }

      /* Module Cards */
      .module-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin: 24px 0;
      }

      .module-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        transition: all 0.2s;
      }

      .module-card:hover {
        border-color: rgba(168, 85, 247, 0.3);
        background: rgba(168, 85, 247, 0.05);
      }

      .module-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .module-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .module-icon.parser { background: linear-gradient(135deg, #3b82f6, #2563eb); }
      .module-icon.analyzer { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
      .module-icon.mapper { background: linear-gradient(135deg, #f59e0b, #d97706); }
      .module-icon.generator { background: linear-gradient(135deg, #22c55e, #16a34a); }

      .module-title {
        font-size: 15px;
        font-weight: 600;
        color: #e2e8f0;
      }

      .module-subtitle {
        font-size: 11px;
        color: #64748b;
      }

      .module-desc {
        font-size: 13px;
        color: #94a3b8;
        margin-bottom: 12px;
      }

      .module-files {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .file-tag {
        font-size: 11px;
        font-family: 'JetBrains Mono', monospace;
        padding: 4px 8px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        color: #94a3b8;
      }

      /* Protocol Box */
      .protocol-box {
        background: rgba(168, 85, 247, 0.1);
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
      }

      .protocol-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .protocol-header .icon {
        color: #a855f7;
        font-size: 24px;
      }

      .protocol-title {
        font-size: 16px;
        font-weight: 600;
        color: #e2e8f0;
      }

      /* Data Flow */
      .data-flow {
        display: flex;
        align-items: stretch;
        gap: 0;
        margin: 32px 0;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        overflow: hidden;
      }

      .flow-step {
        flex: 1;
        padding: 20px;
        text-align: center;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
      }

      .flow-step:last-child { border-right: none; }

      .flow-step::after {
        content: '→';
        position: absolute;
        right: -8px;
        top: 50%;
        transform: translateY(-50%);
        color: #475569;
        font-size: 16px;
        z-index: 1;
      }

      .flow-step:last-child::after { display: none; }

      .flow-number {
        width: 28px;
        height: 28px;
        background: rgba(168, 85, 247, 0.2);
        border: 1px solid rgba(168, 85, 247, 0.4);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        font-size: 12px;
        font-weight: 600;
        color: #a855f7;
      }

      .flow-title {
        font-size: 13px;
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 4px;
      }

      .flow-desc {
        font-size: 11px;
        color: #64748b;
      }

      /* Info & Warning Boxes */
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

      .info-box p { margin: 0; color: #cbd5e1; }

      .tip-box {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 24px 0;
        display: flex;
        gap: 16px;
      }

      .tip-box .icon {
        color: #4ade80;
        font-size: 24px;
        flex-shrink: 0;
      }

      .tip-box p { margin: 0; color: #cbd5e1; }

      /* Section Divider */
      .section-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        margin: 48px 0;
      }

      /* Interface Table */
      .interface-table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
        font-size: 13px;
      }

      .interface-table th {
        text-align: left;
        padding: 12px;
        background: rgba(0, 0, 0, 0.3);
        color: #94a3b8;
        font-weight: 500;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .interface-table td {
        padding: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: #cbd5e1;
      }

      .interface-table code {
        font-size: 12px;
        padding: 2px 6px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }

      /* API Method */
      .api-method {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        margin: 16px 0;
        overflow: hidden;
      }

      .api-method-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .method-badge {
        font-size: 10px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        text-transform: uppercase;
      }

      .method-badge.tool { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
      .method-badge.resource { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
      .method-badge.prompt { background: rgba(168, 85, 247, 0.2); color: #a855f7; }

      .method-name {
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        font-weight: 500;
        color: #e2e8f0;
      }

      .api-method-body {
        padding: 16px;
      }

      .method-desc {
        font-size: 13px;
        color: #94a3b8;
        margin-bottom: 12px;
      }

      /* Context Layer Styles */
      .context-diagram {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 16px;
        padding: 32px;
        margin: 32px 0;
      }

      .context-layers {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .context-layer {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .context-layer.business {
        background: rgba(34, 197, 94, 0.1);
        border-color: rgba(34, 197, 94, 0.3);
      }

      .context-layer.api {
        background: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.3);
      }

      .context-layer.ui {
        background: rgba(168, 85, 247, 0.1);
        border-color: rgba(168, 85, 247, 0.3);
      }

      .context-layer-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .context-layer.business .context-layer-icon {
        background: linear-gradient(135deg, #22c55e, #16a34a);
      }

      .context-layer.api .context-layer-icon {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
      }

      .context-layer.ui .context-layer-icon {
        background: linear-gradient(135deg, #a855f7, #7c3aed);
      }

      .context-layer-content {
        flex: 1;
      }

      .context-layer-title {
        font-size: 15px;
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 4px;
      }

      .context-layer-desc {
        font-size: 13px;
        color: #94a3b8;
      }

      .context-layer-files {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }

      /* Markdown Structure */
      .md-structure {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        overflow: hidden;
        margin: 24px 0;
      }

      .md-structure-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: rgba(34, 197, 94, 0.15);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 13px;
        font-weight: 600;
        color: #4ade80;
      }

      .md-structure-content {
        padding: 16px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        line-height: 1.6;
      }

      .md-heading { color: #60a5fa; font-weight: 600; }
      .md-meta { color: #64748b; }
      .md-field { color: #f59e0b; }
      .md-value { color: #4ade80; }
      .md-comment { color: #64748b; font-style: italic; }

      /* Use Case Cards */
      .usecase-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin: 24px 0;
      }

      .usecase-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
      }

      .usecase-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .usecase-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
      }

      .usecase-title {
        font-size: 14px;
        font-weight: 600;
        color: #e2e8f0;
      }

      .usecase-prompt {
        font-size: 12px;
        font-family: 'JetBrains Mono', monospace;
        color: #94a3b8;
        background: rgba(0, 0, 0, 0.3);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
      }

      .usecase-result {
        font-size: 12px;
        color: #64748b;
      }

      .usecase-result strong {
        color: #4ade80;
      }

      /* Connector Arrow */
      .connector {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 0;
        color: #475569;
      }

      .connector .icon {
        transform: rotate(90deg);
      }
    `;
  }

  getSidebar() {
    return `
      <div class="sidebar-title">
        <span class="icon">dns</span>
        MCP Server V3
      </div>
      <div class="sidebar-subtitle">Technische Architektur & Implementation</div>
      <nav>
        <div class="nav-section">
          <div class="nav-section-title">Grundlagen</div>
          <a href="#intro" class="active">
            <span class="icon nav-icon">home</span>
            Übersicht
          </a>
          <a href="#architecture">
            <span class="icon nav-icon">account_tree</span>
            Architektur
            <span class="nav-badge badge-v3">V3</span>
          </a>
          <a href="#protocol">
            <span class="icon nav-icon">sync_alt</span>
            MCP Protocol
            <span class="nav-badge badge-core">Core</span>
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Server Module</div>
          <a href="#parser">
            <span class="icon nav-icon">code</span>
            HTML Parser
          </a>
          <a href="#analyzer">
            <span class="icon nav-icon">psychology</span>
            Pattern Analyzer
          </a>
          <a href="#mapper">
            <span class="icon nav-icon">transform</span>
            Component Mapper
          </a>
          <a href="#generator">
            <span class="icon nav-icon">build</span>
            Code Generator
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Context-Driven MCP</div>
          <a href="#context-overview">
            <span class="icon nav-icon">hub</span>
            Knowledge Layer
            <span class="nav-badge badge-new">Neu</span>
          </a>
          <a href="#business-context">
            <span class="icon nav-icon">business</span>
            Business Context
          </a>
          <a href="#api-context">
            <span class="icon nav-icon">api</span>
            API Dokumentation
          </a>
          <a href="#ui-mapping">
            <span class="icon nav-icon">link</span>
            UI ↔ API Mapping
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Markdown Struktur</div>
          <a href="#md-domain">
            <span class="icon nav-icon">schema</span>
            Domain Model
          </a>
          <a href="#md-endpoints">
            <span class="icon nav-icon">http</span>
            REST Endpoints
          </a>
          <a href="#md-components">
            <span class="icon nav-icon">view_module</span>
            Component Specs
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">Konfiguration</div>
          <a href="#config">
            <span class="icon nav-icon">settings</span>
            Server Config
          </a>
          <a href="#patterns">
            <span class="icon nav-icon">grid_view</span>
            Pattern Definitions
          </a>
          <a href="#components">
            <span class="icon nav-icon">widgets</span>
            Component Library
          </a>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">API</div>
          <a href="#tools">
            <span class="icon nav-icon">construction</span>
            MCP Tools
          </a>
          <a href="#resources">
            <span class="icon nav-icon">folder</span>
            Resources
          </a>
          <a href="#prompts">
            <span class="icon nav-icon">chat</span>
            Prompts
          </a>
        </div>
      </nav>
    `;
  }

  getContent() {
    return `
      <section id="intro">
        <h1>MCP Server Architecture</h1>
        <p class="lead">
          Deep-Dive in die technische Implementierung des Figma-to-Angular MCP Servers.
          Vom Protocol über die Module bis zur Code-Generierung.
        </p>

        <div class="architecture-diagram">
          <div class="arch-row">
            <div class="arch-box figma">
              <div class="arch-box-title">Figma Export</div>
              <div class="arch-box-subtitle">HTML/CSS via Figma Make</div>
            </div>
            <span class="arch-arrow">→</span>
            <div class="arch-box mcp">
              <div class="arch-box-title">MCP Server</div>
              <div class="arch-box-subtitle">Pattern Recognition & Component Mapping</div>
              <div class="mcp-internal">
                <div class="mcp-layer-box">
                  <span class="icon">code</span>
                  <div class="mcp-layer-box-title">Parser</div>
                </div>
                <div class="mcp-layer-box">
                  <span class="icon">psychology</span>
                  <div class="mcp-layer-box-title">Analyzer</div>
                </div>
                <div class="mcp-layer-box">
                  <span class="icon">transform</span>
                  <div class="mcp-layer-box-title">Mapper</div>
                </div>
                <div class="mcp-layer-box">
                  <span class="icon">build</span>
                  <div class="mcp-layer-box-title">Generator</div>
                </div>
              </div>
            </div>
            <span class="arch-arrow">→</span>
            <div class="arch-box angular">
              <div class="arch-box-title">Angular App</div>
              <div class="arch-box-subtitle">Clean Components</div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="architecture">
        <h2><span class="icon" style="color: #a855f7;">account_tree</span> Projekt-Struktur</h2>

        <p>Der MCP Server ist als TypeScript/Node.js Projekt aufgebaut und folgt einer modularen Architektur:</p>

        <div class="directory-tree">
          <div class="dir-line folder">
            <span class="icon">folder</span>
            <span>figma-angular-mcp-server/</span>
          </div>
          <div class="dir-line folder dir-indent-1">
            <span class="icon">folder</span>
            <span>src/</span>
          </div>
          <div class="dir-line file dir-indent-2">
            <span class="icon">description</span>
            <span>index.ts</span>
            <span class="dir-comment">MCP Server Entry Point</span>
          </div>
          <div class="dir-line file dir-indent-2">
            <span class="icon">description</span>
            <span>server.ts</span>
            <span class="dir-comment">Server Lifecycle & Protocol</span>
          </div>
          <div class="dir-line folder dir-indent-2">
            <span class="icon">folder</span>
            <span>parser/</span>
            <span class="dir-comment">HTML/CSS Parsing</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>html-parser.ts</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>css-parser.ts</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>ast-builder.ts</span>
          </div>
          <div class="dir-line folder dir-indent-2">
            <span class="icon">folder</span>
            <span>analyzer/</span>
            <span class="dir-comment">Pattern Recognition</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>pattern-detector.ts</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>similarity-engine.ts</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>semantic-extractor.ts</span>
          </div>
          <div class="dir-line folder dir-indent-2">
            <span class="icon">folder</span>
            <span>mapper/</span>
            <span class="dir-comment">Component Mapping</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>component-resolver.ts</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>prop-mapper.ts</span>
          </div>
          <div class="dir-line folder dir-indent-2">
            <span class="icon">folder</span>
            <span>generator/</span>
            <span class="dir-comment">Code Generation</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>angular-generator.ts</span>
          </div>
          <div class="dir-line file dir-indent-3">
            <span class="icon">description</span>
            <span>template-builder.ts</span>
          </div>
          <div class="dir-line folder dir-indent-2">
            <span class="icon">folder</span>
            <span>tools/</span>
            <span class="dir-comment">MCP Tool Implementations</span>
          </div>
          <div class="dir-line folder dir-indent-2">
            <span class="icon">folder</span>
            <span>resources/</span>
            <span class="dir-comment">MCP Resource Handlers</span>
          </div>
          <div class="dir-line folder dir-indent-1">
            <span class="icon">folder</span>
            <span>config/</span>
          </div>
          <div class="dir-line config dir-indent-2">
            <span class="icon">settings</span>
            <span>patterns.yaml</span>
            <span class="dir-comment">Pattern Definitions</span>
          </div>
          <div class="dir-line config dir-indent-2">
            <span class="icon">settings</span>
            <span>components.yaml</span>
            <span class="dir-comment">Component Library</span>
          </div>
          <div class="dir-line config dir-indent-2">
            <span class="icon">settings</span>
            <span>server.yaml</span>
            <span class="dir-comment">Server Configuration</span>
          </div>
          <div class="dir-line file dir-indent-1">
            <span class="icon">description</span>
            <span>package.json</span>
          </div>
          <div class="dir-line file dir-indent-1">
            <span class="icon">description</span>
            <span>tsconfig.json</span>
          </div>
        </div>

        <h3>Module Overview</h3>

        <div class="module-grid">
          <div class="module-card">
            <div class="module-header">
              <div class="module-icon parser"><span class="icon">code</span></div>
              <div>
                <div class="module-title">Parser Module</div>
                <div class="module-subtitle">HTML/CSS → AST</div>
              </div>
            </div>
            <div class="module-desc">
              Parst Figma Export HTML und CSS in einen Abstract Syntax Tree (AST).
              Extrahiert Styles, Klassen und DOM-Struktur.
            </div>
            <div class="module-files">
              <span class="file-tag">html-parser.ts</span>
              <span class="file-tag">css-parser.ts</span>
              <span class="file-tag">ast-builder.ts</span>
            </div>
          </div>

          <div class="module-card">
            <div class="module-header">
              <div class="module-icon analyzer"><span class="icon">psychology</span></div>
              <div>
                <div class="module-title">Analyzer Module</div>
                <div class="module-subtitle">Pattern Recognition</div>
              </div>
            </div>
            <div class="module-desc">
              Erkennt UI-Patterns durch visuelle Ähnlichkeitsanalyse.
              Extrahiert semantische Daten unabhängig von der HTML-Struktur.
            </div>
            <div class="module-files">
              <span class="file-tag">pattern-detector.ts</span>
              <span class="file-tag">similarity-engine.ts</span>
              <span class="file-tag">semantic-extractor.ts</span>
            </div>
          </div>

          <div class="module-card">
            <div class="module-header">
              <div class="module-icon mapper"><span class="icon">transform</span></div>
              <div>
                <div class="module-title">Mapper Module</div>
                <div class="module-subtitle">Pattern → Component</div>
              </div>
            </div>
            <div class="module-desc">
              Mappt erkannte Patterns auf Angular Components.
              Löst Component-Varianten und Props auf.
            </div>
            <div class="module-files">
              <span class="file-tag">component-resolver.ts</span>
              <span class="file-tag">prop-mapper.ts</span>
            </div>
          </div>

          <div class="module-card">
            <div class="module-header">
              <div class="module-icon generator"><span class="icon">build</span></div>
              <div>
                <div class="module-title">Generator Module</div>
                <div class="module-subtitle">Code Output</div>
              </div>
            </div>
            <div class="module-desc">
              Generiert Angular Templates, Components und Styles.
              Optimiert Output für Produktionsreife.
            </div>
            <div class="module-files">
              <span class="file-tag">angular-generator.ts</span>
              <span class="file-tag">template-builder.ts</span>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="protocol">
        <h2><span class="icon" style="color: #60a5fa;">sync_alt</span> MCP Protocol</h2>

        <p>
          Der Server implementiert das <strong>Model Context Protocol (MCP)</strong> -
          ein offenes Protokoll für die Kommunikation zwischen AI-Modellen und externen Tools.
        </p>

        <div class="protocol-box">
          <div class="protocol-header">
            <span class="icon">hub</span>
            <div class="protocol-title">MCP Communication Flow</div>
          </div>

          <div class="data-flow">
            <div class="flow-step">
              <div class="flow-number">1</div>
              <div class="flow-title">Initialize</div>
              <div class="flow-desc">Client connects, capabilities exchange</div>
            </div>
            <div class="flow-step">
              <div class="flow-number">2</div>
              <div class="flow-title">List Tools</div>
              <div class="flow-desc">Server exposes available tools</div>
            </div>
            <div class="flow-step">
              <div class="flow-number">3</div>
              <div class="flow-title">Call Tool</div>
              <div class="flow-desc">Client invokes tool with args</div>
            </div>
            <div class="flow-step">
              <div class="flow-number">4</div>
              <div class="flow-title">Return Result</div>
              <div class="flow-desc">Server returns structured data</div>
            </div>
          </div>
        </div>

        <h3>Server Implementation</h3>

        <div class="tabs">
          <div class="tab-header">
            <button class="tab-btn active" data-tab="server">server.ts</button>
            <button class="tab-btn" data-tab="index">index.ts</button>
            <button class="tab-btn" data-tab="types">types.ts</button>
          </div>

          <div class="tab-content active" data-tab="server">
            <pre><code><span class="code-keyword">import</span> { Server } <span class="code-keyword">from</span> <span class="code-string">'@modelcontextprotocol/sdk/server/index.js'</span>;
<span class="code-keyword">import</span> { StdioServerTransport } <span class="code-keyword">from</span> <span class="code-string">'@modelcontextprotocol/sdk/server/stdio.js'</span>;

<span class="code-keyword">export class</span> <span class="code-type">FigmaAngularMcpServer</span> {
  <span class="code-keyword">private</span> server: Server;
  <span class="code-keyword">private</span> parser: HtmlParser;
  <span class="code-keyword">private</span> analyzer: PatternAnalyzer;
  <span class="code-keyword">private</span> mapper: ComponentMapper;
  <span class="code-keyword">private</span> generator: AngularGenerator;

  <span class="code-keyword">constructor</span>(config: ServerConfig) {
    <span class="code-keyword">this</span>.server = <span class="code-keyword">new</span> Server({
      name: <span class="code-string">'figma-angular-mcp'</span>,
      version: <span class="code-string">'1.0.0'</span>,
    }, {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      }
    });

    <span class="code-keyword">this</span>.initializeModules(config);
    <span class="code-keyword">this</span>.registerHandlers();
  }

  <span class="code-keyword">private</span> registerHandlers() {
    <span class="code-comment">// Tool: Convert Figma HTML to Angular</span>
    <span class="code-keyword">this</span>.server.setRequestHandler(
      ListToolsRequestSchema,
      <span class="code-keyword">async</span> () => ({
        tools: [<span class="code-keyword">this</span>.getConvertTool(), ...]
      })
    );

    <span class="code-keyword">this</span>.server.setRequestHandler(
      CallToolRequestSchema,
      <span class="code-keyword">async</span> (request) => <span class="code-keyword">this</span>.handleToolCall(request)
    );
  }

  <span class="code-keyword">async</span> start() {
    <span class="code-keyword">const</span> transport = <span class="code-keyword">new</span> StdioServerTransport();
    <span class="code-keyword">await</span> <span class="code-keyword">this</span>.server.connect(transport);
  }
}</code></pre>
          </div>

          <div class="tab-content" data-tab="index">
            <pre><code><span class="code-comment">#!/usr/bin/env node</span>
<span class="code-keyword">import</span> { FigmaAngularMcpServer } <span class="code-keyword">from</span> <span class="code-string">'./server.js'</span>;
<span class="code-keyword">import</span> { loadConfig } <span class="code-keyword">from</span> <span class="code-string">'./config/loader.js'</span>;

<span class="code-keyword">async function</span> <span class="code-function">main</span>() {
  <span class="code-keyword">const</span> config = <span class="code-keyword">await</span> loadConfig();
  <span class="code-keyword">const</span> server = <span class="code-keyword">new</span> FigmaAngularMcpServer(config);

  <span class="code-comment">// Handle graceful shutdown</span>
  process.on(<span class="code-string">'SIGINT'</span>, <span class="code-keyword">async</span> () => {
    <span class="code-keyword">await</span> server.shutdown();
    process.exit(<span class="code-number">0</span>);
  });

  <span class="code-keyword">await</span> server.start();
  console.error(<span class="code-string">'MCP Server running on stdio'</span>);
}

main().catch(console.error);</code></pre>
          </div>

          <div class="tab-content" data-tab="types">
            <pre><code><span class="code-comment">// Core Types</span>
<span class="code-keyword">export interface</span> <span class="code-type">ParsedElement</span> {
  tag: <span class="code-type">string</span>;
  classes: <span class="code-type">string</span>[];
  styles: Record&lt;<span class="code-type">string</span>, <span class="code-type">string</span>&gt;;
  children: ParsedElement[];
  textContent?: <span class="code-type">string</span>;
  attributes: Record&lt;<span class="code-type">string</span>, <span class="code-type">string</span>&gt;;
}

<span class="code-keyword">export interface</span> <span class="code-type">PatternMatch</span> {
  type: PatternType;
  confidence: <span class="code-type">number</span>;
  elements: ParsedElement[];
  extractedData: Record&lt;<span class="code-type">string</span>, <span class="code-type">any</span>&gt;;
  boundingBox: BoundingBox;
}

<span class="code-keyword">export interface</span> <span class="code-type">ComponentOutput</span> {
  selector: <span class="code-type">string</span>;
  template: <span class="code-type">string</span>;
  inputs: Record&lt;<span class="code-type">string</span>, <span class="code-type">any</span>&gt;;
  styles?: <span class="code-type">string</span>;
}

<span class="code-keyword">export type</span> <span class="code-type">PatternType</span> =
  | <span class="code-string">'card'</span>
  | <span class="code-string">'list'</span>
  | <span class="code-string">'navigation'</span>
  | <span class="code-string">'form'</span>
  | <span class="code-string">'hero'</span>
  | <span class="code-string">'grid'</span>;</code></pre>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="parser">
        <h2><span class="icon" style="color: #3b82f6;">code</span> HTML Parser</h2>

        <p>Das Parser-Modul konvertiert Figma Export HTML in einen strukturierten AST,
        bereinigt unnötige Wrapper und normalisiert Klassen.</p>

        <h3>Parsing Pipeline</h3>

        <div class="data-flow">
          <div class="flow-step">
            <div class="flow-number">1</div>
            <div class="flow-title">Tokenize</div>
            <div class="flow-desc">HTML → Token Stream</div>
          </div>
          <div class="flow-step">
            <div class="flow-number">2</div>
            <div class="flow-title">Build Tree</div>
            <div class="flow-desc">Tokens → DOM Tree</div>
          </div>
          <div class="flow-step">
            <div class="flow-number">3</div>
            <div class="flow-title">Extract Styles</div>
            <div class="flow-desc">Inline + CSS Classes</div>
          </div>
          <div class="flow-step">
            <div class="flow-number">4</div>
            <div class="flow-title">Normalize</div>
            <div class="flow-desc">Flatten & Clean</div>
          </div>
        </div>

        <h3>Key Implementation</h3>

        <pre><code><span class="code-keyword">export class</span> <span class="code-type">HtmlParser</span> {
  <span class="code-keyword">private</span> cssParser: CssParser;

  <span class="code-function">parse</span>(html: <span class="code-type">string</span>, css?: <span class="code-type">string</span>): ParsedDocument {
    <span class="code-comment">// 1. Parse CSS first to resolve classes</span>
    <span class="code-keyword">const</span> styleMap = css
      ? <span class="code-keyword">this</span>.cssParser.parse(css)
      : <span class="code-keyword">new</span> Map();

    <span class="code-comment">// 2. Parse HTML with cheerio</span>
    <span class="code-keyword">const</span> $ = cheerio.load(html);

    <span class="code-comment">// 3. Build AST recursively</span>
    <span class="code-keyword">const</span> root = <span class="code-keyword">this</span>.buildAstNode($(<span class="code-string">'body'</span>).children().first(), $, styleMap);

    <span class="code-comment">// 4. Post-process: flatten unnecessary wrappers</span>
    <span class="code-keyword">return</span> <span class="code-keyword">this</span>.normalizeTree(root);
  }

  <span class="code-keyword">private</span> <span class="code-function">buildAstNode</span>(
    el: Cheerio,
    $: CheerioAPI,
    styleMap: Map&lt;<span class="code-type">string</span>, CssRule&gt;
  ): ParsedElement {
    <span class="code-keyword">const</span> classes = ($(el).attr(<span class="code-string">'class'</span>) || <span class="code-string">''</span>).split(<span class="code-string">' '</span>).filter(Boolean);

    <span class="code-comment">// Merge inline styles with class-based styles</span>
    <span class="code-keyword">const</span> styles = <span class="code-keyword">this</span>.mergeStyles(
      <span class="code-keyword">this</span>.parseInlineStyles($(el).attr(<span class="code-string">'style'</span>)),
      ...classes.map(c => styleMap.get(<span class="code-string">'.'</span> + c) || {})
    );

    <span class="code-keyword">return</span> {
      tag: el.tagName.toLowerCase(),
      classes,
      styles,
      attributes: <span class="code-keyword">this</span>.extractAttributes(el, $),
      textContent: <span class="code-keyword">this</span>.getDirectText(el, $),
      children: $(el).children().map((_, child) =>
        <span class="code-keyword">this</span>.buildAstNode($(child), $, styleMap)
      ).get()
    };
  }

  <span class="code-keyword">private</span> <span class="code-function">normalizeTree</span>(node: ParsedElement): ParsedElement {
    <span class="code-comment">// Remove single-child div wrappers with no meaningful styles</span>
    <span class="code-keyword">if</span> (
      node.tag === <span class="code-string">'div'</span> &&
      node.children.length === <span class="code-number">1</span> &&
      !<span class="code-keyword">this</span>.hasSignificantStyles(node.styles)
    ) {
      <span class="code-keyword">return</span> <span class="code-keyword">this</span>.normalizeTree(node.children[<span class="code-number">0</span>]);
    }

    <span class="code-keyword">return</span> {
      ...node,
      children: node.children.map(c => <span class="code-keyword">this</span>.normalizeTree(c))
    };
  }
}</code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="analyzer">
        <h2><span class="icon" style="color: #8b5cf6;">psychology</span> Pattern Analyzer</h2>

        <p>Der Analyzer erkennt UI-Patterns durch visuelle Ähnlichkeitsanalyse -
        unabhängig von der tatsächlichen HTML-Struktur.</p>

        <h3>Similarity Engine</h3>

        <pre><code><span class="code-keyword">export class</span> <span class="code-type">SimilarityEngine</span> {
  <span class="code-comment">/**
   * Berechnet visuelle Ähnlichkeit zwischen zwei Elementen
   * basierend auf Größe, Position, Styles und Struktur
   */</span>
  <span class="code-function">calculateSimilarity</span>(a: ParsedElement, b: ParsedElement): <span class="code-type">number</span> {
    <span class="code-keyword">const</span> weights = {
      size: <span class="code-number">0.3</span>,
      structure: <span class="code-number">0.25</span>,
      styles: <span class="code-number">0.25</span>,
      content: <span class="code-number">0.2</span>
    };

    <span class="code-keyword">const</span> sizeSim = <span class="code-keyword">this</span>.compareSizes(a, b);
    <span class="code-keyword">const</span> structSim = <span class="code-keyword">this</span>.compareStructure(a, b);
    <span class="code-keyword">const</span> styleSim = <span class="code-keyword">this</span>.compareStyles(a, b);
    <span class="code-keyword">const</span> contentSim = <span class="code-keyword">this</span>.compareContent(a, b);

    <span class="code-keyword">return</span> (
      sizeSim * weights.size +
      structSim * weights.structure +
      styleSim * weights.styles +
      contentSim * weights.content
    );
  }

  <span class="code-keyword">private</span> <span class="code-function">compareStructure</span>(a: ParsedElement, b: ParsedElement): <span class="code-type">number</span> {
    <span class="code-comment">// Vergleiche DOM-Tiefe und Kinder-Anzahl</span>
    <span class="code-keyword">const</span> depthA = <span class="code-keyword">this</span>.getTreeDepth(a);
    <span class="code-keyword">const</span> depthB = <span class="code-keyword">this</span>.getTreeDepth(b);
    <span class="code-keyword">const</span> depthSim = <span class="code-number">1</span> - Math.abs(depthA - depthB) / Math.max(depthA, depthB);

    <span class="code-keyword">const</span> childSim = <span class="code-keyword">this</span>.compareChildCounts(a, b);

    <span class="code-keyword">return</span> (depthSim + childSim) / <span class="code-number">2</span>;
  }
}

<span class="code-keyword">export class</span> <span class="code-type">PatternDetector</span> {
  <span class="code-keyword">private</span> similarity: SimilarityEngine;
  <span class="code-keyword">private</span> patterns: PatternDefinition[];

  <span class="code-function">detect</span>(root: ParsedElement): PatternMatch[] {
    <span class="code-comment">// 1. Finde alle potenziellen Pattern-Kandidaten</span>
    <span class="code-keyword">const</span> candidates = <span class="code-keyword">this</span>.findCandidates(root);

    <span class="code-comment">// 2. Gruppiere nach Ähnlichkeit</span>
    <span class="code-keyword">const</span> groups = <span class="code-keyword">this</span>.clusterBySimilarity(candidates);

    <span class="code-comment">// 3. Klassifiziere jede Gruppe</span>
    <span class="code-keyword">return</span> groups
      .filter(g => g.length >= <span class="code-number">2</span>) <span class="code-comment">// Mindestens 2 ähnliche Elemente</span>
      .map(g => <span class="code-keyword">this</span>.classifyGroup(g))
      .filter(m => m.confidence >= <span class="code-number">0.7</span>);
  }

  <span class="code-keyword">private</span> <span class="code-function">clusterBySimilarity</span>(elements: ParsedElement[]): ParsedElement[][] {
    <span class="code-keyword">const</span> threshold = <span class="code-number">0.85</span>;
    <span class="code-keyword">const</span> clusters: ParsedElement[][] = [];

    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> el <span class="code-keyword">of</span> elements) {
      <span class="code-keyword">let</span> added = <span class="code-keyword">false</span>;
      <span class="code-keyword">for</span> (<span class="code-keyword">const</span> cluster <span class="code-keyword">of</span> clusters) {
        <span class="code-keyword">if</span> (<span class="code-keyword">this</span>.similarity.calculateSimilarity(el, cluster[<span class="code-number">0</span>]) >= threshold) {
          cluster.push(el);
          added = <span class="code-keyword">true</span>;
          <span class="code-keyword">break</span>;
        }
      }
      <span class="code-keyword">if</span> (!added) clusters.push([el]);
    }

    <span class="code-keyword">return</span> clusters;
  }
}</code></pre>

        <h3>Semantic Extraction</h3>

        <pre><code><span class="code-keyword">export class</span> <span class="code-type">SemanticExtractor</span> {
  <span class="code-keyword">private</span> extractors: Map&lt;PatternType, FieldExtractor[]&gt;;

  <span class="code-function">extract</span>(pattern: PatternMatch): Record&lt;<span class="code-type">string</span>, <span class="code-type">any</span>&gt; {
    <span class="code-keyword">const</span> extractors = <span class="code-keyword">this</span>.extractors.get(pattern.type) || [];
    <span class="code-keyword">const</span> data: Record&lt;<span class="code-type">string</span>, <span class="code-type">any</span>&gt; = {};

    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> extractor <span class="code-keyword">of</span> extractors) {
      <span class="code-keyword">for</span> (<span class="code-keyword">const</span> element <span class="code-keyword">of</span> pattern.elements) {
        <span class="code-keyword">const</span> value = <span class="code-keyword">this</span>.tryExtract(element, extractor);
        <span class="code-keyword">if</span> (value !== <span class="code-keyword">undefined</span>) {
          data[extractor.field] = value;
          <span class="code-keyword">break</span>;
        }
      }
    }

    <span class="code-keyword">return</span> data;
  }

  <span class="code-keyword">private</span> <span class="code-function">tryExtract</span>(el: ParsedElement, extractor: FieldExtractor): <span class="code-type">any</span> {
    <span class="code-comment">// Probiere alle Selektoren der Reihe nach</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> selector <span class="code-keyword">of</span> extractor.selectors) {
      <span class="code-keyword">const</span> match = <span class="code-keyword">this</span>.querySelector(el, selector);
      <span class="code-keyword">if</span> (match) {
        <span class="code-keyword">return</span> extractor.transform
          ? extractor.transform(match)
          : match.textContent;
      }
    }
    <span class="code-keyword">return</span> <span class="code-keyword">undefined</span>;
  }
}</code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="mapper">
        <h2><span class="icon" style="color: #f59e0b;">transform</span> Component Mapper</h2>

        <p>Der Mapper löst erkannte Patterns zu konkreten Angular Components auf
        und mappt extrahierte Daten auf Component Inputs.</p>

        <pre><code><span class="code-keyword">export class</span> <span class="code-type">ComponentResolver</span> {
  <span class="code-keyword">private</span> library: ComponentLibrary;

  <span class="code-function">resolve</span>(pattern: PatternMatch): ComponentOutput {
    <span class="code-comment">// 1. Finde passende Component</span>
    <span class="code-keyword">const</span> component = <span class="code-keyword">this</span>.library.findBestMatch(pattern);

    <span class="code-comment">// 2. Bestimme Variante basierend auf Pattern-Daten</span>
    <span class="code-keyword">const</span> variant = <span class="code-keyword">this</span>.determineVariant(component, pattern);

    <span class="code-comment">// 3. Mappe Daten auf Component Inputs</span>
    <span class="code-keyword">const</span> inputs = <span class="code-keyword">this</span>.mapInputs(variant, pattern.extractedData);

    <span class="code-keyword">return</span> {
      selector: variant.selector,
      inputs,
      template: <span class="code-keyword">this</span>.buildTemplate(variant, inputs)
    };
  }

  <span class="code-keyword">private</span> <span class="code-function">determineVariant</span>(
    component: ComponentDef,
    pattern: PatternMatch
  ): ComponentVariant {
    <span class="code-comment">// Prüfe welche Variante am besten passt</span>
    <span class="code-keyword">for</span> (<span class="code-keyword">const</span> [condition, variant] <span class="code-keyword">of</span> component.variants) {
      <span class="code-keyword">if</span> (<span class="code-keyword">this</span>.matchesCondition(pattern, condition)) {
        <span class="code-keyword">return</span> variant;
      }
    }
    <span class="code-keyword">return</span> component.defaultVariant;
  }

  <span class="code-keyword">private</span> <span class="code-function">matchesCondition</span>(pattern: PatternMatch, condition: <span class="code-type">string</span>): <span class="code-type">boolean</span> {
    <span class="code-keyword">const</span> data = pattern.extractedData;

    <span class="code-keyword">switch</span> (condition) {
      <span class="code-keyword">case</span> <span class="code-string">'has-icon'</span>:
        <span class="code-keyword">return</span> !!data.icon;
      <span class="code-keyword">case</span> <span class="code-string">'has-price'</span>:
        <span class="code-keyword">return</span> !!data.price || !!data.currency;
      <span class="code-keyword">case</span> <span class="code-string">'has-avatar'</span>:
        <span class="code-keyword">return</span> !!data.avatar || !!data.image;
      <span class="code-keyword">case</span> <span class="code-string">'has-link'</span>:
        <span class="code-keyword">return</span> !!data.href || !!data.routerLink;
      <span class="code-keyword">default</span>:
        <span class="code-keyword">return</span> <span class="code-keyword">false</span>;
    }
  }
}</code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="generator">
        <h2><span class="icon" style="color: #22c55e;">build</span> Code Generator</h2>

        <p>Der Generator produziert produktionsreifen Angular-Code
        aus den gemappten Components.</p>

        <pre><code><span class="code-keyword">export class</span> <span class="code-type">AngularGenerator</span> {
  <span class="code-function">generate</span>(components: ComponentOutput[]): GeneratedCode {
    <span class="code-keyword">return</span> {
      template: <span class="code-keyword">this</span>.generateTemplate(components),
      component: <span class="code-keyword">this</span>.generateComponent(components),
      styles: <span class="code-keyword">this</span>.generateStyles(components),
      imports: <span class="code-keyword">this</span>.collectImports(components)
    };
  }

  <span class="code-keyword">private</span> <span class="code-function">generateTemplate</span>(components: ComponentOutput[]): <span class="code-type">string</span> {
    <span class="code-keyword">return</span> components.map(c => {
      <span class="code-keyword">const</span> inputBindings = Object.entries(c.inputs)
        .map(([key, value]) => {
          <span class="code-keyword">if</span> (<span class="code-keyword">typeof</span> value === <span class="code-string">'string'</span>) {
            <span class="code-keyword">return</span> <span class="code-string">\`[\${key}]="\${<span class="code-keyword">this</span>.escapeString(value)}"\`</span>;
          }
          <span class="code-keyword">return</span> <span class="code-string">\`[\${key}]="\${JSON.stringify(value)}"\`</span>;
        })
        .join(<span class="code-string">'\\n  '</span>);

      <span class="code-keyword">return</span> <span class="code-string">\`&lt;\${c.selector}
  \${inputBindings}
/&gt;\`</span>;
    }).join(<span class="code-string">'\\n\\n'</span>);
  }

  <span class="code-keyword">private</span> <span class="code-function">generateComponent</span>(components: ComponentOutput[]): <span class="code-type">string</span> {
    <span class="code-keyword">const</span> imports = <span class="code-keyword">this</span>.collectImports(components);
    <span class="code-keyword">const</span> dataProperties = <span class="code-keyword">this</span>.extractDataProperties(components);

    <span class="code-keyword">return</span> <span class="code-string">\`
import { Component } from '@angular/core';
\${imports.map(i => \`import { \${i.name} } from '\${i.path}';\`).join('\\n')}

@Component({
  selector: 'app-generated-page',
  templateUrl: './generated-page.component.html',
  styleUrls: ['./generated-page.component.scss'],
  standalone: true,
  imports: [\${imports.map(i => i.name).join(', ')}]
})
export class GeneratedPageComponent {
\${dataProperties}
}
\`</span>;
  }
}</code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="config">
        <h2><span class="icon" style="color: #94a3b8;">settings</span> Server Konfiguration</h2>

        <pre><code><span class="code-comment"># config/server.yaml</span>

<span class="code-keyword">server:</span>
  <span class="code-keyword">name:</span> <span class="code-string">figma-angular-mcp</span>
  <span class="code-keyword">version:</span> <span class="code-string">1.0.0</span>
  <span class="code-keyword">logLevel:</span> <span class="code-string">info</span>

<span class="code-keyword">parser:</span>
  <span class="code-keyword">maxDepth:</span> <span class="code-number">20</span>
  <span class="code-keyword">normalizeWrappers:</span> <span class="code-keyword">true</span>
  <span class="code-keyword">preserveComments:</span> <span class="code-keyword">false</span>

<span class="code-keyword">analyzer:</span>
  <span class="code-keyword">similarityThreshold:</span> <span class="code-number">0.85</span>
  <span class="code-keyword">minGroupSize:</span> <span class="code-number">2</span>
  <span class="code-keyword">patternConfidenceThreshold:</span> <span class="code-number">0.7</span>

<span class="code-keyword">generator:</span>
  <span class="code-keyword">framework:</span> <span class="code-string">angular</span>
  <span class="code-keyword">version:</span> <span class="code-string">"17"</span>
  <span class="code-keyword">standalone:</span> <span class="code-keyword">true</span>
  <span class="code-keyword">styleFormat:</span> <span class="code-string">scss</span>
  <span class="code-keyword">prefix:</span> <span class="code-string">app</span></code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="patterns">
        <h2><span class="icon" style="color: #60a5fa;">grid_view</span> Pattern Definitions</h2>

        <pre><code><span class="code-comment"># config/patterns.yaml</span>

<span class="code-keyword">patterns:</span>
  <span class="code-keyword">card:</span>
    <span class="code-keyword">description:</span> <span class="code-string">"Generic card component"</span>
    <span class="code-keyword">detection:</span>
      <span class="code-keyword">minSimilarity:</span> <span class="code-number">0.85</span>
      <span class="code-keyword">requiredElements:</span>
        - <span class="code-string">title</span>
      <span class="code-keyword">optionalElements:</span>
        - <span class="code-string">description</span>
        - <span class="code-string">icon</span>
        - <span class="code-string">image</span>
        - <span class="code-string">link</span>

    <span class="code-keyword">extraction:</span>
      <span class="code-keyword">title:</span>
        <span class="code-keyword">selectors:</span>
          - <span class="code-string">"h1, h2, h3, h4, h5, h6"</span>
          - <span class="code-string">"[class*='title'], [class*='heading']"</span>
          - <span class="code-string">":scope > div:first-child"</span>
        <span class="code-keyword">required:</span> <span class="code-keyword">true</span>

      <span class="code-keyword">description:</span>
        <span class="code-keyword">selectors:</span>
          - <span class="code-string">"p"</span>
          - <span class="code-string">"[class*='desc'], [class*='text'], [class*='body']"</span>
        <span class="code-keyword">required:</span> <span class="code-keyword">false</span>

      <span class="code-keyword">icon:</span>
        <span class="code-keyword">selectors:</span>
          - <span class="code-string">"svg"</span>
          - <span class="code-string">"[class*='icon']"</span>
          - <span class="code-string">"span.material-icons"</span>
        <span class="code-keyword">transform:</span> <span class="code-string">extractIconName</span>

      <span class="code-keyword">link:</span>
        <span class="code-keyword">selectors:</span>
          - <span class="code-string">"a[href]"</span>
        <span class="code-keyword">attribute:</span> <span class="code-string">href</span>

  <span class="code-keyword">hero:</span>
    <span class="code-keyword">description:</span> <span class="code-string">"Hero section with headline and CTA"</span>
    <span class="code-keyword">detection:</span>
      <span class="code-keyword">position:</span> <span class="code-string">top</span>
      <span class="code-keyword">fullWidth:</span> <span class="code-keyword">true</span>
    <span class="code-keyword">extraction:</span>
      <span class="code-keyword">headline:</span>
        <span class="code-keyword">selectors:</span> [<span class="code-string">"h1"</span>]
      <span class="code-keyword">subline:</span>
        <span class="code-keyword">selectors:</span> [<span class="code-string">"h2, p.lead, [class*='subline']"</span>]
      <span class="code-keyword">cta:</span>
        <span class="code-keyword">selectors:</span> [<span class="code-string">"button, a.btn, [class*='cta']"</span>]</code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="components">
        <h2><span class="icon" style="color: #a855f7;">widgets</span> Component Library</h2>

        <pre><code><span class="code-comment"># config/components.yaml</span>

<span class="code-keyword">components:</span>
  <span class="code-keyword">card:</span>
    <span class="code-keyword">module:</span> <span class="code-string">"@app/shared/components"</span>
    <span class="code-keyword">defaultVariant:</span>
      <span class="code-keyword">selector:</span> <span class="code-string">"app-card"</span>
      <span class="code-keyword">inputs:</span>
        <span class="code-keyword">title:</span> <span class="code-string">title</span>
        <span class="code-keyword">description:</span> <span class="code-string">description</span>

    <span class="code-keyword">variants:</span>
      <span class="code-keyword">has-icon:</span>
        <span class="code-keyword">selector:</span> <span class="code-string">"app-feature-card"</span>
        <span class="code-keyword">inputs:</span>
          <span class="code-keyword">title:</span> <span class="code-string">title</span>
          <span class="code-keyword">description:</span> <span class="code-string">description</span>
          <span class="code-keyword">icon:</span> <span class="code-string">iconName</span>

      <span class="code-keyword">has-price:</span>
        <span class="code-keyword">selector:</span> <span class="code-string">"app-pricing-card"</span>
        <span class="code-keyword">inputs:</span>
          <span class="code-keyword">title:</span> <span class="code-string">planName</span>
          <span class="code-keyword">price:</span> <span class="code-string">price</span>
          <span class="code-keyword">features:</span> <span class="code-string">features</span>

      <span class="code-keyword">has-avatar:</span>
        <span class="code-keyword">selector:</span> <span class="code-string">"app-team-card"</span>
        <span class="code-keyword">inputs:</span>
          <span class="code-keyword">name:</span> <span class="code-string">title</span>
          <span class="code-keyword">role:</span> <span class="code-string">description</span>
          <span class="code-keyword">avatar:</span> <span class="code-string">avatarUrl</span></code></pre>
      </section>

      <div class="section-divider"></div>

      <section id="tools">
        <h2><span class="icon" style="color: #22c55e;">construction</span> MCP Tools</h2>

        <p>Der Server exponiert folgende Tools über das MCP Protocol:</p>

        <div class="api-method">
          <div class="api-method-header">
            <span class="method-badge tool">Tool</span>
            <span class="method-name">convert_figma_html</span>
          </div>
          <div class="api-method-body">
            <p class="method-desc">Konvertiert Figma Export HTML zu Angular Components</p>
            <h4>Parameters</h4>
            <table class="interface-table">
              <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>
              <tr><td><code>html</code></td><td>string</td><td>Yes</td><td>Figma Export HTML</td></tr>
              <tr><td><code>css</code></td><td>string</td><td>No</td><td>Associated CSS styles</td></tr>
              <tr><td><code>options</code></td><td>object</td><td>No</td><td>Conversion options</td></tr>
            </table>
          </div>
        </div>

        <div class="api-method">
          <div class="api-method-header">
            <span class="method-badge tool">Tool</span>
            <span class="method-name">analyze_patterns</span>
          </div>
          <div class="api-method-body">
            <p class="method-desc">Analysiert HTML und gibt erkannte Patterns zurück (ohne Konvertierung)</p>
            <h4>Parameters</h4>
            <table class="interface-table">
              <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>
              <tr><td><code>html</code></td><td>string</td><td>Yes</td><td>HTML to analyze</td></tr>
            </table>
          </div>
        </div>

        <div class="api-method">
          <div class="api-method-header">
            <span class="method-badge tool">Tool</span>
            <span class="method-name">list_components</span>
          </div>
          <div class="api-method-body">
            <p class="method-desc">Listet alle verfügbaren Angular Components in der Library</p>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="resources">
        <h2><span class="icon" style="color: #60a5fa;">folder</span> MCP Resources</h2>

        <div class="api-method">
          <div class="api-method-header">
            <span class="method-badge resource">Resource</span>
            <span class="method-name">config://patterns</span>
          </div>
          <div class="api-method-body">
            <p class="method-desc">Pattern-Definitionen als YAML</p>
          </div>
        </div>

        <div class="api-method">
          <div class="api-method-header">
            <span class="method-badge resource">Resource</span>
            <span class="method-name">config://components</span>
          </div>
          <div class="api-method-body">
            <p class="method-desc">Component Library Konfiguration</p>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section id="prompts">
        <h2><span class="icon" style="color: #a855f7;">chat</span> MCP Prompts</h2>

        <div class="api-method">
          <div class="api-method-header">
            <span class="method-badge prompt">Prompt</span>
            <span class="method-name">convert_page</span>
          </div>
          <div class="api-method-body">
            <p class="method-desc">Interaktiver Prompt zur schrittweisen Konvertierung einer Figma-Seite</p>
            <h4>Arguments</h4>
            <table class="interface-table">
              <tr><th>Name</th><th>Description</th></tr>
              <tr><td><code>page_name</code></td><td>Name der zu konvertierenden Seite</td></tr>
            </table>
          </div>
        </div>

        <div class="tip-box">
          <span class="icon">tips_and_updates</span>
          <p>
            <strong>Tipp:</strong> Der MCP Server kann direkt in Claude Code, Cursor oder andere
            MCP-kompatible Clients integriert werden. Die Konfiguration erfolgt über die
            <code>mcp.json</code> oder <code>claude_desktop_config.json</code>.
          </p>
        </div>
      </section>
    `;
  }
}

customElements.define('figma-angular-mcp-pipeline-v3', FigmaAngularMcpPipelineV3);
