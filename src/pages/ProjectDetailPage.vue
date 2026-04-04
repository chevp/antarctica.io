<template>
  <div>
    <!-- Breadcrumb -->
    <div class="max-w-6xl mx-auto px-6 pt-4">
      <div class="flex items-center gap-2 text-sm">
        <router-link to="/" class="text-blue-400 hover:text-blue-300 transition-colors">Groups</router-link>
        <span class="text-slate-600">/</span>
        <router-link to="/projects" class="text-blue-400 hover:text-blue-300 transition-colors">Projects</router-link>
        <span class="text-slate-600">/</span>
        <span class="text-slate-300 break-all">{{ project ? project.name : id }}</span>
      </div>
    </div>

    <!-- Not found -->
    <div v-if="!project" class="max-w-2xl mx-auto px-6 py-20">
      <div class="glass rounded-xl p-8 border border-slate-700/50 text-center">
        <span class="material-symbols-outlined text-slate-600 text-6xl">search_off</span>
        <h2 class="text-xl font-bold mt-4 mb-2">Project not found</h2>
        <p class="text-slate-400 text-sm">No project with id <code class="text-blue-300">{{ id }}</code>.</p>
        <router-link to="/projects" class="inline-block mt-6 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition-colors text-sm font-medium">
          Back to Projects
        </router-link>
      </div>
    </div>

    <!-- Dynamic layout -->
    <component
      v-else
      :is="layoutComponent"
      :project="project"
      :palette="theme.palette"
      :state="theme.state"
      :icon="theme.icon"
      :seed="theme.seed"
    />

    <!-- Back link -->
    <div v-if="project" class="max-w-6xl mx-auto px-6 pb-12">
      <router-link to="/projects" class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
        <span class="material-symbols-outlined text-base">arrow_back</span>
        Back to all projects
      </router-link>
    </div>
  </div>
</template>

<script>
import { projects } from '../data/projects.js'
import { themeFor } from '../data/projectTheme.js'
import FrameworkLayout from '../components/project-layouts/FrameworkLayout.vue'
import SplitLayout from '../components/project-layouts/SplitLayout.vue'
import TimelineLayout from '../components/project-layouts/TimelineLayout.vue'
import GridLayout from '../components/project-layouts/GridLayout.vue'
import ArchitectureLayout from '../components/project-layouts/ArchitectureLayout.vue'
import DashboardLayout from '../components/project-layouts/DashboardLayout.vue'

const LAYOUTS = {
  framework: FrameworkLayout,
  split: SplitLayout,
  timeline: TimelineLayout,
  grid: GridLayout,
  architecture: ArchitectureLayout,
  dashboard: DashboardLayout
}

export default {
  name: 'ProjectDetailPage',
  props: { id: { type: String, required: true } },
  computed: {
    project() { return projects.find(p => p.id === this.id) },
    theme() { return this.project ? themeFor(this.project) : null },
    layoutComponent() { return this.theme ? LAYOUTS[this.theme.layout] : null }
  }
}
</script>
