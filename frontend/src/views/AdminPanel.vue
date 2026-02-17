<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import BaseInput from '../components/BaseInput.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'
import SelectField from '../components/SelectField.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ModalConfirm from '../components/ModalConfirm.vue'

const API = 'http://localhost:3000/api'

const loggedIn = ref(false)
const loginForm = reactive({ usuario: '', password: '' })
const loginError = ref('')

const clientes = ref([])
const vehiculosPorCliente = ref({})
const filtroEstado = ref('todos')
const busqueda = ref('')
const loading = ref(false)

const showDeleteModal = ref(false)
const clienteAEliminar = ref(null)

const estados = ['todos', 'pendiente', 'en trámite', 'resuelto', 'rechazado']

const clientesFiltrados = computed(() => {
    let lista = clientes.value
    if (filtroEstado.value !== 'todos') {
        lista = lista.filter(c => c.estado === filtroEstado.value)
    }
    if (busqueda.value.trim()) {
        const q = busqueda.value.toLowerCase()
        lista = lista.filter(c =>
            c.dni.toLowerCase().includes(q) ||
            c.nombre.toLowerCase().includes(q) ||
            c.apellidos.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        )
    }
    return lista
})

const estadisticas = computed(() => {
    const total = clientes.value.length
    const pendientes = clientes.value.filter(c => c.estado === 'pendiente').length
    const enTramite = clientes.value.filter(c => c.estado === 'en trámite').length
    const resueltos = clientes.value.filter(c => c.estado === 'resuelto').length
    const rechazados = clientes.value.filter(c => c.estado === 'rechazado').length
    return { total, pendientes, enTramite, resueltos, rechazados }
})

