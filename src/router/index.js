import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import DocsPage from '../pages/DocsPage.vue'

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
  },
  {
    path: '/docs',
    name: 'Docs',
    component: DocsPage
  },
  {
    path: '/docs/:docId',
    name: 'DocDetail',
    component: DocsPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router