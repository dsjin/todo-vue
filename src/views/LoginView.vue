<script setup lang="ts">
import { ref, type Ref } from 'vue'
import Card from 'primevue/card'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { supabase } from '@/lib/superbaseClient'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const username: Ref<string> = ref('')
const password: Ref<string> = ref('')
const router = useRouter()

const toast = useToast()

const onLoginClicked = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username.value,
    password: password.value,
  })
  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000,
    })
  }
  if (data.user) {
    router.push('/')
  }
}
</script>

<template>
  <div id="Login-Wrapper">
    <Card id="Login-Card" class="p-5">
      <template #content>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText
            v-model="username"
            placeholder="Username"
            @keydown.enter.prevent="onLoginClicked"
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-lock"></i>
          </InputGroupAddon>
          <InputText
            v-model="password"
            type="password"
            placeholder="Password"
            autofocus
            @keydown.enter.prevent="onLoginClicked"
          />
        </InputGroup>
      </template>
      <template #footer>
        <div class="flex">
          <Button label="Login" class="w-full" @click="onLoginClicked" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style lang="scss">
#Login-Wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  & #Login-Card {
    min-width: 25rem;
  }
}
</style>
