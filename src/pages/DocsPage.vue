<template>
  <div class="docs-page">
    <div class="docs-header mb-8">
      <h1 class="text-3xl font-bold mb-2">Documentation</h1>
      <p class="text-slate-400">Technical specifications and architecture documentation</p>
    </div>

    <!-- Documentation Navigation -->
    <div class="docs-nav mb-6">
      <div class="flex flex-wrap gap-3">
        <button
          v-for="doc in documents"
          :key="doc.id"
          @click="selectDocument(doc.id)"
          :class="[
            'doc-tab px-4 py-2 rounded-lg text-sm font-medium transition-all',
            selectedDoc === doc.id
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
              : 'glass text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          ]"
        >
          {{ doc.title }}
        </button>
      </div>
    </div>

    <!-- Document Viewer -->
    <div class="docs-content">
      <external-doc-embed
        v-if="currentDocument"
        :src="currentDocument.src"
        :title="currentDocument.title"
      ></external-doc-embed>
    </div>
  </div>
</template>

<script>
import '../components/ExternalDocEmbed.js';

export default {
  name: 'DocsPage',
  data() {
    return {
      selectedDoc: 'figma-angular-mcp-pipeline',
      documents: [
        {
          id: 'figma-angular-mcp-pipeline',
          title: 'Figma to Angular MCP Pipeline',
          src: 'figma-angular-mcp-pipeline',
          description: 'Design-to-code pipeline using MCP servers'
        }
      ]
    };
  },
  computed: {
    currentDocument() {
      return this.documents.find(doc => doc.id === this.selectedDoc);
    }
  },
  methods: {
    selectDocument(docId) {
      this.selectedDoc = docId;
    }
  }
};
</script>

<style scoped>
.docs-page {
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.docs-content {
  flex: 1;
  min-height: 0;
}

.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.doc-tab {
  cursor: pointer;
}
</style>