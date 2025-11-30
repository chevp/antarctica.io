import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'

const routes = [
  {
    path: '/',
    name: 'Overview',
    component: OverviewPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router