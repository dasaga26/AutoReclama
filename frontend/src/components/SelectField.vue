<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    label: String,
    modelValue: [String, Number],
    options: { type: Array, default: () => [] },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Selecciona una opción' }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const root = ref(null)
const listRef = ref(null)
const highlightedIndex = ref(-1)

const normalizedOptions = computed(() =>
    props.options.map(o => typeof o === 'object' ? o : { label: String(o), value: String(o) })
)

const selectedLabel = computed(() => {
    if (!props.modelValue && props.modelValue !== 0) return ''
    const found = normalizedOptions.value.find(o => String(o.value) === String(props.modelValue))
    return found ? found.label : String(props.modelValue)
})

function select(value) {
    emit('update:modelValue', value)
    open.value = false
    highlightedIndex.value = -1
}

function toggle() {
    open.value = !open.value
    if (open.value) {
        highlightedIndex.value = normalizedOptions.value.findIndex(
            o => String(o.value) === String(props.modelValue)
        )
        // Scroll selected item into view after render
        setTimeout(() => scrollToHighlighted(), 10)
    }
}

function onKeydown(e) {
    if (!open.value) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault()
            open.value = true
            highlightedIndex.value = normalizedOptions.value.findIndex(
                o => String(o.value) === String(props.modelValue)
            )
        }
        return
    }
    if (e.key === 'Escape') { open.value = false; return }
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        highlightedIndex.value = Math.min(highlightedIndex.value + 1, normalizedOptions.value.length - 1)
        scrollToHighlighted()
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
        scrollToHighlighted()
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (highlightedIndex.value >= 0) select(normalizedOptions.value[highlightedIndex.value].value)
    }
}

function scrollToHighlighted() {
    if (!listRef.value) return
    const item = listRef.value.children[highlightedIndex.value]
    if (item) item.scrollIntoView({ block: 'nearest' })
}

function onClickOutside(e) {
    if (root.value && !root.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
    <div class="mb-4" ref="root">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <!-- Trigger button -->
        <div class="relative">
            <button
                type="button"
                :aria-label="label"
                :aria-expanded="open"
                @click="toggle"
                @keydown="onKeydown"
                class="flex w-full items-center justify-between px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                :class="[
                    error ? 'border-red-400 focus:ring-red-400' : open ? 'border-primary ring-2 ring-primary' : 'border-slate-200 dark:border-slate-700',
                ]"
            >
                <span :class="selectedLabel ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'">
                    {{ selectedLabel || placeholder }}
                </span>
                <span
                    class="material-icons text-slate-400 text-lg shrink-0 transition-transform duration-200"
                    :class="open ? 'rotate-180 text-primary' : ''"
                >expand_more</span>
            </button>

            <!-- Dropdown panel -->
            <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 -translate-y-1 scale-[0.98]"
            >
                <div
                    v-if="open"
                    ref="listRef"
                    role="listbox"
                    class="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-y-auto max-h-56 py-1 origin-top"
                >
                    <div
                        v-if="!normalizedOptions.length"
                        class="px-4 py-3 text-sm text-slate-400 italic"
                    >Sin opciones disponibles</div>

                    <button
                        v-for="(opt, i) in normalizedOptions"
                        :key="opt.value"
                        type="button"
                        role="option"
                        :aria-selected="String(opt.value) === String(modelValue)"
                        @click="select(opt.value)"
                        @mouseenter="highlightedIndex = i"
                        class="flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors duration-75 text-left"
                        :class="[
                            String(opt.value) === String(modelValue)
                                ? 'bg-primary/10 text-primary font-semibold'
                                : i === highlightedIndex
                                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                        ]"
                    >
                        {{ opt.label }}
                        <span
                            v-if="String(opt.value) === String(modelValue)"
                            class="material-icons text-primary text-base"
                        >check</span>
                    </button>
                </div>
            </Transition>
        </div>

        <p v-if="error" class="mt-1 text-xs text-red-500 flex items-center gap-1">
            <span class="material-icons text-xs">error</span>
            {{ error }}
        </p>
    </div>
</template>
