<script setup lang="ts">
import type { Group } from '@/assets/types/group'
import GroupCard from '@/components/GroupCard.vue'
import GroupCardSkeleton from '@/components/GroupCardSkeleton.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { onMounted, ref, type Ref } from 'vue'

const createDialogVisible = ref(false)
const groups: Ref<Group[]> = ref([
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupNameGroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
  {
    id: 0,
    uuid: 'uuid',
    name: 'GroupName',
    userId: 'UserId',
    createdAt: new Date().getTime(),
  },
])
const busy: Ref<boolean> = ref(true)
onMounted(() => {
  setTimeout(() => {
    busy.value = false
  }, 5000)
})
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
      <template v-if="busy">
        <GroupCardSkeleton />
      </template>
      <template v-else>
        <GroupCard
          :key="value.id"
          v-for="value in groups"
          class="mb-3"
          :value="value"
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
    :draggable="false"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">
      Create new group.
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
        @click="createDialogVisible = false"
      />
      <Button
        type="button"
        label="Create"
        @click="createDialogVisible = false"
      />
    </div>
  </Dialog>
</template>
