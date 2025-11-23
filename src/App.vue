<template>
  <div class="bg-slate-950 text-slate-100 overflow-hidden h-screen">
    <!-- Main Container -->
    <div class="h-screen flex flex-col">
      <!-- Top Bar -->
      <header class="h-16 glass border-b border-slate-700/50 flex items-center justify-between px-6 diagonal-stripes">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center hover-glow cursor-pointer">
            <span class="material-symbols-outlined text-white text-xl">workspaces</span>
          </div>
          <h1 class="text-xl font-bold gradient-text">Antarctica.io</h1>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-3">
          <button class="w-10 h-10 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">search</span>
          </button>
          <button class="w-10 h-10 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">filter_list</span>
          </button>
          <button class="w-10 h-10 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button class="w-10 h-10 rounded-lg glass hover:bg-slate-700/50 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden flex">
        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto p-8 grid-bg">
          <div class="max-w-7xl mx-auto">
            <!-- Breadcrumb Navigation -->
            <div class="flex items-center gap-2 text-sm mb-8">
              <span class="text-blue-400 font-medium cursor-pointer hover:text-blue-300 transition-colors">Organizations</span>
            </div>

            <!-- Page Header -->
            <div class="mb-8">
              <h2 class="text-3xl font-bold mb-2">Select an Organization</h2>
              <p class="text-slate-400">Choose your organization to view projects</p>
            </div>

            <!-- Organizations Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Arctic Engine Org -->
              <div class="card glass rounded-xl p-6 border border-slate-700/50">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span class="material-symbols-outlined text-white text-3xl">api</span>
                  </div>
                  <span class="material-symbols-outlined text-blue-400">arrow_forward</span>
                </div>
                <h3 class="text-xl font-bold mb-2">Arctic Engine</h3>
                <p class="text-sm text-slate-400 mb-4">Core rendering engine and tooling ecosystem</p>
                <div class="flex items-center gap-4 text-xs text-slate-500">
                  <span>12 Projects</span>
                  <span>•</span>
                  <span>Active</span>
                </div>
              </div>

              <!-- Cryo Platform Org -->
              <div class="card glass rounded-xl p-6 border border-slate-700/50">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <span class="material-symbols-outlined text-white text-3xl">cloud</span>
                  </div>
                  <span class="material-symbols-outlined text-purple-400">arrow_forward</span>
                </div>
                <h3 class="text-xl font-bold mb-2">Cryo Platform</h3>
                <p class="text-sm text-slate-400 mb-4">Cloud-native game development platform</p>
                <div class="flex items-center gap-4 text-xs text-slate-500">
                  <span>8 Projects</span>
                  <span>•</span>
                  <span>Active</span>
                </div>
              </div>

              <!-- Demo Apps Org -->
              <div class="card glass rounded-xl p-6 border border-slate-700/50">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <span class="material-symbols-outlined text-white text-3xl">apps</span>
                  </div>
                  <span class="material-symbols-outlined text-green-400">arrow_forward</span>
                </div>
                <h3 class="text-xl font-bold mb-2">Demo Applications</h3>
                <p class="text-sm text-slate-400 mb-4">Example applications and showcases</p>
                <div class="flex items-center gap-4 text-xs text-slate-500">
                  <span>10 Projects</span>
                  <span>•</span>
                  <span>7 Available • 3 Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Status Bar -->
      <footer class="h-10 glass border-t border-slate-700/50 flex items-center justify-between px-6 text-xs diagonal-stripes">
        <div class="flex items-center gap-4">
          <span class="text-slate-500">Antarctica.io</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-slate-500">Server: <span class="text-green-400 font-medium">Healthy</span></span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
