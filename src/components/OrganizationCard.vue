<template>
  <a
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    class="card glass rounded-xl p-6 border border-slate-700/50 block cursor-pointer hover:border-slate-600 transition-colors"
  >
    <div class="flex items-start justify-between mb-4">
      <div
        class="w-16 h-16 rounded-xl flex items-center justify-center"
        :class="gradientClass"
      >
        <span class="material-symbols-outlined text-white text-3xl">{{ icon }}</span>
      </div>
      <span class="material-symbols-outlined" :class="arrowColorClass">arrow_forward</span>
    </div>
    <h3 class="text-xl font-bold mb-2">{{ title }}</h3>
    <p class="text-sm text-slate-400 mb-4">{{ description }}</p>
    <div class="flex items-center gap-4 text-xs text-slate-500">
      <span>{{ projectCount }} Projects</span>
      <span>•</span>
      <span>{{ status }}</span>
    </div>
  </a>
</template>

<script>
export default {
  name: 'OrganizationCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'blue'
    },
    projectCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'Active'
    },
    link: {
      type: String,
      default: '#'
    }
  },
  computed: {
    gradientClass() {
      const gradients = {
        blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
        purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
        green: 'bg-gradient-to-br from-green-500 to-green-600'
      }
      return gradients[this.color] || gradients.blue
    },
    arrowColorClass() {
      const colors = {
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        green: 'text-green-400'
      }
      return colors[this.color] || colors.blue
    }
  }
}
</script>