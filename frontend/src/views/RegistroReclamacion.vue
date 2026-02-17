<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import SelectField from '../components/SelectField.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'

const API = 'http://localhost:3000/api'
const route = useRoute()
const router = useRouter()

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
    'Fiat': ['500', 'Punto', 'Tipo', 'Panda', 'Bravo', 'Doblo'],
    'Skoda': ['Fabia', 'Octavia', 'Superb', 'Yeti', 'Rapid', 'Roomster'],
    'Nissan': ['Micra', 'Qashqai', 'Juke', 'X-Trail', 'Note', 'Pulsar'],
    'Kia': ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'Venga'],
    'Volvo': ['S40', 'S60', 'V50', 'V70', 'XC60', 'XC90'],
    'Honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'FR-V'],
    'Mazda': ['2', '3', '5', '6', 'CX-5', 'MX-5'],
    'Chevrolet': ['Spark', 'Aveo', 'Cruze', 'Captiva', 'Orlando', 'Trax']
}

const marcas = Object.keys(marcasModelos)
const anios = Array.from({ length: 8 }, (_, i) => String(2006 + i))
const colores = ['Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Marrón']

const form = reactive({
    dni: '', nombre: '', apellidos: '', telefono: '', email: '',
    matricula: '', marca: '', modelo: '', anio: '', color: '', puertas: '', observaciones: ''
})

const errors = reactive({
    dni: '', nombre: '', apellidos: '', telefono: '', email: '', matricula: '', marca: '', modelo: '', anio: ''
})

const modelosDisponibles = computed(() => form.marca ? marcasModelos[form.marca] || [] : [])
const mensaje = ref('')
const mensajeError = ref('')
const loading = ref(false)
const registroExitoso = ref(false)

const dniRegex = /^\d{8}[A-Za-z]$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const telefonoRegex = /^\d{9}$/
const matriculaRegex = /^\d{4}[A-Za-z]{3}$/

watch(() => form.marca, () => { form.modelo = '' })

function validar() {
    let ok = true
    Object.keys(errors).forEach(k => errors[k] = '')

    if (!form.dni) { errors.dni = 'El DNI es obligatorio'; ok = false }
    else if (!dniRegex.test(form.dni)) { errors.dni = '8 dígitos + 1 letra (ej: 12345678A)'; ok = false }

    if (!form.nombre.trim()) { errors.nombre = 'Obligatorio'; ok = false }
    if (!form.apellidos.trim()) { errors.apellidos = 'Obligatorio'; ok = false }

    if (!form.telefono) { errors.telefono = 'Obligatorio'; ok = false }
    else if (!telefonoRegex.test(form.telefono)) { errors.telefono = '9 dígitos'; ok = false }

    if (!form.email) { errors.email = 'Obligatorio'; ok = false }
    else if (!emailRegex.test(form.email)) { errors.email = 'Email no válido'; ok = false }

    if (!form.matricula) { errors.matricula = 'Obligatoria'; ok = false }
    else if (!matriculaRegex.test(form.matricula)) { errors.matricula = '4 dígitos + 3 letras (ej: 1234ABC)'; ok = false }

    if (!form.marca) { errors.marca = 'Selecciona marca'; ok = false }
    if (!form.modelo) { errors.modelo = 'Selecciona modelo'; ok = false }

    if (!form.anio) { errors.anio = 'Selecciona año'; ok = false }
    else {
        const a = parseInt(form.anio)
        if (a < 2006 || a > 2013) { errors.anio = 'Debe ser entre 2006 y 2013'; ok = false }
    }

    return ok
}

