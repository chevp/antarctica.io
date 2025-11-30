<template>
  <div class="max-w-7xl mx-auto">
    <!-- Breadcrumb Navigation -->
    <div class="flex items-center gap-2 text-sm mb-8">
      <span class="text-blue-400 font-medium cursor-pointer hover:text-blue-300 transition-colors">Organizations</span>
    </div>

    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold mb-2">Select an Organization</h2>
      <p class="text-slate-400">Choose your organization to view projects</p>
    </div>

    <!-- Organizations Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <OrganizationCard
        v-for="org in organizations"
        :key="org.id"
        :title="org.title"
        :description="org.description"
        :icon="org.icon"
        :color="org.color"
        :project-count="org.projectCount"
        :status="org.status"
      />
    </div>
  </div>
</template>

<script>
import OrganizationCard from './OrganizationCard.vue'

export default {
  name: 'OrganizationsGrid',
  components: {
    OrganizationCard
  },
  data() {
    return {
      organizations: [
        {
          id: 'arctic-engine',
          title: 'Arctic Engine',
          description: 'Core rendering engine and tooling ecosystem',
          icon: 'api',
          color: 'blue',
          projectCount: 12,
          status: 'Active'
        },
        {
          id: 'cryo-platform',
          title: 'Cryo Platform',
          description: 'Cloud-native game development platform',
          icon: 'cloud',
          color: 'purple',
          projectCount: 8,
          status: 'Active'
        },
        {
          id: 'demo-apps',
          title: 'Demo Applications',
          description: 'Example applications and showcases',
          icon: 'apps',
          color: 'green',
          projectCount: 10,
          status: '7 Available • 3 Coming Soon'
        }
      ]
    }
  }
}
</script>