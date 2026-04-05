<template>
  <div class="max-w-6xl mx-auto px-6 py-10 relative">
    <!-- Ambient backdrop -->
    <div class="absolute inset-x-0 -top-10 h-96 overflow-hidden rounded-3xl -z-10 opacity-30">
      <ProjectHeroArt :seed="seed" :palette="palette" />
    </div>
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950 to-slate-950 -z-10"></div>

    <!-- Top bar -->
    <section class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl flex items-center justify-center" :class="palette.gradBtn">
          <span class="material-symbols-outlined text-white text-2xl">{{ icon }}</span>
        </div>
        <div>
          <div class="text-xs uppercase tracking-wider" :class="palette.accentDim">Project</div>
          <h1 class="text-2xl md:text-3xl font-bold break-words">
            <span class="bg-clip-text text-transparent" :class="palette.gradHeroText">{{ project.name }}</span>
          </h1>
        </div>
      </div>
      <span class="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider self-start" :class="state.pill">{{ state.label }}</span>
    </section>

    <!-- Stat tiles -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="(s,i) in stats" :key="i" class="glass rounded-xl p-5 border border-slate-700/50">
        <div class="text-xs uppercase tracking-wider mb-2 text-slate-500">{{ s.label }}</div>
        <div class="text-2xl font-bold" :class="palette.accentText">{{ s.value }}</div>
        <div class="text-xs text-slate-500 mt-1">{{ s.sub }}</div>
      </div>
    </section>

    <!-- Two-column: summary + streams -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
      <div class="lg:col-span-2 glass rounded-xl p-6 border border-slate-700/50">
        <h2 class="text-sm uppercase tracking-wider font-semibold mb-3" :class="palette.accentText">Summary</h2>
        <p class="text-slate-300 leading-relaxed">{{ project.overview || project.summary || 'A private project inside the chevp ecosystem.' }}</p>
        <div class="mt-5 flex flex-wrap gap-2">
          <span v-for="c in project.categories" :key="c" class="text-xs px-2.5 py-1 rounded" :class="palette.badge">{{ c }}</span>
          <span v-for="t in (project.techStack || [])" :key="'t-'+t" class="text-xs px-2.5 py-1 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50">{{ t }}</span>
        </div>
      </div>
      <div class="glass rounded-xl p-6 border border-slate-700/50">
        <h2 class="text-sm uppercase tracking-wider font-semibold mb-4" :class="palette.accentText">Streams</h2>
        <ul class="space-y-3">
          <li v-for="(st,i) in streams" :key="i" class="flex items-start gap-3">
            <span class="w-2 h-2 rounded-full mt-2 flex-shrink-0" :class="palette.gradBtn"></span>
            <div>
              <div class="text-sm font-semibold text-slate-100">{{ st.h }}</div>
              <div class="text-xs text-slate-500">{{ st.b }}</div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Progress bars -->
    <section class="glass rounded-xl p-6 border border-slate-700/50">
      <h2 class="text-sm uppercase tracking-wider font-semibold mb-4" :class="palette.accentText">Areas</h2>
      <div class="space-y-4">
        <div v-for="(p,i) in progress" :key="i">
          <div class="flex justify-between text-sm mb-1.5">
            <span class="text-slate-300 font-medium">{{ p.h }}</span>
            <span class="text-slate-500 text-xs">{{ p.pct }}%</span>
          </div>
          <div class="h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div class="h-full rounded-full" :class="palette.gradBtn" :style="{ width: p.pct + '%' }"></div>
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
  name: 'DashboardLayout',
  components: { ProjectHeroArt },
  props: { project: Object, palette: Object, state: Object, icon: String, seed: Number },
  computed: {
    stats() {
      const bullets = (this.project.bullets || []).length
      const stack = (this.project.techStack || []).length
      const sections = (this.project.sections || []).length
      return [
        { label: 'Categories', value: this.project.categories.length, sub: 'domain tags' },
        { label: 'Tech',       value: stack || '—',                  sub: 'detected' },
        { label: 'Features',   value: bullets || '—',                sub: 'README bullets' },
        { label: 'Sections',   value: sections || '—',               sub: 'README chapters' }
      ]
    },
    streams() {
      const sections = this.project.sections || []
      if (sections.length >= 2) return sections.slice(0, 4).map(s => ({ h: s.h, b: s.b }))
      const bullets = this.project.bullets || []
      if (bullets.length >= 2) {
        return bullets.slice(0, 4).map(b => {
          const parts = b.split(/\s[:–—-]\s/)
          if (parts.length >= 2) return { h: parts[0].slice(0, 32), b: parts.slice(1).join(' - ') }
          return { h: b.slice(0, 32) + (b.length > 32 ? '…' : ''), b: '' }
        })
      }
      const pool = [
        { h: 'Core',        b: 'Domain logic and invariants' },
        { h: 'Runtime',     b: 'Scheduling and lifecycle' },
        { h: 'Integrations',b: 'External system adapters' },
        { h: 'Tooling',     b: 'CLI, inspectors, scaffolds' },
        { h: 'Docs',        b: 'Reference and cookbook' },
        { h: 'Examples',    b: 'End-to-end usage samples' }
      ]
      return [0,1,2,3].map(i => pick(pool, this.seed, i*37+11))
    },
    progress() {
      const stack = this.project.techStack || []
      if (stack.length >= 2) {
        // one bar per tech, fill proportional to order (first = most prominent)
        return stack.slice(0, 4).map((t, i) => ({
          h: t,
          pct: Math.max(25, 100 - i * 18)
        }))
      }
      const pool = [
        { h: 'Specification' }, { h: 'Core engine' }, { h: 'Adapters' },
        { h: 'Documentation' }, { h: 'Tests' }, { h: 'Examples' },
        { h: 'Tooling' }, { h: 'Packaging' }
      ]
      const chosen = [0,1,2,3].map(i => pick(pool, this.seed, i*41+13))
      return chosen.map((p,i) => ({ ...p, pct: 15 + ((this.seed + i*47) % 80) }))
    }
  }
}
</script>
