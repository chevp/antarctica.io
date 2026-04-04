<template>
  <div class="max-w-7xl mx-auto">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm mb-6">
      <router-link to="/" class="text-blue-400 font-medium hover:text-blue-300 transition-colors">Groups</router-link>
      <span class="text-slate-600">/</span>
      <span class="text-slate-300 font-medium">Projects</span>
    </div>

    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold mb-2 gradient-text">Private Projects</h2>
      <p class="text-slate-400">Explanation pages for projects without a public site yet.</p>
    </div>

    <!-- State filters -->
    <div class="flex flex-wrap items-center gap-2 mb-8">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="activeFilter = f.value"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-colors"
        :class="activeFilter === f.value ? f.activeClass : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:border-slate-600'"
      >
        {{ f.label }} <span class="opacity-60 ml-1">{{ counts[f.value] }}</span>
      </button>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProjectStateCard
        v-for="p in filteredProjects"
        :key="p.id"
        :id="p.id"
        :name="p.name"
        :state="p.state"
        :categories="p.categories"
        :summary="p.summary"
      />
    </div>

    <div v-if="filteredProjects.length === 0" class="text-center py-12 text-slate-500">
      No projects match this filter.
    </div>
  </div>
</template>

<script>
import { projects } from '../data/projects.js'
import ProjectStateCard from '../components/ProjectStateCard.vue'

export default {
  name: 'ProjectsHubPage',
  components: { ProjectStateCard },
  data() {
    return {
      activeFilter: 'all',
      filters: [
        { value: 'all',         label: 'All',         activeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
        { value: 'active',      label: 'Active',      activeClass: 'bg-green-500/20 text-green-300 border-green-500/50' },
        { value: 'in-progress', label: 'In Progress', activeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
        { value: 'archived',    label: 'Archived',    activeClass: 'bg-red-500/20 text-red-300 border-red-500/50' }
      ]
    }
  },
  computed: {
    projects() { return projects },
    counts() {
      return {
        all: projects.length,
        active: projects.filter(p => p.state === 'active').length,
        'in-progress': projects.filter(p => p.state === 'in-progress').length,
        archived: projects.filter(p => p.state === 'archived').length
      }
    },
    filteredProjects() {
      if (this.activeFilter === 'all') return projects
      return projects.filter(p => p.state === this.activeFilter)
    }
  }
}
</script>
