import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { 
        path: '/',
        name: 'Home',
        component: () => import('./views/BlogView.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('./views/LoginView.vue')
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('./views/AdminView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export { router }