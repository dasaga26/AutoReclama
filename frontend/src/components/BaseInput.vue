<script setup>
defineProps({
    label: String,
    modelValue: [String, Number],
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<template>
    <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <input
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :required="required"
            :aria-label="label"
            :aria-invalid="!!error"
            @input="$emit('update:modelValue', $event.target.value)"
            class="block w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors sm:text-sm"
            :class="error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'"
        />
        <p v-if="error" class="mt-1 text-xs text-red-500 flex items-center gap-1">
            <span class="material-icons text-xs">error</span>
            {{ error }}
        </p>
    </div>
</template>
