<script setup lang="ts">
import type { Group } from '@/assets/types/group'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  value: Group
}

const props = defineProps<Props>()
const confirm = useConfirm()
const toast = useToast()
const router = useRouter()
const menu: Ref<InstanceType<typeof Menu> | undefined> = ref()
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          editDialogVisible.value = true
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          deleteConfirm()
        },
      },
    ],
  },
])
const editDialogVisible = ref(false)
const toggleMenu = (event: MouseEvent) => {
  menu.value?.toggle(event)
}
const deleteConfirm = () => {
  confirm.require({
    message: 'Do you want to delete this group?',
    header: 'Action',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      toast.add({
        severity: 'info',
        summary: 'Confirmed',
        detail: 'Record deleted',
        life: 3000,
      })
    },
  })
}
</script>
<template>
  <div
    class="flex items-center justify-between w-full px-3 rounded-md bg-gray-300 py-5 cursor-pointer"
    :class="$attrs.class"
    @click="
      router.push({
        name: 'group-detail',
        params: {
          groupId: value.uuid,
        },
      })
    "
  >
    <div class="overflow-hidden">
      <p class="text-3xl text-ellipsis overflow-hidden">
        {{ props.value.name }}
      </p>
    </div>
    <div class="w-15">
      <Button
        icon="pi pi-ellipsis-v"
        class="text-lg z-50"
        text
        severity="secondary"
        @click.stop="toggleMenu"
      />
    </div>
    <Menu ref="menu" :model="items" :popup="true" />
  </div>
  <Dialog
    v-model:visible="editDialogVisible"
    modal
    header="Edit Group"
    :style="{ width: '25rem' }"
    closable
    :draggable="false"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Edit group information.
    </span>
    <div class="flex items-center gap-4 mb-4">
      <label for="group-name" class="font-semibold w-64">Name</label>
      <InputText id="group-name" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="editDialogVisible = false"
      />
      <Button type="button" label="Save" @click="editDialogVisible = false" />
    </div>
  </Dialog>
</template>
<style></style>
