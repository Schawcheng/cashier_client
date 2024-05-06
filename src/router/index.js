import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/recharge.vue')
    },
    {
        path: '/recharge/',
        name: 'recharge',
        redirect: to => {
            return {
                path: '/',
            }
        }
    },
    {
        path: '/qrcode',
        name: 'qrcode',
        component: () => import('@/views/qrcode.vue')
    }
]

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
)

export default router