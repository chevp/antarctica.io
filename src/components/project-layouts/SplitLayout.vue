<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <!-- Split hero -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4" :class="state.pill">
          <span class="w-1.5 h-1.5 rounded-full" :class="state.dot"></span>
          <span class="font-semibold uppercase tracking-wider">{{ state.label }}</span>
        </div>
        <h1 class="text-5xl font-bold mb-6 leading-tight break-words">
          <span class="bg-clip-text text-transparent" :class="palette.gradHeroText">{{ project.name }}</span>
        </h1>
        <p class="text-slate-400 text-lg mb-6">{{ project.summary || 'A private project inside the chevp ecosystem.' }}</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="c in project.categories" :key="c" class="text-xs px-2.5 py-1 rounded" :class="palette.badge">{{ c }}</span>
        </div>
      </div>
      <div class="relative aspect-square max-w-md mx-auto w-full">
        <div class="absolute inset-0 rounded-3xl overflow-hidden" :class="palette.ringCls + ' ' + palette.glow">
          <ProjectHeroArt :seed="seed" :palette="palette" />
        </div>
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="material-symbols-outlined text-[140px] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" :class="palette.accentText" style="font-variation-settings: 'FILL' 0, 'wght' 200;">{{ icon }}</span>
        </div>
      </div>
    </section>

    <!-- Numbered feature list -->
    <section>
      <h2 class="text-2xl font-bold mb-8" :class="palette.accentText">Capabilities</h2>
      <div class="space-y-4">
        <div v-for="(f,i) in features" :key="i" class="flex gap-5 p-5 glass rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
          <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white" :class="palette.gradBtn">
            {{ String(i+1).padStart(2,'0') }}
          </div>
          <div>
            <h3 class="font-semibold text-slate-100 mb-1">{{ f.h }}</h3>
            <p class="text-slate-400 text-sm">{{ f.b }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { pick } from '../../data/projectTheme.js'
import ProjectHeroArt from './ProjectHeroArt.vue'
export default {
  name: 'SplitLayout',
  components: { ProjectHeroArt },
  props: { project: Object, palette: Object, state: Object, icon: String, seed: Number },
  computed: {
    features() {
      const pool = [
        { h: 'Headless core', b: 'Business logic independent of any UI or transport.' },
        { h: 'Pluggable adapters', b: 'Swap storage, queues, or renderers without touching the core.' },
        { h: 'Typed boundaries', b: 'Every public edge has a schema; runtime and compile-time agree.' },
        { h: 'Deterministic replays', b: 'Reproduce any state from an event log.' },
        { h: 'Progressive enhancement', b: 'Works without JS, gets better with it.' },
        { h: 'Streaming first', b: 'Long operations report progress incrementally.' },
        { h: 'Resource-bound', b: 'Memory and CPU budgets enforced, not just hoped for.' },
        { h: 'Human-in-the-loop', b: 'Manual approval at every destructive step.' },
        { h: 'Hot-swappable config', b: 'Runtime behaviour changes without a restart.' },
        { h: 'Offline-capable', b: 'Works with intermittent network, syncs when online.' }
      ]
      return [0,1,2,3].map(i => pick(pool, this.seed, i*13+1))
    }
  }
}
</script>
