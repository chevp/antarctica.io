<template>
  <div class="max-w-4xl mx-auto">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm mb-6">
      <router-link to="/" class="text-blue-400 hover:text-blue-300 transition-colors">Groups</router-link>
      <span class="text-slate-600">/</span>
      <router-link to="/projects" class="text-blue-400 hover:text-blue-300 transition-colors">Projects</router-link>
      <span class="text-slate-600">/</span>
      <span class="text-slate-300">{{ project ? project.name : id }}</span>
    </div>

    <!-- Not found -->
    <div v-if="!project" class="glass rounded-xl p-8 border border-slate-700/50 text-center">
      <span class="material-symbols-outlined text-slate-600 text-6xl">search_off</span>
      <h2 class="text-xl font-bold mt-4 mb-2">Project not found</h2>
      <p class="text-slate-400 text-sm">No project with id <code class="text-blue-300">{{ id }}</code>.</p>
      <router-link to="/projects" class="inline-block mt-6 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-colors text-sm font-medium">
        Back to Projects
      </router-link>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="glass rounded-xl p-8 border mb-6" :class="style.border">
        <div class="flex items-start justify-between mb-4">
          <div
            class="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br"
            :class="style.gradient"
          >
            <span class="material-symbols-outlined text-white text-3xl">{{ icon }}</span>
          </div>
          <span
            class="text-xs uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full"
            :class="style.pill"
          >{{ style.label }}</span>
        </div>
        <h1 class="text-3xl font-bold mb-2 text-slate-100 break-all">{{ project.name }}</h1>
        <p class="text-slate-400 mb-4">{{ project.summary || 'Private project — details below.' }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="c in project.categories"
            :key="c"
            class="text-xs px-2.5 py-1 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50"
          >{{ c }}</span>
        </div>
      </div>

      <!-- Sections -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <section class="glass rounded-xl p-6 border border-slate-700/50">
          <h2 class="text-sm uppercase tracking-wider font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">info</span> Overview
          </h2>
          <p class="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{{ project.overview || 'Overview coming soon.' }}</p>
        </section>

        <section class="glass rounded-xl p-6 border border-slate-700/50">
          <h2 class="text-sm uppercase tracking-wider font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">flag</span> Goals
          </h2>
          <p class="text-slate-300 text-sm leading-relaxed">Goals and scope coming soon.</p>
        </section>

        <section class="glass rounded-xl p-6 border border-slate-700/50">
          <h2 class="text-sm uppercase tracking-wider font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">timeline</span> Status
          </h2>
          <dl class="text-sm space-y-2">
            <div class="flex justify-between"><dt class="text-slate-500">State</dt><dd :class="style.text">{{ style.label }}</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Visibility</dt><dd class="text-slate-300">Private</dd></div>
            <div class="flex justify-between"><dt class="text-slate-500">Org</dt><dd class="text-slate-300">{{ project.org }}</dd></div>
          </dl>
        </section>

        <section class="glass rounded-xl p-6 border border-slate-700/50">
          <h2 class="text-sm uppercase tracking-wider font-semibold text-blue-400 mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">category</span> Categories
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="c in project.categories"
              :key="c"
              class="text-xs px-2.5 py-1 rounded bg-slate-800/60 text-slate-300 border border-slate-700/50"
            >{{ c }}</span>
          </div>
        </section>
      </div>

      <router-link to="/projects" class="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
        <span class="material-symbols-outlined text-base">arrow_back</span>
        Back to all projects
      </router-link>
    </template>
  </div>
</template>

<script>
import { projects } from '../data/projects.js'

const STATE_STYLES = {
  active: {
    label: 'Active',
    gradient: 'from-green-500 to-green-600',
    border: 'border-green-500/30',
    pill: 'bg-green-500/15 text-green-300 border border-green-500/30',
    text: 'text-green-300'
  },
  'in-progress': {
    label: 'In Progress',
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-500/30',
    pill: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    text: 'text-blue-300'
  },
  archived: {
    label: 'Archived',
    gradient: 'from-red-500 to-red-600',
    border: 'border-red-500/30',
    pill: 'bg-red-500/15 text-red-300 border border-red-500/30',
    text: 'text-red-300'
  }
}

const CATEGORY_ICONS = {
  Assets: 'inventory_2',
  Data: 'database',
  Development: 'code',
  Engine: 'settings',
  Frameworks: 'view_in_ar',
  Gaming: 'sports_esports',
  Graphics: 'brush',
  Platform: 'cloud',
  Tools: 'build',
  Web: 'language'
}

export default {
  name: 'ProjectDetailPage',
  props: {
    id: { type: String, required: true }
  },
  computed: {
    project() { return projects.find(p => p.id === this.id) },
    style() { return STATE_STYLES[this.project?.state] || STATE_STYLES['in-progress'] },
    icon() { return CATEGORY_ICONS[this.project?.categories?.[0]] || 'folder' }
  }
}
</script>
