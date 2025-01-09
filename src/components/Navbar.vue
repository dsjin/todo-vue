<script setup lang="ts">
import { supabase } from '@/lib/superbaseClient'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import { ref, type Ref } from 'vue'

const menu: Ref<InstanceType<typeof Menu> | undefined> = ref()
const items = ref([
  {
    label: 'Menu',
    items: [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          supabase.auth.signOut()
        },
      },
    ],
  },
])
const toggleMenu = (event: MouseEvent) => {
  menu.value?.toggle(event)
}
</script>
<template>
  <Menubar>
    <template #start>
      <p>Todo</p>
    </template>
    <template #end>
      <button @click="toggleMenu">
        <Avatar
          label="T"
          style="background-color: #dee9fc; color: #1a2551"
          shape="circle"
        />
      </button>
    </template>
  </Menubar>
  <Menu ref="menu" :model="items" :popup="true" />
</template>
