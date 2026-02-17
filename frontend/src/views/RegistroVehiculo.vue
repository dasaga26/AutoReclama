<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import SelectField from '../components/SelectField.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'

const API = 'http://localhost:3000/api'
const route = useRoute()

const marcasModelos = {
    'Seat': ['Ibiza', 'León', 'Altea', 'Toledo', 'Alhambra', 'Exeo'],
    'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'Jetta'],
    'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7', 'TT'],
    'BMW': ['Serie 1', 'Serie 3', 'Serie 5', 'X3', 'X5', 'X6'],
    'Mercedes': ['Clase A', 'Clase C', 'Clase E', 'GLA', 'GLC', 'GLE'],
    'Renault': ['Clio', 'Megane', 'Scenic', 'Laguna', 'Captur', 'Kadjar'],
    'Peugeot': ['208', '308', '508', '2008', '3008', '5008'],
    'Citroën': ['C3', 'C4', 'C5', 'Berlingo', 'C4 Picasso', 'DS3'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'S-Max', 'Galaxy'],
    'Opel': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Zafira', 'Meriva'],
    'Toyota': ['Yaris', 'Corolla', 'Auris', 'RAV4', 'Avensis', 'Land Cruiser'],
    'Hyundai': ['i20', 'i30', 'Tucson', 'Santa Fe', 'ix35', 'i40'],
    'Fiat': ['500', 'Punto', 'Tipo', 'Panda', 'Bravo', 'Doblo']
}

const marcas = Object.keys(marcasModelos)
const modelosDisponibles = computed(() => {
    return form.marca ? marcasModelos[form.marca] || [] : []
})

const form = reactive({
    matricula: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
    puertas: '',
    observaciones: '',
    clienteId: ''
})

const errors = reactive({
    matricula: '',
    marca: '',
    modelo: '',
    anio: '',
    clienteId: ''
})

const clientes = ref([])
const mensaje = ref('')
const mensajeError = ref('')
const loading = ref(false)

const matriculaRegex = /^\d{4}[A-Za-z]{3}$/
const colores = ['Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Marrón']

watch(() => form.marca, () => {
    form.modelo = ''
})

function validar() {
    let ok = true
    errors.matricula = ''
    errors.marca = ''
    errors.modelo = ''
    errors.anio = ''
    errors.clienteId = ''

    if (!form.matricula) {
        errors.matricula = 'La matrícula es obligatoria'
        ok = false
    } else if (!matriculaRegex.test(form.matricula)) {
        errors.matricula = 'Formato: 4 dígitos + 3 letras (ej: 1234ABC)'
        ok = false
    }

    if (!form.marca) {
        errors.marca = 'Selecciona una marca'
        ok = false
    }

    if (!form.modelo) {
        errors.modelo = 'Selecciona un modelo'
        ok = false
    }

    if (!form.anio) {
        errors.anio = 'El año es obligatorio'
        ok = false
    } else {
        const a = parseInt(form.anio)
        if (a < 2006 || a > 2013) {
            errors.anio = 'El año debe estar entre 2006 y 2013'
            ok = false
        }
    }

    if (!form.clienteId) {
        errors.clienteId = 'Selecciona un cliente'
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
        const res = await fetch(`${API}/vehiculos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                anio: parseInt(form.anio),
                puertas: form.puertas ? parseInt(form.puertas) : null,
                matricula: form.matricula.toUpperCase()
            })
        })

        const data = await res.json()

        if (!res.ok) {
            mensajeError.value = data.error || 'Error al guardar'
            return
        }

        mensaje.value = 'Vehículo registrado correctamente'
        form.matricula = ''
        form.marca = ''
        form.modelo = ''
        form.anio = ''
        form.color = ''
        form.puertas = ''
        form.observaciones = ''
        if (!route.query.clienteId) form.clienteId = ''
    } catch {
        mensajeError.value = 'Error de conexión con el servidor'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    cargarClientes()
    if (route.query.clienteId) {
        form.clienteId = route.query.clienteId
    }
})
</script>

<template>
    <div class="max-w-4xl mx-auto px-6 py-12">
        <div class="mb-10">
            <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">Registro de Vehículo</h1>
            <p class="text-lg text-slate-600 dark:text-slate-400">Introduce los datos del vehículo afectado por el cártel</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span class="material-icons text-primary">directions_car</span>
                Datos del Vehículo
            </h2>

            <form @submit.prevent="guardar">
                <div class="grid md:grid-cols-2 gap-x-6">
                    <!-- Cliente -->
                    <div class="md:col-span-2">
                        <SelectField
                            v-model="form.clienteId"
                            label="Cliente asociado"
                            :options="clientes.map(c => ({ value: c.id, label: c.dni + ' - ' + c.nombre + ' ' + c.apellidos }))"
                            placeholder="Selecciona un cliente"
                            :error="errors.clienteId"
                            :required="true"
                        />
                    </div>

                    <BaseInput
                        v-model="form.matricula"
                        label="Matrícula"
                        placeholder="1234ABC"
                        :error="errors.matricula"
                        :required="true"
                    />

                    <BaseInput
                        v-model="form.anio"
                        label="Año de matriculación"
                        type="number"
                        placeholder="2010"
                        :error="errors.anio"
                        :required="true"
                    />

                    <SelectField
                        v-model="form.marca"
                        label="Marca"
                        :options="marcas"
                        placeholder="Selecciona una marca"
                        :error="errors.marca"
                        :required="true"
                    />

                    <SelectField
                        v-model="form.modelo"
                        label="Modelo"
                        :options="modelosDisponibles"
                        placeholder="Selecciona un modelo"
                        :error="errors.modelo"
                        :required="true"
                    />

                    <SelectField
                        v-model="form.color"
                        label="Color"
                        :options="colores"
                        placeholder="Selecciona un color"
                    />

                    <SelectField
                        v-model="form.puertas"
                        label="Nº de puertas"
                        :options="['2', '3', '4', '5']"
                        placeholder="Selecciona"
                    />
                </div>

                <div class="mt-2">
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observaciones</label>
                    <textarea
                        v-model="form.observaciones"
                        rows="3"
                        placeholder="Comentarios adicionales sobre el vehículo..."
                        aria-label="Observaciones"
                        class="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm"
                    ></textarea>
                </div>

                <div class="mt-6 flex items-center gap-4">
                    <ButtonPrimary
                        type="submit"
                        text="Registrar Vehículo"
                        icon="save"
                        :disabled="loading"
                    />
                    <router-link
                        to="/registro-cliente"
                        class="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        <span class="material-icons text-sm">arrow_back</span>
                        Volver a clientes
                    </router-link>
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
