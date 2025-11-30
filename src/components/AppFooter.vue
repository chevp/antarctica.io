<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="h-10 glass border-t border-slate-700/50 flex items-center justify-center px-6 text-xs diagonal-stripes">
    <nav class="flex items-center gap-4">
      <span class="text-slate-500">Antarctica.io @ {{ currentYear }} Patrice Chevillat</span>
      <a href="https://chevp.github.io/site-policy/terms.html" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
      <a href="https://chevp.github.io/site-policy/privacy.html" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
      <a href="https://chevp.github.io/site-policy/impressum.html" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-300 transition-colors">Impressum</a>
      <a href="/docs" class="text-slate-500 hover:text-slate-300 transition-colors">Docs</a>
      <a href="https://chevp.github.io/site-policy/contact.html" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-300 transition-colors">Contact</a>
      <button type="button" class="text-slate-500 hover:text-slate-300 transition-colors">Manage cookies</button>
    </nav>
  </footer>
</template>
