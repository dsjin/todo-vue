<script setup lang="ts">
import type { TaskItemDetail } from '@/assets/types/task'
import TodoItem from '@/components/TodoItem.vue'
import TodoItemSkeleton from '@/components/TodoItemSkeleton.vue'
import { supabase } from '@/lib/superbaseClient'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const initBusy: Ref<boolean> = ref(true)
const busy: Ref<boolean> = ref(false)
const title: Ref<string> = ref('')
const groupId: Ref<number> = ref(-1)
const newTask: Ref<string> = ref('')
const remainingTasks: ComputedRef<number> = computed((): number => {
  return taskItems.value.filter(value => !value.checked).length
})
const totalTasks: ComputedRef<number> = computed((): number => {
  return taskItems.value.length
})
const taskItems: Ref<TaskItemDetail[]> = ref([])
const addTaskClicked = async () => {
  busy.value = true
  try {
    const { data, error } = await supabase
      .from('tasks')
      .upsert({
        text: newTask.value,
        group_id: groupId.value,
      })
      .select(`id,uuid,text,checked,created_at,updated_at`)
      .single()
    if (error) {
      throw new Error(error.message)
    }
    taskItems.value = [
      ...taskItems.value,
      {
        id: data.id,
        uuid: data.uuid,
        text: data.text,
        checked: data.checked,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    ]
    newTask.value = ''
  } catch (e: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: e.message,
      life: 3000,
    })
  }
  busy.value = false
}
const deleteTaskClicked = (id: number) => {
  taskItems.value = taskItems.value.filter(value => value.id !== id)
  toast.add({
    severity: 'info',
    summary: 'Confirmed',
    detail: 'Record deleted',
    life: 3000,
  })
}
onMounted(async () => {
  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .select('id, name')
    .eq('uuid', route.params.groupId)
    .single()
  if (groupData === null) {
    return
  }
  const { data: taskData, error: taskError } = await supabase
    .from('tasks')
    .select(
      `
      id,
      uuid,
      text,
      checked,
      created_at,
      updated_at,
      groups!inner()
    `,
    )
    .eq('group_id', groupData.id)
  title.value = groupData.name
  groupId.value = groupData.id
  taskItems.value = taskData
    ? taskData.map(value => {
        return {
          id: value.id,
          uuid: value.uuid,
          text: value.text,
          checked: value.checked,
          createdAt: value.created_at,
          updatedAt: value.updated_at,
        }
      })
    : []
  initBusy.value = false
})
</script>
<template>
  <div class="lg:px-60 px-10 py-5">
    <div class="flex w-full items-center justify-between">
      <div class="overflow-hidden w-full mr-2">
        <template v-if="initBusy">
          <Skeleton height="2.25rem"></Skeleton>
        </template>
        <template v-else>
          <h1 class="text-3xl text-ellipsis overflow-hidden">
            {{ title }}
          </h1>
        </template>
      </div>
      <div class="w-15">
        <Button
          type="button"
          icon="pi pi-angle-left"
          aria-label="Back"
          label="Back"
          size="small"
          raised
          @click="
            router.push({
              name: 'home',
            })
          "
          :disabled="busy || initBusy"
        />
      </div>
    </div>
    <Divider />
    <Card>
      <template #title>
        <div class="flex justify-between items-center">
          <p>Tasks</p>
          <p class="text-sm inline-block">
            Remaining Tasks:
            <template v-if="initBusy">
              <Skeleton
                height="15px"
                width="15px"
                class="inline-block"
              ></Skeleton>
            </template>
            <template v-else>
              <span>{{ remainingTasks }}</span>
            </template>
            /
            <template v-if="initBusy">
              <Skeleton
                height="15px"
                width="15px"
                class="inline-block"
              ></Skeleton>
            </template>
            <template v-else>
              <span>{{ totalTasks }}</span>
            </template>
          </p>
        </div>
      </template>
      <template #subtitle>
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-pencil"></i>
          </InputGroupAddon>
          <InputText
            v-model="newTask"
            placeholder="Input Task"
            size="small"
            :disabled="busy || initBusy"
            @keydown.enter.prevent="addTaskClicked"
          />
          <Button
            icon="pi pi-plus"
            size="small"
            :disabled="busy || initBusy"
            @click="addTaskClicked"
          />
        </InputGroup>
      </template>
      <template #content>
        <template v-if="initBusy">
          <TodoItemSkeleton />
        </template>
        <template v-else-if="totalTasks === 0">
          <p>No task</p>
        </template>
        <template v-else>
          <TodoItem
            v-for="value in taskItems"
            :key="value.uuid"
            v-model:checked="value.checked"
            :value="value"
            class="pb-1"
            v-model:disabled="busy"
            @on-deleted="deleteTaskClicked"
          />
        </template>
      </template>
    </Card>
  </div>
</template>
<style></style>