async function guardar() {
    if (!validar()) return

    loading.value = true
    mensaje.value = ''
    mensajeError.value = ''

    try {
        const res = await fetch(`${API}/reclamaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                anio: parseInt(form.anio),
                puertas: form.puertas ? parseInt(form.puertas) : null
            })
        })

        const data = await res.json()

        if (!res.ok) {
            mensajeError.value = data.error || 'Error al guardar'
            return
        }

        registroExitoso.value = true
        mensaje.value = 'Reclamación registrada correctamente'
    } catch {
        mensajeError.value = 'Error de conexión con el servidor'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (route.query.marca) form.marca = route.query.marca
    if (route.query.modelo) {
        setTimeout(() => { form.modelo = route.query.modelo }, 50)
    }
    if (route.query.anio) form.anio = route.query.anio
})
</script>

<template>
    <div class="max-w-4xl mx-auto px-6 py-12">
        <!-- Estado: Registro exitoso -->
        <div v-if="registroExitoso" class="max-w-lg mx-auto text-center py-12">
            <div class="w-24 h-24 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <span class="material-icons text-emerald-600 text-5xl">task_alt</span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">¡Reclamación Registrada!</h1>
            <p class="text-lg text-slate-600 dark:text-slate-400 mb-2">Tu reclamación se ha registrado correctamente.</p>
            <p class="text-slate-500 mb-8">Puedes consultar el estado de tu reclamación en cualquier momento con tu DNI: <strong class="text-slate-900 dark:text-white font-mono">{{ form.dni }}</strong></p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    @click="router.push('/consultar')"
                    class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm inline-flex items-center justify-center gap-2"
                >
                    <span class="material-icons text-sm">fact_check</span>
                    Consultar mi Estado
                </button>
                <button
                    @click="router.push('/verificar')"
                    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-semibold transition-all hover:border-primary inline-flex items-center justify-center gap-2"
                >
                    <span class="material-icons text-sm">add</span>
                    Añadir otro vehículo
                </button>
            </div>
        </div>

        <!-- Estado: Formulario -->
        <template v-else>
            <div class="mb-10">
                <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-3">Registrar Reclamación</h1>
                <p class="text-lg text-slate-600 dark:text-slate-400">Completa tus datos personales y los del vehículo afectado</p>
            </div>

            <form @submit.prevent="guardar" class="space-y-8">
                <!-- Datos personales -->
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-icons text-primary">person</span>
                        Datos Personales
                    </h2>
                    <div class="grid md:grid-cols-2 gap-x-6">
                        <BaseInput v-model="form.dni" label="DNI" placeholder="12345678A" :error="errors.dni" :required="true" />
                        <BaseInput v-model="form.email" label="Email" type="email" placeholder="tu@email.com" :error="errors.email" :required="true" />
                        <BaseInput v-model="form.nombre" label="Nombre" placeholder="Juan" :error="errors.nombre" :required="true" />
                        <BaseInput v-model="form.apellidos" label="Apellidos" placeholder="García López" :error="errors.apellidos" :required="true" />
                        <BaseInput v-model="form.telefono" label="Teléfono" placeholder="612345678" :error="errors.telefono" :required="true" />
                    </div>
                </div>

                <!-- Datos del vehículo -->
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-icons text-primary">directions_car</span>
                        Datos del Vehículo
                    </h2>
                    <div class="grid md:grid-cols-2 gap-x-6">
                        <BaseInput v-model="form.matricula" label="Matrícula" placeholder="1234ABC" :error="errors.matricula" :required="true" />
                        <SelectField v-model="form.anio" label="Año de compra" :options="anios" placeholder="Selecciona año" :error="errors.anio" :required="true" />
                        <SelectField v-model="form.marca" label="Marca" :options="marcas" placeholder="Selecciona marca" :error="errors.marca" :required="true" />
                        <SelectField v-model="form.modelo" label="Modelo" :options="modelosDisponibles" placeholder="Selecciona modelo" :error="errors.modelo" :required="true" />
                        <SelectField v-model="form.color" label="Color" :options="colores" placeholder="Selecciona color" />
                        <SelectField v-model="form.puertas" label="Nº de puertas" :options="['2', '3', '4', '5']" placeholder="Selecciona" />
                    </div>
                    <div class="mt-2">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observaciones</label>
                        <textarea
                            v-model="form.observaciones"
                            rows="3"
                            placeholder="Información adicional sobre el vehículo..."
                            aria-label="Observaciones"
                            class="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm"
                        ></textarea>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex items-center justify-between">
                    <router-link to="/verificar" class="text-sm text-primary hover:underline flex items-center gap-1">
                        <span class="material-icons text-sm">arrow_back</span>
                        Volver a verificar
                    </router-link>
                    <ButtonPrimary type="submit" text="Registrar Reclamación" icon="save" :disabled="loading" />
                </div>
            </form>

            <Transition name="fade">
                <div v-if="mensajeError" class="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                    <span class="material-icons text-sm">error</span>
                    {{ mensajeError }}
                </div>
            </Transition>
        </template>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
