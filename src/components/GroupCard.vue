<script setup lang="ts">
import type { Group } from '@/assets/types/group'
import { supabase } from '@/lib/superbaseClient'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu'
import { useToast } from 'primevue/usetoast'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  value: Group
}

const props = defineProps<Props>()
const emits = defineEmits<{
  onDeleted: [number]
  onEdited: [number, string]
}>()
const toast = useToast()
const router = useRouter()
const menu: Ref<InstanceType<typeof Menu> | undefined> = ref()
const editName: Ref<string> = ref('')
const modalBusy: Ref<boolean> = ref(false)
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {
          editDialogVisible.value = true
          editName.value = props.value.name
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          deleteDialogVisible.value = true
        },
      },
    ],
  },
])
const editDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const toggleMenu = (event: MouseEvent) => {
  menu.value?.toggle(event)
}
const editClicked = async () => {
  modalBusy.value = true
  try {
    const { error } = await supabase
      .from('groups')
      .update({
        name: editName.value,
      })
      .eq('id', props.value.id)
    if (error) {
      throw new Error(error.message)
    }
    emits('onEdited', props.value.id, editName.value)
    editDialogVisible.value = false
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
const deleteClicked = async () => {
  modalBusy.value = true
  try {
    const { error } = await supabase
      .from('groups')
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
    :close-button-props="{
      severity: 'secondary',
      rounded: true,
      text: true,
      disabled: modalBusy,
    }"
    :draggable="false"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Edit group information.
    </span>
    <div class="flex items-center gap-4 mb-4">
      <label for="group-name" class="font-semibold w-64">Name</label>
      <InputText
        v-model="editName"
        id="group-name"
        class="flex-auto"
        autocomplete="off"
        :disabled="modalBusy"
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="editDialogVisible = false"
        :disabled="modalBusy"
      />
      <Button
        type="button"
        label="Save"
        @click="editClicked"
        :disabled="modalBusy"
      />
    </div>
  </Dialog>
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
      Do you want to delete this group?
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
<style></style>
