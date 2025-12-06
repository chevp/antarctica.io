/**
 * ExternalDocEmbed - Vanilla JS Web Component
 *
 * Embeds external HTML documentation from chevp.github.io assets
 * into the Antarctica.io documentation system.
 *
 * Usage:
 *   <external-doc-embed
 *     src="figma-angular-mcp-pipeline"
 *     title="Figma to Angular Pipeline">
 *   </external-doc-embed>
 *
 * The component fetches content from:
 *   https://chevp.github.io/assets/{src}.html
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

  get title() {
    return this.getAttribute('title') || 'Documentation';
  }

  get baseUrl() {
    return this.getAttribute('base-url') || 'https://chevp.github.io/assets';
  }

  get fullUrl() {
    const src = this.src;
    if (!src) return null;
    // Add .html extension if not present
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
    // Create a temporary container to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract the main content (body) and styles
    const body = doc.body;
    const styles = doc.querySelectorAll('style');
    const links = doc.querySelectorAll('link[rel="stylesheet"]');

    // Extract inline styles from <style> tags
    let extractedStyles = '';
    styles.forEach(style => {
      extractedStyles += style.textContent;
    });

    // Get body content
    const bodyContent = body ? body.innerHTML : html;

    return {
      styles: extractedStyles,
      content: bodyContent,
      stylesheetLinks: Array.from(links).map(link => link.href)
    };
  }

  getStyles() {
    return `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .embed-container {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .embed-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: rgba(30, 41, 59, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .embed-title {
        font-size: 14px;
        font-weight: 600;
        color: #e2e8f0;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .embed-title::before {
        content: '';
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #60a5fa, #3b82f6);
        border-radius: 50%;
      }

      .embed-actions {
        display: flex;
        gap: 8px;
      }

      .embed-action {
        padding: 6px 12px;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 6px;
        color: #60a5fa;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
      }

      .embed-action:hover {
        background: rgba(59, 130, 246, 0.3);
        border-color: rgba(59, 130, 246, 0.5);
      }

      .embed-content {
        flex: 1;
        overflow: auto;
        position: relative;
      }

      .embed-iframe {
        width: 100%;
        height: 100%;
        min-height: 600px;
        border: none;
        background: #0f172a;
      }

      .loading-state,
      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px;
        text-align: center;
        color: #94a3b8;
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

      .error-message {
        color: #f87171;
        margin-bottom: 8px;
      }

      .error-hint {
        font-size: 12px;
        color: #64748b;
      }
    `;
  }

  render() {
    const styles = this.getStyles();

    if (this._loading) {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="embed-container">
          <div class="embed-header">
            <h3 class="embed-title">${this.title}</h3>
          </div>
          <div class="embed-content">
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Loading documentation...</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    if (this._error) {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="embed-container">
          <div class="embed-header">
            <h3 class="embed-title">${this.title}</h3>
          </div>
          <div class="embed-content">
            <div class="error-state">
              <div class="error-icon">!</div>
              <p class="error-message">${this._error}</p>
              <p class="error-hint">Source: ${this.fullUrl || 'not specified'}</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Use iframe for complete isolation and proper styling
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="embed-container">
        <div class="embed-header">
          <h3 class="embed-title">${this.title}</h3>
          <div class="embed-actions">
            <a href="${this.fullUrl}" target="_blank" class="embed-action">
              Open in New Tab
            </a>
          </div>
        </div>
        <div class="embed-content">
          <iframe
            class="embed-iframe"
            src="${this.fullUrl}"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    `;
  }
}

// Register the custom element
if (!customElements.get('external-doc-embed')) {
  customElements.define('external-doc-embed', ExternalDocEmbed);
}

export default ExternalDocEmbed;