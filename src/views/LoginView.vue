<script setup lang="ts">
import Card from 'primevue/card'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { supabase } from '@/lib/superbaseClient'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import loginValidateSchema from '@/assets/validateSchema/login'
import type { Login } from '@/assets/types/login'
import Message from 'primevue/message'
import { useTemplateRef } from 'vue'

const { defineField, errors, handleSubmit } = useForm<Login>({
  validationSchema: loginValidateSchema,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const passwordRef = useTemplateRef<any>('passwordRef')
const router = useRouter()

const toast = useToast()

const onSubmit = handleSubmit(values => {
  onLoginClicked(values)
})

const onLoginClicked = async ({ email, password }: Login) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
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
    <form @submit="onSubmit">
      <Card id="Login-Card" class="p-5">
        <template #content>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user"></i>
            </InputGroupAddon>
            <InputText
              v-model="email"
              placeholder="Email"
              v-bind="emailAttrs"
              :invalid="errors.email !== undefined"
              @keydown.enter.prevent="() => passwordRef.$el.focus()"
            />
          </InputGroup>
          <Message
            v-if="errors.email !== undefined"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ errors.email }}
          </Message>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock"></i>
            </InputGroupAddon>
            <InputText
              ref="passwordRef"
              v-model="password"
              type="password"
              placeholder="Password"
              v-bind="passwordAttrs"
              :invalid="errors.password !== undefined"
            />
          </InputGroup>
          <Message
            v-if="errors.password !== undefined"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ errors.password }}
          </Message>
        </template>
        <template #footer>
          <div class="flex">
            <Button label="Login" class="w-full" type="submit" />
          </div>
        </template>
      </Card>
    </form>
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
