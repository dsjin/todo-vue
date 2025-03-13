<script setup lang="ts">
import type { TaskItemDetail } from '@/assets/types/task'
import { supabase } from '@/lib/superbaseClient'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { ref, type Ref } from 'vue'

interface Props {
  value: TaskItemDetail
}
const checked = defineModel<boolean>('checked')
const disabled = defineModel<boolean>('disabled')
const props = defineProps<Props>()
const emits = defineEmits<{
  onCheckUpdate: []
  onDeleted: [number]
}>()
const toast = useToast()
const deleteDialogVisible = ref(false)
const modalBusy: Ref<boolean> = ref(false)
const updateCheck = async (value: boolean) => {
  disabled.value = true
  try {
    const { error } = await supabase
      .from('tasks')
      .update({
        checked: value,
      })
      .eq('id', props.value.id)
    if (error) {
      throw new Error(error.message)
    }
    emits('onCheckUpdate')
  } catch (e: any) {
    checked.value = !checked.value
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: e.message,
      life: 3000,
    })
  }
  disabled.value = false
}
const deleteClicked = async () => {
  modalBusy.value = true
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', props.value.id)
    if (error) {
      throw new Error(error.message)
    }
    emits('onDeleted', props.value.id)
  } catch (e: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: e.message,
      life: 3000,
    })
  }
  modalBusy.value = false
}
</script>
<template>
  <div class="flex items-center" :class="$attrs.class">
    <Checkbox
      class="mr-2"
      v-model="checked"
      binary
      :disabled="disabled"
      @update:modelValue="(value: boolean) => updateCheck(value)"
    />
    <div class="overflow-hidden w-full mr-2">
      <p
        class="text-ellipsis overflow-hidden cursor-pointer"
        :class="{
          strike: checked,
        }"
        @click="
          () => {
            checked = !checked
            updateCheck(!checked)
          }
        "
      >
        {{ props.value.text }}
      </p>
    </div>
    <Button
      icon="pi pi-trash"
      severity="danger"
      size="small"
      text
      :disabled="disabled"
      @click="() => (deleteDialogVisible = true)"
    />
  </div>
  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    header="Delete Group"
    :style="{ width: '25rem' }"
    closable
    :close-button-props="{
      severity: 'secondary',
      rounded: true,
      text: true,
      disabled: modalBusy,
    }"
    :draggable="false"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Do you want to delete this task?
    </span>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="deleteDialogVisible = false"
        :disabled="modalBusy"
      />
      <Button
        type="button"
        label="Delete"
        severity="danger"
        @click="deleteClicked"
        :disabled="modalBusy"
      />
    </div>
  </Dialog>
</template>
<style>
.strike {
  text-decoration: line-through;
}
</style>
