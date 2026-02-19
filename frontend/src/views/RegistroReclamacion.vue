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

// --- Campo tocado (para validación en tiempo real al salir del campo) ---
const touched = reactive({
    dni: false, nombre: false, apellidos: false, telefono: false, email: false,
    matricula: false, marca: false, modelo: false, anio: false
})

// --- Multi-step ---
const currentStep = ref(1)
const totalSteps = 3

const modelosDisponibles = computed(() => form.marca ? marcasModelos[form.marca] || [] : [])
const obsMaxLen = 300
const obsCharsLeft = computed(() => obsMaxLen - form.observaciones.length)

const mensajeError = ref('')
const loading = ref(false)
const registroExitoso = ref(false)

const dniRegex = /^\d{8}[A-Za-z]$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const telefonoRegex = /^\d{9}$/
const matriculaRegex = /^\d{4}[A-Za-z]{3}$/

watch(() => form.marca, () => { form.modelo = '' })

// Auto-mayúsculas para DNI y matrícula
function handleDni(e) {
    form.dni = e.target.value.toUpperCase()
    if (touched.dni) validateField('dni')
}
function handleMatricula(e) {
    form.matricula = e.target.value.toUpperCase()
    if (touched.matricula) validateField('matricula')
}

// Validación de un solo campo
function validateField(field) {
    errors[field] = ''
    switch (field) {
        case 'dni':
            if (!form.dni) errors.dni = 'El DNI es obligatorio'
            else if (!dniRegex.test(form.dni)) errors.dni = '8 dígitos + 1 letra (ej: 12345678A)'
            break
        case 'nombre':
            if (!form.nombre.trim()) errors.nombre = 'Obligatorio'
            break
        case 'apellidos':
            if (!form.apellidos.trim()) errors.apellidos = 'Obligatorio'
            break
        case 'telefono':
            if (!form.telefono) errors.telefono = 'Obligatorio'
            else if (!telefonoRegex.test(form.telefono)) errors.telefono = '9 dígitos sin espacios'
            break
        case 'email':
            if (!form.email) errors.email = 'Obligatorio'
            else if (!emailRegex.test(form.email)) errors.email = 'Email no válido'
            break
        case 'matricula':
            if (!form.matricula) errors.matricula = 'Obligatoria'
            else if (!matriculaRegex.test(form.matricula)) errors.matricula = '4 dígitos + 3 letras (ej: 1234ABC)'
            break
        case 'marca':
            if (!form.marca) errors.marca = 'Selecciona una marca'
            break
        case 'modelo':
            if (!form.modelo) errors.modelo = 'Selecciona un modelo'
            break
        case 'anio':
            if (!form.anio) errors.anio = 'Selecciona el año'
            else {
                const a = parseInt(form.anio)
                if (a < 2006 || a > 2013) errors.anio = 'Debe ser entre 2006 y 2013'
            }
            break
    }
}

function onBlur(field) {
    touched[field] = true
    validateField(field)
}

// Validar todos los campos del paso actual y devolver si son válidos
function validarPaso(paso) {
    let ok = true
    const camposPaso1 = ['dni', 'nombre', 'apellidos', 'telefono', 'email']
    const camposPaso2 = ['matricula', 'marca', 'modelo', 'anio']

    const campos = paso === 1 ? camposPaso1 : camposPaso2
    campos.forEach(f => {
        touched[f] = true
        validateField(f)
        if (errors[f]) ok = false
    })
    return ok
}

