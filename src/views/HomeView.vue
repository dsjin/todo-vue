<script setup lang="ts">
import { supabase } from '@/lib/superbaseClient'
import type { AuthChangeEvent, AuthSession, User } from '@supabase/supabase-js'
import { onMounted, ref, type Ref } from 'vue'
import LandingView from './LandingView.vue'
import GroupView from './GroupView.vue'
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
  <LandingView v-if="!isAuthenticated" />
  <GroupView v-else />
</template>

<style type="scss">
/* main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
} */
</style>
