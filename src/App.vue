<template>
  <div class="bg-slate-950 text-slate-100 overflow-hidden h-screen">
    <div class="h-screen flex flex-col">
      <AppHeader />

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden flex">
        <main class="flex-1 overflow-y-auto p-8 grid-bg">
          <router-view />
        </main>
      </div>

      <AppFooter />
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>