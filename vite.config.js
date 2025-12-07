import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat external-doc-embed as custom element
          isCustomElement: (tag) => ['external-doc-embed', 'figma-angular-mcp-pipeline', 'figma-angular-mcp-pipeline-v2', 'figma-angular-mcp-pipeline-v3', 'markdown-preview', 'job-application-preview', 'job-application-preview-v2'].includes(tag)
        }
      }
    })
  ],
  base: '/antarctica.io/',
})
