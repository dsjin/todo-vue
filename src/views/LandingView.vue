<script setup lang="ts">
import { supabase } from '@/lib/superbaseClient'
import type { AuthChangeEvent, AuthSession, User } from '@supabase/supabase-js'
import Button from 'primevue/button'
import { onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const userInfo: Ref<User | undefined> = ref(undefined)

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    userInfo.value = data.session?.user
  })

  supabase.auth.onAuthStateChange(
    (_: AuthChangeEvent, session: AuthSession | null) => {
      userInfo.value = session?.user
    },
  )
})
</script>

<template>
  <div id="LandingPage">
    <h1>TODO LIST</h1>
    <div class="flex">
      <Button
        v-if="!userInfo"
        @click="
          () =>
            router.push({
              path: '/login',
            })
        "
      >
        Login
      </Button>
      <Button
        v-if="!userInfo"
        @click="
          () =>
            router.push({
              path: '/register',
            })
        "
      >
        Register
      </Button>
    </div>
  </div>
</template>

<style type="scss">
#LandingPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
