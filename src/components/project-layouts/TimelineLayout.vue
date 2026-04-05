<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <!-- Hero -->
    <section class="text-center mb-16 relative">
      <div class="absolute inset-x-0 -top-4 h-64 overflow-hidden rounded-3xl -z-10 opacity-50">
        <ProjectHeroArt :seed="seed" :palette="palette" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 -z-10"></div>
      <span class="material-symbols-outlined text-6xl mb-4 block relative" :class="palette.accentText">{{ icon }}</span>
      <h1 class="text-4xl md:text-5xl font-bold mb-3 break-words">
        <span class="bg-clip-text text-transparent" :class="palette.gradHeroText">{{ project.name }}</span>
      </h1>
      <p class="text-slate-400 text-lg max-w-2xl mx-auto mb-4">{{ project.overview || project.summary || 'A private project inside the chevp ecosystem.' }}</p>
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs" :class="state.pill">
        <span class="w-1.5 h-1.5 rounded-full" :class="state.dot"></span>
        <span class="font-semibold uppercase tracking-wider">{{ state.label }}</span>
      </div>
    </section>

    <!-- Timeline -->
    <section>
      <h2 class="text-2xl font-bold text-center mb-10" :class="palette.accentText">Journey</h2>
      <div class="relative">
        <!-- vertical line -->
        <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
        <div class="space-y-8">
          <div v-for="(m,i) in milestones" :key="i" class="relative md:grid md:grid-cols-2 md:gap-8" :class="i%2===0 ? 'md:text-right' : 'md:text-left'">
            <!-- dot -->
            <div class="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-slate-950" :class="palette.gradBtn"></div>
            <div :class="i%2===0 ? 'md:col-start-1 pl-12 md:pl-0 md:pr-12' : 'md:col-start-2 pl-12 md:pl-12'">
              <div class="glass rounded-xl p-5 border border-slate-700/50 inline-block w-full">
                <div class="text-xs uppercase tracking-wider mb-2" :class="palette.accentDim">{{ m.phase }}</div>
                <h3 class="font-semibold text-slate-100 mb-1">{{ m.title }}</h3>
                <p class="text-slate-400 text-sm">{{ m.body }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories footer -->
    <section class="mt-12 text-center">
      <div class="inline-flex flex-wrap gap-2 justify-center">
        <span v-for="c in project.categories" :key="c" class="text-xs px-2.5 py-1 rounded" :class="palette.badge">{{ c }}</span>
      </div>
    </section>
  </div>
</template>

<script>
import { pick } from '../../data/projectTheme.js'
import ProjectHeroArt from './ProjectHeroArt.vue'
export default {
  name: 'TimelineLayout',
  components: { ProjectHeroArt },
  props: { project: Object, palette: Object, state: Object, icon: String, seed: Number },
  computed: {
    milestones() {
      const sections = this.project.sections || []
      if (sections.length >= 3) {
        return sections.slice(0, 5).map((s, i) => ({
          phase: 'Step ' + String(i + 1).padStart(2, '0'),
          title: s.h,
          body: s.b
        }))
      }
      const pool = [
        { phase: 'Phase 01', title: 'Problem framing', body: 'Identify who the user is and the job the project does for them.' },
        { phase: 'Phase 02', title: 'Prototype', body: 'Smallest possible thing that proves the core idea.' },
        { phase: 'Phase 03', title: 'Integration', body: 'Wire the prototype into the surrounding ecosystem.' },
        { phase: 'Phase 04', title: 'Hardening', body: 'Boundary checks, rate limits, observability added.' },
        { phase: 'Phase 05', title: 'Release', body: 'First users onboarded; feedback loops established.' },
        { phase: 'Phase 06', title: 'Iterate', body: 'Remove what nobody uses; double down on what works.' },
        { phase: 'Phase 07', title: 'Stabilize', body: 'Freeze surface, document, version.' }
      ]
      return [0,1,2,3,4].map(i => pick(pool, this.seed, i*17+3))
    }
  }
}
</script>
