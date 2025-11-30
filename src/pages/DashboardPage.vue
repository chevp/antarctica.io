<template>
  <div class="max-w-4xl mx-auto">
    <!-- Page Header -->
    <div class="mb-12 text-center">
      <h2 class="text-4xl font-bold mb-4">Welcome to Cryo Lab</h2>
      <p class="text-slate-400 text-lg">Your development environment for building modern applications</p>
    </div>

    <!-- Get Cryo Lab Button -->
    <div class="flex justify-center mb-12">
      <button class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25">
        Get Cryo Lab
      </button>
    </div>

    <!-- Preview Card -->
    <div class="glass rounded-2xl p-8 border border-slate-700/50 mb-6">
      <div class="aspect-video bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700/30">
        <div class="text-center">
          <span class="material-symbols-outlined text-6xl text-slate-600 mb-4">play_circle</span>
          <p class="text-slate-500">Preview Coming Soon</p>
        </div>
      </div>
    </div>

    <!-- Learn More Text -->
    <p class="text-center text-slate-400">
      Learn more what Cryo Lab is able to offer with our
      <router-link to="/learning" class="text-blue-400 hover:text-blue-300 underline transition-colors">
        Learning materials
      </router-link>.
    </p>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage'
}
</script>