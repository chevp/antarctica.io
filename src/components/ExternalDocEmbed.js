/**
 * ExternalDocEmbed - Vanilla JS Web Component
 *
 * Embeds HTML documentation with sidebar navigation
 * into the Antarctica.io documentation system.
 *
 * Usage:
 *   <external-doc-embed
 *     src="figma-angular-mcp-pipeline"
 *     title="Figma to Angular Pipeline">
 *   </external-doc-embed>
 */

class ExternalDocEmbed extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'title', 'base-url'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._loading = true;
    this._error = null;
    this._content = null;
  }

  connectedCallback() {
    this.render();
    this.loadContent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'src') {
        this.loadContent();
      }
      this.render();
    }
  }

  get src() {
    return this.getAttribute('src') || '';
  }

  set src(value) {
    if (value) {
      this.setAttribute('src', value);
    } else {
      this.removeAttribute('src');
    }
  }

  get title() {
    return this.getAttribute('title') || 'Documentation';
  }

  set title(value) {
    if (value) {
      this.setAttribute('title', value);
    } else {
      this.removeAttribute('title');
    }
  }

  get baseUrl() {
    return this.getAttribute('base-url') || '/assets';
  }

  set baseUrl(value) {
    if (value) {
      this.setAttribute('base-url', value);
    } else {
      this.removeAttribute('base-url');
    }
  }

  get fullUrl() {
    const src = this.src;
    if (!src) return null;
    const filename = src.endsWith('.html') ? src : `${src}.html`;
    return `${this.baseUrl}/${filename}`;
  }

  async loadContent() {
    const url = this.fullUrl;
    if (!url) {
      this._error = 'No source specified';
      this._loading = false;
      this.render();
      return;
    }

    this._loading = true;
    this._error = null;
    this.render();

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.status} ${response.statusText}`);
      }
      const html = await response.text();
      this._content = this.extractContent(html);
      this._loading = false;
      this.render();
    } catch (error) {
      this._error = error.message;
      this._loading = false;
      this.render();
    }
  }

  extractContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract sidebar navigation
    const sidebar = doc.querySelector('aside nav');
    const sidebarHtml = sidebar ? sidebar.innerHTML : '';

    // Extract main content
    const main = doc.querySelector('main .max-w-4xl');
    const mainHtml = main ? main.innerHTML : '';

    // Extract styles
    const styles = doc.querySelectorAll('style');
    let extractedStyles = '';
    styles.forEach(style => {
      extractedStyles += style.textContent;
    });

    return {
      sidebar: sidebarHtml,
      content: mainHtml,
      styles: extractedStyles
    };
  }

  getStyles() {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
      @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');

      :host {
        display: block;
        width: 100%;
        height: 100%;
        font-family: 'Inter', sans-serif;
        color: #e2e8f0;
      }

      code, pre {
        font-family: 'JetBrains Mono', monospace;
      }

      .doc-container {
        display: flex;
        height: 100%;
        background: transparent;
      }

      /* Sidebar */
      .doc-sidebar {
        width: 256px;
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
        gap: 4px;
      }

      .doc-sidebar a {
        display: block;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 14px;
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

      .doc-sidebar .nav-section-title {
        padding: 16px 12px 8px 12px;
        font-size: 11px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Main Content */
      .doc-content {
        flex: 1;
        padding: 24px 32px;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 0 12px 12px 0;
      }

      .doc-content section {
        margin-bottom: 48px;
        scroll-margin-top: 24px;
      }

      .doc-content h2 {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .doc-content h3 {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 12px;
      }

      .doc-content h4 {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 8px;
      }

      .doc-content p {
        color: #94a3b8;
        line-height: 1.7;
        margin-bottom: 16px;
      }

      /* Glass cards */
      .glass {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .doc-content .glass {
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
      }

      /* Code blocks */
      .code-block, pre {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        overflow-x: auto;
        font-size: 13px;
        line-height: 1.5;
      }

      /* Gradient text */
      .gradient-text {
        background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .gradient-purple {
        background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .gradient-green {
        background: linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .gradient-orange {
        background: linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* Grid layouts */
      .grid {
        display: grid;
      }

      .grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }

      .grid-cols-3 {
        grid-template-columns: repeat(3, 1fr);
      }

      .grid-cols-4 {
        grid-template-columns: repeat(4, 1fr);
      }

      .gap-4 {
        gap: 16px;
      }

      .gap-6 {
        gap: 24px;
      }

      /* Flex utilities */
      .flex {
        display: flex;
      }

      .items-center {
        align-items: center;
      }

      .items-start {
        align-items: flex-start;
      }

      .justify-between {
        justify-content: space-between;
      }

      .gap-2 {
        gap: 8px;
      }

      .gap-3 {
        gap: 12px;
      }

      /* Spacing */
      .mb-1 { margin-bottom: 4px; }
      .mb-2 { margin-bottom: 8px; }
      .mb-3 { margin-bottom: 12px; }
      .mb-4 { margin-bottom: 16px; }
      .mb-6 { margin-bottom: 24px; }
      .mb-8 { margin-bottom: 32px; }
      .mt-0\.5 { margin-top: 2px; }
      .mt-1 { margin-top: 4px; }
      .mt-6 { margin-top: 24px; }
      .pt-4 { padding-top: 16px; }
      .pt-6 { padding-top: 24px; }
      .pb-2 { padding-bottom: 8px; }
      .p-3 { padding: 12px; }
      .p-4 { padding: 16px; }
      .p-6 { padding: 24px; }
      .p-8 { padding: 32px; }
      .px-3 { padding-left: 12px; padding-right: 12px; }

      /* Sizing */
      .w-5 { width: 20px; }
      .w-8 { width: 32px; }
      .w-10 { width: 40px; }
      .w-16 { width: 64px; }
      .h-5 { height: 20px; }
      .h-8 { height: 32px; }
      .h-10 { height: 40px; }
      .h-16 { height: 64px; }

      /* Border radius */
      .rounded { border-radius: 4px; }
      .rounded-lg { border-radius: 8px; }
      .rounded-xl { border-radius: 12px; }
      .rounded-2xl { border-radius: 16px; }

      /* Colors */
      .text-white { color: #fff; }
      .text-slate-300 { color: #cbd5e1; }
      .text-slate-400 { color: #94a3b8; }
      .text-slate-500 { color: #64748b; }
      .text-blue-400 { color: #60a5fa; }
      .text-purple-400 { color: #a78bfa; }
      .text-green-400 { color: #4ade80; }
      .text-orange-400 { color: #fb923c; }
      .text-red-400 { color: #f87171; }
      .text-cyan-400 { color: #22d3ee; }

      .bg-blue-500\/20 { background: rgba(59, 130, 246, 0.2); }
      .bg-purple-500\/20 { background: rgba(168, 85, 247, 0.2); }
      .bg-green-500\/20 { background: rgba(34, 197, 94, 0.2); }
      .bg-orange-500\/20 { background: rgba(249, 115, 22, 0.2); }

      .border-blue-500\/20 { border-color: rgba(59, 130, 246, 0.2); }
      .border-purple-500\/20 { border-color: rgba(168, 85, 247, 0.2); }
      .border-green-500\/20 { border-color: rgba(34, 197, 94, 0.2); }
      .border-orange-500\/20 { border-color: rgba(249, 115, 22, 0.2); }
      .border-slate-700\/50 { border-color: rgba(51, 65, 85, 0.5); }

      /* Gradients for icons */
      .bg-gradient-to-br {
        background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
      }

      .from-blue-500 { --tw-gradient-from: #3b82f6; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
      .to-blue-600 { --tw-gradient-to: #2563eb; }
      .from-purple-500 { --tw-gradient-from: #a855f7; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
      .to-purple-600 { --tw-gradient-to: #9333ea; }
      .from-green-500 { --tw-gradient-from: #22c55e; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
      .to-green-600 { --tw-gradient-to: #16a34a; }
      .from-orange-500 { --tw-gradient-from: #f97316; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
      .to-red-500 { --tw-gradient-to: #ef4444; }

      /* Font utilities */
      .text-xs { font-size: 12px; }
      .text-sm { font-size: 14px; }
      .text-base { font-size: 16px; }
      .text-lg { font-size: 18px; }
      .text-xl { font-size: 20px; }
      .text-2xl { font-size: 24px; }
      .text-3xl { font-size: 30px; }
      .font-medium { font-weight: 500; }
      .font-semibold { font-weight: 600; }
      .font-bold { font-weight: 700; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
      .uppercase { text-transform: uppercase; }
      .tracking-wider { letter-spacing: 0.05em; }

      /* Pipeline animation */
      .flow-line {
        stroke-dasharray: 8 4;
        animation: dash 1s linear infinite;
      }

      @keyframes dash {
        to { stroke-dashoffset: -12; }
      }

      /* Material icons */
      .material-icons-outlined {
        font-family: 'Material Icons Outlined';
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
        -webkit-font-smoothing: antialiased;
      }

      /* Space utilities */
      .space-y-1 > * + * { margin-top: 4px; }
      .space-y-2 > * + * { margin-top: 8px; }
      .space-y-4 > * + * { margin-top: 16px; }
      .space-y-6 > * + * { margin-top: 24px; }
      .space-y-16 > * + * { margin-top: 64px; }

      /* Border utilities */
      .border { border-width: 1px; }
      .border-t { border-top-width: 1px; }
      .border-l-2 { border-left-width: 2px; }

      /* Other */
      .flex-1 { flex: 1; }
      .flex-shrink-0 { flex-shrink: 0; }
      .overflow-x-auto { overflow-x: auto; }
      .leading-relaxed { line-height: 1.625; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }

      /* Loading & Error states */
      .loading-state,
      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px;
        text-align: center;
        height: 100%;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(59, 130, 246, 0.2);
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .error-icon {
        width: 48px;
        height: 48px;
        background: rgba(239, 68, 68, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        color: #ef4444;
        font-size: 24px;
      }
    `;
  }

  render() {
    const styles = this.getStyles();

    if (this._loading) {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="doc-container">
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading documentation...</p>
          </div>
        </div>
      `;
      return;
    }

    if (this._error) {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="doc-container">
          <div class="error-state">
            <div class="error-icon">!</div>
            <p style="color: #f87171; margin-bottom: 8px;">${this._error}</p>
            <p style="font-size: 12px; color: #64748b;">Source: ${this.fullUrl || 'not specified'}</p>
          </div>
        </div>
      `;
      return;
    }

    // Render sidebar + content
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="doc-container">
        <aside class="doc-sidebar">
          <nav class="space-y-1">
            ${this._content.sidebar}
          </nav>
        </aside>
        <main class="doc-content">
          <div class="space-y-16">
            ${this._content.content}
          </div>
        </main>
      </div>
    `;

    // Add click handlers for navigation
    this.shadowRoot.querySelectorAll('.doc-sidebar a[href^="#"]').forEach(link => {
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
}

// Register the custom element
if (!customElements.get('external-doc-embed')) {
  customElements.define('external-doc-embed', ExternalDocEmbed);
}

export default ExternalDocEmbed;
