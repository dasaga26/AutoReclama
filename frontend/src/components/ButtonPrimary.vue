<script setup>
defineProps({
    text: { type: String, default: '' },
    icon: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'button' },
    variant: { type: String, default: 'primary' }
})
</script>

<template>
    <button
        :type="type"
        :disabled="disabled"
        class="px-6 py-3 rounded-lg font-semibold text-sm shadow-sm transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{
            'bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:shadow-primary/20': variant === 'primary',
            'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary': variant === 'secondary',
            'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/20': variant === 'danger'
        }"
    >
        <span v-if="icon" class="material-icons text-sm">{{ icon }}</span>
        {{ text }}
        <slot />
    </button>
</template>
