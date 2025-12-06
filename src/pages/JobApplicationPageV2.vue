<template>
  <div class="application-page">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn" @click="generatePreview">
          <span class="material-symbols-outlined">refresh</span>
          <span>Aktualisieren</span>
        </button>
        <button class="toolbar-btn" @click="downloadPdf">
          <span class="material-symbols-outlined">picture_as_pdf</span>
          <span>PDF Export</span>
        </button>
        <button class="toolbar-btn" @click="saveAllFiles">
          <span class="material-symbols-outlined">save</span>
          <span>Speichern</span>
        </button>
      </div>
      <div class="toolbar-center">
        <span class="page-title">Bewerbungs-Generator v2</span>
        <span class="version-badge">Projekt-basiert</span>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn" @click="loadTemplate">
          <span class="material-symbols-outlined">description</span>
          <span>Vorlage</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-layout">
      <!-- Left Sidebar: File Tree -->
      <div class="sidebar-panel">
        <div class="panel-header">
          <span class="material-symbols-outlined">folder_open</span>
          <span>Bewerbung v2</span>
        </div>

        <!-- File Tree -->
        <div class="file-tree">
          <!-- Profil Section -->
          <div class="tree-section">
            <div class="section-header" @click="toggleSection('profil')">
              <span class="material-symbols-outlined expand-icon">
                {{ expandedSections.profil ? 'expand_more' : 'chevron_right' }}
              </span>
              <span class="material-symbols-outlined section-icon cyan">person</span>
              <span>Profil</span>
            </div>
            <div class="section-content" v-show="expandedSections.profil">
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'profile' }"
                @click="selectFile('profile')"
              >
                <span class="material-symbols-outlined">badge</span>
                <span>Wer ich bin</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'approach' }"
                @click="selectFile('approach')"
              >
                <span class="material-symbols-outlined">psychology</span>
                <span>Arbeitsansatz</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'domains' }"
                @click="selectFile('domains')"
              >
                <span class="material-symbols-outlined">domain</span>
                <span>Domain-Expertise</span>
              </div>
            </div>
          </div>

          <!-- Projekte Section -->
          <div class="tree-section">
            <div class="section-header" @click="toggleSection('projekte')">
              <span class="material-symbols-outlined expand-icon">
                {{ expandedSections.projekte ? 'expand_more' : 'chevron_right' }}
              </span>
              <span class="material-symbols-outlined section-icon purple">rocket_launch</span>
              <span>Projekte</span>
            </div>
            <div class="section-content" v-show="expandedSections.projekte">
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'project-1' }"
                @click="selectFile('project-1')"
              >
                <span class="material-symbols-outlined">shopping_cart</span>
                <span>E-Commerce Relaunch</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'project-2' }"
                @click="selectFile('project-2')"
              >
                <span class="material-symbols-outlined">analytics</span>
                <span>Analytics Dashboard</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'project-3' }"
                @click="selectFile('project-3')"
              >
                <span class="material-symbols-outlined">history</span>
                <span>Legacy Rettung</span>
              </div>
            </div>
          </div>

          <!-- Bewerbung Section -->
          <div class="tree-section">
            <div class="section-header" @click="toggleSection('bewerbung')">
              <span class="material-symbols-outlined expand-icon">
                {{ expandedSections.bewerbung ? 'expand_more' : 'chevron_right' }}
              </span>
              <span class="material-symbols-outlined section-icon blue">description</span>
              <span>Bewerbung</span>
            </div>
            <div class="section-content" v-show="expandedSections.bewerbung">
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'position' }"
                @click="selectFile('position')"
              >
                <span class="material-symbols-outlined">business_center</span>
                <span>Position</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'motivation' }"
                @click="selectFile('motivation')"
              >
                <span class="material-symbols-outlined">edit_note</span>
                <span>Anschreiben</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'references' }"
                @click="selectFile('references')"
              >
                <span class="material-symbols-outlined">recommend</span>
                <span>Referenzen</span>
              </div>
            </div>
          </div>
        </div>

        <!-- File Status -->
        <div class="file-status">
          <div class="status-header">Dateistatus</div>
          <div class="status-item" v-for="file in fileList" :key="file.id">
            <span class="material-symbols-outlined" :class="{ modified: files[file.id]?.modified }">
              {{ files[file.id]?.modified ? 'edit' : 'check_circle' }}
            </span>
            <span>{{ file.name }}</span>
          </div>
        </div>
      </div>

      <!-- Center: ACE Editor -->
      <div class="editor-panel">
        <div class="panel-header">
          <span class="material-symbols-outlined">edit_note</span>
          <span>{{ currentFileName }}</span>
          <span class="file-badge" v-if="isCurrentFileModified">Geändert</span>
        </div>
        <div ref="editorContainer" class="ace-editor"></div>
      </div>

      <!-- Right: Preview -->
      <div class="preview-panel">
        <div class="panel-header">
          <span class="material-symbols-outlined">preview</span>
          <span>Vorschau</span>
          <div class="page-nav">
            <button @click="currentPage = 1" :class="{ active: currentPage === 1 }">Profil</button>
            <button @click="currentPage = 2" :class="{ active: currentPage === 2 }">Projekte</button>
            <button @click="currentPage = 3" :class="{ active: currentPage === 3 }">Anschreiben</button>
          </div>
        </div>
        <div class="preview-content">
          <job-application-preview-v2
            :markdown="combinedMarkdown"
            :page="currentPage"
          ></job-application-preview-v2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-monokai';

