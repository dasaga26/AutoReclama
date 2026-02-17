<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
    <AppHeader />
    <main class="pt-16 min-h-screen">
        <router-view />
    </main>
    <AppFooter />
</template>
