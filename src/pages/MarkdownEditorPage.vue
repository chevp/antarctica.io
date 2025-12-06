<template>
  <div class="editor-page">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn" @click="sendToServer" :disabled="isLoading">
          <span class="material-symbols-outlined">send</span>
          <span>Send</span>
        </button>
        <button class="toolbar-btn" @click="downloadMarkdown">
          <span class="material-symbols-outlined">download</span>
          <span>Download</span>
        </button>
        <button class="toolbar-btn" @click="clearEditor">
          <span class="material-symbols-outlined">delete</span>
          <span>Clear</span>
        </button>
      </div>
      <div class="toolbar-center">
        <span class="status-indicator" :class="{ active: isLoading }">
          <span class="material-symbols-outlined">{{ isLoading ? 'sync' : 'check_circle' }}</span>
          <span>{{ statusText }}</span>
        </span>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn" @click="toggleSettings">
          <span class="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </button>
        <button class="toolbar-btn primary" @click="login">
          <span class="material-symbols-outlined">login</span>
          <span>Login</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="editor-container">
      <!-- Left: ACE Editor -->
      <div class="editor-panel">
        <div class="panel-header">
          <span class="material-symbols-outlined">edit_note</span>
          <span>Markdown Editor</span>
        </div>
        <div ref="editorContainer" class="ace-editor"></div>
      </div>

      <!-- Resizer -->
      <div class="resizer" @mousedown="startResize"></div>

      <!-- Right: Preview -->
      <div class="preview-panel" :style="{ width: previewWidth + '%' }">
        <div class="panel-header">
          <span class="material-symbols-outlined">preview</span>
          <span>HTML Preview</span>
        </div>
        <div class="preview-content">
          <markdown-preview :html="previewHtml"></markdown-preview>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="settings-modal" @click.self="toggleSettings">
      <div class="settings-content">
        <h3>Settings</h3>
        <div class="setting-item">
          <label>Server URL</label>
          <input v-model="serverUrl" type="text" placeholder="https://your-server.com/api/markdown" />
        </div>
        <div class="setting-item">
          <label>Theme</label>
          <select v-model="editorTheme">
            <option value="monokai">Monokai</option>
            <option value="github_dark">GitHub Dark</option>
            <option value="tomorrow_night">Tomorrow Night</option>
            <option value="twilight">Twilight</option>
          </select>
        </div>
        <button class="toolbar-btn primary" @click="applySettings">Apply</button>
      </div>
    </div>
  </div>
</template>

<script>
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github_dark';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-twilight';

