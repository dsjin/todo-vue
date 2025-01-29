<script setup lang="ts">
import { ref, useTemplateRef, type Ref } from 'vue'
import Card from 'primevue/card'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { supabase } from '@/lib/superbaseClient'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const confirmPassword: Ref<string> = ref('')
const passwordRef = useTemplateRef<any>('passwordRef')
const confirmPasswordRef = useTemplateRef<any>('confirmPasswordRef')
const router = useRouter()

const toast = useToast()

const onRegisterClicked = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
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
  <div id="Register-Wrapper">
    <Card id="Register-Card" class="p-5">
      <template #content>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText
            v-model="email"
            placeholder="Email"
            @keydown.enter.prevent="() => passwordRef.$el.focus()"
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-lock"></i>
          </InputGroupAddon>
          <InputText
            ref="passwordRef"
            v-model="password"
            type="password"
            placeholder="Password"
            @keydown.enter.prevent="() => confirmPasswordRef.$el.focus()"
          />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-lock"></i>
          </InputGroupAddon>
          <InputText
            ref="confirmPasswordRef"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            @keydown.enter.prevent="onRegisterClicked"
          />
        </InputGroup>
      </template>
      <template #footer>
        <div class="flex">
          <Button label="Register" class="w-full" @click="onRegisterClicked" />
        </div>
      </template>
    </Card>
  </div>
</template>
<style lang="scss">
#Register-Wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  & #Register-Card {
    min-width: 25rem;
  }
}
</style>
