<script setup lang="ts">
import { supabase } from '@/lib/superbaseClient'
import ConfirmDialog from 'primevue/confirmdialog'
import ScrollTop from 'primevue/scrolltop'
import Toast from 'primevue/toast'
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { onMounted, ref, type Ref } from 'vue'
import type { AuthChangeEvent, AuthSession } from '@supabase/supabase-js'

const isAuthenticated: Ref<boolean> = ref(false)
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    isAuthenticated.value = !!data.session?.user
  })

  supabase.auth.onAuthStateChange(
    (_: AuthChangeEvent, session: AuthSession | null) => {
      isAuthenticated.value = !!session?.user
    },
  )
})
</script>

<template>
  <Navbar v-if="isAuthenticated" />
  <RouterView />
  <Toast :breakpoints="{ '960px': { width: '75vw' } }" />
  <ConfirmDialog :draggable="false" />
  <ScrollTop
    target="window"
    icon="pi pi-arrow-up"
    :threshold="100"
    :buttonProps="{
      severity: 'contrast',
      raised: true,
      rounded: true,
      class: 'transition-all',
    }"
  />
</template>
