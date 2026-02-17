<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import SelectField from '../components/SelectField.vue'
import ButtonPrimary from '../components/ButtonPrimary.vue'

const API = 'http://localhost:3000/api'
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

const form = reactive({ marca: '', modelo: '', anio: '' })
const resultado = ref(null)
const loading = ref(false)

const modelosDisponibles = computed(() => form.marca ? marcasModelos[form.marca] || [] : [])

watch(() => form.marca, () => { form.modelo = '' })

async function verificar() {
    if (!form.marca || !form.anio) return

    loading.value = true
    resultado.value = null

    try {
        const res = await fetch(`${API}/verificar?marca=${encodeURIComponent(form.marca)}&anio=${form.anio}`)
        resultado.value = await res.json()
    } catch {
        resultado.value = { elegible: false, mensaje: 'Error de conexión con el servidor' }
    } finally {
        loading.value = false
    }
}

function irAReclamar() {
    router.push({
        path: '/reclamar',
        query: { marca: form.marca, modelo: form.modelo, anio: form.anio }
    })
}
</script>

<template>
    <div class="max-w-3xl mx-auto px-6 py-12">
        <div class="mb-10 text-center">
            <div class="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span class="material-icons text-primary text-4xl">search</span>
            </div>
            <h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-3">Verifica tu Vehículo</h1>
            <p class="text-lg text-slate-600 dark:text-slate-400">Selecciona los datos de tu vehículo para comprobar si está afectado por el cártel</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <form @submit.prevent="verificar">
                <div class="grid md:grid-cols-3 gap-4">
                    <SelectField
                        v-model="form.marca"
                        label="Marca"
                        :options="marcas"
                        placeholder="Selecciona marca"
                        :required="true"
                    />
                    <SelectField
                        v-model="form.modelo"
                        label="Modelo"
                        :options="modelosDisponibles"
                        placeholder="Selecciona modelo"
                    />
                    <SelectField
                        v-model="form.anio"
                        label="Año de compra"
                        :options="anios"
                        placeholder="Selecciona año"
                        :required="true"
                    />
                </div>
                <div class="mt-6 text-center">
                    <ButtonPrimary
                        type="submit"
                        text="Comprobar Elegibilidad"
                        icon="search"
                        :disabled="!form.marca || !form.anio || loading"
                    />
                </div>
            </form>
        </div>

        <!-- Resultado -->
        <Transition name="fade">
            <div v-if="resultado" class="mt-8">
                <!-- Elegible -->
                <div v-if="resultado.elegible" class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 p-8 text-center">
                    <div class="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-4">
                        <span class="material-icons text-emerald-600 text-3xl">check_circle</span>
                    </div>
                    <h2 class="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">¡Tu vehículo es elegible!</h2>
                    <p class="text-emerald-700 dark:text-emerald-400 mb-6">{{ resultado.mensaje }}</p>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            @click="irAReclamar"
                            class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-600/20 inline-flex items-center justify-center gap-2"
                        >
                            <span class="material-icons">edit_note</span>
                            Registrar mi Reclamación
                        </button>
                    </div>
                </div>

                <!-- No elegible -->
                <div v-else class="bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-8 text-center">
                    <div class="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                        <span class="material-icons text-slate-500 text-3xl">info</span>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Vehículo no afectado</h2>
                    <p class="text-slate-600 dark:text-slate-400 mb-4">{{ resultado.mensaje }}</p>
                    <p class="text-sm text-slate-500">Solo están afectados vehículos comprados entre 2006 y 2013 de marcas participantes en el cártel.</p>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active { transition: all 0.4s ease; }
.fade-enter-from { opacity: 0; transform: translateY(16px); }
</style>
