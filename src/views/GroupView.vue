<script setup lang="ts">
import type { CreateGroup, Group } from '@/assets/types/group'
import GroupCard from '@/components/GroupCard.vue'
import GroupCardSkeleton from '@/components/GroupCardSkeleton.vue'
import { supabase } from '@/lib/superbaseClient'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref, watch, type Ref } from 'vue'
import debounce from 'lodash.debounce'
import { useForm } from 'vee-validate'
import Message from 'primevue/message'
import { createGroupValidateSchema } from '@/assets/validateSchema/group'

enum PaginationState {
  INIT = 'init',
  NEXT_PAGE = 'nextPage',
}

const { defineField, errors, handleSubmit, resetForm } = useForm<CreateGroup>({
  validationSchema: createGroupValidateSchema,
})

const toast = useToast()
const createDialogVisible = ref(false)
const [newGroupName, newGroupNameAttrs] = defineField('name')
const groups: Ref<Group[]> = ref([])
const busy: Ref<boolean> = ref(true)
const createModalBusy: Ref<boolean> = ref(false)
onMounted(() => {
  debouncedAssignGroupList()
})
watch(createDialogVisible, (value: boolean) => {
  if (!value) {
    resetForm()
  }
})
const assignGroupList = async (
  state: PaginationState = PaginationState.INIT,
) => {
  busy.value = true
  let from = 0
  let to = 0
  if (state === PaginationState.INIT) {
    from = 0
    to = 4
  } else if (state === PaginationState.NEXT_PAGE) {
    from = groups.value.length
    to = groups.value.length + 4
  }
  const groupItems = await fetchGroups(from, to)
  if (state === PaginationState.INIT) {
    groups.value = groupItems
  } else {
    groups.value = [...groups.value, ...groupItems]
  }
  if (groupItems.length === 0) {
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: 'All groups retrieved',
      life: 3000,
    })
  }
  busy.value = false
}
const debouncedAssignGroupList = debounce(
  (value?: PaginationState) => assignGroupList(value),
  300,
)
const fetchGroups = async (
  from: number = 0,
  to: number = 9,
): Promise<Group[]> => {
  const { data } = await supabase
    .from('groups')
    .select('id, uuid, name, user_id, created_at, updated_at')
    .range(from, to)
    .order('created_at')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
  return data
    ? data.map(value => {
        return {
          id: value.id,
          uuid: value.uuid,
          name: value.name,
          userId: value.user_id,
          createdAt: value.created_at,
          updatedAt: value.updated_at,
        }
      })
    : []
}
const onCreateGroupSubmit = handleSubmit((values: CreateGroup) => {
  createGroup(values)
})
const createGroup = async ({ name }: CreateGroup) => {
  createModalBusy.value = true
  try {
    const { error } = await supabase
      .from('groups')
      .upsert({
        name,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select('id, uuid, name, user_id, created_at, updated_at')
      .single()
    if (error) {
      throw new Error(error.message)
    }
    createDialogVisible.value = false
    newGroupName.value = ''
    toast.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Record created',
      life: 3000,
    })
  } catch (e: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: e.message,
      life: 3000,
    })
  }
  createModalBusy.value = false
}
const deleteGroupClicked = (id: number) => {
  groups.value = groups.value.filter(value => value.id !== id)
  toast.add({
    severity: 'info',
    summary: 'Confirmed',
    detail: 'Record deleted',
    life: 3000,
  })
}
const editClicked = (id: number, newName: string) => {
  const index = groups.value.findIndex(value => value.id === id)
  groups.value[index].name = newName
  groups.value = [...groups.value]
  toast.add({
    severity: 'info',
    summary: 'Confirmed',
    detail: 'Record edited',
    life: 3000,
  })
}
</script>
<template>
  <div class="lg:px-60 px-10 py-5">
    <div class="flex flex-col w-full">
      <div class="flex justify-between items-center w-full mb-5">
        <h1 class="text-6xl">Group</h1>
        <Button
          icon="pi pi-plus"
          aria-label="Add"
          rounded
          @click="createDialogVisible = true"
          :disabled="busy"
        />
      </div>
      <GroupCard
        :key="value.id"
        v-for="value in groups"
        class="mb-3"
        :value="value"
        @on-deleted="deleteGroupClicked"
        @on-edited="editClicked"
      />
      <template v-if="busy">
        <GroupCardSkeleton />
      </template>
      <template v-if="!busy">
        <Button
          label="Load more groups"
          @click="() => debouncedAssignGroupList(PaginationState.NEXT_PAGE)"
        />
      </template>
    </div>
  </div>
  <Dialog
    v-model:visible="createDialogVisible"
    modal
    header="Create Group"
    :style="{ width: '25rem' }"
    closable
    :close-button-props="{
      severity: 'secondary',
      rounded: true,
      text: true,
      disabled: createModalBusy,
    }"
    :draggable="false"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Create new group.
    </span>
    <form @submit="onCreateGroupSubmit">
      <div class="flex items-center gap-4 mb-4">
        <label for="group-name" class="font-semibold w-64">Name</label>
        <InputText
          v-model="newGroupName"
          id="group-name"
          class="flex-auto"
          autocomplete="off"
          :disabled="createModalBusy"
          :invalid="errors.name !== undefined"
          v-bind="newGroupNameAttrs"
        />
      </div>
      <Message
        v-if="errors.name !== undefined"
        class="mb-4"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ errors.name }}
      </Message>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="createDialogVisible = false"
          :disabled="createModalBusy"
        />
        <Button type="submit" label="Create" :disabled="createModalBusy" />
      </div>
    </form>
  </Dialog>
</template>
