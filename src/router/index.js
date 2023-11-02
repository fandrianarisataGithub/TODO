import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SingleTask from './../views/tasks/_slug/IndexView.vue'
import TasksView from './../views/tasks/IndexView.vue'
import PathNotFound from '../views/PathNotFound.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: TasksView
    },
    {
        path: '/tasks/:id',
        name: 'single_task',
        component: SingleTask
    },
    { path: '/:pathMatch(.*)*', component: PathNotFound, name : 'error404' },
  ]
})

export default router
