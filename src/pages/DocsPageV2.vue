<template>
  <div class="docs-page">
    <figma-angular-mcp-pipeline-v2></figma-angular-mcp-pipeline-v2>
  </div>
</template>

<script>
export default {
  name: 'DocsPageV2',
  mounted() {
    // Load Material Icons font (needed for Shadow DOM)
    if (!document.querySelector('link[href*="Material+Icons+Outlined"]')) {
      const iconLink = document.createElement('link');
      iconLink.rel = 'stylesheet';
      iconLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined';
      document.head.appendChild(iconLink);
    }

    // Dynamically load the web component
    const script = document.createElement('script');
    script.type = 'module';
    script.src = import.meta.env.BASE_URL + 'assets/figma-angular-mcp-pipeline-v2.js';
    document.head.appendChild(script);
  }
};
</script>

<style scoped>
.docs-page {
  height: calc(100vh - 140px);
  margin: -32px;
}
</style>
