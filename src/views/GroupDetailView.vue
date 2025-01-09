<script setup lang="ts">
import type { TodoItemDetail } from '@/assets/types/todo'
import TodoItem from '@/components/TodoItem.vue'
import TodoItemSkeleton from '@/components/TodoItemSkeleton.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const busy: Ref<boolean> = ref(true)
const title: Ref<string> = ref('')
const remainingTasks: Ref<number> = ref(0)
const totalTasks: ComputedRef<number> = computed((): number => {
  return todoItems.value.length
})
const todoItems: Ref<TodoItemDetail[]> = ref([])
const addTaskClicked = () => {
  // TODO: Implement Adding task function
}
onMounted(() => {
  setTimeout(() => {
    busy.value = false
  }, 5000)
  title.value =
    'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest'
})
</script>
<template>
  <div class="lg:px-60 px-10 py-5">
    <div class="flex w-full items-center justify-between">
      <div class="overflow-hidden w-full mr-2">
        <template v-if="busy">
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
          :disabled="busy"
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
            <template v-if="busy">
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
            <template v-if="busy">
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
            placeholder="Input Task"
            size="small"
            :disabled="busy"
            @keydown.enter.prevent="addTaskClicked"
          />
          <Button
            icon="pi pi-plus"
            size="small"
            :disabled="busy"
            @onClick="addTaskClicked"
          />
        </InputGroup>
      </template>
      <template #content>
        <template v-if="busy">
          <TodoItemSkeleton />
        </template>
        <template v-else-if="totalTasks === 0">
          <p>No task</p>
        </template>
        <template v-else>
          <TodoItem
            v-for="value in todoItems"
            :key="value.uuid"
            :v-model:checked="value.checked"
            :text="value.text"
            class="pb-1"
          />
        </template>
      </template>
    </Card>
  </div>
</template>
<style></style>
