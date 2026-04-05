<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <!-- Compact hero bar -->
    <section class="glass rounded-2xl p-8 mb-10 border relative overflow-hidden" :class="palette.borderAccent">
      <div class="absolute inset-0 opacity-50 -z-0">
        <ProjectHeroArt :seed="seed" :palette="palette" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent -z-0"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="flex items-center gap-5">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" :class="palette.gradBtn">
            <span class="material-symbols-outlined text-white text-3xl">{{ icon }}</span>
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-bold break-words">
              <span class="bg-clip-text text-transparent" :class="palette.gradHeroText">{{ project.name }}</span>
            </h1>
            <p class="text-slate-400 mt-1">{{ project.overview || project.summary || 'A private project inside the chevp ecosystem.' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider" :class="state.pill">{{ state.label }}</span>
        </div>
      </div>
    </section>

    <!-- Feature tiles 3-col -->
    <section>
      <h2 class="text-2xl font-bold mb-8 text-center" :class="palette.accentText">What's inside</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(t,i) in tiles" :key="i" class="card glass rounded-xl p-6 border border-slate-700/50">
          <div class="relative z-10">
            <span class="material-symbols-outlined text-3xl mb-4 block" :class="palette.accentText">{{ t.icon }}</span>
            <h3 class="font-semibold text-slate-100 mb-2">{{ t.h }}</h3>
            <p class="text-slate-400 text-sm">{{ t.b }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer strip -->
    <section class="mt-10 flex flex-wrap items-center gap-3 glass rounded-xl p-5 border border-slate-700/50">
      <span class="text-xs text-slate-500 uppercase tracking-wider">Domains</span>
      <span v-for="c in project.categories" :key="c" class="text-xs px-2.5 py-1 rounded" :class="palette.badge">{{ c }}</span>
    </section>
  </div>
</template>

<script>
import { pick, SECTION_ICONS } from '../../data/projectTheme.js'
import ProjectHeroArt from './ProjectHeroArt.vue'
export default {
  name: 'GridLayout',
  components: { ProjectHeroArt },
  props: { project: Object, palette: Object, state: Object, icon: String, seed: Number },
  computed: {
    tiles() {
      const sections = this.project.sections || []
      const bullets = this.project.bullets || []
      let chosen = null
      if (sections.length >= 3) {
        chosen = sections.slice(0, 6).map(s => ({ h: s.h, b: s.b }))
      } else if (bullets.length >= 3) {
        chosen = bullets.slice(0, 6).map(b => {
          const parts = b.split(/\s[:–—-]\s/)
          if (parts.length >= 2) return { h: parts[0].slice(0, 40), b: parts.slice(1).join(' - ') }
          return { h: b.slice(0, 40) + (b.length > 40 ? '…' : ''), b }
        })
      }
      if (chosen) return chosen.map((t, i) => ({ ...t, icon: pick(SECTION_ICONS, this.seed, i * 23 + 2) }))
      const pool = [
        { h: 'Core API', b: 'Typed interfaces with schema-first contracts.' },
        { h: 'Runtime', b: 'Resource-aware scheduler and lifecycle manager.' },
        { h: 'Storage', b: 'Pluggable adapters for local, blob, and remote stores.' },
        { h: 'Pipelines', b: 'Composable stages with backpressure and replay.' },
        { h: 'Inspector', b: 'Live state introspection and replay tooling.' },
        { h: 'CLI', b: 'Scriptable operations surface for automation.' },
        { h: 'Metrics', b: 'Structured telemetry out of the box.' },
        { h: 'Docs', b: 'Reference, cookbook, and architecture decisions.' },
        { h: 'SDK', b: 'Typed client for the most common integrations.' },
        { h: 'Templates', b: 'Scaffolds for the common starting points.' }
      ]
      const fallback = [0,1,2,3,4,5].map(i => pick(pool, this.seed, i*19+7))
      return fallback.map((t,i) => ({ ...t, icon: pick(SECTION_ICONS, this.seed, i*23+2) }))
    }
  }
}
</script>