export default {
  name: 'JobApplicationPageV2',
  data() {
    return {
      editor: null,
      selectedFile: 'profile',
      currentPage: 1,
      expandedSections: {
        profil: true,
        projekte: true,
        bewerbung: true
      },
      files: {
        profile: { content: '', modified: false, loaded: false },
        approach: { content: '', modified: false, loaded: false },
        domains: { content: '', modified: false, loaded: false },
        'project-1': { content: '', modified: false, loaded: false },
        'project-2': { content: '', modified: false, loaded: false },
        'project-3': { content: '', modified: false, loaded: false },
        position: { content: '', modified: false, loaded: false },
        motivation: { content: '', modified: false, loaded: false },
        references: { content: '', modified: false, loaded: false }
      },
      fileList: [
        { id: 'profile', name: 'Profil' },
        { id: 'approach', name: 'Arbeitsansatz' },
        { id: 'domains', name: 'Domain-Expertise' },
        { id: 'project-1', name: 'Projekt 1' },
        { id: 'project-2', name: 'Projekt 2' },
        { id: 'project-3', name: 'Projekt 3' },
        { id: 'position', name: 'Position' },
        { id: 'motivation', name: 'Anschreiben' },
        { id: 'references', name: 'Referenzen' }
      ]
    };
  },
  computed: {
    currentFileName() {
      const file = this.fileList.find(f => f.id === this.selectedFile);
      return file ? file.name : '';
    },
    isCurrentFileModified() {
      return this.files[this.selectedFile]?.modified;
    },
    combinedMarkdown() {
      const order = ['profile', 'approach', 'domains', 'project-1', 'project-2', 'project-3', 'position', 'motivation', 'references'];
      return order.map(id => this.files[id]?.content || '').join('\n\n---\n\n');
    }
  },
  mounted() {
    this.initEditor();
    this.loadWebComponent();
    this.loadAllFiles();
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
        theme: 'ace/theme/monokai',
        fontSize: 14,
        showPrintMargin: false,
        wrap: true,
        tabSize: 2,
        useSoftTabs: true
      });

      this.editor.on('change', () => {
        if (this.files[this.selectedFile]) {
          this.files[this.selectedFile].content = this.editor.getValue();
          this.files[this.selectedFile].modified = true;
        }
      });
    },
    loadWebComponent() {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = import.meta.env.BASE_URL + 'assets/job-application-preview-v2.js';
      document.head.appendChild(script);
    },
    async loadAllFiles() {
      const baseUrl = import.meta.env.BASE_URL + 'assets/application-templates-v2/';

      for (const file of this.fileList) {
        try {
          const response = await fetch(baseUrl + file.id + '.md');
          if (response.ok) {
            const content = await response.text();
            this.files[file.id].content = content;
            this.files[file.id].loaded = true;
          }
        } catch (error) {
          console.error(`Failed to load ${file.id}.md:`, error);
        }
      }

      this.loadFileIntoEditor(this.selectedFile);
    },
    loadFileIntoEditor(fileId) {
      if (this.files[fileId]) {
        this.editor.setValue(this.files[fileId].content, -1);
        this.files[fileId].modified = false;
      }
    },
    selectFile(fileId) {
      if (this.files[this.selectedFile]) {
        this.files[this.selectedFile].content = this.editor.getValue();
      }
      this.selectedFile = fileId;
      this.loadFileIntoEditor(fileId);
    },
    toggleSection(section) {
      this.expandedSections[section] = !this.expandedSections[section];
    },
    generatePreview() {
      if (this.files[this.selectedFile]) {
        this.files[this.selectedFile].content = this.editor.getValue();
      }
      this.files = { ...this.files };
    },
    saveAllFiles() {
      Object.keys(this.files).forEach(key => {
        this.files[key].modified = false;
      });
      alert('Alle Dateien wurden gespeichert.');
    },
    downloadPdf() {
      const previewEl = document.querySelector('job-application-preview-v2');
      if (previewEl && previewEl.shadowRoot) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Bewerbung - PDF Export</title>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; padding: 0; }
              ${previewEl.getStyles ? previewEl.getStyles() : ''}
            </style>
          </head>
          <body>
            ${previewEl.shadowRoot.innerHTML}
          </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    },
    async loadTemplate() {
      const baseUrl = import.meta.env.BASE_URL + 'assets/application-templates-v2/';

      for (const file of this.fileList) {
        try {
          const response = await fetch(baseUrl + file.id + '.md', { cache: 'reload' });
          if (response.ok) {
            const content = await response.text();
            this.files[file.id].content = content;
            this.files[file.id].modified = false;
            this.files[file.id].loaded = true;
          }
        } catch (error) {
          console.error(`Failed to reload ${file.id}.md:`, error);
        }
      }

      this.loadFileIntoEditor(this.selectedFile);
      this.files = { ...this.files };
    }
  }
};
</script>

