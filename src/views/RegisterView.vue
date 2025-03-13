<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Card from 'primevue/card'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { supabase } from '@/lib/superbaseClient'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import type { Register } from '@/assets/types/register'
import registerValidateSchema from '@/assets/validateSchema/register'
import Message from 'primevue/message'

const { defineField, errors, handleSubmit } = useForm<Register>({
  validationSchema: registerValidateSchema,
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')
const passwordRef = useTemplateRef<any>('passwordRef')
const confirmPasswordRef = useTemplateRef<any>('confirmPasswordRef')
const router = useRouter()

const toast = useToast()

const onSubmit = handleSubmit(values => {
  onRegisterClicked(values)
})

const onRegisterClicked = async ({ email, password }: Register) => {
  const { data, error } = await supabase.auth.signUp({
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
  <div id="Register-Wrapper">
    <form @submit="onSubmit">
      <Card id="Register-Card" class="p-5">
        <template #content>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user"></i>
            </InputGroupAddon>
            <InputText
              v-model="email"
              placeholder="Email"
              v-bind="emailAttrs"
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
              @keydown.enter.prevent="() => confirmPasswordRef.$el.focus()"
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
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock"></i>
            </InputGroupAddon>
            <InputText
              ref="confirmPasswordRef"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              v-bind="confirmPasswordAttrs"
            />
          </InputGroup>
          <Message
            v-if="errors.confirmPassword !== undefined"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ errors.confirmPassword }}
          </Message>
        </template>
        <template #footer>
          <div class="flex">
            <Button label="Register" class="w-full" type="submit" />
          </div>
        </template>
      </Card>
    </form>
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
