<script setup>
import { RouterView } from 'vue-router'
import HeaderLayout from '@/components/layouts/HeaderLayout.vue'
</script>

<template>
    <HeaderLayout />
    <div class="container">
        <RouterView />
    </div>
</template>