<style scoped>
.application-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  margin: -32px;
  background: #0f172a;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-title {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 15px;
}

.version-badge {
  padding: 2px 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px;
  font-size: 10px;
  color: white;
  font-weight: 500;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
  color: #60a5fa;
  transform: translateY(-1px);
}

.toolbar-btn .material-symbols-outlined {
  font-size: 18px;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.panel-header .material-symbols-outlined {
  font-size: 18px;
}

.file-badge {
  margin-left: auto;
  padding: 2px 8px;
  background: #f59e0b;
  color: #1e293b;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.tree-section {
  margin-bottom: 4px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.section-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.expand-icon {
  font-size: 18px;
  color: #64748b;
}

.section-icon {
  font-size: 18px;
}

.section-icon.cyan { color: #22d3ee; }
.section-icon.purple { color: #a78bfa; }
.section-icon.blue { color: #60a5fa; }

.section-content {
  margin-left: 12px;
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 8px 24px;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}

.tree-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.tree-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border-left-color: #60a5fa;
}

.tree-item .material-symbols-outlined {
  font-size: 16px;
}

.file-status {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 150px;
  overflow-y: auto;
}

.status-header {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 11px;
  color: #64748b;
}

.status-item .material-symbols-outlined {
  font-size: 14px;
  color: #22c55e;
}

.status-item .material-symbols-outlined.modified {
  color: #f59e0b;
}

.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.ace-editor {
  flex: 1;
  width: 100%;
}

.preview-panel {
  width: 45%;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.page-nav {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.page-nav button {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #94a3b8;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-nav button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.page-nav button.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  color: #60a5fa;
}

.preview-content {
  flex: 1;
  overflow: auto;
  background: #1e293b;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex;
  justify-content: center;
  padding: 20px;
}
</style>
