import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import DocsPage from '../pages/DocsPage.vue'
import MarkdownEditorPage from '../pages/MarkdownEditorPage.vue'
import JobApplicationPage from '../pages/JobApplicationPage.vue'
import JobApplicationPageV2 from '../pages/JobApplicationPageV2.vue'

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
  },
  {
    path: '/editor',
    name: 'Editor',
    component: MarkdownEditorPage
  },
  {
    path: '/application',
    name: 'Application',
    component: JobApplicationPage
  },
  {
    path: '/application-v2',
    name: 'ApplicationV2',
    component: JobApplicationPageV2
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router