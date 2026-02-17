import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RegistroCliente from '../views/RegistroCliente.vue'
import RegistroVehiculo from '../views/RegistroVehiculo.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/registro-cliente', name: 'RegistroCliente', component: RegistroCliente },
    { path: '/registro-vehiculo', name: 'RegistroVehiculo', component: RegistroVehiculo },
    { path: '/admin', name: 'AdminPanel', component: AdminPanel }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
