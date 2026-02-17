<script setup>
import { ref, reactive } from 'vue'
import BaseInput from '../components/BaseInput.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'
import StatusBadge from '../components/StatusBadge.vue'

const API = 'http://localhost:3000/api'

const dni = ref('')
const dniError = ref('')
const loading = ref(false)
const buscado = ref(false)
const noEncontrado = ref(false)

const cliente = ref(null)
const vehiculos = ref([])

const dniRegex = /^\d{8}[A-Za-z]$/

async function buscar() {
    dniError.value = ''

    if (!dni.value) {
        dniError.value = 'Introduce tu DNI'
        return
    }
    if (!dniRegex.test(dni.value)) {
        dniError.value = '8 dígitos + 1 letra (ej: 12345678A)'
        return
    }

    loading.value = true
    buscado.value = false
    noEncontrado.value = false

    try {
        const res = await fetch(`${API}/reclamaciones/${dni.value}`)

        if (res.status === 404) {
            noEncontrado.value = true
            buscado.value = true
            cliente.value = null
            vehiculos.value = []
            return
        }

        const data = await res.json()
        cliente.value = data.cliente
        vehiculos.value = data.vehiculos
        buscado.value = true
    } catch {
        dniError.value = 'Error de conexión con el servidor'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-3xl mx-auto px-6 py-12">
        <div class="mb-10 text-center">
            <div class="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span class="material-icons text-primary text-4xl">fact_check</span>
            </div>
            <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-3">Consultar Estado</h1>
            <p class="text-lg text-slate-600 dark:text-slate-400">Introduce tu DNI para ver el estado de tu reclamación</p>
        </div>

        <!-- Buscador -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm mb-8">
            <form @submit.prevent="buscar" class="flex flex-col sm:flex-row gap-3">
                <div class="flex-grow">
                    <BaseInput
                        v-model="dni"
                        label="DNI"
                        placeholder="12345678A"
                        :error="dniError"
                        :required="true"
                    />
                </div>
                <div class="sm:pt-6">
                    <ButtonPrimary type="submit" text="Buscar" icon="search" :disabled="loading" />
                </div>
            </form>
        </div>

        <!-- No encontrado -->
        <Transition name="fade">
            <div v-if="buscado && noEncontrado" class="bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-8 text-center">
                <div class="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <span class="material-icons text-slate-500 text-3xl">search_off</span>
                </div>
                <h2 class="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No se encontraron reclamaciones</h2>
                <p class="text-slate-500 mb-4">No hay ninguna reclamación registrada con el DNI <strong class="font-mono">{{ dni }}</strong></p>
                <router-link
                    to="/verificar"
                    class="text-primary hover:underline text-sm inline-flex items-center gap-1"
                >
                    <span class="material-icons text-sm">arrow_forward</span>
                    Verificar si tu vehículo está afectado
                </router-link>
            </div>
        </Transition>

        <!-- Resultado -->
        <Transition name="fade">
            <div v-if="buscado && cliente" class="space-y-6">
                <!-- Datos del cliente -->
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span class="material-icons text-primary">person</span>
                        Tus Datos
                    </h2>
                    <div class="grid md:grid-cols-2 gap-4 text-sm">
                        <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span class="text-slate-500">DNI</span>
                            <span class="font-mono text-slate-900 dark:text-white">{{ cliente.dni }}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span class="text-slate-500">Nombre</span>
                            <span class="text-slate-900 dark:text-white">{{ cliente.nombre }} {{ cliente.apellidos }}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span class="text-slate-500">Email</span>
                            <span class="text-slate-900 dark:text-white">{{ cliente.email }}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span class="text-slate-500">Teléfono</span>
                            <span class="text-slate-900 dark:text-white">{{ cliente.telefono }}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span class="text-slate-500">Fecha registro</span>
                            <span class="text-slate-900 dark:text-white">{{ cliente.fecha_registro }}</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span class="text-slate-500">Estado</span>
                            <StatusBadge :estado="cliente.estado" />
                        </div>
                    </div>
                </div>

                <!-- Vehículos -->
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span class="material-icons text-primary">directions_car</span>
                        Mis Vehículos
                        <span class="ml-auto text-sm font-normal text-slate-500">{{ vehiculos.length }} registrados</span>
                    </h2>

                    <div v-if="vehiculos.length === 0" class="text-center py-8 text-slate-500">
                        <p>No tienes vehículos registrados</p>
                    </div>

                    <div v-else class="space-y-3">
                        <div
                            v-for="v in vehiculos"
                            :key="v.id"
                            class="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                        >
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-mono font-bold text-primary text-lg">{{ v.matricula }}</span>
                                <span class="text-sm text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{{ v.anio }}</span>
                            </div>
                            <p class="text-slate-900 dark:text-white font-medium">{{ v.marca }} {{ v.modelo }}</p>
                            <div class="flex gap-4 mt-1 text-xs text-slate-500">
                                <span v-if="v.color">{{ v.color }}</span>
                                <span v-if="v.puertas">{{ v.puertas }} puertas</span>
                                <span v-if="v.observaciones" class="truncate">{{ v.observaciones }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <router-link
                            to="/verificar"
                            class="text-primary hover:underline text-sm inline-flex items-center gap-1"
                        >
                            <span class="material-icons text-sm">add</span>
                            Añadir otro vehículo
                        </router-link>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active { transition: all 0.4s ease; }
.fade-enter-from { opacity: 0; transform: translateY(16px); }
</style>
