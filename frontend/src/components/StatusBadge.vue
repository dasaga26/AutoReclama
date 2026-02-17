<script setup>
import { computed } from 'vue'

const props = defineProps({
    estado: { type: String, required: true }
})

const config = computed(() => {
    const map = {
        'pendiente': { color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800', icon: 'schedule' },
        'en trámite': { color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800', icon: 'autorenew' },
        'resuelto': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800', icon: 'check_circle' },
        'rechazado': { color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800', icon: 'cancel' }
    }
    return map[props.estado] || map['pendiente']
})
</script>

<template>
    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border capitalize" :class="config.color">
        <span class="material-icons text-xs">{{ config.icon }}</span>
        {{ estado }}
    </span>
</template>
