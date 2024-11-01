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
  <main>
    <h1>TODO LIST</h1>
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
    <Button v-else @click="() => supabase.auth.signOut()"> Logout </Button>
  </main>
</template>

<style type="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
