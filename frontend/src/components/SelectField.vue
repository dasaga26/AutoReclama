<script setup>
defineProps({
    label: String,
    modelValue: [String, Number],
    options: { type: Array, default: () => [] },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Selecciona una opción' }
})

defineEmits(['update:modelValue'])
</script>

<template>
    <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <div class="relative">
            <select
                :value="modelValue"
                :required="required"
                :aria-label="label"
                @change="$emit('update:modelValue', $event.target.value)"
                class="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm appearance-none"
                :class="error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'"
            >
                <option value="" disabled>{{ placeholder }}</option>
                <option v-for="opt in options" :key="opt.value ?? opt" :value="opt.value ?? opt">
                    {{ opt.label ?? opt }}
                </option>
            </select>
            <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
        </div>
        <p v-if="error" class="mt-1 text-xs text-red-500 flex items-center gap-1">
            <span class="material-icons text-xs">error</span>
            {{ error }}
        </p>
    </div>
</template>