async function login() {
    loginError.value = ''
    try {
        const res = await fetch(`${API}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginForm)
        })
        const data = await res.json()
        if (data.ok) {
            loggedIn.value = true
            cargarDatos()
        } else {
            loginError.value = data.error || 'Credenciales incorrectas'
        }
    } catch {
        loginError.value = 'Error de conexión'
    }
}

async function cargarDatos() {
    loading.value = true
    try {
        const resC = await fetch(`${API}/clientes`)
        clientes.value = await resC.json()

        const resV = await fetch(`${API}/vehiculos`)
        const vehiculos = await resV.json()
        const agrupados = {}
        vehiculos.forEach(v => {
            if (!agrupados[v.clienteId]) agrupados[v.clienteId] = []
            agrupados[v.clienteId].push(v)
        })
        vehiculosPorCliente.value = agrupados
    } catch {
        console.error('Error al cargar datos')
    } finally {
        loading.value = false
    }
}

async function cambiarEstado(clienteId, nuevoEstado) {
    try {
        await fetch(`${API}/clientes/${clienteId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        cargarDatos()
    } catch {
        console.error('Error al cambiar estado')
    }
}

function confirmarEliminar(cliente) {
    clienteAEliminar.value = cliente
    showDeleteModal.value = true
}

async function eliminarCliente() {
    if (!clienteAEliminar.value) return
    try {
        await fetch(`${API}/clientes/${clienteAEliminar.value.id}`, { method: 'DELETE' })
        showDeleteModal.value = false
        clienteAEliminar.value = null
        cargarDatos()
    } catch {
        console.error('Error al eliminar')
    }
}

// Detalles expandibles
const expandedCliente = ref(null)
function toggleExpand(id) {
    expandedCliente.value = expandedCliente.value === id ? null : id
}
</script>

<template>
    <!-- Login -->
    <div v-if="!loggedIn" class="min-h-[80vh] flex items-center justify-center px-6">
        <div class="max-w-md w-full">
            <div class="text-center mb-8">
                <div class="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span class="material-icons text-primary text-4xl">admin_panel_settings</span>
                </div>
                <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Panel de Administración</h1>
                <p class="text-slate-600 dark:text-slate-400 mt-2">Introduce tus credenciales para acceder</p>
            </div>

            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <form @submit.prevent="login">
                    <BaseInput
                        v-model="loginForm.usuario"
                        label="Usuario"
                        placeholder="admin"
                        :required="true"
                    />
                    <BaseInput
                        v-model="loginForm.password"
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        :required="true"
                    />
                    <div class="mt-4">
                        <ButtonPrimary type="submit" text="Iniciar Sesión" icon="login" />
                    </div>
                </form>
                <div v-if="loginError" class="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                    <span class="material-icons text-sm">error</span>
                    {{ loginError }}
                </div>
            </div>
        </div>
    </div>

    <!-- Dashboard -->
    <div v-else class="max-w-6xl mx-auto px-6 py-12">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
                <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">Panel de Incidencias</h1>
                <p class="text-lg text-slate-600 dark:text-slate-400">Gestiona clientes, vehículos y estados de reclamación</p>
            </div>
            <button
                @click="loggedIn = false"
                class="self-start px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
                <span class="material-icons text-sm">logout</span>
                Cerrar Sesión
            </button>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                <div class="text-3xl font-bold text-slate-900 dark:text-white">{{ estadisticas.total }}</div>
                <div class="text-sm text-slate-500 mt-1">Total</div>
            </div>
            <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4 text-center cursor-pointer hover:scale-105 transition-transform" @click="filtroEstado = 'pendiente'">
                <div class="text-3xl font-bold text-amber-600">{{ estadisticas.pendientes }}</div>
                <div class="text-sm text-amber-600/70 mt-1">Pendientes</div>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4 text-center cursor-pointer hover:scale-105 transition-transform" @click="filtroEstado = 'en trámite'">
                <div class="text-3xl font-bold text-blue-600">{{ estadisticas.enTramite }}</div>
                <div class="text-sm text-blue-600/70 mt-1">En trámite</div>
            </div>
            <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4 text-center cursor-pointer hover:scale-105 transition-transform" @click="filtroEstado = 'resuelto'">
                <div class="text-3xl font-bold text-emerald-600">{{ estadisticas.resueltos }}</div>
                <div class="text-sm text-emerald-600/70 mt-1">Resueltos</div>
            </div>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4 text-center cursor-pointer hover:scale-105 transition-transform" @click="filtroEstado = 'rechazado'">
                <div class="text-3xl font-bold text-red-600">{{ estadisticas.rechazados }}</div>
                <div class="text-sm text-red-600/70 mt-1">Rechazados</div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div class="relative flex-grow">
                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                    v-model="busqueda"
                    type="text"
                    placeholder="Buscar por DNI, nombre o email..."
                    aria-label="Buscar clientes"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary text-sm"
                />
            </div>
            <div class="flex gap-2 flex-wrap">
                <button
                    v-for="e in estados"
                    :key="e"
                    @click="filtroEstado = e"
                    class="px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize"
                    :class="filtroEstado === e
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'"
                >
                    {{ e }}
                </button>
            </div>
        </div>

        <!-- Lista de clientes -->
        <div v-if="loading" class="text-center py-12">
            <span class="material-icons text-4xl text-primary animate-spin">autorenew</span>
        </div>

        <div v-else-if="clientesFiltrados.length === 0" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span class="material-icons text-5xl text-slate-300 dark:text-slate-600 mb-4 block">search_off</span>
            <p class="text-slate-500 dark:text-slate-400">No se encontraron clientes con los filtros actuales</p>
            <button @click="filtroEstado = 'todos'; busqueda = ''" class="mt-4 text-primary text-sm hover:underline">Limpiar filtros</button>
        </div>

        <div v-else class="space-y-4">
            <div
                v-for="cliente in clientesFiltrados"
                :key="cliente.id"
                class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
                <!-- Cliente header -->
                <div class="p-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer" @click="toggleExpand(cliente.id)">
                    <div class="flex items-center gap-4 flex-grow min-w-0">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span class="material-icons text-primary">person</span>
                        </div>
                        <div class="min-w-0">
                            <p class="font-semibold text-slate-900 dark:text-white truncate">{{ cliente.nombre }} {{ cliente.apellidos }}</p>
                            <p class="text-sm text-slate-500 flex items-center gap-3">
                                <span class="font-mono">{{ cliente.dni }}</span>
                                <span>{{ cliente.email }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <StatusBadge :estado="cliente.estado" />
                        <span class="material-icons text-slate-400 transition-transform" :class="{ 'rotate-180': expandedCliente === cliente.id }">expand_more</span>
                    </div>
                </div>

                <!-- Expandido: detalles -->
                <Transition name="expand">
                    <div v-if="expandedCliente === cliente.id" class="border-t border-slate-200 dark:border-slate-700 px-5 py-5 bg-slate-50 dark:bg-slate-800/50">
                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- Info -->
                            <div>
                                <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1">
                                    <span class="material-icons text-sm text-primary">info</span> Información
                                </h4>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-slate-500">Teléfono:</span>
                                        <span class="text-slate-900 dark:text-white">{{ cliente.telefono }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-500">Email:</span>
                                        <span class="text-slate-900 dark:text-white">{{ cliente.email }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-500">Fecha registro:</span>
                                        <span class="text-slate-900 dark:text-white">{{ cliente.fechaRegistro }}</span>
                                    </div>
                                </div>

                                <h4 class="text-sm font-bold text-slate-900 dark:text-white mt-5 mb-3 flex items-center gap-1">
                                    <span class="material-icons text-sm text-primary">edit</span> Cambiar Estado
                                </h4>
                                <div class="flex gap-2 flex-wrap">
                                    <button
                                        v-for="e in ['pendiente', 'en trámite', 'resuelto', 'rechazado']"
                                        :key="e"
                                        @click.stop="cambiarEstado(cliente.id, e)"
                                        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                                        :class="cliente.estado === e
                                            ? 'bg-primary text-white'
                                            : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'"
                                    >
                                        {{ e }}
                                    </button>
                                </div>
                            </div>

                            <!-- Vehiculos -->
                            <div>
                                <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1">
                                    <span class="material-icons text-sm text-primary">directions_car</span>
                                    Vehículos ({{ (vehiculosPorCliente[cliente.id] || []).length }})
                                </h4>
                                <div v-if="!vehiculosPorCliente[cliente.id] || vehiculosPorCliente[cliente.id].length === 0" class="text-sm text-slate-500 italic">
                                    Sin vehículos registrados
                                </div>
                                <div v-else class="space-y-2">
                                    <div
                                        v-for="v in vehiculosPorCliente[cliente.id]"
                                        :key="v.id"
                                        class="bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-3 text-sm"
                                    >
                                        <div class="flex justify-between items-center">
                                            <span class="font-mono font-bold text-primary">{{ v.matricula }}</span>
                                            <span class="text-slate-500 text-xs">{{ v.anio }}</span>
                                        </div>
                                        <p class="text-slate-700 dark:text-slate-300">{{ v.marca }} {{ v.modelo }}</p>
                                        <p v-if="v.color" class="text-xs text-slate-500">{{ v.color }} · {{ v.puertas || '?' }} puertas</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Acciones -->
                        <div class="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                            <button
                                @click.stop="confirmarEliminar(cliente)"
                                class="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
                            >
                                <span class="material-icons text-sm">delete</span>
                                Eliminar cliente
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <ModalConfirm
            :show="showDeleteModal"
            title="Eliminar Cliente"
            :message="clienteAEliminar ? `¿Estás seguro de que quieres eliminar a ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}? Se eliminarán también todos sus vehículos.` : ''"
            @confirm="eliminarCliente"
            @cancel="showDeleteModal = false"
        />
    </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
    max-height: 500px;
}
</style>
