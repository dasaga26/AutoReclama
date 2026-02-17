<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-24 md:py-32">
        <div class="absolute inset-0 pointer-events-none opacity-5">
            <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
            <div class="absolute top-1/2 left-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Plazo de reclamaciones para compras 2006-2013
            </div>
            <h1 class="text-5xl md:text-7xl font-bold leading-tight mb-6 text-slate-900 dark:text-white">
                Comprueba si tu vehículo está afectado por el <span class="text-primary italic">Cártel de Coches</span>.
            </h1>
            <p class="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Verifica la elegibilidad de tu vehículo al instante. Si está afectado, registra tu reclamación en menos de 2 minutos.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    @click="router.push('/verificar')"
                    class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <span class="material-icons">search</span>
                    Verificar mi Vehículo
                </button>
                <button
                    @click="router.push('/consultar')"
                    class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary text-slate-900 dark:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    <span class="material-icons">fact_check</span>
                    Consultar mi Reclamación
                </button>
            </div>
            <p class="mt-6 text-xs text-slate-500 flex items-center justify-center gap-1">
                <span class="material-icons text-xs">lock</span>
                Tus datos están encriptados y se usan exclusivamente para gestionar reclamaciones.
            </p>
        </div>
    </section>

    <!-- Trust Indicators -->
    <section class="border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div class="max-w-6xl mx-auto px-6 py-8">
            <p class="text-center text-sm font-medium text-slate-500 mb-6 uppercase tracking-widest">
                Verificado por organizaciones de defensa al consumidor
            </p>
            <div class="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div class="flex items-center gap-2">
                    <span class="material-icons text-3xl">account_balance</span>
                    <span class="font-bold text-lg">OCU</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="material-icons text-3xl">balance</span>
                    <span class="font-bold text-lg">FACUA</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="material-icons text-3xl">verified_user</span>
                    <span class="font-bold text-lg">CNMC</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="material-icons text-3xl">gavel</span>
                    <span class="font-bold text-lg">TRIBUNAL SUPREMO</span>
                </div>
            </div>
        </div>
    </section>

    <!-- 3-Step Process -->
    <section class="py-24 bg-white dark:bg-slate-900">
        <div class="max-w-6xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4 text-slate-900 dark:text-white">¿Cómo funciona?</h2>
                <p class="text-xl text-slate-600 dark:text-slate-400">Simple, rápido y sin compromiso.</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8 relative">
                <div class="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-slate-200 dark:bg-slate-800 z-0 border-t border-dashed border-slate-300 dark:border-slate-700"></div>

                <div class="relative z-10 bg-background-light dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center group hover:border-primary/50 transition-colors duration-300">
                    <div class="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                        <span class="material-icons text-4xl text-primary">search</span>
                    </div>
                    <div class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">Paso 01</div>
                    <h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Verifica tu Vehículo</h3>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Selecciona la marca, modelo y año de tu coche para saber si está afectado por el cártel.
                    </p>
                </div>

                <div class="relative z-10 bg-background-light dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center group hover:border-primary/50 transition-colors duration-300">
                    <div class="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                        <span class="material-icons text-4xl text-primary">edit_note</span>
                    </div>
                    <div class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">Paso 02</div>
                    <h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Registra tu Reclamación</h3>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Si tu vehículo es elegible, rellena tus datos personales y los del coche en un único formulario.
                    </p>
                </div>

                <div class="relative z-10 bg-background-light dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center group hover:border-primary/50 transition-colors duration-300">
                    <div class="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                        <span class="material-icons text-4xl text-primary">fact_check</span>
                    </div>
                    <div class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">Paso 03</div>
                    <h3 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Consulta tu Estado</h3>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Introduce tu DNI en cualquier momento para ver el estado de tu reclamación en tiempo real.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-primary text-white relative overflow-hidden">
        <div class="max-w-6xl mx-auto px-6 relative z-10">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-4xl md:text-5xl font-bold mb-6">Justicia para los Propietarios.</h2>
                    <p class="text-xl text-blue-100 leading-relaxed mb-8">
                        Los fabricantes de automóviles coordinaron ilegalmente estrategias de precios, afectando a millones de consumidores entre 2006 y 2013.
                    </p>
                    <ul class="space-y-4">
                        <li class="flex items-center gap-3">
                            <span class="bg-white/20 p-1 rounded-full"><span class="material-icons text-white text-sm">check</span></span>
                            <span class="text-lg">Sin coste si no ganamos</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <span class="bg-white/20 p-1 rounded-full"><span class="material-icons text-white text-sm">check</span></span>
                            <span class="text-lg">Representación legal completa</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <span class="bg-white/20 p-1 rounded-full"><span class="material-icons text-white text-sm">check</span></span>
                            <span class="text-lg">Compensación media: 1.250€</span>
                        </li>
                    </ul>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
                        <div class="text-4xl font-bold mb-2">45M€+</div>
                        <div class="text-blue-200 text-sm uppercase tracking-wide">Recuperados</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
                        <div class="text-4xl font-bold mb-2">50k+</div>
                        <div class="text-blue-200 text-sm uppercase tracking-wide">Clientes</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
                        <div class="text-4xl font-bold mb-2">98%</div>
                        <div class="text-blue-200 text-sm uppercase tracking-wide">Éxito</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 text-center">
                        <div class="text-4xl font-bold mb-2">24h</div>
                        <div class="text-blue-200 text-sm uppercase tracking-wide">Inicio proceso</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ -->
    <section class="py-24 bg-background-light dark:bg-background-dark">
        <div class="max-w-3xl mx-auto px-6">
            <h2 class="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">Preguntas Frecuentes</h2>
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <details class="group">
                        <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                            <span class="text-lg font-semibold text-slate-800 dark:text-white">¿Qué vehículos están afectados?</span>
                            <span class="material-icons text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                            La mayoría de marcas compradas entre 2006 y 2013 están afectadas: Seat, Volkswagen, Audi, BMW, Mercedes, Renault, Peugeot, Citroën, Ford, Opel, Toyota, Hyundai, Fiat y más. Incluye turismos y comerciales.
                        </div>
                    </details>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <details class="group">
                        <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                            <span class="text-lg font-semibold text-slate-800 dark:text-white">¿Puedo añadir varios vehículos?</span>
                            <span class="material-icons text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                            Sí. Si tienes más de un vehículo afectado, puedes registrar cada uno por separado. Todos se vincularán a tu DNI automáticamente.
                        </div>
                    </details>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <details class="group">
                        <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
                            <span class="text-lg font-semibold text-slate-800 dark:text-white">¿Cómo consulto el estado de mi reclamación?</span>
                            <span class="material-icons text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                            Solo necesitas tu DNI. Ve a "Consultar Estado", introdúcelo y verás toda la información de tu reclamación y tus vehículos registrados.
                        </div>
                    </details>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h2 class="text-3xl font-bold mb-6 text-slate-900 dark:text-white">No dejes pasar tu compensación.</h2>
            <p class="text-xl text-slate-600 dark:text-slate-400 mb-8">
                El plazo legal se acerca. Verifica tu vehículo en menos de 1 minuto.
            </p>
            <button
                @click="router.push('/verificar')"
                class="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-200 inline-flex items-center gap-2"
            >
                Verificar mi Vehículo
                <span class="material-icons">arrow_forward</span>
            </button>
        </div>
    </section>
</template>
