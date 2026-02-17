<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

const links = [
    { to: '/', label: 'Inicio', icon: 'home' },
    { to: '/verificar', label: 'Verificar Vehículo', icon: 'search' },
    { to: '/consultar', label: 'Consultar Estado', icon: 'fact_check' },
    { to: '/admin', label: 'Admin', icon: 'admin_panel_settings' }
]
</script>

<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <router-link to="/" class="flex items-center gap-3">
                <span class="material-icons text-primary text-2xl">gavel</span>
                <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    AutoReclama<span class="text-primary">.org</span>
                </span>
            </router-link>

            <nav class="hidden md:flex items-center gap-1">
                <router-link
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                    :class="route.path === link.to
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 hover:text-primary hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'"
                >
                    <span class="material-icons text-sm">{{ link.icon }}</span>
                    {{ link.label }}
                </router-link>
            </nav>

            <button
                class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                @click="mobileMenuOpen = !mobileMenuOpen"
                aria-label="Menú de navegación"
            >
                <span class="material-icons">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
            </button>
        </div>

        <Transition name="slide">
            <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-1">
                <router-link
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    @click="mobileMenuOpen = false"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    :class="route.path === link.to
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'"
                >
                    <span class="material-icons text-lg">{{ link.icon }}</span>
                    {{ link.label }}
                </router-link>
            </div>
        </Transition>
    </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
