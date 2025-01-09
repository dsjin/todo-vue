<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

interface Props {
  text: string
}
const props = defineProps<Props>()
const checked = defineModel<boolean>('checked')
const emits = defineEmits<{
  onDelete: []
}>()
const confirm = useConfirm()
const toast = useToast()
const deleteConfirm = () => {
  confirm.require({
    message: 'Do you want to delete this task?',
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
  <div class="flex items-center">
    <Checkbox class="mr-2" v-model="checked" binary />
    <div class="overflow-hidden w-full mr-2">
      <p
        class="text-ellipsis overflow-hidden cursor-pointer"
        :class="{
          strike: checked,
        }"
        @click="checked = !checked"
      >
        {{ text }}
      </p>
    </div>
    <Button
      icon="pi pi-trash"
      severity="danger"
      size="small"
      text
      @click="deleteConfirm"
    />
  </div>
</template>
<style>
.strike {
  text-decoration: line-through;
}
</style>