export default {
  name: 'MarkdownEditorPage',
  data() {
    return {
      editor: null,
      previewHtml: '',
      isLoading: false,
      statusText: 'Ready',
      showSettings: false,
      serverUrl: 'https://your-server.com/api/markdown',
      editorTheme: 'monokai',
      previewWidth: 50,
      isResizing: false,
      defaultMarkdown: `# Welcome to the Markdown Editor

This is a **live preview** editor that sends your Markdown to a PHP server for conversion.

## Features

- Real-time preview
- Server-side PHP conversion
- Multiple themes
- Download functionality

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

- Bullet point
- Another point

> This is a blockquote

---

Click **Send** to convert this Markdown to HTML!
`
    };
  },
  mounted() {
    this.initEditor();
    this.loadWebComponent();
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
  methods: {
    initEditor() {
      this.editor = ace.edit(this.$refs.editorContainer, {
        mode: 'ace/mode/markdown',
        theme: `ace/theme/${this.editorTheme}`,
        fontSize: 14,
        showPrintMargin: false,
        wrap: true,
        tabSize: 2,
        useSoftTabs: true
      });
      this.editor.setValue(this.defaultMarkdown, -1);

      // Auto-send on change with debounce
      let timeout;
      this.editor.on('change', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.sendToServer();
        }, 1000);
      });
    },
    loadWebComponent() {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = import.meta.env.BASE_URL + 'assets/markdown-preview.js';
      document.head.appendChild(script);
    },
    async sendToServer() {
      const markdown = this.editor.getValue();
      if (!markdown.trim()) {
        this.previewHtml = '<p class="empty">No content to preview</p>';
        return;
      }

      this.isLoading = true;
      this.statusText = 'Converting...';

      try {
        const response = await fetch(this.serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ markdown })
        });

        if (response.ok) {
          const data = await response.json();
          this.previewHtml = data.html || data;
          this.statusText = 'Converted';
        } else {
          // Fallback: simple client-side conversion for demo
          this.previewHtml = this.simpleMarkdownToHtml(markdown);
          this.statusText = 'Local preview (server unavailable)';
        }
      } catch (error) {
        // Fallback: simple client-side conversion for demo
        this.previewHtml = this.simpleMarkdownToHtml(markdown);
        this.statusText = 'Local preview (server unavailable)';
      }

      this.isLoading = false;
    },
    simpleMarkdownToHtml(md) {
      // Basic markdown conversion for demo/fallback
      let html = md
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/`{3}(\w+)?\n([\s\S]*?)`{3}/gim, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/^---$/gim, '<hr>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n/gim, '<br>');
      return html;
    },
    downloadMarkdown() {
      const markdown = this.editor.getValue();
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      a.click();
      URL.revokeObjectURL(url);
      this.statusText = 'Downloaded';
    },
    clearEditor() {
      this.editor.setValue('', -1);
      this.previewHtml = '';
      this.statusText = 'Cleared';
    },
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    applySettings() {
      this.editor.setTheme(`ace/theme/${this.editorTheme}`);
      this.showSettings = false;
      this.statusText = 'Settings applied';
    },
    login() {
      // Placeholder for login functionality
      alert('Login functionality coming soon!');
    },
    startResize(e) {
      this.isResizing = true;
      document.addEventListener('mousemove', this.resize);
      document.addEventListener('mouseup', this.stopResize);
    },
    resize(e) {
      if (!this.isResizing) return;
      const container = document.querySelector('.editor-container');
      const containerRect = container.getBoundingClientRect();
      const newPreviewWidth = ((containerRect.right - e.clientX) / containerRect.width) * 100;
      this.previewWidth = Math.min(Math.max(newPreviewWidth, 20), 80);
    },
    stopResize() {
      this.isResizing = false;
      document.removeEventListener('mousemove', this.resize);
      document.removeEventListener('mouseup', this.stopResize);
    }
  }
};
</script>

<style scoped>
.editor-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  margin: -32px;
  background: #0f172a;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #475569;
  border-color: #64748b;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn.primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: #818cf8;
}

.toolbar-btn.primary:hover {
  background: linear-gradient(135deg, #818cf8, #a78bfa);
}

.toolbar-btn .material-symbols-outlined {
  font-size: 18px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.status-indicator.active .material-symbols-outlined {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Editor Container */
.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.preview-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-left: 1px solid #334155;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.panel-header .material-symbols-outlined {
  font-size: 18px;
}

.ace-editor {
  flex: 1;
  width: 100%;
}

.preview-content {
  flex: 1;
  overflow: auto;
  background: #0f172a;
}

/* Resizer */
.resizer {
  width: 6px;
  background: #1e293b;
  cursor: col-resize;
  transition: background 0.2s;
}

.resizer:hover {
  background: #6366f1;
}

/* Settings Modal */
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.settings-content {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
}

.settings-content h3 {
  margin: 0 0 20px;
  color: #e2e8f0;
  font-size: 18px;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item label {
  display: block;
  margin-bottom: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.setting-item input,
.setting-item select {
  width: 100%;
  padding: 10px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 14px;
}

.setting-item input:focus,
.setting-item select:focus {
  outline: none;
  border-color: #6366f1;
}
</style>
