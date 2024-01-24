import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import PathNotFound from '../views/PathNotFound.vue';
import SingleTask from '../views/tasks/_slug/IndexView.vue';
import TasksView from '../views/tasks/IndexView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
        path: '/',
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
