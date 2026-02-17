<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'
import StatusBadge from '../components/StatusBadge.vue'

const API = 'http://localhost:3000/api'
const router = useRouter()

const form = reactive({
    dni: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    email: ''
})

const errors = reactive({
    dni: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    email: ''
})

const clientes = ref([])
const mensaje = ref('')
const mensajeError = ref('')
const loading = ref(false)

const dniRegex = /^\d{8}[A-Za-z]$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const telefonoRegex = /^\d{9}$/

function validar() {
    let ok = true
    errors.dni = ''
    errors.nombre = ''
    errors.apellidos = ''
    errors.telefono = ''
    errors.email = ''

    if (!form.dni) {
        errors.dni = 'El DNI es obligatorio'
        ok = false
    } else if (!dniRegex.test(form.dni)) {
        errors.dni = 'Formato: 8 dígitos + 1 letra (ej: 12345678A)'
        ok = false
    }

    if (!form.nombre.trim()) {
        errors.nombre = 'El nombre es obligatorio'
        ok = false
    }

    if (!form.apellidos.trim()) {
        errors.apellidos = 'Los apellidos son obligatorios'
        ok = false
    }

    if (!form.telefono) {
        errors.telefono = 'El teléfono es obligatorio'
        ok = false
    } else if (!telefonoRegex.test(form.telefono)) {
        errors.telefono = 'Formato: 9 dígitos'
        ok = false
    }

    if (!form.email) {
        errors.email = 'El email es obligatorio'
        ok = false
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Email no válido'
        ok = false
    }

    return ok
}

async function cargarClientes() {
    try {
        const res = await fetch(`${API}/clientes`)
        clientes.value = await res.json()
    } catch {
        console.error('Error al cargar clientes')
    }
}

async function guardar() {
    if (!validar()) return

    loading.value = true
    mensaje.value = ''
    mensajeError.value = ''

    try {
        const res = await fetch(`${API}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })

        const data = await res.json()

        if (!res.ok) {
            mensajeError.value = data.error || 'Error al guardar'
            return
        }

        mensaje.value = 'Cliente registrado correctamente'
        form.dni = ''
        form.nombre = ''
        form.apellidos = ''
        form.telefono = ''
        form.email = ''
        cargarClientes()

        setTimeout(() => {
            if (confirm('¿Quieres añadir un vehículo para este cliente?')) {
                router.push(`/registro-vehiculo?clienteId=${data.id}`)
            }
        }, 500)
    } catch {
        mensajeError.value = 'Error de conexión con el servidor'
    } finally {
        loading.value = false
    }
}

onMounted(cargarClientes)
</script>

<template>
    <div class="max-w-6xl mx-auto px-6 py-12">
        <!-- Header -->
        <div class="mb-10">
            <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">Registro de Cliente</h1>
            <p class="text-lg text-slate-600 dark:text-slate-400">Introduce los datos del afectado por el cártel de coches</p>
        </div>

        <div class="grid lg:grid-cols-5 gap-8">
            <!-- Formulario -->
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-icons text-primary">person_add</span>
                        Datos del Cliente
                    </h2>

                    <form @submit.prevent="guardar">
                        <BaseInput
                            v-model="form.dni"
                            label="DNI"
                            placeholder="12345678A"
                            :error="errors.dni"
                            :required="true"
                        />
                        <BaseInput
                            v-model="form.nombre"
                            label="Nombre"
                            placeholder="Juan"
                            :error="errors.nombre"
                            :required="true"
                        />
                        <BaseInput
                            v-model="form.apellidos"
                            label="Apellidos"
                            placeholder="García López"
                            :error="errors.apellidos"
                            :required="true"
                        />
                        <BaseInput
                            v-model="form.telefono"
                            label="Teléfono"
                            placeholder="612345678"
                            :error="errors.telefono"
                            :required="true"
                        />
                        <BaseInput
                            v-model="form.email"
                            label="Email"
                            type="email"
                            placeholder="juan@email.com"
                            :error="errors.email"
                            :required="true"
                        />

                        <div class="mt-6">
                            <ButtonPrimary
                                type="submit"
                                text="Registrar Cliente"
                                icon="save"
                                :disabled="loading"
                            />
                        </div>
                    </form>

                    <Transition name="fade">
                        <div v-if="mensaje" class="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2">
                            <span class="material-icons text-sm">check_circle</span>
                            {{ mensaje }}
                        </div>
                    </Transition>

                    <Transition name="fade">
                        <div v-if="mensajeError" class="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                            <span class="material-icons text-sm">error</span>
                            {{ mensajeError }}
                        </div>
                    </Transition>
                </div>
            </div>

            <!-- Listado de clientes -->
            <div class="lg:col-span-3">
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-icons text-primary">people</span>
                        Clientes Registrados
                        <span class="ml-auto text-sm font-normal text-slate-500">{{ clientes.length }} registros</span>
                    </h2>

                    <div v-if="clientes.length === 0" class="text-center py-12 text-slate-500 dark:text-slate-400">
                        <span class="material-icons text-5xl mb-4 block opacity-30">person_off</span>
                        <p>No hay clientes registrados todavía</p>
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-slate-200 dark:border-slate-700">
                                    <th class="text-left py-3 px-2 text-slate-500 dark:text-slate-400 font-medium">DNI</th>
                                    <th class="text-left py-3 px-2 text-slate-500 dark:text-slate-400 font-medium">Nombre</th>
                                    <th class="text-left py-3 px-2 text-slate-500 dark:text-slate-400 font-medium">Email</th>
                                    <th class="text-left py-3 px-2 text-slate-500 dark:text-slate-400 font-medium">Estado</th>
                                    <th class="text-left py-3 px-2 text-slate-500 dark:text-slate-400 font-medium">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="c in clientes" :key="c.id" class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td class="py-3 px-2 font-mono text-xs">{{ c.dni }}</td>
                                    <td class="py-3 px-2">{{ c.nombre }} {{ c.apellidos }}</td>
                                    <td class="py-3 px-2 text-slate-500">{{ c.email }}</td>
                                    <td class="py-3 px-2"><StatusBadge :estado="c.estado" /></td>
                                    <td class="py-3 px-2 text-slate-500 text-xs">{{ c.fechaRegistro }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
