<template>
  <div class="max-w-5xl mx-auto px-6 py-12">
    <!-- Hero -->
    <section class="text-center mb-12 relative">
      <div class="absolute inset-x-0 -top-6 h-72 overflow-hidden rounded-3xl -z-10 opacity-55">
        <ProjectHeroArt :seed="seed" :palette="palette" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/70 to-slate-950 -z-10"></div>
      <div class="inline-block p-[1px] rounded-full mb-6 bg-gradient-to-r" :class="palette.gradBtn">
        <div class="px-4 py-1.5 bg-slate-950 rounded-full text-xs uppercase tracking-[0.2em]" :class="palette.accentText">
          Architecture · {{ project.categories[0] || 'System' }}
        </div>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4 break-words">
        <span class="bg-clip-text text-transparent" :class="palette.gradHeroText">{{ project.name }}</span>
      </h1>
      <p class="text-slate-400 text-lg max-w-2xl mx-auto">{{ project.summary || 'A private project inside the chevp ecosystem.' }}</p>
    </section>

    <!-- Architecture diagram (ASCII-style layered stack) -->
    <section class="mb-12">
      <div class="glass rounded-2xl p-8 border border-slate-700/50">
        <div class="space-y-3">
          <div v-for="(layer,i) in layers" :key="i"
               class="relative rounded-xl p-5 border flex items-center justify-between transition-all hover:translate-x-1"
               :class="[
                 i === 0 ? palette.borderAccent + ' ' + palette.glow : 'border-slate-700/50',
                 i === 0 ? 'bg-gradient-to-r ' + palette.gradPanel : 'bg-slate-900/40'
               ]">
            <div class="flex items-center gap-4">
              <span class="material-symbols-outlined text-2xl" :class="palette.accentText">{{ layer.icon }}</span>
              <div>
                <div class="font-semibold text-slate-100">{{ layer.h }}</div>
                <div class="text-xs text-slate-500">{{ layer.b }}</div>
              </div>
            </div>
            <span class="text-[10px] uppercase tracking-wider text-slate-500 font-mono">L{{ layers.length - i }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Decisions -->
    <section>
      <h2 class="text-2xl font-bold mb-6" :class="palette.accentText">Key Decisions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(d,i) in decisions" :key="i" class="glass rounded-xl p-5 border-l-4" :class="palette.borderAccent">
          <div class="text-xs uppercase tracking-wider mb-2" :class="palette.accentDim">ADR-{{ String(i+1).padStart(3,'0') }}</div>
          <h3 class="font-semibold text-slate-100 mb-1">{{ d.h }}</h3>
          <p class="text-slate-400 text-sm">{{ d.b }}</p>
        </div>
      </div>
    </section>

    <!-- State footer -->
    <section class="mt-10 glass rounded-xl p-5 border border-slate-700/50 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" :class="state.dot"></span>
        <span class="text-sm text-slate-300 font-semibold">{{ state.label }}</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <span v-for="c in project.categories" :key="c" class="text-xs px-2.5 py-1 rounded" :class="palette.badge">{{ c }}</span>
      </div>
    </section>
  </div>
</template>

<script>
import { pick, SECTION_ICONS } from '../../data/projectTheme.js'
import ProjectHeroArt from './ProjectHeroArt.vue'
export default {
  name: 'ArchitectureLayout',
  components: { ProjectHeroArt },
  props: { project: Object, palette: Object, state: Object, icon: String, seed: Number },
  computed: {
    layers() {
      const pool = [
        { h: 'Presentation', b: 'UI and user-facing surfaces.' },
        { h: 'Application', b: 'Use-cases, workflows, orchestration.' },
        { h: 'Domain', b: 'Pure business rules and invariants.' },
        { h: 'Adapters', b: 'Translations to external systems.' },
        { h: 'Infrastructure', b: 'Storage, queues, external services.' },
        { h: 'Runtime', b: 'Process, scheduling, resource management.' },
        { h: 'Transport', b: 'Networking, RPC, event bus.' },
        { h: 'Persistence', b: 'Durable state and replay.' }
      ]
      const icons = [0,1,2,3].map(i => pick(SECTION_ICONS, this.seed, i*29+5))
      return [0,1,2,3].map((i,idx) => ({ ...pick(pool, this.seed, i*11+2), icon: icons[idx] }))
    },
    decisions() {
      const pool = [
        { h: 'Event-sourced core', b: 'State is derived from an immutable event log.' },
        { h: 'Schema-first contracts', b: 'Interfaces are defined before implementation.' },
        { h: 'Single-writer model', b: 'Each aggregate has one owner; no shared mutable state.' },
        { h: 'Typed adapters', b: 'All external I/O flows through typed, replaceable adapters.' },
        { h: 'No implicit I/O', b: 'Side effects are parameterized and injectable.' },
        { h: 'Deterministic time', b: 'Clocks are injected; tests control time.' }
      ]
      return [0,1,2,3].map(i => pick(pool, this.seed, i*31+9))
    }
  }
}
</script>
