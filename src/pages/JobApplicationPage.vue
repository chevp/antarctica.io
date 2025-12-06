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
        <span class="page-title">Bewerbungs-Generator</span>
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
          <span>Bewerbungsdaten</span>
        </div>

        <!-- File Tree -->
        <div class="file-tree">
          <!-- Bewerber Section -->
          <div class="tree-section">
            <div class="section-header" @click="toggleSection('bewerber')">
              <span class="material-symbols-outlined expand-icon">
                {{ expandedSections.bewerber ? 'expand_more' : 'chevron_right' }}
              </span>
              <span class="material-symbols-outlined section-icon">person</span>
              <span>Bewerber</span>
            </div>
            <div class="section-content" v-show="expandedSections.bewerber">
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'personal' }"
                @click="selectFile('personal')"
              >
                <span class="material-symbols-outlined">badge</span>
                <span>Persönliche Daten</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'skills' }"
                @click="selectFile('skills')"
              >
                <span class="material-symbols-outlined">psychology</span>
                <span>Kenntnisse</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'languages' }"
                @click="selectFile('languages')"
              >
                <span class="material-symbols-outlined">translate</span>
                <span>Sprachen</span>
              </div>
            </div>
          </div>

          <!-- Werdegang Section -->
          <div class="tree-section">
            <div class="section-header" @click="toggleSection('werdegang')">
              <span class="material-symbols-outlined expand-icon">
                {{ expandedSections.werdegang ? 'expand_more' : 'chevron_right' }}
              </span>
              <span class="material-symbols-outlined section-icon">timeline</span>
              <span>Werdegang</span>
            </div>
            <div class="section-content" v-show="expandedSections.werdegang">
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'experience' }"
                @click="selectFile('experience')"
              >
                <span class="material-symbols-outlined">work</span>
                <span>Berufserfahrung</span>
              </div>
              <div
                class="tree-item"
                :class="{ active: selectedFile === 'education' }"
                @click="selectFile('education')"
              >
                <span class="material-symbols-outlined">school</span>
                <span>Ausbildung</span>
              </div>
            </div>
          </div>

          <!-- Bewerbung Section -->
          <div class="tree-section">
            <div class="section-header" @click="toggleSection('bewerbung')">
              <span class="material-symbols-outlined expand-icon">
                {{ expandedSections.bewerbung ? 'expand_more' : 'chevron_right' }}
              </span>
              <span class="material-symbols-outlined section-icon">description</span>
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
                <span class="material-symbols-outlined">contact_page</span>
                <span>Referenzen</span>
              </div>
            </div>
          </div>
        </div>

        <!-- File Status -->
        <div class="file-status">
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
            <button @click="currentPage = 1" :class="{ active: currentPage === 1 }">Seite 1</button>
            <button @click="currentPage = 2" :class="{ active: currentPage === 2 }">Seite 2</button>
          </div>
        </div>
        <div class="preview-content">
          <job-application-preview
            :markdown="combinedMarkdown"
            :page="currentPage"
          ></job-application-preview>
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
  name: 'JobApplicationPage',
  data() {
    return {
      editor: null,
      selectedFile: 'personal',
      currentPage: 1,
      expandedSections: {
        bewerber: true,
        werdegang: true,
        bewerbung: true
      },
      files: {
        personal: { content: '', modified: false, loaded: false },
        skills: { content: '', modified: false, loaded: false },
        languages: { content: '', modified: false, loaded: false },
        experience: { content: '', modified: false, loaded: false },
        education: { content: '', modified: false, loaded: false },
        position: { content: '', modified: false, loaded: false },
        motivation: { content: '', modified: false, loaded: false },
        references: { content: '', modified: false, loaded: false }
      },
      fileList: [
        { id: 'personal', name: 'Persönliche Daten' },
        { id: 'skills', name: 'Kenntnisse' },
        { id: 'languages', name: 'Sprachen' },
        { id: 'experience', name: 'Berufserfahrung' },
        { id: 'education', name: 'Ausbildung' },
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
      // Combine all files into one markdown for preview
      const order = ['personal', 'position', 'experience', 'education', 'skills', 'languages', 'motivation', 'references'];
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

      // Track changes
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
      script.src = import.meta.env.BASE_URL + 'assets/job-application-preview.js';
      document.head.appendChild(script);
    },
    async loadAllFiles() {
      const baseUrl = import.meta.env.BASE_URL + 'assets/application-templates/';

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

      // Load initial file into editor
      this.loadFileIntoEditor(this.selectedFile);
    },
    loadFileIntoEditor(fileId) {
      if (this.files[fileId]) {
        this.editor.setValue(this.files[fileId].content, -1);
        this.files[fileId].modified = false;
      }
    },
    selectFile(fileId) {
      // Save current file content
      if (this.files[this.selectedFile]) {
        this.files[this.selectedFile].content = this.editor.getValue();
      }

      // Switch to new file
      this.selectedFile = fileId;
      this.loadFileIntoEditor(fileId);
    },
    toggleSection(section) {
      this.expandedSections[section] = !this.expandedSections[section];
    },
    generatePreview() {
      // Save current file and trigger preview update
      if (this.files[this.selectedFile]) {
        this.files[this.selectedFile].content = this.editor.getValue();
      }
      // Force reactivity
      this.files = { ...this.files };
    },
    saveAllFiles() {
      // In a real app, this would save to a backend
      // For now, we just mark all as saved
      Object.keys(this.files).forEach(key => {
        this.files[key].modified = false;
      });
      alert('Alle Dateien wurden gespeichert (lokal im Browser).');
    },
    downloadPdf() {
      const previewEl = document.querySelector('job-application-preview');
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
      // Reload all template files from server
      const baseUrl = import.meta.env.BASE_URL + 'assets/application-templates/';

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

      // Reload current file into editor
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

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
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

.page-title {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 15px;
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

.toolbar-btn.primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: #818cf8;
}

.toolbar-btn .material-symbols-outlined {
  font-size: 18px;
}

/* Main Layout */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar-panel {
  width: 260px;
  display: flex;
  flex-direction: column;
  background: #1e293b;
  border-right: 1px solid #334155;
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

.file-badge {
  margin-left: auto;
  padding: 2px 8px;
  background: #f59e0b;
  color: #1e293b;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

/* File Tree */
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
  padding: 8px 12px;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.section-header:hover {
  background: #334155;
}

.expand-icon {
  font-size: 18px;
  color: #64748b;
}

.section-icon {
  font-size: 18px;
  color: #6366f1;
}

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
  background: #334155;
  color: #e2e8f0;
}

.tree-item.active {
  background: #334155;
  color: #e2e8f0;
  border-left-color: #6366f1;
}

.tree-item .material-symbols-outlined {
  font-size: 16px;
}

/* File Status */
.file-status {
  padding: 12px;
  border-top: 1px solid #334155;
  max-height: 150px;
  overflow-y: auto;
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

/* Editor Panel */
.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid #334155;
}

.ace-editor {
  flex: 1;
  width: 100%;
}

/* Preview Panel */
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
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-nav button:hover {
  background: #475569;
}

.page-nav button.active {
  background: #6366f1;
  border-color: #818cf8;
  color: white;
}

.preview-content {
  flex: 1;
  overflow: auto;
  background: #374151;
  display: flex;
  justify-content: center;
  padding: 20px;
}

</style>
