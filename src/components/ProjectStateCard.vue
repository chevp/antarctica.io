<template>
  <router-link
    :to="`/projects/${id}`"
    class="card glass rounded-xl p-5 border block cursor-pointer transition-colors"
    :class="borderClass"
  >
    <div class="flex items-start justify-between mb-3">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br"
        :class="gradientClass"
      >
        <span class="material-symbols-outlined text-white text-2xl">{{ icon }}</span>
      </div>
      <span
        class="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full"
        :class="pillClass"
      >{{ stateLabel }}</span>
    </div>
    <h3 class="text-base font-bold mb-1 text-slate-100 break-all">{{ name }}</h3>
    <p class="text-xs text-slate-400 mb-3 line-clamp-2">{{ summary || 'Explanation page.' }}</p>
    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="c in categories"
        :key="c"
        class="text-[10px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/50"
      >{{ c }}</span>
    </div>
  </router-link>
</template>

<script>
const STATE_STYLES = {
  active: {
    label: 'Active',
    gradient: 'from-green-500 to-green-600',
    border: 'border-green-500/30 hover:border-green-400/60',
    pill: 'bg-green-500/15 text-green-300 border border-green-500/30'
  },
  'in-progress': {
    label: 'In Progress',
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-500/30 hover:border-blue-400/60',
    pill: 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
  },
  archived: {
    label: 'Archived',
    gradient: 'from-red-500 to-red-600',
    border: 'border-red-500/30 hover:border-red-400/60',
    pill: 'bg-red-500/15 text-red-300 border border-red-500/30'
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
  name: 'ProjectStateCard',
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    state: { type: String, default: 'in-progress' },
    categories: { type: Array, default: () => [] },
    summary: { type: String, default: '' }
  },
  computed: {
    style() { return STATE_STYLES[this.state] || STATE_STYLES['in-progress'] },
    stateLabel() { return this.style.label },
    gradientClass() { return this.style.gradient },
    borderClass() { return this.style.border },
    pillClass() { return this.style.pill },
    icon() { return CATEGORY_ICONS[this.categories[0]] || 'folder' }
  }
}
</script>
