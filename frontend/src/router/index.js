import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import VerificarVehiculo from '../views/VerificarVehiculo.vue'
import RegistroReclamacion from '../views/RegistroReclamacion.vue'
import ConsultarEstado from '../views/ConsultarEstado.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/verificar', name: 'VerificarVehiculo', component: VerificarVehiculo },
    { path: '/reclamar', name: 'RegistroReclamacion', component: RegistroReclamacion },
    { path: '/consultar', name: 'ConsultarEstado', component: ConsultarEstado },
    { path: '/admin', name: 'AdminPanel', component: AdminPanel }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