function siguientePaso() {
    if (currentStep.value === 1 && !validarPaso(1)) return
    if (currentStep.value === 2 && !validarPaso(2)) return
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

function pasoAnterior() {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function guardar() {
    if (!validarPaso(1) || !validarPaso(2)) {
        mensajeError.value = 'Revisa los campos obligatorios antes de enviar.'
        return
    }

    loading.value = true
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

        localStorage.setItem('autoreclama_dni', form.dni)
        registroExitoso.value = true
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

        <!-- ───── ESTADO: REGISTRO EXITOSO ───── -->
        <Transition name="fade" mode="out-in">
        <div v-if="registroExitoso" key="success" class="max-w-lg mx-auto text-center py-12">
            <div class="w-24 h-24 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-once">
                <span class="material-icons text-emerald-600 text-5xl">task_alt</span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">¡Reclamación Registrada!</h1>
            <p class="text-lg text-slate-600 dark:text-slate-400 mb-2">Tu reclamación se ha registrado correctamente.</p>
            <p class="text-slate-500 mb-8">
                Puedes consultar el estado con tu DNI:
                <strong class="text-slate-900 dark:text-white font-mono">{{ form.dni }}</strong>
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button @click="router.push('/consultar')"
                    class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm inline-flex items-center justify-center gap-2">
                    <span class="material-icons text-sm">fact_check</span>
                    Consultar mi Estado
                </button>
                <button @click="router.push('/verificar')"
                    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg font-semibold transition-all hover:border-primary inline-flex items-center justify-center gap-2">
                    <span class="material-icons text-sm">add</span>
                    Añadir otro vehículo
                </button>
            </div>
        </div>

        <!-- ───── ESTADO: FORMULARIO MULTI-PASO ───── -->
        <div v-else key="form">
            <!-- Cabecera -->
            <div class="mb-8">
                <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-2">Registrar Reclamación</h1>
                <p class="text-slate-600 dark:text-slate-400">Completa los datos en tres sencillos pasos</p>
            </div>

            <!-- Progress bar / indicador de pasos -->
            <div class="mb-10">
                <div class="flex items-center gap-0">
                    <template v-for="n in totalSteps" :key="n">
                        <!-- Círculo del paso -->
                        <div class="flex flex-col items-center flex-1">
                            <div class="flex items-center w-full">
                                <!-- Línea izquierda -->
                                <div v-if="n > 1" class="flex-1 h-0.5 transition-colors duration-300"
                                    :class="currentStep >= n ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'"></div>
                                <!-- Círculo -->
                                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 border-2"
                                    :class="currentStep > n
                                        ? 'bg-primary border-primary text-white'
                                        : currentStep === n
                                            ? 'bg-white dark:bg-slate-900 border-primary text-primary shadow-md'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'">
                                    <span v-if="currentStep > n" class="material-icons text-base">check</span>
                                    <span v-else>{{ n }}</span>
                                </div>
                                <!-- Línea derecha -->
                                <div v-if="n < totalSteps" class="flex-1 h-0.5 transition-colors duration-300"
                                    :class="currentStep > n ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'"></div>
                            </div>
                            <!-- Etiqueta -->
                            <span class="mt-2 text-xs font-medium transition-colors duration-300"
                                :class="currentStep === n ? 'text-primary' : 'text-slate-400 dark:text-slate-500'">
                                {{ n === 1 ? 'Tus datos' : n === 2 ? 'Vehículo' : 'Revisar' }}
                            </span>
                        </div>
                    </template>
                </div>
            </div>

            <!-- ── PASO 1: Datos Personales ── -->
            <Transition name="slide" mode="out-in">
            <div v-if="currentStep === 1" key="paso1">
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-icons text-primary">person</span>
                        Datos Personales
                    </h2>
                    <div class="grid md:grid-cols-2 gap-x-6">
                        <!-- DNI con auto-mayúsculas -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                DNI <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">badge</span>
                                <input
                                    :value="form.dni"
                                    @input="handleDni"
                                    @blur="onBlur('dni')"
                                    placeholder="12345678A"
                                    maxlength="9"
                                    class="block w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm font-mono uppercase"
                                    :class="errors.dni ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'"
                                />
                            </div>
                            <p v-if="errors.dni" class="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span class="material-icons text-xs">error</span>{{ errors.dni }}
                            </p>
                        </div>

                        <!-- Email -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Email <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">mail</span>
                                <input
                                    v-model="form.email"
                                    @blur="onBlur('email')"
                                    type="email"
                                    placeholder="tu@email.com"
                                    class="block w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm"
                                    :class="errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'"
                                />
                            </div>
                            <p v-if="errors.email" class="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span class="material-icons text-xs">error</span>{{ errors.email }}
                            </p>
                        </div>

                        <!-- Nombre -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Nombre <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">person</span>
                                <input
                                    v-model="form.nombre"
                                    @blur="onBlur('nombre')"
                                    placeholder="Juan"
                                    class="block w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm"
                                    :class="errors.nombre ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'"
                                />
                            </div>
                            <p v-if="errors.nombre" class="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span class="material-icons text-xs">error</span>{{ errors.nombre }}
                            </p>
                        </div>

                        <!-- Apellidos -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Apellidos <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">people</span>
                                <input
                                    v-model="form.apellidos"
                                    @blur="onBlur('apellidos')"
                                    placeholder="García López"
                                    class="block w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm"
                                    :class="errors.apellidos ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'"
                                />
                            </div>
                            <p v-if="errors.apellidos" class="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span class="material-icons text-xs">error</span>{{ errors.apellidos }}
                            </p>
                        </div>

                        <!-- Teléfono -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Teléfono <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">phone</span>
                                <input
                                    v-model="form.telefono"
                                    @blur="onBlur('telefono')"
                                    placeholder="612345678"
                                    maxlength="9"
                                    class="block w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm font-mono"
                                    :class="errors.telefono ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'"
                                />
                            </div>
                            <p v-if="errors.telefono" class="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span class="material-icons text-xs">error</span>{{ errors.telefono }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-6">
                    <router-link to="/verificar" class="text-sm text-primary hover:underline flex items-center gap-1">
                        <span class="material-icons text-sm">arrow_back</span>
                        Volver a verificar
                    </router-link>
                    <ButtonPrimary type="button" text="Siguiente" icon="arrow_forward" @click="siguientePaso" />
                </div>
            </div>
            </Transition>

            <!-- ── PASO 2: Datos del Vehículo ── -->
            <Transition name="slide" mode="out-in">
            <div v-if="currentStep === 2" key="paso2">
                <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-icons text-primary">directions_car</span>
                        Datos del Vehículo
                    </h2>
                    <div class="grid md:grid-cols-2 gap-x-6">
                        <!-- Matrícula con auto-mayúsculas -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Matrícula <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">pin</span>
                                <input
                                    :value="form.matricula"
                                    @input="handleMatricula"
                                    @blur="onBlur('matricula')"
                                    placeholder="1234ABC"
                                    maxlength="7"
                                    class="block w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm font-mono uppercase tracking-widest"
                                    :class="errors.matricula ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'"
                                />
                            </div>
                            <p v-if="errors.matricula" class="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <span class="material-icons text-xs">error</span>{{ errors.matricula }}
                            </p>
                        </div>

                        <SelectField
                            v-model="form.anio"
                            label="Año de compra"
                            :options="anios"
                            placeholder="Selecciona año"
                            :error="errors.anio"
                            :required="true"
                            @blur="onBlur('anio')"
                        />
                        <SelectField
                            v-model="form.marca"
                            label="Marca"
                            :options="marcas"
                            placeholder="Selecciona marca"
                            :error="errors.marca"
                            :required="true"
                            @blur="onBlur('marca')"
                        />
                        <SelectField
                            v-model="form.modelo"
                            label="Modelo"
                            :options="modelosDisponibles"
                            :placeholder="form.marca ? 'Selecciona modelo' : 'Selecciona primero la marca'"
                            :error="errors.modelo"
                            :required="true"
                            @blur="onBlur('modelo')"
                        />
                        <SelectField v-model="form.color" label="Color" :options="colores" placeholder="Selecciona color (opcional)" />
                        <SelectField v-model="form.puertas" label="Nº de puertas" :options="['2', '3', '4', '5']" placeholder="Selecciona (opcional)" />
                    </div>

                    <!-- Observaciones con contador de caracteres -->
                    <div class="mt-2">
                        <div class="flex items-center justify-between mb-1">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Observaciones</label>
                            <span class="text-xs tabular-nums" :class="obsCharsLeft < 30 ? 'text-amber-500 font-semibold' : 'text-slate-400'">
                                {{ obsCharsLeft }} caracteres restantes
                            </span>
                        </div>
                        <textarea
                            v-model="form.observaciones"
                            rows="3"
                            :maxlength="obsMaxLen"
                            placeholder="Información adicional sobre el vehículo (opcional)..."
                            aria-label="Observaciones"
                            class="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm resize-none"
                        ></textarea>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-6">
                    <button type="button" @click="pasoAnterior"
                        class="text-sm text-primary hover:underline flex items-center gap-1">
                        <span class="material-icons text-sm">arrow_back</span>
                        Volver
                    </button>
                    <ButtonPrimary type="button" text="Revisar datos" icon="checklist" @click="siguientePaso" />
                </div>
            </div>
            </Transition>

            <!-- ── PASO 3: Revisión y envío ── -->
            <Transition name="slide" mode="out-in">
            <div v-if="currentStep === 3" key="paso3">
                <div class="space-y-4 mb-6">
                    <!-- Resumen personal -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span class="material-icons text-primary text-xl">person</span>
                                Datos Personales
                            </h2>
                            <button type="button" @click="currentStep = 1"
                                class="text-xs text-primary hover:underline flex items-center gap-0.5">
                                <span class="material-icons text-xs">edit</span>
                                Editar
                            </button>
                        </div>
                        <dl class="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">DNI</dt>
                                <dd class="font-mono font-medium text-slate-900 dark:text-white">{{ form.dni }}</dd>
                            </div>
                            <div class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Nombre</dt>
                                <dd class="text-slate-900 dark:text-white">{{ form.nombre }} {{ form.apellidos }}</dd>
                            </div>
                            <div class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Email</dt>
                                <dd class="text-slate-900 dark:text-white">{{ form.email }}</dd>
                            </div>
                            <div class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Teléfono</dt>
                                <dd class="font-mono text-slate-900 dark:text-white">{{ form.telefono }}</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Resumen vehículo -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span class="material-icons text-primary text-xl">directions_car</span>
                                Datos del Vehículo
                            </h2>
                            <button type="button" @click="currentStep = 2"
                                class="text-xs text-primary hover:underline flex items-center gap-0.5">
                                <span class="material-icons text-xs">edit</span>
                                Editar
                            </button>
                        </div>
                        <dl class="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Matrícula</dt>
                                <dd class="font-mono font-semibold tracking-widest text-slate-900 dark:text-white">{{ form.matricula }}</dd>
                            </div>
                            <div class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Año de compra</dt>
                                <dd class="text-slate-900 dark:text-white">{{ form.anio }}</dd>
                            </div>
                            <div class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Marca</dt>
                                <dd class="text-slate-900 dark:text-white">{{ form.marca }}</dd>
                            </div>
                            <div class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Modelo</dt>
                                <dd class="text-slate-900 dark:text-white">{{ form.modelo }}</dd>
                            </div>
                            <div v-if="form.color" class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Color</dt>
                                <dd class="text-slate-900 dark:text-white">{{ form.color }}</dd>
                            </div>
                            <div v-if="form.puertas" class="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                                <dt class="text-slate-500">Puertas</dt>
                                <dd class="text-slate-900 dark:text-white">{{ form.puertas }}</dd>
                            </div>
                            <div v-if="form.observaciones" class="col-span-2 flex flex-col gap-1 pt-1">
                                <dt class="text-slate-500">Observaciones</dt>
                                <dd class="text-slate-700 dark:text-slate-300 text-xs italic">{{ form.observaciones }}</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Aviso legal -->
                    <div class="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
                        <span class="material-icons text-amber-500 shrink-0">info</span>
                        <p>Al enviar, confirmas que los datos son correctos y que este vehículo fue adquirido entre 2006 y 2013. Tus datos se usarán exclusivamente para gestionar tu reclamación.</p>
                    </div>
                </div>

                <!-- Error -->
                <Transition name="fade">
                    <div v-if="mensajeError" class="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                        <span class="material-icons text-sm">error</span>
                        {{ mensajeError }}
                    </div>
                </Transition>

                <div class="flex items-center justify-between">
                    <button type="button" @click="pasoAnterior"
                        class="text-sm text-primary hover:underline flex items-center gap-1">
                        <span class="material-icons text-sm">arrow_back</span>
                        Volver
                    </button>
                    <button
                        type="button"
                        @click="guardar"
                        :disabled="loading"
                        class="px-6 py-3 rounded-lg font-semibold text-sm shadow-sm transition-all duration-200 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                    >
                        <template v-if="loading">
                            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Enviando...
                        </template>
                        <template v-else>
                            <span class="material-icons text-sm">send</span>
                            Enviar Reclamación
                        </template>
                    </button>
                </div>
            </div>
            </Transition>
        </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active { transition: all 0.3s ease; }
.slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from { opacity: 0; transform: translateX(24px); }
.slide-leave-to { opacity: 0; transform: translateX(-24px); }

@keyframes bounce-once {
    0%, 100% { transform: translateY(0); }
    40% { transform: translateY(-12px); }
    60% { transform: translateY(-6px); }
}
.animate-bounce-once { animation: bounce-once 0.7s ease 0.1s both; }
</style>
