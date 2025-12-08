<template>
  <div class="max-w-2xl mx-auto text-center py-8">

    <!-- Warning Icon -->
    <div class="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-8 animate-pulse">
      <span class="material-icons text-white text-5xl">cloud_off</span>
    </div>

    <!-- Fallback Message -->
    <h1 class="text-4xl font-extrabold mb-4">
      <span class="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Fallback Mode</span>
    </h1>

    <p class="text-lg text-slate-400 mb-8">
      The Synth Cluster Editor is currently running in fallback mode.
      Local pages could not be loaded and the remote connection is unavailable.
    </p>

    <!-- Status Card -->
    <div class="glass rounded-2xl p-6 mb-8 text-left">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <span class="material-icons text-white text-2xl">info</span>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-2">What does this mean?</h2>
          <p class="text-slate-400 text-sm mb-3">
            The application couldn't load the UI pages from local storage or the remote server.
            This may happen due to network issues, missing files, or during initial setup.
          </p>
          <div class="flex items-center gap-2">
            <span class="text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded border border-amber-500/30">Limited Functionality</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="glass rounded-xl p-4 transition-all hover:translate-y-[-2px] hover:border-blue-500/50">
        <span class="material-icons text-amber-400 text-2xl mb-2">folder_off</span>
        <p class="text-sm font-medium">Local Pages</p>
        <p class="text-xs text-slate-500">Not Available</p>
      </div>
      <div class="glass rounded-xl p-4 transition-all hover:translate-y-[-2px] hover:border-blue-500/50">
        <span class="material-icons text-amber-400 text-2xl mb-2">wifi_off</span>
        <p class="text-sm font-medium">Remote Server</p>
        <p class="text-xs text-slate-500">Unreachable</p>
      </div>
      <div class="glass rounded-xl p-4 transition-all hover:translate-y-[-2px] hover:border-blue-500/50">
        <span class="material-icons text-green-400 text-2xl mb-2">check_circle</span>
        <p class="text-sm font-medium">Application</p>
        <p class="text-xs text-slate-500">Running</p>
      </div>
    </div>

    <!-- Troubleshooting Section -->
    <div class="glass rounded-xl p-6 mb-8 text-left">
      <h3 class="font-semibold mb-4 flex items-center gap-2">
        <span class="material-icons text-blue-400">build</span>
        Troubleshooting Steps
      </h3>
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <span class="material-icons text-slate-500 text-sm mt-0.5">chevron_right</span>
          <div>
            <p class="text-sm text-slate-300">Check your internet connection</p>
            <p class="text-xs text-slate-500">Ensure you have network access to load remote pages</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="material-icons text-slate-500 text-sm mt-0.5">chevron_right</span>
          <div>
            <p class="text-sm text-slate-300">Restart the application</p>
            <p class="text-xs text-slate-500">Close and reopen Synth Cluster Editor</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="material-icons text-slate-500 text-sm mt-0.5">chevron_right</span>
          <div>
            <p class="text-sm text-slate-300">Rebuild the project</p>
            <p class="text-xs text-slate-500">Run <code class="bg-slate-800 px-1 rounded text-xs">npm run build</code> to regenerate local pages</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="material-icons text-slate-500 text-sm mt-0.5">chevron_right</span>
          <div>
            <p class="text-sm text-slate-300">Check the console for errors</p>
            <p class="text-xs text-slate-500">Open DevTools (Ctrl+Shift+I) to see detailed error messages</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Technical Info -->
    <div class="glass rounded-xl p-4 mb-8">
      <p class="text-xs text-slate-500 mb-2">Remote Pages URL</p>
      <div class="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3 font-mono text-sm">
        <span class="text-blue-400 material-icons text-base">link</span>
        <code class="text-slate-300 text-xs">https://chevp.github.io/antarctica.io/</code>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button @click="retryConnection"
         class="bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 rounded-xl font-semibold text-white flex items-center gap-2 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25">
        <span class="material-icons">refresh</span>
        Retry Connection
      </button>
      <a href="https://github.com/chevp/synth-cluster-editor" target="_blank"
         class="glass px-6 py-4 rounded-xl font-medium text-slate-300 flex items-center gap-2 transition-all hover:bg-white/10">
        <span class="material-icons">code</span>
        View on GitHub
      </a>
    </div>

  </div>
</template>

<script>
export default {
  name: 'FallbackPage',
  methods: {
    retryConnection() {
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>