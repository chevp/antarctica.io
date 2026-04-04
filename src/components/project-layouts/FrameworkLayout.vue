<template>
  <div>
    <!-- Hero -->
    <section class="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center relative">
      <div class="absolute inset-x-0 top-0 h-[380px] overflow-hidden rounded-3xl -z-10 opacity-60">
        <ProjectHeroArt :seed="seed" :palette="palette" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950 rounded-3xl -z-10"></div>
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mb-6" :class="palette.badge">
        <span class="w-2 h-2 rounded-full" :class="state.dot"></span>
        <span class="font-semibold uppercase tracking-wider">{{ state.label }}</span>
        <span class="opacity-50">·</span>
        <span>{{ project.categories[0] || 'Project' }}</span>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4 break-words">
        <span class="bg-clip-text text-transparent" :class="palette.gradHeroText">{{ project.name }}</span>
      </h1>
      <p class="text-slate-400 text-lg max-w-2xl mx-auto">
        {{ project.summary || 'A private project inside the chevp ecosystem.' }}
      </p>
    </section>

    <!-- 3-step cards -->
    <section class="max-w-4xl mx-auto px-6 py-8">
      <h2 class="text-2xl font-bold text-center mb-2" :class="palette.accentText">Scope</h2>
      <p class="text-slate-500 text-center text-sm mb-8">Three concerns the project balances</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div v-for="(s,i) in scopes" :key="i" class="card glass rounded-xl p-5 border border-slate-700/50">
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-3">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-white" :class="palette.gradBtn">{{ i+1 }}</span>
              <h3 class="font-semibold text-slate-100">{{ s.title }}</h3>
            </div>
            <p class="text-slate-400 text-sm">{{ s.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Principles -->
    <section class="max-w-4xl mx-auto px-6 py-8">
      <h2 class="text-2xl font-bold text-center mb-2" :class="palette.accentText">Principles</h2>
      <p class="text-slate-500 text-center text-sm mb-8">The rules that guide this project</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <div v-for="(p,i) in principles" :key="i" class="glass rounded-xl p-5 hover-glow">
          <h3 class="font-semibold text-slate-100 text-sm mb-2">{{ p.h }}</h3>
          <p class="text-slate-500 text-xs">{{ p.b }}</p>
        </div>
      </div>
    </section>

    <!-- Categories strip -->
    <section class="max-w-4xl mx-auto px-6 py-8">
      <div class="glass rounded-xl p-5 flex flex-wrap items-center gap-3" :class="palette.borderAccent + ' border'">
        <span class="material-symbols-outlined" :class="palette.accentText">category</span>
        <span class="text-sm text-slate-400">Categories:</span>
        <span v-for="c in project.categories" :key="c" class="text-xs px-2.5 py-1 rounded" :class="palette.badge">{{ c }}</span>
      </div>
    </section>
  </div>
</template>

<script>
import { pick } from '../../data/projectTheme.js'
import ProjectHeroArt from './ProjectHeroArt.vue'
export default {
  name: 'FrameworkLayout',
  components: { ProjectHeroArt },
  props: { project: Object, palette: Object, state: Object, icon: String, seed: Number },
  computed: {
    scopes() {
      const pool = [
        { title: 'Boundaries', body: 'Clear surface area, well-defined inputs and outputs, no hidden coupling.' },
        { title: 'Composability', body: 'Small pieces that combine into larger workflows without rewrite.' },
        { title: 'Observability', body: 'State is inspectable end-to-end; nothing hides behind magic.' },
        { title: 'Performance', body: 'Predictable resource use; latency budgets are explicit.' },
        { title: 'Domain fit', body: 'Shaped by the real domain, not the framework we happen to use.' },
        { title: 'Reliability', body: 'Failures are modelled, not ignored; recovery is a first-class concern.' }
      ]
      return [pick(pool, this.seed, 0), pick(pool, this.seed, 1), pick(pool, this.seed, 2)]
    },
    principles() {
      const pool = [
        { h: 'Small, verifiable steps', b: 'Every change is reviewable in isolation.' },
        { h: 'Data is a contract', b: 'Schemas are versioned; breaking change is explicit.' },
        { h: 'Local reasoning wins', b: 'Understanding a file should not require reading ten others.' },
        { h: 'Tools over frameworks', b: 'Composable tools beat opinionated frameworks.' },
        { h: 'Fail loudly', b: 'Silent fallbacks breed silent bugs.' },
        { h: 'No speculative abstraction', b: 'Wait for the third use before abstracting.' },
        { h: 'Human decides', b: 'AI suggests, the developer carries responsibility.' },
        { h: 'Incremental truth', b: 'Ship the smallest correct thing, then grow.' }
      ]
      return [pick(pool, this.seed, 3), pick(pool, this.seed, 5), pick(pool, this.seed, 7), pick(pool, this.seed, 11)]
    }
  }
}
</script>
