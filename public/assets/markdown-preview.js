/**
 * Markdown Preview Web Component
 * Displays HTML content converted from Markdown via server-side PHP
 */

class MarkdownPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._html = '';
  }

  static get observedAttributes() {
    return ['html'];
  }

  get html() {
    return this._html;
  }

  set html(value) {
    this._html = value;
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'html' && oldValue !== newValue) {
      this._html = newValue;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="preview-container">
        ${this._html || this.getEmptyState()}
      </div>
    `;
  }

  getEmptyState() {
    return `
      <div class="empty-state">
        <span class="icon">preview</span>
        <p>Preview will appear here</p>
        <p class="hint">Write Markdown on the left and click Send</p>
      </div>
    `;
  }

  getStyles() {
    return `
      :host {
        display: block;
        height: 100%;
        overflow: auto;
      }

      .preview-container {
        padding: 24px;
        color: #e2e8f0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 15px;
        line-height: 1.7;
      }

      /* Empty State */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        color: #64748b;
        text-align: center;
      }

      .empty-state .icon {
        font-family: 'Material Symbols Outlined';
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-state p {
        margin: 4px 0;
      }

      .empty-state .hint {
        font-size: 13px;
        color: #475569;
      }

      /* Typography */
      h1 {
        font-size: 2em;
        font-weight: 700;
        margin: 0 0 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #334155;
        color: #f1f5f9;
      }

      h2 {
        font-size: 1.5em;
        font-weight: 600;
        margin: 32px 0 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #334155;
        color: #f1f5f9;
      }

      h3 {
        font-size: 1.25em;
        font-weight: 600;
        margin: 24px 0 12px;
        color: #f1f5f9;
      }

      h4 {
        font-size: 1.1em;
        font-weight: 600;
        margin: 20px 0 10px;
        color: #e2e8f0;
      }

      p {
        margin: 0 0 16px;
      }

      /* Links */
      a {
        color: #818cf8;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
        color: #a5b4fc;
      }

      /* Code */
      code {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 2px 6px;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.9em;
        color: #f472b6;
      }

      pre {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 16px;
        overflow-x: auto;
        margin: 16px 0;
      }

      pre code {
        background: none;
        border: none;
        padding: 0;
        color: #e2e8f0;
        font-size: 14px;
        line-height: 1.5;
      }

      /* Blockquotes */
      blockquote {
        margin: 16px 0;
        padding: 12px 20px;
        border-left: 4px solid #6366f1;
        background: #1e293b;
        border-radius: 0 8px 8px 0;
        color: #94a3b8;
        font-style: italic;
      }

      blockquote p {
        margin: 0;
      }

      /* Lists */
      ul, ol {
        margin: 16px 0;
        padding-left: 24px;
      }

      li {
        margin: 8px 0;
      }

      ul li::marker {
        color: #6366f1;
      }

      ol li::marker {
        color: #6366f1;
        font-weight: 600;
      }

      /* Horizontal Rule */
      hr {
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, #334155, transparent);
        margin: 32px 0;
      }

      /* Tables */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
      }

      th, td {
        padding: 12px;
        text-align: left;
        border: 1px solid #334155;
      }

      th {
        background: #1e293b;
        font-weight: 600;
        color: #f1f5f9;
      }

      tr:nth-child(even) {
        background: rgba(30, 41, 59, 0.5);
      }

      /* Images */
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 16px 0;
      }

      /* Keyboard */
      kbd {
        background: #334155;
        border: 1px solid #475569;
        border-radius: 4px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 0.85em;
        box-shadow: 0 2px 0 #1e293b;
      }

      /* Strikethrough */
      del {
        color: #64748b;
        text-decoration: line-through;
      }

      /* Mark/Highlight */
      mark {
        background: rgba(250, 204, 21, 0.3);
        color: #fef08a;
        padding: 0 4px;
        border-radius: 2px;
      }

      /* Task Lists */
      .task-list-item {
        list-style: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .task-list-item input[type="checkbox"] {
        width: 16px;
        height: 16px;
        accent-color: #6366f1;
      }

      /* Syntax Highlighting (basic) */
      .language-javascript .keyword,
      .language-js .keyword {
        color: #c084fc;
      }

      .language-javascript .string,
      .language-js .string {
        color: #86efac;
      }

      .language-javascript .function,
      .language-js .function {
        color: #60a5fa;
      }

      .language-javascript .comment,
      .language-js .comment {
        color: #64748b;
        font-style: italic;
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: #1e293b;
      }

      ::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }

      /* Empty paragraph styling */
      .empty {
        color: #64748b;
        font-style: italic;
        text-align: center;
        padding: 40px;
      }
    `;
  }
}

customElements.define('markdown-preview', MarkdownPreview);
